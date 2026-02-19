import Constants from 'expo-constants';

/**
 * App configuration from expo-constants extra (build-time) or environment variables.
 * Expo replaces EXPO_PUBLIC_* at build time. app.config.js injects clubSlug and apiBaseUrl into extra.
 */
const extra = (Constants.expoConfig?.extra as Record<string, string> | undefined) ?? {};
export const config = {
  apiBaseUrl:
    extra.apiBaseUrl ??
    process.env.EXPO_PUBLIC_API_BASE_URL ??
    'http://localhost:3002',
  /** API club slug. EXPO_PUBLIC_CLUB_SLUG overrides build-time extra when set. */
  clubSlug:
    process.env.EXPO_PUBLIC_CLUB_SLUG ??
    extra.clubSlug ??
    'rangers',
  /** Build variant for static assets (icon, favicon). Matches app.config. */
  assetVariant: (extra.assetVariant as string) || 'rangers',
  /** When true, use fake data instead of backend. */
  useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
} as const;
