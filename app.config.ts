// eslint-disable-next-line @typescript-eslint/no-require-imports
const { CLUB_CONFIGS, CLUB_SLUG_TO_VARIANT } = require('./club-config.js');

// Derive variant: APP_VARIANT, or from EXPO_PUBLIC_CLUB_SLUG
const clubSlug = process.env.EXPO_PUBLIC_CLUB_SLUG;
const variantFromSlug = clubSlug ? CLUB_SLUG_TO_VARIANT[clubSlug] : undefined;
const variant = process.env.APP_VARIANT || variantFromSlug || 'rangers';
const club = CLUB_CONFIGS[variant] || CLUB_CONFIGS.rangers;
const apiBaseUrl =
  process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3002';

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
    },
  },
};
