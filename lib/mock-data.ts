import type { MembershipTier } from './membership';
import { TIER_CONFIG } from './membership';

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
  tier: MembershipTier;
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
  requiredTier: MembershipTier;
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

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: 'resultado' | 'fichaje' | 'institucional' | 'cantera' | 'comunidad';
  imageUrl?: string;
  publishedAt: string;
  author?: string;
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
  tier: 'fan',
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
    requiredTier: 'gold',
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
    requiredTier: 'gold',
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
    requiredTier: 'fan',
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
    requiredTier: 'silver',
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
    requiredTier: 'fan',
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
    requiredTier: 'silver',
    image: 'food',
  },
];

const MOCK_BENEFITS_PUERTO_MONTT: Benefit[] = [
  {
    id: 'ben_pm_001',
    title: '20% en Angelmó Típico',
    description: 'Descuento exclusivo para socios en curanto, cazuela de mariscos y todos los platos del menu. Valido de lunes a jueves.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'Angelmó Típico',
    location: 'Av. Angelmó 2460, Puerto Montt',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'food',
  },
  {
    id: 'ben_pm_002',
    title: 'Cafe con leche gratis en Café Hausmann',
    description: 'Un cafe con leche gratis por dia para socios activos del Delfin.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Café Hausmann',
    location: 'Av. Juan Soler Manfredini 20, Puerto Montt',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'coffee',
  },
  {
    id: 'ben_pm_003',
    title: '15% en Sparta Deportes',
    description: 'Descuento en ropa deportiva y articulos oficiales del Delfin.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'Sparta Deportes',
    location: 'Mall Paseo Costanera, Puerto Montt',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'sport',
  },
  {
    id: 'ben_pm_004',
    title: '2x1 en Cineplanet',
    description: 'Dos entradas por el precio de una, todos los miercoles.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'Cineplanet',
    location: 'Mall Paseo Costanera, Puerto Montt',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'cinema',
  },
  {
    id: 'ben_pm_005',
    title: '10% en Farmacia Cruz Verde',
    description: 'Descuento en productos seleccionados de farmacia para hinchas albiverdes.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Cruz Verde',
    location: 'Av. Diego Portales 450, Puerto Montt',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'health',
  },
  {
    id: 'ben_pm_006',
    title: 'Almuerzo marino $5.990',
    description: 'Caldillo de congrio o cazuela de mariscos a precio especial de lunes a viernes para socios.',
    category: 'COMIDA',
    discount: '$5.990',
    partner: 'Pa\' Mar Adentro',
    location: 'Av. Angelmó 2068, Puerto Montt',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'food',
  },
];

const MOCK_BENEFITS_PALESTINO: Benefit[] = [
  {
    id: 'ben_pal_001',
    title: '20% en El Majrur',
    description: 'Descuento exclusivo para socios en kubbe, falafel, shawarma y todos los platos palestinos del menu. Valido de lunes a jueves.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'El Majrur',
    location: 'Eusebio Lillo 323, Patronato',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'food',
  },
  {
    id: 'ben_pal_002',
    title: 'Cafe arabe gratis en Cafe Baisano',
    description: 'Un cafe arabe con cardamomo gratis por dia para socios activos del Tino.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Cafe Baisano',
    location: 'Gran Avenida 7530, La Cisterna',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'coffee',
  },
  {
    id: 'ben_pal_003',
    title: '15% en Tienda Oficial Palestino',
    description: 'Descuento en camisetas, buzos y toda la linea oficial del club.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'Tienda Palestino',
    location: 'Av. El Parrón 0999, La Cisterna',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'sport',
  },
  {
    id: 'ben_pal_004',
    title: '2x1 en Cinemark',
    description: 'Dos entradas por el precio de una, todos los miercoles.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'Cinemark',
    location: 'Mall Plaza Vespucio, La Florida',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'cinema',
  },
  {
    id: 'ben_pal_005',
    title: '10% en Farmacia Cruz Verde',
    description: 'Descuento en productos seleccionados de farmacia para hinchas tricolores.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Cruz Verde',
    location: 'Gran Avenida 8100, La Cisterna',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'health',
  },
  {
    id: 'ben_pal_006',
    title: 'Shawarma + bebida $4.990',
    description: 'Shawarma de carne o pollo con bebida a precio especial de lunes a viernes para socios.',
    category: 'COMIDA',
    discount: '$4.990',
    partner: 'Shawarma Moros Gourmet',
    location: 'Paulina 7658, La Cisterna',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'food',
  },
];

