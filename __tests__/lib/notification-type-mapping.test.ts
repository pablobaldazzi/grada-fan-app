import { getDisplayType } from '@/lib/notification-utils';

describe('notification type mapping', () => {
  it('maps NEW_MATCH to ticket', () => {
    expect(getDisplayType('NEW_MATCH')).toBe('ticket');
  });

  it('maps MATCH_REMINDER to ticket', () => {
    expect(getDisplayType('MATCH_REMINDER')).toBe('ticket');
  });

  it('maps PROMO to promo', () => {
    expect(getDisplayType('PROMO')).toBe('promo');
  });

  it('maps NEW_BENEFIT to offer', () => {
    expect(getDisplayType('NEW_BENEFIT')).toBe('offer');
  });

  it('maps GENERAL to club', () => {
    expect(getDisplayType('GENERAL')).toBe('club');
  });

  it('maps unknown or empty to club', () => {
    expect(getDisplayType(undefined)).toBe('club');
    expect(getDisplayType('')).toBe('club');
    expect(getDisplayType('UNKNOWN_TYPE')).toBe('club');
  });
});
