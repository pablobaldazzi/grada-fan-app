import { buildTheme, defaultTheme } from '../../lib/theme';
import type { Club } from '../../lib/schemas';

describe('buildTheme', () => {
  it('returns fallback colors when club is null', () => {
    const theme = buildTheme(null);
    expect(theme.colors.primary).toBe('#E31E24');
    expect(theme.colors.secondary).toBe('#000000');
    expect(theme.colors.background).toBe('#0A0A0A');
    expect(theme.colors.text).toBe('#FFFFFF');
    expect(theme.colors.error).toBe('#E74C3C');
  });
  it('returns fallback when club is undefined', () => {
    const theme = buildTheme(undefined);
    expect(theme.colors.primary).toBe('#E31E24');
  });
  it('uses club primaryColor when provided', () => {
    const club = { primaryColor: '#FF0000' } as Club;
    const theme = buildTheme(club);
    expect(theme.colors.primary).toBe('#FF0000');
    expect(theme.colors.tabActive).toBe('#FF0000');
  });
  it('uses club secondaryColor and storeBackgroundColor and navBarTextColor', () => {
    const club = {
      secondaryColor: '#111',
      storeBackgroundColor: '#222',
      navBarTextColor: '#EEE',
    } as Club;
    const theme = buildTheme(club);
    expect(theme.colors.secondary).toBe('#111');
    expect(theme.colors.background).toBe('#222');
    expect(theme.colors.text).toBe('#EEE');
  });
  it('returns fonts fallback when club has no font', () => {
    const theme = buildTheme(null);
    expect(theme.fonts.regular).toBe('Inter_400Regular');
    expect(theme.fonts.bold).toBe('Inter_700Bold');
  });
  it('returns fonts from club when provided', () => {
    const club = { font: 'CustomFont' } as Club;
    const theme = buildTheme(club);
    expect(theme.fonts.regular).toBe('CustomFont');
    expect(theme.fonts.bold).toBe('CustomFont');
  });
});

describe('defaultTheme', () => {
  it('is valid theme', () => {
    expect(defaultTheme.colors.primary).toBe('#E31E24');
    expect(defaultTheme.fonts.regular).toBeDefined();
  });
});
