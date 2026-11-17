import type { ColoringPage, ColoringStroke } from '../types';

export interface ReliefOptions {
  pageWidth?: number;
  pageHeight?: number;
  baseThickness?: number;
  reliefHeight?: number;
  maxSegmentsPerPage?: number;
  canvasReferenceSize?: number;
}

export interface ReliefResult {
  obj: string;
  stl: string;
  triangles: number;
  pages: number;
  segments: number;
  skippedSegments: number;
}

type Vec3 = [number, number, number];

const DEFAULTS: Required<ReliefOptions> = {
  pageWidth: 80,
  pageHeight: 80,
  baseThickness: 1.6,
  reliefHeight: 1.1,
  maxSegmentsPerPage: 6000,
  canvasReferenceSize: 320,
};

const EPSILON = 1e-6;

const hexToRgb = (hex: string): [number, number, number] => {
  const clean = (hex || '').replace('#', '').trim();
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean.padEnd(6, '0').slice(0, 6);
  const value = Number.parseInt(full, 16);
  if (Number.isNaN(value)) return [0.8, 0.8, 0.8];
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255];
};

interface Mesh {
  vertices: Vec3[];
  faces: { indices: number[]; color: [number, number, number] }[];
}

const emptyMesh = (): Mesh => ({ vertices: [], faces: [] });

const addBox = (mesh: Mesh, min: Vec3, max: Vec3, color: [number, number, number]) => {
  const [x0, y0, z0] = min;
  const [x1, y1, z1] = max;
  const base = mesh.vertices.length;
  const corners: Vec3[] = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  mesh.vertices.push(...corners);
  const quads = [
    [4, 5, 6, 7],
    [0, 3, 2, 1],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ];
  quads.forEach(quad => {
    mesh.faces.push({ indices: quad.map(i => base + i), color });
  });
};

const addRibbon = (mesh: Mesh, from: { x: number; y: number }, to: { x: number; y: number }, width: number, zBottom: number, zTop: number, color: [number, number, number]) => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < EPSILON) return false;
  const half = width / 2;
  const nx = (-dy / len) * half;
  const ny = (dx / len) * half;
  const base = mesh.vertices.length;
  const corners: Vec3[] = [
    [from.x + nx, from.y + ny, zBottom],
    [to.x + nx, to.y + ny, zBottom],
    [to.x - nx, to.y - ny, zBottom],
    [from.x - nx, from.y - ny, zBottom],
    [from.x + nx, from.y + ny, zTop],
    [to.x + nx, to.y + ny, zTop],
    [to.x - nx, to.y - ny, zTop],
    [from.x - nx, from.y - ny, zTop],
  ];
  mesh.vertices.push(...corners);
  const quads = [
    [4, 5, 6, 7],
    [0, 1, 5, 4],
    [1, 2, 6, 5],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
  ];
  quads.forEach(quad => mesh.faces.push({ indices: quad.map(i => base + i), color }));
  return true;
};

const finalize = (mesh: Mesh) => {
  const triangles = mesh.faces.reduce((acc, face) => {
    const idx = face.indices;
    return acc + (idx.length === 4 ? 2 : 1);
  }, 0);
  return triangles;
};

