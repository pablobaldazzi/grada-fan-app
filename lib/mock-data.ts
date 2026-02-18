export interface ClubConfig {
  tenantKey: string;
  clubId: string;
  displayName: string;
  appName: string;
  theme: {
    primary: string;
    primaryDark: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    accent: string;
  };
  features: Record<string, boolean>;
}

export interface Member {
  id: string;
  name: string;
  rut: string;
  birthDate: string;
  role: string;
  tier: string;
  memberNumber: string;
  expirationDate: string;
  photoUrl?: string;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
  homeLogo?: string;
  awayLogo?: string;
  isHome: boolean;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  currency: string;
  available: number;
  zone: string;
}

export interface PurchasedTicket {
  id: string;
  matchId: string;
  match: Match;
  ticketType: TicketType;
  seat: string;
  qrCode: string;
  purchaseDate: string;
  status: 'active' | 'used' | 'expired';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  description: string;
  sizes?: string[];
  inStock: boolean;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  category: string;
  discount: string;
  partner: string;
  location?: string;
  membersOnly: boolean;
  expirationDate?: string;
  image: string;
}

export interface Experience {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  spotsTotal: number;
  spotsRemaining: number;
  price: number;
  currency: string;
  membersOnly: boolean;
  image: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'offer' | 'ticket' | 'promo' | 'club';
  timestamp: string;
  read: boolean;
  deepLink?: string;
}

export interface CartItem {
  id: string;
  type: 'ticket' | 'merch';
  name: string;
  price: number;
  quantity: number;
  details: string;
  size?: string;
  /** Ticket type or product id for checkout */
  refId?: string;
  /** Seat ids when using seat selection (from seat-holds) */
  seatIds?: string[];
}

export const MOCK_CLUB: ClubConfig = {
  tenantKey: 'rangers',
  clubId: 'club_rangers_001',
  displayName: 'Rangers FC',
  appName: 'Rojinegro App',
  theme: {
    primary: '#E31E24',
    primaryDark: '#B71518',
    secondary: '#000000',
    background: '#0A0A0A',
    surface: '#151515',
    text: '#FFFFFF',
    accent: '#FFD700',
  },
  features: {
    home: true,
    membershipId: true,
    tickets: true,
    merch: true,
    benefits: true,
    experiences: true,
    notifications: true,
    academy: false,
  },
};

export const MOCK_MEMBER: Member = {
  id: 'mem_001',
  name: 'Carlos Mendoza R.',
  rut: '12.345.678-9',
  birthDate: '15/03/1990',
  role: 'Socio',
  tier: 'Premium',
  memberNumber: 'RNG-2024-0847',
  expirationDate: '31/12/2026',
};

export const MOCK_MATCHES: Match[] = [
  {
    id: 'match_001',
    homeTeam: 'Rangers FC',
    awayTeam: 'Palestino',
    date: '2026-03-15',
    time: '19:30',
    venue: 'Estadio Fiscal',
    competition: 'Primera B',
    isHome: true,
  },
  {
    id: 'match_002',
    homeTeam: 'Cobreloa',
    awayTeam: 'Rangers FC',
    date: '2026-03-22',
    time: '16:00',
    venue: 'Estadio Zorros del Desierto',
    competition: 'Primera B',
    isHome: false,
  },
  {
    id: 'match_003',
    homeTeam: 'Rangers FC',
    awayTeam: 'San Luis',
    date: '2026-03-29',
    time: '20:00',
    venue: 'Estadio Fiscal',
    competition: 'Primera B',
    isHome: true,
  },
  {
    id: 'match_004',
    homeTeam: 'Rangers FC',
    awayTeam: 'Santa Cruz',
    date: '2026-04-05',
    time: '18:00',
    venue: 'Estadio Fiscal',
    competition: 'Copa Chile',
    isHome: true,
  },
];

export const MOCK_TICKET_TYPES: TicketType[] = [
  { id: 'tt_001', name: 'Tribuna General', price: 8000, currency: 'CLP', available: 245, zone: 'general' },
  { id: 'tt_002', name: 'Tribuna Preferencial', price: 15000, currency: 'CLP', available: 120, zone: 'preferential' },
  { id: 'tt_003', name: 'Palco VIP', price: 35000, currency: 'CLP', available: 18, zone: 'vip' },
  { id: 'tt_004', name: 'Galeria Norte', price: 5000, currency: 'CLP', available: 380, zone: 'north' },
  { id: 'tt_005', name: 'Galeria Sur', price: 5000, currency: 'CLP', available: 290, zone: 'south' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod_001',
    name: 'Camiseta Titular 2026',
    price: 45990,
    currency: 'CLP',
    category: 'Camisetas',
    image: 'jersey_home',
    description: 'Camiseta oficial titular Rangers FC temporada 2026. Tela dry-fit con escudo bordado.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'prod_002',
    name: 'Camiseta Visita 2026',
    price: 45990,
    currency: 'CLP',
    category: 'Camisetas',
    image: 'jersey_away',
    description: 'Camiseta oficial de visita Rangers FC temporada 2026.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'prod_003',
    name: 'Bufanda Rojinegra',
    price: 12990,
    currency: 'CLP',
    category: 'Accesorios',
    image: 'scarf',
    description: 'Bufanda tejida con colores del club. 100% acrilico.',
    inStock: true,
  },
  {
    id: 'prod_004',
    name: 'Gorra Rangers',
    price: 9990,
    currency: 'CLP',
    category: 'Accesorios',
    image: 'cap',
    description: 'Gorra ajustable con escudo bordado.',
    inStock: true,
  },
  {
    id: 'prod_005',
    name: 'Poleron Entrenamiento',
    price: 34990,
    currency: 'CLP',
    category: 'Ropa',
    image: 'hoodie',
    description: 'Poleron de entrenamiento con cierre completo.',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'prod_006',
    name: 'Balon Oficial',
    price: 24990,
    currency: 'CLP',
    category: 'Accesorios',
    image: 'ball',
    description: 'Balon de futbol oficial Rangers FC talla 5.',
    inStock: false,
  },
];

