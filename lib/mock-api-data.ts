import type {
  ClubWithRelations,
  AuthResponse,
  Fan,
  FanProfile,
  Order,
  NotificationList,
  AppNotification,
  NotificationPrefs,
} from './schemas';

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

export const MOCK_ACCESS_TOKEN = 'mock-access-token';

// ── Club with events and products ────────────────────────────────
export const mockClubWithRelations: ClubWithRelations = {
  id: 'mock-club-id',
  slug: 'rangers',
  name: 'Rangers',
  logoUrl: null,
  fullLogoUrl: null,
  useFullLogo: false,
  primaryColor: '#E31E24',
  secondaryColor: '#000000',
  navBarBackgroundColor: null,
  navBarTextColor: '#FFFFFF',
  storeBackgroundColor: '#0A0A0A',
  bannerUrl: null,
  font: null,
  events: [
    {
      id: 'mock-event-1',
      name: 'Rangers vs Colo-Colo',
      datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Estadio Fiscal de Talca',
      ticketTypes: [
        { id: 'mock-tt-1', name: 'General', price: 10000 },
        { id: 'mock-tt-2', name: 'Preferencia', price: 15000 },
      ],
    },
    {
      id: 'mock-event-2',
      name: 'Rangers vs U. de Chile',
      datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Estadio Fiscal de Talca',
      ticketTypes: [{ id: 'mock-tt-3', name: 'Tribuna', price: 12000 }],
    },
  ],
  products: [
    { id: 'mock-prod-1', name: 'Polera Oficial', price: 25000, imageUrl: null, imageUrls: [], stock: 50 },
    { id: 'mock-prod-2', name: 'Gorro', price: 8000, imageUrl: null, imageUrls: [], stock: 100 },
  ],
};

// ── Auth / Fan / Profile ─────────────────────────────────────────
export const mockFan: Fan = {
  id: 'mock-fan-id',
  email: 'socio@rangers.cl',
  name: 'Juan Socio',
  firstName: 'Juan',
  lastName: 'Socio',
  phone: '+56 9 1234 5678',
  clubId: mockClubWithRelations.id,
};

let mockProfileState: FanProfile = {
  ...mockFan,
  nationalId: null,
  address1: null,
  address2: null,
  postalCode: null,
  city: null,
  region: null,
  country: null,
  marketingOptIn: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function getMockProfile(): FanProfile {
  return { ...mockProfileState };
}

export function setMockProfile(updates: Partial<FanProfile>): void {
  mockProfileState = { ...mockProfileState, ...updates };
}

export function createMockAuthResponse(
  email: string,
  firstName?: string,
  lastName?: string
): AuthResponse {
  const fan: Fan = {
    ...mockFan,
    email,
    firstName: firstName ?? mockFan.firstName,
    lastName: lastName ?? mockFan.lastName,
    name: [firstName, lastName].filter(Boolean).join(' ') || email.split('@')[0],
  };
  mockProfileState = { ...mockProfileState, ...fan };
  return {
    accessToken: MOCK_ACCESS_TOKEN,
    fan,
  };
}

// ── Orders with tickets ──────────────────────────────────────────
export const mockOrders: Order[] = [
  {
    id: 'mock-order-1',
    status: 'PAID',
    totalAmount: 15000,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    tickets: [
      {
        id: 'mock-ticket-1',
        orderId: 'mock-order-1',
        status: 'ACTIVE',
        seatLabel: 'A-12',
        sectionName: 'Preferencia',
        token: 'TKT-MOCK-001-ABC123',
        event: {
          id: 'mock-event-1',
          name: 'Rangers vs Colo-Colo',
          datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          venue: 'Estadio Fiscal de Talca',
        },
        ticketType: { id: 'mock-tt-1', name: 'Preferencia', price: 15000 },
      },
    ],
    orderItems: [],
  },
  {
    id: 'mock-order-2',
    status: 'PAID',
    totalAmount: 20000,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    tickets: [
      {
        id: 'mock-ticket-2',
        orderId: 'mock-order-2',
        status: 'ACTIVE',
        seatLabel: 'B-05',
        sectionName: 'Tribuna',
        token: 'TKT-MOCK-002-XYZ789',
        event: {
          id: 'mock-event-2',
          name: 'Rangers vs U. de Chile',
          datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
          venue: 'Estadio Fiscal de Talca',
        },
        ticketType: { id: 'mock-tt-2', name: 'Tribuna', price: 20000 },
      },
    ],
    orderItems: [],
  },
];

// ── Notifications ───────────────────────────────────────────────
const mockNotifItems: AppNotification[] = [
  {
    id: 'mock-notif-1',
    type: 'ticket',
    title: 'Partido mañana: Rangers vs Colo-Colo',
    body: 'Tu partido es en 24 horas. No olvides tu entrada.',
    readAt: null,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-notif-2',
    type: 'promo',
    title: '20% en tienda',
    body: 'Usa el codigo RANGERS20 en tu proxima compra.',
    readAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-notif-3',
    type: 'club',
    title: 'Nuevo partido a la venta',
    body: 'Las entradas para Rangers vs Palestino ya estan disponibles.',
    readAt: null,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export function getMockNotifications(take = 50): { items: AppNotification[]; unreadCount: number } {
  const items = [...mockNotifItems].slice(0, take);
  const unreadCount = items.filter((n) => !n.readAt).length;
  return { items, unreadCount };
}

export function markMockNotificationRead(id: string): AppNotification | undefined {
  const n = mockNotifItems.find((x) => x.id === id);
  if (n && !n.readAt) {
    n.readAt = new Date().toISOString();
    return { ...n };
  }
  return n ? { ...n } : undefined;
}

// ── Notification prefs ───────────────────────────────────────────
let mockPrefsState: NotificationPrefs = {
  matchReminders: true,
  promos: true,
  newMatches: true,
  newBenefits: true,
};

export function getMockNotificationPrefs(): NotificationPrefs {
  return { ...mockPrefsState };
}

export function setMockNotificationPrefs(updates: Partial<NotificationPrefs>): void {
  mockPrefsState = { ...mockPrefsState, ...updates };
}

export { delay };
