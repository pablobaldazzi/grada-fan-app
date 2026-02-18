import { formatCLP, formatDate, formatTime, timeAgo } from '../../lib/format';

describe('formatCLP', () => {
  it('formats zero as Chilean peso string', () => {
    expect(formatCLP(0)).toBe('$0');
  });

  it('formats positive integers with thousands separator', () => {
    expect(formatCLP(1000)).toBe('$1.000');
    expect(formatCLP(15000)).toBe('$15.000');
    expect(formatCLP(1234567)).toBe('$1.234.567');
  });

  it('formats amounts without decimal places for whole numbers', () => {
    expect(formatCLP(99)).toBe('$99');
  });

  it('formats large numbers correctly', () => {
    expect(formatCLP(1_000_000)).toBe('$1.000.000');
  });
});

describe('formatDate', () => {
  it('formats ISO date string to Spanish short format (day name, date, month)', () => {
    expect(formatDate('2025-02-15T12:00:00.000Z')).toMatch(/^\w{3} 15 \w{3}$/);
    expect(formatDate('2025-02-15')).toMatch(/^\w{3} 15 \w{3}$/);
  });

  it('uses Ene, Feb, Mar ... Dic for months', () => {
    const jan = formatDate('2025-01-10');
    expect(jan).toContain('Ene');
    const dic = formatDate('2025-12-10');
    expect(dic).toContain('Dic');
  });

  it('uses Dom, Lun, Mar ... Sab for weekdays', () => {
    const result = formatDate('2025-02-17');
    expect(['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab']).toContain(result.split(' ')[0]);
  });
});

describe('formatTime', () => {
  it('formats datetime to Chilean locale time (HH:MM)', () => {
    const t = formatTime('2025-02-17T14:30:00.000Z');
    expect(t).toMatch(/^\d{1,2}:\d{2}$/);
  });

  it('returns a string with hour and minute', () => {
    const t = formatTime('2025-02-17T09:05:00');
    expect(t).toMatch(/\d/);
  });
});

describe('timeAgo', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns "hace Xm" for minutes less than 60', () => {
    const now = new Date('2025-02-17T12:00:00.000Z');
    jest.setSystemTime(now);
    const past = new Date('2025-02-17T11:45:00.000Z').toISOString();
    expect(timeAgo(past)).toBe('hace 15m');
  });

  it('returns "hace Xh" for hours less than 24', () => {
    const now = new Date('2025-02-17T14:00:00.000Z');
    jest.setSystemTime(now);
    const past = new Date('2025-02-17T11:00:00.000Z').toISOString();
    expect(timeAgo(past)).toBe('hace 3h');
  });

  it('returns "hace Xd" for days less than 7', () => {
    const now = new Date('2025-02-17T12:00:00.000Z');
    jest.setSystemTime(now);
    const past = new Date('2025-02-15T12:00:00.000Z').toISOString();
    expect(timeAgo(past)).toBe('hace 2d');
  });

  it('returns formatted date for 7 or more days ago', () => {
    const now = new Date('2025-02-17T12:00:00.000Z');
    jest.setSystemTime(now);
    const past = new Date('2025-02-01T12:00:00.000Z').toISOString();
    const result = timeAgo(past);
    expect(result).toMatch(/\w{3} \d+ \w{3}/);
    expect(result).not.toMatch(/hace \d+[mhd]/);
  });

  it('handles same timestamp as "hace 0m"', () => {
    const now = new Date('2025-02-17T12:00:00.000Z');
    jest.setSystemTime(now);
    expect(timeAgo(now.toISOString())).toBe('hace 0m');
  });
});