export const buildColoringRelief = (pages: ColoringPage[], options: ReliefOptions = {}): ReliefResult => {
  const opts = { ...DEFAULTS, ...options };
  const mesh = emptyMesh();
  let segments = 0;
  let skippedSegments = 0;
  let usedPages = 0;

  const usablePages = (pages || []).filter(page => (page?.strokes || []).some(stroke => !stroke.isEraser && (stroke.points || []).length > 1));

  usablePages.forEach((page, pageIndex) => {
    const strokes = (page.strokes || []).filter(stroke => !stroke.isEraser);
    let maxAbs = EPSILON;
    strokes.forEach(stroke => {
      (stroke.points || []).forEach(point => {
        maxAbs = Math.max(maxAbs, Math.abs(point.x || 0), Math.abs(point.y || 0));
      });
    });
    const span = Math.max(maxAbs * 2, opts.canvasReferenceSize);
    const factor = Math.min(opts.pageWidth, opts.pageHeight) / span;
    const offsetX = pageIndex * (opts.pageWidth + 10) - (usablePages.length * (opts.pageWidth + 10)) / 2 + opts.pageWidth / 2;
    const baseColor: [number, number, number] = [0.93, 0.93, 0.95];

    addBox(
      mesh,
      [offsetX - opts.pageWidth / 2, -opts.pageHeight / 2, 0],
      [offsetX + opts.pageWidth / 2, opts.pageHeight / 2, opts.baseThickness],
      baseColor,
    );

    let pageSegments = 0;
    strokes.forEach(stroke => {
      if (pageSegments >= opts.maxSegmentsPerPage) return;
      const points = (stroke.points || []).map(point => ({ x: (point.x || 0) * factor, y: -(point.y || 0) * factor }));
      const width = Math.max(0.6, (stroke.size || 6) * factor);
      const color = hexToRgb(stroke.color);
      for (let i = 1; i < points.length; i += 1) {
        if (pageSegments >= opts.maxSegmentsPerPage) break;
        const from = { x: points[i - 1].x + offsetX, y: points[i - 1].y };
        const to = { x: points[i].x + offsetX, y: points[i].y };
        const added = addRibbon(mesh, from, to, width, opts.baseThickness, opts.baseThickness + opts.reliefHeight, color);
        if (added) {
          pageSegments += 1;
          segments += 1;
        } else {
          skippedSegments += 1;
        }
      }
    });
    if (pageSegments > 0) usedPages += 1;
  });

  const triangles = finalize(mesh);

  const objLines: string[] = [];
  objLines.push('# My Life App - printable relief (coloring strokes extruded)');
  objLines.push(`# pages ${usedPages} segments ${segments} triangles ${triangles}`);
  objLines.push(`# units millimeters; page ${opts.pageWidth}x${opts.pageHeight}mm; base ${opts.baseThickness}mm; relief ${opts.reliefHeight}mm`);
  mesh.vertices.forEach(v => {
    objLines.push(`v ${v[0].toFixed(3)} ${v[1].toFixed(3)} ${v[2].toFixed(3)}`);
  });
  mesh.faces.forEach((face, index) => {
    const [r, g, b] = face.color;
    objLines.push(`usemtl color_${index}_${Math.round(r * 255)}_${Math.round(g * 255)}_${Math.round(b * 255)}`);
    const idx = face.indices;
    if (idx.length === 4) {
      objLines.push(`f ${idx[0] + 1} ${idx[1] + 1} ${idx[2] + 1} ${idx[3] + 1}`);
    } else {
      objLines.push(`f ${idx[0] + 1} ${idx[1] + 1} ${idx[2] + 1}`);
    }
  });

  const stlLines: string[] = ['solid my-life-relief'];
  const pushFacet = (a: Vec3, b: Vec3, c: Vec3) => {
    const u: Vec3 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const v: Vec3 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    const n: Vec3 = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
    const len = Math.hypot(n[0], n[1], n[2]) || 1;
    stlLines.push(`  facet normal ${(n[0] / len).toFixed(4)} ${(n[1] / len).toFixed(4)} ${(n[2] / len).toFixed(4)}`);
    stlLines.push('    outer loop');
    [a, b, c].forEach(point => {
      stlLines.push(`      vertex ${point[0].toFixed(3)} ${point[1].toFixed(3)} ${point[2].toFixed(3)}`);
    });
    stlLines.push('    endloop');
    stlLines.push('  endfacet');
  };

  mesh.faces.forEach(face => {
    const idx = face.indices;
    const p = (i: number): Vec3 => mesh.vertices[idx[i]];
    if (idx.length === 4) {
      pushFacet(p(0), p(1), p(2));
      pushFacet(p(0), p(2), p(3));
    } else if (idx.length === 3) {
      pushFacet(p(0), p(1), p(2));
    }
  });
  stlLines.push('endsolid my-life-relief');

  return {
    obj: objLines.join('\n'),
    stl: stlLines.join('\n'),
    triangles,
    pages: usedPages,
    segments,
    skippedSegments,
  };
};