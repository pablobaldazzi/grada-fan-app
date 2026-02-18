import {
  ClubSchema,
  ClubWithRelationsSchema,
  AuthResponseSchema,
  FanSchema,
  FanProfileSchema,
  NotificationSchema,
  NotificationListSchema,
  NotificationPrefsSchema,
  OrderSchema,
  BackendEventSchema,
  TicketTypeSchema,
  BackendProductSchema,
  SeatHoldResponseSchema,
  AvailabilityResponseSchema,
} from '../../lib/schemas';

describe('ClubSchema', () => {
  it('parses minimal valid club', () => {
    const data = { id: 'c1', slug: 'rangers', name: 'Rangers' };
    expect(ClubSchema.parse(data)).toEqual(data);
  });

  it('parses club with optional colors', () => {
    const data = {
      id: 'c1',
      slug: 'rangers',
      name: 'Rangers',
      primaryColor: '#E31E24',
      logoUrl: 'https://example.com/logo.png',
    };
    expect(ClubSchema.parse(data).primaryColor).toBe('#E31E24');
  });

  it('rejects missing id', () => {
    expect(() => ClubSchema.parse({ slug: 'r', name: 'N' })).toThrow();
  });
});

describe('ClubWithRelationsSchema', () => {
  it('defaults events and products to empty arrays', () => {
    const data = { id: 'c1', slug: 'r', name: 'N' };
    const parsed = ClubWithRelationsSchema.parse(data);
    expect(parsed.events).toEqual([]);
    expect(parsed.products).toEqual([]);
  });
});

describe('AuthResponseSchema', () => {
  it('parses valid auth response', () => {
    const data = {
      accessToken: 'jwt-here',
      fan: { id: 'f1', email: 'a@b.com', name: null },
    };
    const parsed = AuthResponseSchema.parse(data);
    expect(parsed.accessToken).toBe('jwt-here');
    expect(parsed.fan.email).toBe('a@b.com');
  });

  it('rejects missing accessToken', () => {
    expect(() =>
      AuthResponseSchema.parse({ fan: { id: 'f1', email: 'a@b.com' } })
    ).toThrow();
  });
});

describe('FanSchema', () => {
  it('parses minimal fan', () => {
    const data = { id: 'f1', email: 'u@example.com' };
    expect(FanSchema.parse(data).email).toBe('u@example.com');
  });
});

describe('FanProfileSchema', () => {
  it('parses profile with optional fields', () => {
    const data = {
      id: 'f1',
      email: 'u@example.com',
      firstName: 'Juan',
      lastName: 'Perez',
      phone: null,
    };
    const parsed = FanProfileSchema.parse(data);
    expect(parsed.firstName).toBe('Juan');
    expect(parsed.lastName).toBe('Perez');
  });
});

describe('NotificationSchema', () => {
  it('parses minimal notification', () => {
    const data = { id: 'n1', title: 'Hello', body: null };
    expect(NotificationSchema.parse(data).title).toBe('Hello');
  });

  it('parses notification with readAt and createdAt', () => {
    const data = {
      id: 'n1',
      title: 'T',
      readAt: '2025-02-17T12:00:00Z',
      createdAt: '2025-02-17T11:00:00Z',
    };
    const parsed = NotificationSchema.parse(data);
    expect(parsed.readAt).toBeDefined();
    expect(parsed.createdAt).toBeDefined();
  });
});

describe('NotificationListSchema', () => {
  it('parses list with items and unreadCount', () => {
    const data = {
      items: [{ id: 'n1', title: 'T', body: '' }],
      unreadCount: 1,
    };
    const parsed = NotificationListSchema.parse(data);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.unreadCount).toBe(1);
  });
});

describe('NotificationPrefsSchema', () => {
  it('parses prefs with optional booleans', () => {
    const data = { matchReminders: true, promos: false };
    const parsed = NotificationPrefsSchema.parse(data);
    expect(parsed.matchReminders).toBe(true);
    expect(parsed.promos).toBe(false);
  });
});

describe('OrderSchema', () => {
  it('parses order with optional tickets', () => {
    const data = { id: 'o1', status: 'PAID', tickets: [] };
    const parsed = OrderSchema.parse(data);
    expect(parsed.id).toBe('o1');
    expect(parsed.tickets).toEqual([]);
  });
});

describe('BackendEventSchema', () => {
  it('parses event with datetime and optional ticketTypes', () => {
    const data = {
      id: 'e1',
      name: 'Match 1',
      datetime: '2025-03-01T20:00:00Z',
      ticketTypes: [],
    };
    const parsed = BackendEventSchema.parse(data);
    expect(parsed.datetime).toBe('2025-03-01T20:00:00Z');
    expect(parsed.ticketTypes).toEqual([]);
  });
});

describe('TicketTypeSchema', () => {
  it('transforms string price to number', () => {
    const data = { id: 'tt1', name: 'General', price: '10000' };
    const parsed = TicketTypeSchema.parse(data);
    expect(parsed.price).toBe(10000);
  });

  it('keeps number price as number', () => {
    const data = { id: 'tt1', name: 'VIP', price: 20000 };
    const parsed = TicketTypeSchema.parse(data);
    expect(parsed.price).toBe(20000);
  });
});

describe('BackendProductSchema', () => {
  it('parses product with string price transformed to number', () => {
    const data = { id: 'p1', name: 'Jersey', price: '25000' };
    const parsed = BackendProductSchema.parse(data);
    expect(parsed.price).toBe(25000);
  });
});

describe('SeatHoldResponseSchema', () => {
  it('parses hold response', () => {
    const data = { holdToken: 'abc123', ttlSeconds: 600 };
    expect(SeatHoldResponseSchema.parse(data).holdToken).toBe('abc123');
  });
});

describe('AvailabilityResponseSchema', () => {
  it('parses availability with taken and held seat ids', () => {
    const data = {
      takenSeatIds: ['s1'],
      heldSeatIds: ['s2'],
    };
    const parsed = AvailabilityResponseSchema.parse(data);
    expect(parsed.takenSeatIds).toEqual(['s1']);
    expect(parsed.heldSeatIds).toEqual(['s2']);
  });
});
