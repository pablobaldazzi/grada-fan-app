import Constants from 'expo-constants';

let runtimeConfig: Record<string, string> = {};
try {
  runtimeConfig = require('./generated-config.json');
} catch {
  // file may not exist; fall through to other sources
}

const extra = (Constants.expoConfig?.extra as Record<string, unknown> | undefined) ?? {};

function resolve(
  generated: string | undefined,
  extraVal: unknown,
  envVal: string | undefined,
  fallback: string,
): string {
  return generated || (extraVal as string) || envVal || fallback;
}

export const config = {
  apiBaseUrl: resolve(
    runtimeConfig.apiBaseUrl,
    extra.apiBaseUrl,
    process.env.EXPO_PUBLIC_API_BASE_URL,
    'http://localhost:3002',
  ),
  clubSlug: resolve(
    runtimeConfig.clubSlug,
    extra.clubSlug,
    process.env.EXPO_PUBLIC_CLUB_SLUG,
    'rangers',
  ),
  assetVariant: resolve(
    runtimeConfig.assetVariant,
    extra.assetVariant,
    undefined,
    'rangers',
  ),
  useMockData:
    runtimeConfig.useMockData === 'true' ||
    extra.useMockData === true ||
    extra.useMockData === 'true' ||
    process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
} as const;
