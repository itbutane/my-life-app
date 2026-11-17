import { StyleSheet, View, Text } from 'react-native';
import type { ThemePreset } from '../types';

type Palette = {
  background: string;
  surface: string;
  surfaceVariant: string;
  primary: string;
  primaryLight: string;
  secondary: string;
  secondaryLight: string;
  accent: string;
  accentLight: string;
  tertiary: string;
  tertiaryLight: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  unicorn: { pink: string; purple: string; blue: string; green: string; yellow: string; orange: string };
  gradient: { morning: string[]; noon: string[]; evening: string[]; night: string[] };
};

const presetPalettes: Record<ThemePreset, { light: Palette; dark: Palette; decor: string[]; label: string; emoji: string; description: string }> = {
  joy: {
    label: 'مرکز فرمان شادی (Inside Out)',
    emoji: '😊',
    description: 'با جوی در مرکز فرمان ذهن؛ انرژی، خاطرات طلایی و امید در زندگی روزمره',
    decor: ['#FFD93D', '#FFB703', '#74B9FF', '#FF6B9D', '#A29BFE', '#55EFC4'],
    light: {
      background: '#FFFBEA', surface: '#FFFFFF', surfaceVariant: '#FFF3C4',
      primary: '#F4B400', primaryLight: '#FFE082',
      secondary: '#5C9DED', secondaryLight: '#BBD8FF',
      accent: '#FF6B9D', accentLight: '#FFB3C6',
      tertiary: '#A29BFE', tertiaryLight: '#DDD6FE',
      text: '#2D3436', textSecondary: '#636E72', textMuted: '#9CA3AF', border: '#F3E3A0',
      success: '#00B894', warning: '#F59E0B', error: '#E17055',
      unicorn: { pink: '#FF6B9D', purple: '#A29BFE', blue: '#74B9FF', green: '#55EFC4', yellow: '#FFD93D', orange: '#FB923C' },
      gradient: { morning: ['#FFE082', '#FFD93D', '#FFB703'], noon: ['#74B9FF', '#A29BFE', '#FFD93D'], evening: ['#FFB3C6', '#FFD93D', '#74B9FF'], night: ['#2D3436', '#636E72', '#FFD93D'] },
    },
    dark: {
      background: '#1A1608', surface: '#241F0C', surfaceVariant: '#332B12',
      primary: '#FFD93D', primaryLight: '#FFE082',
      secondary: '#74B9FF', secondaryLight: '#BBD8FF',
      accent: '#FF8FB3', accentLight: '#FFB3C6',
      tertiary: '#B6A8FF', tertiaryLight: '#DDD6FE',
      text: '#FFFDF5', textSecondary: '#E5E7EB', textMuted: '#9CA3AF', border: '#4A3F18',
      success: '#34D399', warning: '#FBBF24', error: '#F87171',
      unicorn: { pink: '#FF8FB3', purple: '#B6A8FF', blue: '#74B9FF', green: '#34D399', yellow: '#FFD93D', orange: '#FB923C' },
      gradient: { morning: ['#FFD93D', '#F4B400', '#FB923C'], noon: ['#74B9FF', '#B6A8FF', '#FFD93D'], evening: ['#B6A8FF', '#FF8FB3', '#FFD93D'], night: ['#0F0B04', '#1A1608', '#332B12'] },
    },
  },
  sadness: {
    label: 'گنبد خاطرات غم (Inside Out)',
    emoji: '😢',
    description: 'با سدنِس در دنیای خاطرات؛ همدلی، آرامش و پذیرش احساسات در کنار هم',
    decor: ['#74B9FF', '#A8D8EA', '#6C5CE7', '#81ECEC', '#DFE6E9', '#55EFC4'],
    light: {
      background: '#F1F7FF', surface: '#FFFFFF', surfaceVariant: '#E3F0FF',
      primary: '#4D96FF', primaryLight: '#A7C7FF',
      secondary: '#6C5CE7', secondaryLight: '#C7BFFF',
      accent: '#00CEC9', accentLight: '#81ECEC',
      tertiary: '#0984E3', tertiaryLight: '#74B9FF',
      text: '#1E293B', textSecondary: '#475569', textMuted: '#94A3B8', border: '#CFE3FF',
      success: '#0EA5A4', warning: '#F59E0B', error: '#EF4444',
      unicorn: { pink: '#FF8FB3', purple: '#6C5CE7', blue: '#4D96FF', green: '#00CEC9', yellow: '#FFE082', orange: '#FB923C' },
      gradient: { morning: ['#A7C7FF', '#74B9FF', '#81ECEC'], noon: ['#74B9FF', '#6C5CE7', '#A7C7FF'], evening: ['#6C5CE7', '#4D96FF', '#0984E3'], night: ['#0F172A', '#1E293B', '#334155'] },
    },
    dark: {
      background: '#0B1324', surface: '#121C33', surfaceVariant: '#1A2744',
      primary: '#74B9FF', primaryLight: '#A7C7FF',
      secondary: '#A29BFE', secondaryLight: '#DDD6FE',
      accent: '#22D3EE', accentLight: '#A5F3FC',
      tertiary: '#60A5FA', tertiaryLight: '#BFDBFE',
      text: '#F8FAFC', textSecondary: '#CBD5E1', textMuted: '#94A3B8', border: '#26385E',
      success: '#2DD4BF', warning: '#FBBF24', error: '#F87171',
      unicorn: { pink: '#FB7185', purple: '#A29BFE', blue: '#74B9FF', green: '#2DD4BF', yellow: '#FDE68A', orange: '#FDBA74' },
      gradient: { morning: ['#74B9FF', '#60A5FA', '#22D3EE'], noon: ['#60A5FA', '#A29BFE', '#74B9FF'], evening: ['#A29BFE', '#60A5FA', '#2563EB'], night: ['#020617', '#0B1324', '#1A2744'] },
    },
  },
  anxiety: {
    label: 'کنسول اضطراب (Inside Out 2)',
    emoji: '😰',
    description: 'با اَنگزایتی، انوی، انویی، خجالت و نوستالژی؛ برنامه‌ریزی، تمرکز و مدیریت هیجان‌ها',
    decor: ['#FD9644', '#FF7675', '#00CEC9', '#636E72', '#FAB1A0', '#D6A2E8'],
    light: {
      background: '#FFF7F0', surface: '#FFFFFF', surfaceVariant: '#FFE9D6',
      primary: '#F97316', primaryLight: '#FDBA74',
      secondary: '#14B8A6', secondaryLight: '#99F6E4',
      accent: '#8B5CF6', accentLight: '#DDD6FE',
      tertiary: '#EF4444', tertiaryLight: '#FCA5A5',
      text: '#292524', textSecondary: '#57534E', textMuted: '#A8A29E', border: '#FED7AA',
      success: '#16A34A', warning: '#EA580C', error: '#DC2626',
      unicorn: { pink: '#FB7185', purple: '#8B5CF6', blue: '#38BDF8', green: '#14B8A6', yellow: '#FACC15', orange: '#F97316' },
      gradient: { morning: ['#FDBA74', '#F97316', '#D6A2E8'], noon: ['#99F6E4', '#14B8A6', '#FDBA74'], evening: ['#8B5CF6', '#F97316', '#EF4444'], night: ['#292524', '#44403C', '#7C2D12'] },
    },
    dark: {
      background: '#1C120C', surface: '#261810', surfaceVariant: '#352117',
      primary: '#FB923C', primaryLight: '#FDBA74',
      secondary: '#2DD4BF', secondaryLight: '#99F6E4',
      accent: '#A78BFA', accentLight: '#DDD6FE',
      tertiary: '#F87171', tertiaryLight: '#FECACA',
      text: '#FAFAF9', textSecondary: '#D6D3D1', textMuted: '#A8A29E', border: '#4A2D1D',
      success: '#4ADE80', warning: '#FBBF24', error: '#F87171',
      unicorn: { pink: '#FB7185', purple: '#A78BFA', blue: '#38BDF8', green: '#2DD4BF', yellow: '#FACC15', orange: '#FB923C' },
      gradient: { morning: ['#FB923C', '#F97316', '#A78BFA'], noon: ['#2DD4BF', '#14B8A6', '#FB923C'], evening: ['#A78BFA', '#FB923C', '#F87171'], night: ['#0F0A07', '#1C120C', '#352117'] },
    },
  },
  'dream-studio': {
    label: 'استودیو رویاها (Dream Productions)',
    emoji: '🎬',
    description: 'با پائولا، زِنی و ژان در استودیو رویابافی؛ ساخت رویاها، خلاقیت و خواب آرام',
    decor: ['#A29BFE', '#FF9FF3', '#74B9FF', '#FFEAA7', '#55EFC4', '#81ECEC'],
    light: {
      background: '#F6F3FF', surface: '#FFFFFF', surfaceVariant: '#ECE7FF',
      primary: '#7C5CFF', primaryLight: '#C4B5FD',
      secondary: '#EC4899', secondaryLight: '#FBCFE8',
      accent: '#06B6D4', accentLight: '#A5F3FC',
      tertiary: '#F59E0B', tertiaryLight: '#FDE68A',
      text: '#1F2937', textSecondary: '#4B5563', textMuted: '#9CA3AF', border: '#DDD6FE',
      success: '#10B981', warning: '#F59E0B', error: '#EF4444',
      unicorn: { pink: '#EC4899', purple: '#7C5CFF', blue: '#38BDF8', green: '#34D399', yellow: '#FDE68A', orange: '#FB923C' },
      gradient: { morning: ['#C4B5FD', '#A29BFE', '#FBCFE8'], noon: ['#A5F3FC', '#7C5CFF', '#FDE68A'], evening: ['#EC4899', '#7C5CFF', '#38BDF8'], night: ['#1E1B4B', '#312E81', '#4C1D95'] },
    },
    dark: {
      background: '#120F24', surface: '#1A1533', surfaceVariant: '#241D45',
      primary: '#A78BFA', primaryLight: '#DDD6FE',
      secondary: '#F472B6', secondaryLight: '#FBCFE8',
      accent: '#22D3EE', accentLight: '#A5F3FC',
      tertiary: '#FBBF24', tertiaryLight: '#FDE68A',
      text: '#F8FAFC', textSecondary: '#CBD5E1', textMuted: '#94A3B8', border: '#3B2E66',
      success: '#34D399', warning: '#FBBF24', error: '#F87171',
      unicorn: { pink: '#F472B6', purple: '#A78BFA', blue: '#38BDF8', green: '#34D399', yellow: '#FDE68A', orange: '#FB923C' },
      gradient: { morning: ['#A78BFA', '#7C5CFF', '#F472B6'], noon: ['#22D3EE', '#A78BFA', '#FBBF24'], evening: ['#F472B6', '#A78BFA', '#38BDF8'], night: ['#070716', '#120F24', '#241D45'] },
    },
  },
};

// Back-compat exports
export const colors = {
  light: presetPalettes.joy.light,
  dark: presetPalettes.joy.dark,
};

export const themePresets = (Object.keys(presetPalettes) as ThemePreset[]).map(id => ({
  id,
  label: presetPalettes[id].label,
  emoji: presetPalettes[id].emoji,
  description: presetPalettes[id].description,
  decor: presetPalettes[id].decor,
  primaryLight: presetPalettes[id].light.primary,
  primaryDark: presetPalettes[id].dark.primary,
}));

export const getThemeDecor = (preset: ThemePreset = 'joy') => presetPalettes[preset]?.decor || presetPalettes.joy.decor;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 36,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const shadows = {
  light: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 8 },
  },
  dark: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 2, elevation: 2 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  },
};

export const getThemeColors = (isDark: boolean, preset: ThemePreset = 'joy') => {
  const p = presetPalettes[preset] || presetPalettes.joy;
  return isDark ? p.dark : p.light;
};
export type ThemeColors = ReturnType<typeof getThemeColors>;
export const getThemeShadows = (isDark: boolean) => isDark ? shadows.dark : shadows.light;