const MOCK_BENEFITS_CONCEPCION: Benefit[] = [
  {
    id: 'ben_dc_001',
    title: '20% en Latitud Sur',
    description: 'Descuento exclusivo para socios en cervezas artesanales y platos del menu. Valido de lunes a jueves.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'Latitud Sur',
    location: 'Víctor Lamas 401, Concepción',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'food',
  },
  {
    id: 'ben_dc_002',
    title: 'Cafe gratis en Cafe Lila',
    description: 'Un cafe americano gratis por dia para socios activos del Conce.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Cafe Lila',
    location: 'Barros Arana 890, Concepción',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'coffee',
  },
  {
    id: 'ben_dc_003',
    title: '15% en Sport Center',
    description: 'Descuento en articulos deportivos y ropa oficial del Conce.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'Sport Center',
    location: 'Mall del Centro, Concepción',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'sport',
  },
  {
    id: 'ben_dc_004',
    title: '2x1 en Cineplanet',
    description: 'Dos entradas por el precio de una, todos los miercoles.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'Cineplanet',
    location: 'Mall del Centro, Barros Arana 1080, Concepción',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'cinema',
  },
  {
    id: 'ben_dc_005',
    title: '10% en Farmacia Cruz Verde',
    description: 'Descuento en productos seleccionados de farmacia para hinchas lilas.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Cruz Verde',
    location: 'Barros Arana 600, Concepción',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'health',
  },
  {
    id: 'ben_dc_006',
    title: 'Almuerzo ejecutivo $5.490',
    description: 'Menu ejecutivo a precio especial de lunes a viernes para socios del Conce.',
    category: 'COMIDA',
    discount: '$5.490',
    partner: 'Fusion Urbana',
    location: 'Diagonal Pedro Aguirre Cerda 1269, Concepción',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'food',
  },
];

const BENEFITS_BY_CLUB: Record<string, Benefit[]> = {
  'puerto-montt': MOCK_BENEFITS_PUERTO_MONTT,
  palestino: MOCK_BENEFITS_PALESTINO,
  'deportes-concepcion': MOCK_BENEFITS_CONCEPCION,
};

export function getMockBenefits(slug: string): Benefit[] {
  return BENEFITS_BY_CLUB[slug] ?? MOCK_BENEFITS;
}

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

