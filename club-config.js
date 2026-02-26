/**
 * Club build configurations. Each variant maps to app identity at build time.
 * @see app.config.ts
 *
 * Maps API club slug to build variant for static assets (favicon, title, etc).
 * Used when EXPO_PUBLIC_CLUB_SLUG is set without APP_VARIANT.
 */
exports.CLUB_SLUG_TO_VARIANT = {
  rangers: 'rangers',
  'deportes-concepcion': 'deportes-concepcion',
  palestino: 'palestino',
  'puerto-montt': 'puerto-montt',
};

exports.CLUB_CONFIGS = {
  rangers: {
    name: 'Rangers App',
    slug: 'rangers-app',
    scheme: 'rangersapp',
    bundleId: 'com.grada.rangers',
    package: 'com.grada.rangers',
    clubSlug: 'rangers',
  },
  'deportes-concepcion': {
    name: 'Deportes Concepción App',
    slug: 'deportes-concepcion-app',
    scheme: 'deportesconcepcionapp',
    bundleId: 'com.grada.deportesconcepcion',
    package: 'com.grada.deportesconcepcion',
    clubSlug: 'deportes-concepcion',
  },
  palestino: {
    name: 'Palestino App',
    slug: 'palestino-app',
    scheme: 'palestinoapp',
    bundleId: 'com.grada.palestino',
    package: 'com.grada.palestino',
    clubSlug: 'palestino',
  },
  'puerto-montt': {
    name: 'Deportes Puerto Montt App',
    slug: 'puerto-montt-app',
    scheme: 'puertomonttapp',
    bundleId: 'com.grada.puertomontt',
    package: 'com.grada.puertomontt',
    clubSlug: 'puerto-montt',
  },
};
