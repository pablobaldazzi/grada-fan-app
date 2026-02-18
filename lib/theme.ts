import type { Club } from './schemas';

/** Rojinegro fallbacks (grada-fan-app default) */
const FALLBACK = {
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

export function buildTheme(club?: Club | null): Theme {
  return {
    colors: {
      primary: club?.primaryColor ?? FALLBACK.primary,
      primaryDark: FALLBACK.primaryDark,
      primaryLight: FALLBACK.primaryLight,
      secondary: club?.secondaryColor ?? FALLBACK.secondary,
      background: club?.storeBackgroundColor ?? FALLBACK.background,
      surface: FALLBACK.surface,
      surfaceLight: FALLBACK.surfaceLight,
      surfaceHighlight: FALLBACK.surfaceHighlight,
      card: FALLBACK.card,
      cardBorder: FALLBACK.cardBorder,
      text: club?.navBarTextColor ?? FALLBACK.text,
      textSecondary: FALLBACK.textSecondary,
      textTertiary: FALLBACK.textTertiary,
      textMuted: FALLBACK.textMuted,
      tabActive: club?.primaryColor ?? FALLBACK.tabActive,
      tabInactive: FALLBACK.tabInactive,
      success: FALLBACK.success,
      warning: FALLBACK.warning,
      error: FALLBACK.error,
      info: FALLBACK.info,
      gold: FALLBACK.gold,
      divider: FALLBACK.divider,
    },
    fonts: {
      regular: club?.font ?? 'Inter_400Regular',
      bold: club?.font ?? 'Inter_700Bold',
    },
  };
}

export const defaultTheme = buildTheme();
