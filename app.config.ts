// eslint-disable-next-line @typescript-eslint/no-require-imports
const { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT } = require('./club-config.js');

const LOCAL_API_BASE_URL = 'http://localhost:3002';
const RELEASE_BUILD_PROFILES = new Set([
  'production',
  'rangers_ios',
  'rangers_android',
  'deportes_concepcion_ios',
  'deportes_concepcion_android',
  'palestino_ios',
  'palestino_android',
  'puerto_montt_ios',
  'puerto_montt_android',
]);

function isLocalhostUrl(value: string): boolean {
  try {
    const { hostname } = new URL(value);
    return (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.endsWith('.localhost')
    );
  } catch {
    return false;
  }
}

function failReleaseConfig(message: string): never {
  throw new Error(`[release config] ${message}`);
}

const buildProfile = process.env.EAS_BUILD_PROFILE;
const isReleaseBuild =
  process.env.GRADA_RELEASE_BUILD === 'true' ||
  process.env.EAS_BUILD === 'true' ||
  (buildProfile ? RELEASE_BUILD_PROFILES.has(buildProfile) : false);

// Derive variant: APP_VARIANT, or from EXPO_PUBLIC_CLUB_SLUG
const clubSlug = process.env.EXPO_PUBLIC_CLUB_SLUG;
const variantFromSlug = clubSlug ? CLUB_SLUG_TO_VARIANT[clubSlug] : undefined;
const requestedVariant = process.env.APP_VARIANT || variantFromSlug;
const variant = requestedVariant || 'rangers';
const club = CLUB_CONFIGS[variant] || CLUB_CONFIGS.rangers;
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || LOCAL_API_BASE_URL;
const easProjectId =
  process.env.EXPO_PUBLIC_EAS_PROJECT_ID || process.env.EAS_PROJECT_ID;
const expectedVariant =
  process.env.GRADA_EXPECTED_APP_VARIANT ||
  (buildProfile?.startsWith('puerto_montt') ? 'puerto-montt' : undefined);

if (isReleaseBuild) {
  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    failReleaseConfig('EXPO_PUBLIC_API_BASE_URL is required for release builds.');
  }
  if (isLocalhostUrl(apiBaseUrl)) {
    failReleaseConfig('EXPO_PUBLIC_API_BASE_URL must not point to localhost for release builds.');
  }
  if (process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true') {
    failReleaseConfig('EXPO_PUBLIC_USE_MOCK_DATA must be false or unset for release builds.');
  }
  if (!easProjectId) {
    failReleaseConfig(
      'EXPO_PUBLIC_EAS_PROJECT_ID or EAS_PROJECT_ID is required for release builds with push notifications.',
    );
  }
  if (!requestedVariant) {
    failReleaseConfig('APP_VARIANT or EXPO_PUBLIC_CLUB_SLUG is required for release builds.');
  }
  if (!CLUB_CONFIGS[variant]) {
    failReleaseConfig(`Unknown APP_VARIANT "${variant}".`);
  }
  if (expectedVariant) {
    if (process.env.APP_VARIANT !== expectedVariant) {
      failReleaseConfig(`APP_VARIANT must be "${expectedVariant}" for this build profile.`);
    }
    if (clubSlug !== expectedVariant) {
      failReleaseConfig(`EXPO_PUBLIC_CLUB_SLUG must be "${expectedVariant}" for this build profile.`);
    }
  }
}

const assetBase = `./assets/clubs/${variant}`;

export default {
  expo: {
    name: club.name,
    slug: club.slug,
    version: '1.0.0',
    orientation: 'portrait',
    icon: `${assetBase}/icon.png`,
    scheme: club.scheme,
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      image: `${assetBase}/splash-icon.png`,
      resizeMode: 'contain',
      backgroundColor: '#0A0A0A',
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: club.bundleId,
    },
    android: {
      package: club.package,
      adaptiveIcon: {
        backgroundColor: '#0A0A0A',
        foregroundImage: `${assetBase}/android-icon-foreground.png`,
        backgroundImage: `${assetBase}/android-icon-background.png`,
        monochromeImage: `${assetBase}/android-icon-monochrome.png`,
      },
    },
    web: {
      favicon: `${assetBase}/favicon.png`,
    },
    plugins: [
      ['expo-router', { origin: 'https://replit.com/' }],
      [
        'expo-image-picker',
        {
          photosPermission:
            'Deportes Puerto Montt usa tu biblioteca de fotos solo para que puedas elegir o actualizar tu foto de perfil.',
          cameraPermission: false,
          microphonePermission: false,
        },
      ],
      'expo-font',
      'expo-web-browser',
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
    extra: {
      clubSlug: club.clubSlug,
      apiBaseUrl,
      assetVariant: variant,
      useMockData: process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true',
      releaseBuild: isReleaseBuild,
      eas: {
        projectId: easProjectId,
      },
    },
  },
};
