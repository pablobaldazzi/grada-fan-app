/**
 * Club build configurations. Each variant maps to app identity at build time.
 * @see app.config.ts
 */
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
};
