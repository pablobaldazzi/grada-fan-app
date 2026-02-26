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

// ── Per-club appearance & content for demo mode ──────────────────
interface MockTeamSummary {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

interface MockMatch {
  id: string;
  name: string;
  datetime: string;
  venue: string;
  homeTeam?: MockTeamSummary;
  awayTeam?: MockTeamSummary;
}

interface MockProduct {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string | null;
  imageUrls: string[];
  stock: number;
}

interface MockClubConfig {
  name: string;
  nickname: string;
  primaryColor: string;
  secondaryColor: string;
  storeBackgroundColor: string;
  navBarTextColor: string;
  venue: string;
  rivals: [string, string];
  matches?: MockMatch[];
  products?: MockProduct[];
}

const MOCK_CLUBS: Record<string, MockClubConfig> = {
  rangers: {
    name: 'Rangers',
    nickname: 'Rojinegro',
    primaryColor: '#E31E24',
    secondaryColor: '#000000',
    storeBackgroundColor: '#0A0A0A',
    navBarTextColor: '#FFFFFF',
    venue: 'Estadio Fiscal de Talca',
    rivals: ['Colo-Colo', 'U. de Chile'],
  },
  'puerto-montt': {
    name: 'Deportes Puerto Montt',
    nickname: 'Albiverde',
    primaryColor: '#009639',
    secondaryColor: '#FFFFFF',
    storeBackgroundColor: '#0A0A0A',
    navBarTextColor: '#FFFFFF',
    venue: 'Estadio Regional de Chinquihue',
    rivals: ['Antofagasta', 'Recoleta'],
    matches: [
      {
        id: 'pm-match-1',
        name: 'Antofagasta vs Puerto Montt',
        datetime: '2026-03-01T12:00:00-03:00',
        venue: 'Estadio Regional de Antofagasta',
        homeTeam: { id: 't-antofagasta', name: 'Antofagasta', slug: 'antofagasta', logoUrl: null },
        awayTeam: { id: 't-puerto-montt', name: 'Deportes Puerto Montt', slug: 'puerto-montt', logoUrl: null },
      },
      {
        id: 'pm-match-2',
        name: 'Puerto Montt vs Recoleta',
        datetime: '2026-03-08T18:00:00-03:00',
        venue: 'Estadio Regional de Chinquihue',
        homeTeam: { id: 't-puerto-montt', name: 'Deportes Puerto Montt', slug: 'puerto-montt', logoUrl: null },
        awayTeam: { id: 't-recoleta', name: 'Recoleta', slug: 'recoleta', logoUrl: null },
      },
      {
        id: 'pm-match-3',
        name: 'Puerto Montt vs Santa Cruz',
        datetime: '2026-03-15T20:30:00-03:00',
        venue: 'Estadio Regional de Chinquihue',
        homeTeam: { id: 't-puerto-montt', name: 'Deportes Puerto Montt', slug: 'puerto-montt', logoUrl: null },
        awayTeam: { id: 't-santa-cruz', name: 'Santa Cruz', slug: 'santa-cruz', logoUrl: null },
      },
    ],
    products: [
      {
        id: 'pm-prod-1',
        name: 'Camiseta Titular 2026',
        description: 'Camiseta oficial titular Deportes Puerto Montt temporada 2026. Blanca con detalles verdes, tela dry-fit.',
        price: 45990,
        imageUrl: null,
        imageUrls: [],
        stock: 150,
      },
      {
        id: 'pm-prod-2',
        name: 'Camiseta Visita 2026',
        description: 'Camiseta oficial de visita Deportes Puerto Montt temporada 2026. Diseño oscuro con acentos verdes.',
        price: 45990,
        imageUrl: null,
        imageUrls: [],
        stock: 120,
      },
      {
        id: 'pm-prod-3',
        name: 'Tercera Camiseta 2026',
        description: 'Tercera camiseta oficial temporada 2026. Edicion especial verde con mangas blancas.',
        price: 42990,
        imageUrl: null,
        imageUrls: [],
        stock: 80,
      },
      {
        id: 'pm-prod-4',
        name: 'Camiseta Titular 2025',
        description: 'Camiseta titular temporada anterior. Liquidacion de stock, blanca con acentos verdes.',
        price: 29990,
        imageUrl: null,
        imageUrls: [],
        stock: 30,
      },
      {
        id: 'pm-prod-5',
        name: 'Camiseta Visita 2025',
        description: 'Camiseta de visita temporada anterior. Diseño negro y verde, ultimas unidades.',
        price: 29990,
        imageUrl: null,
        imageUrls: [],
        stock: 25,
      },
      {
        id: 'pm-prod-6',
        name: 'Camiseta Local KS7',
        description: 'Camiseta KS7 oficial Deportes Puerto Montt. Blanca con detalles del club, tela respirable.',
        price: 34990,
        imageUrl: 'https://sparta.cl/media/catalog/product/c/a/camiseta-futbol-hombre-ks7-deportes-puerto-montt-local-2024-blanca_1.jpg',
        imageUrls: [
          'https://sparta.cl/media/catalog/product/c/a/camiseta-futbol-hombre-ks7-deportes-puerto-montt-local-2024-blanca_1.jpg',
        ],
        stock: 60,
      },
    ],
  },
  'deportes-concepcion': {
    name: 'Deportes Concepción',
    nickname: 'Lila',
    primaryColor: '#8E44AD',
    secondaryColor: '#FFFFFF',
    storeBackgroundColor: '#0A0A0A',
    navBarTextColor: '#FFFFFF',
    venue: 'Estadio Municipal de Concepción',
    rivals: ['Rangers', 'U. de Chile'],
    matches: [
      {
        id: 'dc-match-1',
        name: 'Deportes Concepción vs Antofagasta',
        datetime: '2026-03-07T18:00:00-03:00',
        venue: 'Estadio Municipal de Concepción',
        homeTeam: { id: 't-concepcion', name: 'Deportes Concepción', slug: 'deportes-concepcion', logoUrl: null },
        awayTeam: { id: 't-antofagasta', name: 'Antofagasta', slug: 'antofagasta', logoUrl: null },
      },
      {
        id: 'dc-match-2',
        name: 'Recoleta vs Deportes Concepción',
        datetime: '2026-03-14T15:30:00-03:00',
        venue: 'Estadio Municipal de La Pintana',
        homeTeam: { id: 't-recoleta', name: 'Recoleta', slug: 'recoleta', logoUrl: null },
        awayTeam: { id: 't-concepcion', name: 'Deportes Concepción', slug: 'deportes-concepcion', logoUrl: null },
      },
      {
        id: 'dc-match-3',
        name: 'Deportes Concepción vs Santa Cruz',
        datetime: '2026-03-21T20:00:00-03:00',
        venue: 'Estadio Municipal de Concepción',
        homeTeam: { id: 't-concepcion', name: 'Deportes Concepción', slug: 'deportes-concepcion', logoUrl: null },
        awayTeam: { id: 't-santa-cruz', name: 'Santa Cruz', slug: 'santa-cruz', logoUrl: null },
      },
    ],
    products: [
      {
        id: 'dc-prod-1',
        name: 'Camiseta Titular 2026',
        description: 'Camiseta oficial local Deportes Concepción temporada 2026 por Kelme. Lila con detalles dorados, tejido jacquard 3D. Edicion 60 aniversario.',
        price: 59990,
        imageUrl: null,
        imageUrls: [],
        stock: 150,
      },
      {
        id: 'dc-prod-2',
        name: 'Camiseta Visita 2026',
        description: 'Camiseta oficial de visita Deportes Concepción temporada 2026 por Kelme. Diseño blanco con acentos lilas.',
        price: 59990,
        imageUrl: null,
        imageUrls: [],
        stock: 120,
      },
      {
        id: 'dc-prod-3',
        name: 'Camiseta Niño Local 2026',
        description: 'Camiseta oficial infantil local temporada 2026. Mismos detalles que la version adulto en tallas de nino.',
        price: 34990,
        imageUrl: null,
        imageUrls: [],
        stock: 80,
      },
      {
        id: 'dc-prod-4',
        name: 'Camiseta Retro Concepción',
        description: 'Camiseta de la Coleccion Retro Kelme. Diseño clasico lila inspirado en las glorias del Conce.',
        price: 49990,
        imageUrl: null,
        imageUrls: [],
        stock: 40,
      },
      {
        id: 'dc-prod-5',
        name: 'Polerón Entrenamiento 2026',
        description: 'Poleron de entrenamiento oficial Kelme. Color lila con cierre completo y escudo bordado.',
        price: 48990,
        imageUrl: null,
        imageUrls: [],
        stock: 60,
      },
      {
        id: 'dc-prod-6',
        name: 'Cortaviento Retro',
        description: 'Cortaviento oficial Coleccion Retro Kelme. Impermeable, lila con forro interior. Ideal para el clima penquista.',
        price: 99990,
        imageUrl: null,
        imageUrls: [],
        stock: 35,
      },
    ],
  },
  palestino: {
    name: 'Palestino',
    nickname: 'Árabe',
    primaryColor: '#007A3D',
    secondaryColor: '#CE1126',
    storeBackgroundColor: '#0A0A0A',
    navBarTextColor: '#FFFFFF',
    venue: 'Estadio Municipal de La Cisterna',
    rivals: ['Colo-Colo', 'U. Católica'],
    matches: [
      {
        id: 'pal-match-1',
        name: 'Palestino vs Colo-Colo',
        datetime: '2026-03-06T20:00:00-03:00',
        venue: 'Estadio Municipal de La Cisterna',
        homeTeam: { id: 't-palestino', name: 'Palestino', slug: 'palestino', logoUrl: null },
        awayTeam: { id: 't-colo-colo', name: 'Colo-Colo', slug: 'colo-colo', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Escudo_de_Colo-Colo_1947.svg/200px-Escudo_de_Colo-Colo_1947.svg.png' },
      },
      {
        id: 'pal-match-2',
        name: 'U. Católica vs Palestino',
        datetime: '2026-03-13T18:30:00-03:00',
        venue: 'Estadio San Carlos de Apoquindo',
        homeTeam: { id: 't-ucatolica', name: 'U. Católica', slug: 'u-catolica', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/33/LogoCDUC.png' },
        awayTeam: { id: 't-palestino', name: 'Palestino', slug: 'palestino', logoUrl: null },
      },
      {
        id: 'pal-match-3',
        name: 'Palestino vs U. de Chile',
        datetime: '2026-03-20T19:30:00-03:00',
        venue: 'Estadio Municipal de La Cisterna',
        homeTeam: { id: 't-palestino', name: 'Palestino', slug: 'palestino', logoUrl: null },
        awayTeam: { id: 't-udechile', name: 'U. de Chile', slug: 'u-de-chile', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Emblema_del_Club_Universidad_de_Chile.png' },
      },
    ],
    products: [
      {
        id: 'pal-prod-1',
        name: 'Camiseta Titular 2026',
        description: 'Camiseta oficial titular Palestino temporada 2026. Diseño con los colores del club.',
        price: 45990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/72387399/resize/600/600?1769518015',
        imageUrls: [],
        stock: 150,
      },
      {
        id: 'pal-prod-2',
        name: 'Camiseta Visita 2026',
        description: 'Camiseta oficial de visita Palestino temporada 2026.',
        price: 45990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/72387401/resize/600/600?1769516763',
        imageUrls: [],
        stock: 120,
      },
      {
        id: 'pal-prod-3',
        name: 'Tercera Camiseta 2026',
        description: 'Tercera camiseta oficial Palestino temporada 2026. Edicion especial.',
        price: 42990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/72386604/resize/600/600?1769515754',
        imageUrls: [],
        stock: 80,
      },
      {
        id: 'pal-prod-4',
        name: 'Camiseta Titular 2025',
        description: 'Camiseta titular temporada anterior. Ultimas unidades en liquidacion.',
        price: 29990,
        imageUrl: 'https://cdn.shopify.com/s/files/1/0805/1893/8955/files/camiseta_futbol_palestino_oficial_2025_500x500.png',
        imageUrls: [],
        stock: 35,
      },
      {
        id: 'pal-prod-5',
        name: 'Camiseta Sandía 2025',
        description: 'Edicion especial Sandia. Diseño unico inspirado en la cultura palestina.',
        price: 34990,
        imageUrl: 'https://cdn.shopify.com/s/files/1/0805/1893/8955/files/camiseta_futbol_sandia_palestino_oficial_2025_500x500.png',
        imageUrls: [],
        stock: 40,
      },
      {
        id: 'pal-prod-6',
        name: 'Camiseta Visita Negra 2025',
        description: 'Camiseta de visita negra temporada 2024-2025. Diseño clasico.',
        price: 29990,
        imageUrl: 'https://cdn.shopify.com/s/files/1/0805/1893/8955/files/Camiseta_Palestino_Chile_Oficial_Visitante_Negra_2024_2025_500x500.png',
        imageUrls: [],
        stock: 20,
      },
      {
        id: 'pal-prod-7',
        name: 'Parka Cortaviento',
        description: 'Parka cortaviento oficial Palestino. Impermeable, ideal para dias de lluvia.',
        price: 54990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/61842685/resize/600/600?1743123714',
        imageUrls: [],
        stock: 45,
      },
      {
        id: 'pal-prod-8',
        name: 'Mochila Oficial 2025',
        description: 'Mochila oficial Palestino con escudo bordado. Compartimento para notebook.',
        price: 24990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/67023228/resize/600/600?1764351536',
        imageUrls: [],
        stock: 60,
      },
      {
        id: 'pal-prod-9',
        name: 'Jockey Palestino',
        description: 'Jockey ajustable con escudo de Palestino bordado.',
        price: 12990,
        imageUrl: 'https://cdnx.jumpseller.com/palestino/image/69337330/resize/510/510?1762281206',
        imageUrls: [],
        stock: 100,
      },
    ],
  },
};

function getClubConfig(slug: string): MockClubConfig {
  return MOCK_CLUBS[slug] ?? MOCK_CLUBS.rangers;
}

// ── Club with events and products ────────────────────────────────
export function getMockClubWithRelations(slug: string): ClubWithRelations {
  const cfg = getClubConfig(slug);
  return {
    id: `mock-club-${slug}`,
    slug,
    name: cfg.name,
    nickname: cfg.nickname,
    logoUrl: null,
    fullLogoUrl: null,
    useFullLogo: false,
    primaryColor: cfg.primaryColor,
    secondaryColor: cfg.secondaryColor,
    navBarBackgroundColor: null,
    navBarTextColor: cfg.navBarTextColor,
    storeBackgroundColor: cfg.storeBackgroundColor,
    bannerUrl: null,
    font: null,
    events: cfg.matches
      ? cfg.matches.map((m) => ({
          id: m.id,
          name: m.name,
          datetime: m.datetime,
          venue: m.venue,
          homeTeam: m.homeTeam ?? null,
          awayTeam: m.awayTeam ?? null,
          ticketTypes: [
            { id: `${m.id}-tt-1`, name: 'General', price: 10000 },
            { id: `${m.id}-tt-2`, name: 'Preferencia', price: 15000 },
          ],
        }))
      : [
          {
            id: 'mock-event-1',
            name: `${cfg.name} vs ${cfg.rivals[0]}`,
            datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            venue: cfg.venue,
            homeTeam: null,
            awayTeam: null,
            ticketTypes: [
              { id: 'mock-tt-1', name: 'General', price: 10000 },
              { id: 'mock-tt-2', name: 'Preferencia', price: 15000 },
            ],
          },
          {
            id: 'mock-event-2',
            name: `${cfg.name} vs ${cfg.rivals[1]}`,
            datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            venue: cfg.venue,
            homeTeam: null,
            awayTeam: null,
            ticketTypes: [{ id: 'mock-tt-3', name: 'Tribuna', price: 12000 }],
          },
        ],
    products: cfg.products ?? [
      { id: 'mock-prod-1', name: 'Polera Oficial', price: 25000, imageUrl: null, imageUrls: [], stock: 50 },
      { id: 'mock-prod-2', name: 'Gorro', price: 8000, imageUrl: null, imageUrls: [], stock: 100 },
    ],
  };
}

export const mockClubWithRelations: ClubWithRelations = getMockClubWithRelations('rangers');

// ── Auth / Fan / Profile ─────────────────────────────────────────
export const mockFan: Fan = {
  id: 'mock-fan-id',
  email: 'juan.socio@gmail.com',
  name: 'Juan Socio',
  firstName: 'Juan',
  lastName: 'Socio',
  phone: '+56 9 1234 5678',
  clubId: 'mock-club',
};

let mockProfileState: FanProfile = {
  ...mockFan,
  nationalId: '12.345.678-9',
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
export function getMockOrders(slug: string): Order[] {
  const cfg = getClubConfig(slug);
  return [
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
            name: `${cfg.name} vs ${cfg.rivals[0]}`,
            datetime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            venue: cfg.venue,
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
            name: `${cfg.name} vs ${cfg.rivals[1]}`,
            datetime: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
            venue: cfg.venue,
          },
          ticketType: { id: 'mock-tt-2', name: 'Tribuna', price: 20000 },
        },
      ],
      orderItems: [],
    },
  ];
}

export const mockOrders: Order[] = getMockOrders('rangers');

// ── Notifications ───────────────────────────────────────────────
function buildMockNotifications(slug: string): AppNotification[] {
  const cfg = getClubConfig(slug);
  return [
    {
      id: 'mock-notif-1',
      type: 'ticket',
      title: `Partido mañana: ${cfg.name} vs ${cfg.rivals[0]}`,
      body: 'Tu partido es en 24 horas. No olvides tu entrada.',
      readAt: null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-notif-2',
      type: 'promo',
      title: '20% en tienda',
      body: 'Usa el codigo GRADA20 en tu proxima compra.',
      readAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'mock-notif-3',
      type: 'club',
      title: 'Nuevo partido a la venta',
      body: `Las entradas para ${cfg.name} vs ${cfg.rivals[1]} ya estan disponibles.`,
      readAt: null,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

let mockNotifSlug = 'rangers';
let mockNotifItems: AppNotification[] = buildMockNotifications(mockNotifSlug);

export function initMockNotifications(slug: string): void {
  if (slug !== mockNotifSlug) {
    mockNotifSlug = slug;
    mockNotifItems = buildMockNotifications(slug);
  }
}

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
