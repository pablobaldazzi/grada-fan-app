import type { Club } from './schemas';

export type ThemeMode = 'dark' | 'light';

const DARK = {
  primary: '#E31E24',
  primaryDark: '#B71518',
  primaryLight: '#FF4449',
  secondary: '#000000',
  background: '#0A0A0A',
  surface: '#151515',
  surfaceLight: '#1E1E1E',
  surfaceHighlight: '#2A2A2A',
  card: '#181818',
  cardBorder: '#252525',
  text: '#FFFFFF',
  textSecondary: '#A0A0A0',
  textTertiary: '#666666',
  textMuted: '#4A4A4A',
  tabActive: '#E31E24',
  tabInactive: '#666666',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',
  gold: '#FFD700',
  divider: '#222222',
} as const;

const LIGHT = {
  ...DARK,
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceLight: '#F0F0F0',
  surfaceHighlight: '#E5E5E5',
  card: '#F5F5F5',
  cardBorder: '#E0E0E0',
  text: '#1A1A1A',
  textSecondary: '#555555',
  textTertiary: '#888888',
  textMuted: '#BBBBBB',
  tabInactive: '#999999',
  divider: '#E0E0E0',
} as const;

const FALLBACK = DARK;

function parseHex(hex: string): { r: number; g: number; b: number } {
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function darkenHex(hex: string, factor: number): string {
  const { r, g, b } = parseHex(hex);
  return '#' + [r, g, b]
    .map((c) => Math.round(c * (1 - factor)))
    .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0'))
    .join('');
}

function lightenHex(hex: string, factor: number): string {
  const { r, g, b } = parseHex(hex);
  return '#' + [r, g, b]
    .map((c) => Math.round(c + factor * (255 - c)))
    .map((c) => Math.max(0, Math.min(255, c)).toString(16).padStart(2, '0'))
    .join('');
}

export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    surface: string;
    surfaceLight: string;
    surfaceHighlight: string;
    card: string;
    cardBorder: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    textMuted: string;
    tabActive: string;
    tabInactive: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    gold: string;
    divider: string;
  };
  fonts: {
    regular: string;
    bold: string;
  };
}

export function buildTheme(club?: Club | null, mode: ThemeMode = 'dark'): Theme {
  const palette = mode === 'light' ? LIGHT : DARK;
  const primary = club?.appPrimaryColor ?? club?.primaryColor ?? palette.primary;
  const secondary = club?.appSecondaryColor ?? club?.secondaryColor ?? palette.secondary;
  const background = mode === 'light'
    ? palette.background
    : (club?.appBackgroundColor ?? club?.storeBackgroundColor ?? palette.background);
  const text = mode === 'light' ? LIGHT.text : (club?.appTextColor ?? club?.navBarTextColor ?? palette.text);

  return {
    colors: {
      primary,
      primaryDark: darkenHex(primary, 0.3),
      primaryLight: lightenHex(primary, 0.3),
      secondary,
      background,
      surface: palette.surface,
      surfaceLight: palette.surfaceLight,
      surfaceHighlight: palette.surfaceHighlight,
      card: palette.card,
      cardBorder: palette.cardBorder,
      text,
      textSecondary: palette.textSecondary,
      textTertiary: palette.textTertiary,
      textMuted: palette.textMuted,
      tabActive: primary,
      tabInactive: palette.tabInactive,
      success: palette.success,
      warning: palette.warning,
      error: palette.error,
      info: palette.info,
      gold: palette.gold,
      divider: palette.divider,
    },
    fonts: {
      regular: club?.font ?? 'Inter_400Regular',
      bold: club?.font ?? 'Inter_700Bold',
    },
  };
}

export const defaultTheme = buildTheme();
