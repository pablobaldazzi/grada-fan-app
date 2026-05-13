import Constants from 'expo-constants';

const extra = (Constants?.expoConfig?.extra as Record<string, unknown> | undefined) ?? {};
const isReleaseBuild =
  extra.releaseBuild === true ||
  process.env.GRADA_RELEASE_BUILD === 'true' ||
  process.env.EAS_BUILD === 'true';

let runtimeConfig: Record<string, string> = {};
if (!isReleaseBuild) {
  try {
    runtimeConfig = require('./generated-config.json');
  } catch {
    // file may not exist; fall through to other sources
  }
}

function resolve(
  generated: string | undefined,
  extraVal: unknown,
  envVal: string | undefined,
  fallback: string,
): string {
  return (generated || (extraVal as string) || envVal || fallback).replace(/\/$/, '');
}

function resolveOptionalString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

const extraEas = extra.eas as Record<string, unknown> | undefined;

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
  easProjectId: resolveOptionalString(
    extraEas?.projectId,
    process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    process.env.EAS_PROJECT_ID,
  ),
} as const;
