/**
 * App configuration from environment variables.
 * Expo replaces EXPO_PUBLIC_* at build time.
 */
export const config = {
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3002',
  clubSlug:
    process.env.EXPO_PUBLIC_CLUB_SLUG ?? 'rangers',
  /** When true, use fake data instead of backend. */
  useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
} as const;
