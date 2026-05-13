type LoadConfigOptions = {
  env?: Record<string, string | undefined>;
  extra?: Record<string, unknown>;
  generated?: Record<string, string>;
};

const ORIGINAL_ENV = process.env;

function loadConfig({ env = {}, extra = {}, generated = {} }: LoadConfigOptions = {}) {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  jest.doMock('expo-constants', () => ({
    __esModule: true,
    default: {
      expoConfig: {
        extra,
      },
    },
  }));
  jest.doMock('../../lib/generated-config.json', () => generated);

  return require('../../lib/config').config;
}

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.dontMock('expo-constants');
  jest.dontMock('../../lib/generated-config.json');
});

describe('config', () => {
  it('has typed fallback values for local development', () => {
    const config = loadConfig();

    expect(typeof config.apiBaseUrl).toBe('string');
    expect(config.apiBaseUrl.length).toBeGreaterThan(0);
    expect(typeof config.clubSlug).toBe('string');
    expect(config.clubSlug.length).toBeGreaterThan(0);
    expect(typeof config.useMockData).toBe('boolean');
  });

  it('removes a trailing slash from apiBaseUrl', () => {
    const config = loadConfig({
      env: {
        EXPO_PUBLIC_API_BASE_URL: 'https://example.com/',
      },
    });

    expect(config.apiBaseUrl).toBe('https://example.com');
  });

  it('allows generated runtime config to override local development values', () => {
    const config = loadConfig({
      extra: {
        apiBaseUrl: 'https://extra.example.com',
        clubSlug: 'rangers',
        assetVariant: 'rangers',
        useMockData: false,
      },
      generated: {
        apiBaseUrl: 'http://localhost:3002',
        clubSlug: 'santiago-morning',
        assetVariant: 'santiago-morning',
        useMockData: 'true',
      },
    });

    expect(config.apiBaseUrl).toBe('http://localhost:3002');
    expect(config.clubSlug).toBe('santiago-morning');
    expect(config.assetVariant).toBe('santiago-morning');
    expect(config.useMockData).toBe(true);
  });

  it('ignores generated runtime config in release builds', () => {
    const config = loadConfig({
      extra: {
        apiBaseUrl: 'https://example.com',
        clubSlug: 'puerto-montt',
        assetVariant: 'puerto-montt',
        useMockData: false,
        releaseBuild: true,
      },
      generated: {
        apiBaseUrl: 'http://localhost:3002',
        clubSlug: 'santiago-morning',
        assetVariant: 'santiago-morning',
        useMockData: 'true',
      },
    });

    expect(config.apiBaseUrl).toBe('https://example.com');
    expect(config.clubSlug).toBe('puerto-montt');
    expect(config.assetVariant).toBe('puerto-montt');
    expect(config.useMockData).toBe(false);
  });

  it('reads the EAS project id from Expo extra first', () => {
    const config = loadConfig({
      env: {
        EXPO_PUBLIC_EAS_PROJECT_ID: 'env-project-id',
        EAS_PROJECT_ID: 'private-env-project-id',
      },
      extra: {
        eas: {
          projectId: 'extra-project-id',
        },
      },
    });

    expect(config.easProjectId).toBe('extra-project-id');
  });

  it('falls back to EAS project id env values', () => {
    expect(
      loadConfig({
        env: {
          EXPO_PUBLIC_EAS_PROJECT_ID: 'public-env-project-id',
        },
      }).easProjectId,
    ).toBe('public-env-project-id');

    expect(
      loadConfig({
        env: {
          EXPO_PUBLIC_EAS_PROJECT_ID: undefined,
          EAS_PROJECT_ID: 'private-env-project-id',
        },
      }).easProjectId,
    ).toBe('private-env-project-id');
  });
});
