describe('config', () => {
  it('has apiBaseUrl string', () => {
    const mod = require('../../lib/config');
    expect(typeof mod.config.apiBaseUrl).toBe('string');
    expect(mod.config.apiBaseUrl.length).toBeGreaterThan(0);
  });
  it('has clubSlug string', () => {
    const mod = require('../../lib/config');
    expect(typeof mod.config.clubSlug).toBe('string');
    expect(mod.config.clubSlug.length).toBeGreaterThan(0);
  });
  it('has useMockData boolean', () => {
    const mod = require('../../lib/config');
    expect(typeof mod.config.useMockData).toBe('boolean');
  });
  it('apiBaseUrl does not end with slash', () => {
    const mod = require('../../lib/config');
    expect(mod.config.apiBaseUrl).not.toMatch(/\/$/);
  });
});