const MOCK_EXPERIENCES_PUERTO_MONTT: Experience[] = [
  {
    id: 'exp_pm_001',
    title: 'Meet & Greet con el Plantel',
    description: 'Conoce a los jugadores del Delfin. Incluye foto grupal, autografos y recorrido por el camarín.',
    date: '2026-03-20',
    time: '11:00',
    location: 'Estadio Regional de Chinquihue',
    spotsTotal: 30,
    spotsRemaining: 8,
    price: 15000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_pm_002',
    title: 'Tour Estadio Chinquihue',
    description: 'Recorre el Estadio Regional de Chinquihue: vestuarios, sala de prensa, zona mixta y acceso a la cancha con vista al Seno de Reloncaví.',
    date: '2026-03-25',
    time: '10:00',
    location: 'Estadio Regional de Chinquihue, Puerto Montt',
    spotsTotal: 40,
    spotsRemaining: 22,
    price: 8000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_pm_003',
    title: 'Clinica de Futbol Infantil Albiverde',
    description: 'Jornada deportiva para ninos de 6 a 12 anos con entrenadores del club. Cada participante recibe una camiseta del Delfin.',
    date: '2026-04-02',
    time: '09:00',
    location: 'Cancha Sintética Chinquihue, Puerto Montt',
    spotsTotal: 50,
    spotsRemaining: 35,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_pm_004',
    title: 'Cena con Leyendas del Delfin',
    description: 'Cena exclusiva con ex jugadores historicos del club en el corazon de Angelmó. Incluye curanto, mariscos, sorteos y anecdotas.',
    date: '2026-04-10',
    time: '20:00',
    location: 'Restaurant Angelmó Típico, Puerto Montt',
    spotsTotal: 60,
    spotsRemaining: 3,
    price: 45000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

const MOCK_EXPERIENCES_PALESTINO: Experience[] = [
  {
    id: 'exp_pal_001',
    title: 'Meet & Greet con el Plantel',
    description: 'Conoce a los jugadores del Tino. Incluye foto grupal, autografos y recorrido por el camarín.',
    date: '2026-03-20',
    time: '11:00',
    location: 'Estadio Municipal de La Cisterna',
    spotsTotal: 30,
    spotsRemaining: 8,
    price: 15000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_pal_002',
    title: 'Tour Estadio La Cisterna',
    description: 'Recorre el Estadio Municipal de La Cisterna: vestuarios, sala de prensa, zona mixta y pisada de cancha con la camiseta tricolor.',
    date: '2026-03-25',
    time: '10:00',
    location: 'Estadio Municipal de La Cisterna',
    spotsTotal: 40,
    spotsRemaining: 22,
    price: 8000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_pal_003',
    title: 'Clinica de Futbol Infantil Tricolor',
    description: 'Jornada deportiva para ninos de 6 a 12 anos con entrenadores del club. Cada participante recibe una camiseta del Tino.',
    date: '2026-04-02',
    time: '09:00',
    location: 'Complejo Deportivo La Cisterna',
    spotsTotal: 50,
    spotsRemaining: 35,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_pal_004',
    title: 'Cena con Leyendas Arabes',
    description: 'Cena exclusiva con ex jugadores historicos del club en el Club Social Palestino. Incluye cena arabe, sorteos y anecdotas de los grandes campeonatos.',
    date: '2026-04-10',
    time: '20:00',
    location: 'Club Social Palestino, Av. Kennedy 9351, Las Condes',
    spotsTotal: 60,
    spotsRemaining: 3,
    price: 45000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

const MOCK_EXPERIENCES_CONCEPCION: Experience[] = [
  {
    id: 'exp_dc_001',
    title: 'Meet & Greet con el Plantel',
    description: 'Conoce a los jugadores del Conce. Incluye foto grupal, autografos y acceso a la zona de camarines.',
    date: '2026-03-20',
    time: '11:00',
    location: 'Estadio Ester Roa Rebolledo, Concepción',
    spotsTotal: 30,
    spotsRemaining: 8,
    price: 15000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_dc_002',
    title: 'Tour Estadio Ester Roa',
    description: 'Recorre el historico Collao: vestuarios, sala de prensa, palcos, zona mixta y acceso a la cancha del tercer estadio mas grande de Chile.',
    date: '2026-03-25',
    time: '10:00',
    location: 'Estadio Ester Roa Rebolledo, Concepción',
    spotsTotal: 40,
    spotsRemaining: 22,
    price: 8000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_dc_003',
    title: 'Clinica de Futbol Infantil Lila',
    description: 'Jornada deportiva para ninos de 6 a 12 anos con entrenadores del club. Cada participante recibe una camiseta lila del Conce.',
    date: '2026-04-02',
    time: '09:00',
    location: 'Casa del Deporte, Concepción',
    spotsTotal: 50,
    spotsRemaining: 35,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_dc_004',
    title: 'Cena con Leyendas del Conce',
    description: 'Cena exclusiva con ex jugadores historicos del club. Incluye cena completa, sorteos y anecdotas de Libertadores y los grandes clasicos penquistas.',
    date: '2026-04-10',
    time: '20:00',
    location: 'Hotel Terrano, O\'Higgins 340, Concepción',
    spotsTotal: 60,
    spotsRemaining: 3,
    price: 45000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

const EXPERIENCES_BY_CLUB: Record<string, Experience[]> = {
  'puerto-montt': MOCK_EXPERIENCES_PUERTO_MONTT,
  palestino: MOCK_EXPERIENCES_PALESTINO,
  'deportes-concepcion': MOCK_EXPERIENCES_CONCEPCION,
};

export function getMockExperiences(slug: string): Experience[] {
  return EXPERIENCES_BY_CLUB[slug] ?? MOCK_EXPERIENCES;
}

export const NEWS_CATEGORIES = ['Todas', 'Resultados', 'Fichajes', 'Institucional', 'Cantera', 'Comunidad'];

const NEWS_CATEGORY_MAP: Record<string, NewsArticle['category']> = {
  Resultados: 'resultado',
  Fichajes: 'fichaje',
  Institucional: 'institucional',
  Cantera: 'cantera',
  Comunidad: 'comunidad',
};

const PUERTO_MONTT_NEWS: NewsArticle[] = [
  {
    id: 'news_001',
    title: 'Puerto Montt vence 2-1 a Recoleta y suma tres puntos claves',
    summary: 'Con goles de Sepulveda y Muñoz, el equipo albiverde se impuso en el Regional de Chinquihue.',
    body: 'Deportes Puerto Montt logró una importante victoria por 2-1 ante Recoleta en el Estadio Regional de Chinquihue, en partido válido por la fecha 5 del Campeonato Nacional.\n\nEl equipo dirigido por el técnico albiverde salió con determinación desde el primer minuto. A los 23\', Matías Sepúlveda abrió el marcador con un potente remate desde fuera del área que se coló junto al palo derecho.\n\nRecoleta logró empatar a los 38\' a través de un tiro libre que sorprendió a la defensa local. Sin embargo, el conjunto sureño no bajó los brazos y a los 67\', Diego Muñoz selló la victoria con un cabezazo tras un centro preciso desde la banda derecha.\n\nCon este resultado, Puerto Montt llega a 10 puntos y se ubica en zona de clasificación.',
    category: 'resultado',
    publishedAt: '2026-02-25T22:45:00',
    author: 'Prensa DPMT',
  },
  {
    id: 'news_002',
    title: 'Se confirma la llegada del mediocampista Andrés Villalobos',
    summary: 'El volante de 26 años proviene de Ñublense y firma por dos temporadas.',
    body: 'Deportes Puerto Montt oficializó la contratación del mediocampista Andrés Villalobos, quien llega procedente de Ñublense para reforzar la zona media del equipo.\n\nVillalobos, de 26 años, se desempeña como volante mixto y fue una pieza fundamental en su anterior club durante la temporada 2025. El jugador firmó contrato por dos temporadas y ya se encuentra entrenando con el plantel.\n\n"Estoy muy contento de llegar a un club con tanta historia como Puerto Montt. Vengo a dar todo de mí para lograr los objetivos del equipo", señaló el nuevo refuerzo en su presentación oficial.\n\nEl director deportivo destacó que Villalobos aporta experiencia, capacidad de pase y llegada al área rival.',
    category: 'fichaje',
    publishedAt: '2026-02-24T14:00:00',
    author: 'Prensa DPMT',
  },
  {
    id: 'news_003',
    title: 'Deportes Puerto Montt lanza campaña de socios 2026',
    summary: 'El club presentó los nuevos planes de membresía con beneficios exclusivos.',
    body: 'Deportes Puerto Montt presentó oficialmente su campaña de socios para la temporada 2026, con el lema "Siempre Albiverde".\n\nLa nueva estructura incluye tres niveles de membresía: Fan (gratuito), Silver y Gold, cada uno con beneficios diferenciados que van desde descuentos en boletería hasta acceso preferencial y experiencias exclusivas con el plantel.\n\nEl presidente del club señaló: "Queremos que cada hincha se sienta parte de esta gran familia. Los socios son el motor del club y estos nuevos planes buscan retribuir su fidelidad".\n\nLos interesados pueden inscribirse directamente desde la app oficial del club o en las oficinas del estadio.',
    category: 'institucional',
    publishedAt: '2026-02-22T10:00:00',
    author: 'Comunicaciones DPMT',
  },
  {
    id: 'news_004',
    title: 'Sub-17 clasifica a semifinales del torneo regional',
    summary: 'Los juveniles albiverdes vencieron 3-0 a Osorno y avanzan en el certamen.',
    body: 'La selección Sub-17 de Deportes Puerto Montt consiguió una contundente victoria por 3-0 ante Deportes Osorno, asegurando su lugar en las semifinales del Torneo Regional de la categoría.\n\nLos goles fueron obra de Benjamín Cárdenas (2) y Tomás Riquelme, quienes mostraron un nivel destacado durante todo el encuentro.\n\nEl formador a cargo del equipo expresó su satisfacción: "Estos chicos tienen un futuro brillante. Trabajan con mucha dedicación y los resultados se están viendo en la cancha".\n\nLa semifinal se disputará el próximo sábado en el Complejo Deportivo Albiverde.',
    category: 'cantera',
    publishedAt: '2026-02-21T18:30:00',
    author: 'Cantera DPMT',
  },
  {
    id: 'news_005',
    title: 'Club realiza jornada solidaria en población Alerce',
    summary: 'Jugadores del primer equipo participaron de una actividad deportiva con niños de la comunidad.',
    body: 'Un grupo de jugadores del primer equipo de Deportes Puerto Montt visitó la población Alerce como parte del programa "Albiverde en tu Barrio", una iniciativa que busca acercar el club a las comunidades de la región.\n\nLos futbolistas realizaron una clínica deportiva para más de 80 niños y niñas, entregaron implementación deportiva y compartieron con las familias del sector.\n\nEl capitán del equipo comentó: "Es importante devolver el cariño que la gente nos da en cada partido. Ver la alegría de los niños es lo que nos motiva dentro y fuera de la cancha".\n\nEl programa continuará con visitas a otras poblaciones durante las próximas semanas.',
    category: 'comunidad',
    publishedAt: '2026-02-20T12:00:00',
    author: 'Comunicaciones DPMT',
  },
  {
    id: 'news_006',
    title: 'Empate 1-1 ante Santa Cruz en partido amistoso',
    summary: 'El equipo probó variantes tácticas de cara al próximo compromiso oficial.',
    body: 'Deportes Puerto Montt igualó 1-1 ante Santa Cruz en un partido amistoso disputado en el Complejo Deportivo Albiverde.\n\nEl técnico aprovechó la oportunidad para probar distintas variantes tácticas y dar minutos a jugadores que no han tenido tanta participación en los partidos oficiales.\n\nEl gol albiverde fue convertido por el juvenil Nicolás Paredes, quien ingresó en el segundo tiempo y mostró buenas condiciones.\n\nEl cuerpo técnico se mostró conforme con lo trabajado: "Era un partido para probar cosas y lo logramos. Vimos jugadores con hambre de demostrar que merecen estar en el once titular".',
    category: 'resultado',
    publishedAt: '2026-02-19T20:00:00',
    author: 'Prensa DPMT',
  },
  {
    id: 'news_007',
    title: 'Abonos para el Clausura ya están disponibles',
    summary: 'Socios tienen precios preferenciales y acceso anticipado a la compra.',
    body: 'Deportes Puerto Montt informó que los abonos para el Torneo de Clausura 2026 ya se encuentran a la venta.\n\nLos socios Gold tienen un 20% de descuento y acceso anticipado de 48 horas. Los socios Silver cuentan con un 10% de descuento y 12 horas de preventa.\n\nLos precios de los abonos van desde $45.000 para la galería hasta $120.000 para tribuna preferencial, cubriendo todos los partidos de local del segundo semestre.\n\n"Queremos que el Regional de Chinquihue sea una fortaleza. Con el apoyo de nuestros hinchas, el equipo se hace mucho más fuerte", indicó el gerente deportivo.',
    category: 'institucional',
    publishedAt: '2026-02-18T09:00:00',
    author: 'Comunicaciones DPMT',
  },
];

export function getMockNews(): NewsArticle[] {
  return PUERTO_MONTT_NEWS;
}

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

export function getBenefitTierLabel(tier: MembershipTier): string {
  return TIER_CONFIG[tier].displayName;
}

export function getBenefitTierColor(tier: MembershipTier): string {
  return TIER_CONFIG[tier].color;
}

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