export const MOCK_BENEFITS: Benefit[] = [
  {
    id: 'ben_001',
    title: '20% en Restaurant Don Pepe',
    description: 'Descuento exclusivo para socios en todos los platos del menu. Valido de lunes a jueves.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'Don Pepe',
    location: 'Av. Alemania 850, Talca',
    membersOnly: true,
    image: 'food',
  },
  {
    id: 'ben_002',
    title: 'Cafe gratis en Cafe del Centro',
    description: 'Un cafe americano gratis por dia para socios activos.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Cafe del Centro',
    location: '1 Sur 945, Talca',
    membersOnly: true,
    image: 'coffee',
  },
  {
    id: 'ben_003',
    title: '15% en Sport Depot',
    description: 'Descuento en toda la tienda de articulos deportivos.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'Sport Depot',
    location: 'Mall Plaza Maule',
    membersOnly: false,
    image: 'sport',
  },
  {
    id: 'ben_004',
    title: '2x1 en Cine Planet',
    description: 'Dos entradas por el precio de una, todos los miercoles.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'Cine Planet',
    location: 'Mall Plaza Maule',
    membersOnly: true,
    image: 'cinema',
  },
  {
    id: 'ben_005',
    title: '10% en Farmacia Cruz Verde',
    description: 'Descuento en productos seleccionados de farmacia.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Cruz Verde',
    membersOnly: false,
    image: 'health',
  },
  {
    id: 'ben_006',
    title: 'Almuerzo ejecutivo $4.990',
    description: 'Menu ejecutivo a precio especial de lunes a viernes.',
    category: 'COMIDA',
    discount: '$4.990',
    partner: 'La Buena Mesa',
    location: '2 Norte 1250, Talca',
    membersOnly: true,
    image: 'food',
  },
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp_001',
    title: 'Meet & Greet con Plantel',
    description: 'Conoce a los jugadores del plantel profesional. Incluye foto grupal y autografos.',
    date: '2026-03-20',
    time: '11:00',
    location: 'Centro de Entrenamiento',
    spotsTotal: 30,
    spotsRemaining: 8,
    price: 15000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_002',
    title: 'Tour Estadio Fiscal',
    description: 'Recorre las instalaciones del estadio, vestuarios, sala de prensa y acceso al campo.',
    date: '2026-03-25',
    time: '10:00',
    location: 'Estadio Fiscal de Talca',
    spotsTotal: 40,
    spotsRemaining: 22,
    price: 8000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_003',
    title: 'Clinica de Futbol Infantil',
    description: 'Jornada deportiva para ninos de 6 a 12 anos con entrenadores del club.',
    date: '2026-04-02',
    time: '09:00',
    location: 'Complejo Deportivo Rangers',
    spotsTotal: 50,
    spotsRemaining: 35,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_004',
    title: 'Cena con Leyendas',
    description: 'Cena exclusiva con ex jugadores historicos del club. Incluye cena completa y sorteos.',
    date: '2026-04-10',
    time: '20:00',
    location: 'Hotel Casino Talca',
    spotsTotal: 60,
    spotsRemaining: 3,
    price: 45000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'not_001',
    title: 'Entradas disponibles',
    body: 'Ya estan a la venta las entradas para Rangers vs Palestino. Compra ahora y asegura tu lugar.',
    type: 'ticket',
    timestamp: '2026-02-17T10:30:00',
    read: false,
    deepLink: '/tickets/match_001',
  },
  {
    id: 'not_002',
    title: 'Nueva camiseta 2026',
    body: 'La nueva camiseta titular ya esta disponible en la tienda. Edicion limitada.',
    type: 'promo',
    timestamp: '2026-02-16T14:00:00',
    read: false,
    deepLink: '/store/prod_001',
  },
  {
    id: 'not_003',
    title: 'Beneficio exclusivo',
    body: 'Nuevo convenio con Restaurant Don Pepe. 20% de descuento para socios.',
    type: 'offer',
    timestamp: '2026-02-15T09:00:00',
    read: true,
  },
  {
    id: 'not_004',
    title: 'Victoria rojinegra',
    body: 'Rangers FC 3 - 1 Cobreloa. Gran victoria en casa. Revive los goles.',
    type: 'club',
    timestamp: '2026-02-14T22:30:00',
    read: true,
  },
  {
    id: 'not_005',
    title: 'Meet & Greet',
    body: 'Ultimos cupos para el Meet & Greet con el plantel. Reserva tu lugar.',
    type: 'offer',
    timestamp: '2026-02-13T11:00:00',
    read: true,
  },
  {
    id: 'not_006',
    title: 'Renovacion de socio',
    body: 'Tu membresia vence pronto. Renueva antes del 31 de marzo y obtiene un 10% de descuento.',
    type: 'club',
    timestamp: '2026-02-12T08:00:00',
    read: true,
  },
];

export const BENEFIT_CATEGORIES = ['TODO', 'COMIDA', 'CAFE', 'DEPORTE', 'ENTRETENIMIENTO', 'SALUD'];

export const PRODUCT_CATEGORIES = ['Todos', 'Camisetas', 'Ropa', 'Accesorios'];

export function formatCLP(amount: number): string {
  return '$' + amount.toLocaleString('es-CL');
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const days = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
}

export function timeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `hace ${diffMins}m`;
  if (diffHours < 24) return `hace ${diffHours}h`;
  if (diffDays < 7) return `hace ${diffDays}d`;
  return formatDate(timestamp);
}
