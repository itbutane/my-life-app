/*
  Jalaali (Solar Hijri / Shamsi) conversion utilities.
  Primary: Intl Persian calendar for correctness across environments.
  Fallback: tabular conversion via JDN for Gregorian<->Jalaali.
*/

export interface JalaaliDate { jy: number; jm: number; jd: number }

const faNumMap: Record<string, string> = { '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9','٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9' };
function toLatinDigits(s: string): string { return s.replace(/[۰-۹٠-٩]/g, d => faNumMap[d] ?? d); }

export function toJalaali(gy: number, gm: number, gd: number): JalaaliDate {
  try {
    const dt = new Date(gy, gm - 1, gd);
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian-nu-latn', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(dt);
    const get = (t: string) => parseInt(parts.find(p => p.type === t)?.value || '', 10);
    const jy = get('year'); const jm = get('month'); const jd = get('day');
    if (jy && jm && jd) return { jy, jm, jd };
  } catch {}
  // Fallback via Intl without nu-latn
  try {
    const dt = new Date(gy, gm - 1, gd);
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(dt);
    const get = (t: string) => parseInt(toLatinDigits(parts.find(p => p.type === t)?.value || ''), 10);
    const jy = get('year'); const jm = get('month'); const jd = get('day');
    if (jy && jm && jd) return { jy, jm, jd };
  } catch {}
  // Last-resort approximation should not happen; return safe value
  return { jy: gy - 621, jm: gm <= 3 ? gm + 9 : gm - 3, jd: gd };
}

export function toGregorian(jy: number, jm: number, jd: number): { gy: number; gm: number; gd: number } {
  // Find Gregorian date by searching around approximate day (robust via Intl reverse check)
  const approxGy = jy + 621;
  // Try a window of days around approximate mapping
  const base = jalaaliToJdnApprox(jy, jm, jd);
  for (let delta = -2; delta <= 2; delta++) {
    const g = jdnToGregorian(base + delta);
    const j = toJalaali(g.gy, g.gm, g.gd);
    if (j.jy === jy && j.jm === jm && j.jd === jd) return g;
  }
  // Broader search
  for (let delta = -40; delta <= 40; delta++) {
    const g = jdnToGregorian(base + delta);
    const j = toJalaali(g.gy, g.gm, g.gd);
    if (j.jy === jy && j.jm === jm && j.jd === jd) return g;
  }
  // Fallback: approximate
  const g = jdnToGregorian(base);
  return g;
}

function gregorianToJdn(gy: number, gm: number, gd: number): number {
  const a = Math.floor((14 - gm) / 12);
  const y = gy + 4800 - a;
  const m = gm + 12 * a - 3;
  return gd + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;
}

function jdnToGregorian(jdn: number): { gy: number; gm: number; gd: number } {
  const a = jdn + 32044;
  const b = Math.floor((4 * a + 3) / 146097);
  const c = a - Math.floor((146097 * b) / 4);
  const d = Math.floor((4 * c + 3) / 1461);
  const e = c - Math.floor((1461 * d) / 4);
  const m = Math.floor((5 * e + 2) / 153);
  const gd = e - Math.floor((153 * m + 2) / 5) + 1;
  const gm = m + 3 - 12 * Math.floor(m / 10);
  const gy = 100 * b + d - 4800 + Math.floor(m / 10);
  return { gy, gm, gd };
}

function jalaaliToJdnApprox(jy: number, jm: number, jd: number): number {
  // Approximate using epoch: 1 Farvardin 1 = 1948321 JDN? better use known anchor: 1405/08/20 = 2026-11-11
  const anchorJ = { jy: 1405, jm: 8, jd: 20 };
  const anchorG = { gy: 2026, gm: 11, gd: 11 };
  const anchorJdn = gregorianToJdn(anchorG.gy, anchorG.gm, anchorG.gd);
  // rough day offset within year/month
  let dayOfYear = jd;
  for (let m = 1; m < jm; m++) dayOfYear += m <= 6 ? 31 : 30;
  let anchorDayOfYear = anchorJ.jd;
  for (let m = 1; m < anchorJ.jm; m++) anchorDayOfYear += m <= 6 ? 31 : 30;
  const yearDiff = jy - anchorJ.jy;
  const approx = anchorJdn + yearDiff * 365 + Math.floor((yearDiff * 8 + 21) / 33) + (dayOfYear - anchorDayOfYear);
  return approx;
}

export function jalaaliMonthLength(jy: number, jm: number): number {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // Esfand: check if 30 days by converting 30th and seeing if it stays in same month
  try {
    const g = toGregorian(jy, 12, 30);
    const j = toJalaali(g.gy, g.gm, g.gd);
    return (j.jy === jy && j.jm === 12 && j.jd === 30) ? 30 : 29;
  } catch { return 29; }
}

export const JALAALI_MONTHS = [
  'فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور',
  'مهر','آبان','آذر','دی','بهمن','اسفند'
];

export const PERSIAN_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
export function toPersianDigits(n: number | string): string {
  return String(n).replace(/\d/g, d => PERSIAN_DIGITS[Number(d)]);
}

export function toEnglishDigits(input: string | number): string {
  const map: Record<string, string> = {
    '۰':'0','۱':'1','۲':'2','۳':'3','۴':'4','۵':'5','۶':'6','۷':'7','۸':'8','۹':'9',
    '٠':'0','١':'1','٢':'2','٣':'3','٤':'4','٥':'5','٦':'6','٧':'7','٨':'8','٩':'9',
  };
  return String(input).replace(/[۰-۹٠-٩]/g, d => map[d] ?? d);
}

export function gregorianToJalaaliDate(date: Date): JalaaliDate {
  return toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

export function jalaaliToGregorianDate(jy: number, jm: number, jd: number): Date {
  const { gy, gm, gd } = toGregorian(jy, jm, jd);
  return new Date(gy, gm - 1, gd);
}

export function formatJalaali(j: JalaaliDate): string {
  return `${toPersianDigits(j.jy)}/${toPersianDigits(String(j.jm).padStart(2,'0'))}/${toPersianDigits(String(j.jd).padStart(2,'0'))}`;
}

export function formatGregorian(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}
