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

export type PlayerPosition = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface SquadPlayer {
  id: string;
  name: string;
  number: number;
  position: PlayerPosition;
  role: string;
}

export interface SquadFormation {
  name: string;
  coach: string;
  startingEleven: SquadPlayer[];
  substitutes: SquadPlayer[];
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

const MOCK_BENEFITS_UNION_ESPANOLA: Benefit[] = [
  {
    id: 'ben_ue_001',
    title: '20% en Restaurant El Hispano',
    description: 'Descuento exclusivo para socios en paella, tapas y todos los platos del menu. Valido de lunes a jueves.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'El Hispano',
    location: 'Av. Independencia 2820, Independencia',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'food',
  },
  {
    id: 'ben_ue_002',
    title: 'Cafe cortado gratis en Cafe Santa Laura',
    description: 'Un cafe cortado gratis por dia para socios activos de los Hispanos.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Cafe Santa Laura',
    location: 'Santa Laura 1350, Independencia',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'coffee',
  },
  {
    id: 'ben_ue_003',
    title: '15% en CYHStore',
    description: 'Descuento en toda la tienda oficial de Unión Española. Camisetas, accesorios y más.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'CYHStore',
    location: 'Tienda online cyhstore.cl',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'sport',
  },
  {
    id: 'ben_ue_004',
    title: '2x1 en Cineplanet',
    description: 'Dos entradas por el precio de una, todos los miercoles.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'Cineplanet',
    location: 'Mall Plaza Norte, Huechuraba',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'cinema',
  },
  {
    id: 'ben_ue_005',
    title: '10% en Farmacia Ahumada',
    description: 'Descuento en productos seleccionados de farmacia para socios hispanos.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Farmacia Ahumada',
    location: 'Av. Independencia 2066, Independencia',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'health',
  },
  {
    id: 'ben_ue_006',
    title: 'Almuerzo ejecutivo $5.490',
    description: 'Menu ejecutivo a precio especial de lunes a viernes para socios hispanos.',
    category: 'COMIDA',
    discount: '$5.490',
    partner: 'La Esquina de Santa Laura',
    location: 'Julio Martínez Prádanos 1380, Independencia',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'food',
  },
];

const MOCK_BENEFITS_SANTIAGO_MORNING: Benefit[] = [
  {
    id: 'ben_sm_001',
    title: '20% en picadas del barrio',
    description:
      'Descuento en completo, churrasco y tablita para socios bohemios. Valido de lunes a jueves cerca del estadio.',
    category: 'COMIDA',
    discount: '20%',
    partner: 'Fuente Buenos Aires La Pintana',
    location: 'Av. La Serena esquina Gomez Carreño, La Pintana',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'food',
  },
  {
    id: 'ben_sm_002',
    title: 'Cafe americano en Recoleta',
    description:
      'Un cafe americano por dia gratis para socios activos — homenaje a la casa comunal del club.',
    category: 'CAFE',
    discount: 'Gratis',
    partner: 'Cafe Bohemio',
    location: 'Av. Dorsal 1300, Recoleta',
    membersOnly: true,
    requiredTier: 'gold',
    image: 'coffee',
  },
  {
    id: 'ben_sm_003',
    title: '15% en indumentaria blanco y negro',
    description:
      'Descuento en polerones, gorros y accesorios con la marca del Chaguito en la tienda del club.',
    category: 'DEPORTE',
    discount: '15%',
    partner: 'Tienda Oficial Santiago Morning',
    location: 'Sede Recoleta y venta online santiagomorning.cl',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'sport',
  },
  {
    id: 'ben_sm_004',
    title: '2x1 cine zona sur',
    description: 'Dos entradas por el precio de una los martes en salas seleccionadas del sector sur.',
    category: 'ENTRETENIMIENTO',
    discount: '2x1',
    partner: 'CineStar La Florida',
    location: 'Vicuña Mackenna 7110, La Florida',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'cinema',
  },
  {
    id: 'ben_sm_005',
    title: '10% en farmacia',
    description: 'Descuento en productos de botiquin para microbuseros y socios.',
    category: 'SALUD',
    discount: '10%',
    partner: 'Farmacia Popular',
    location: 'Recoleta y La Pintana',
    membersOnly: false,
    requiredTier: 'fan',
    image: 'health',
  },
  {
    id: 'ben_sm_006',
    title: 'Almuerzo ejecutivo $5.490',
    description:
      'Menu del dia a precio especial de lunes a viernes para socios cerca del Estadio de La Pintana.',
    category: 'COMIDA',
    discount: '$5.490',
    partner: 'Restaurant Don Chago',
    location: 'Ciudad de Mexico 1450, La Pintana',
    membersOnly: true,
    requiredTier: 'silver',
    image: 'food',
  },
];

const BENEFITS_BY_CLUB: Record<string, Benefit[]> = {
  'puerto-montt': MOCK_BENEFITS_PUERTO_MONTT,
  palestino: MOCK_BENEFITS_PALESTINO,
  'deportes-concepcion': MOCK_BENEFITS_CONCEPCION,
  'union-espanola': MOCK_BENEFITS_UNION_ESPANOLA,
  'santiago-morning': MOCK_BENEFITS_SANTIAGO_MORNING,
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

const MOCK_EXPERIENCES_UNION_ESPANOLA: Experience[] = [
  {
    id: 'exp_ue_001',
    title: 'Meet & Greet con el Plantel',
    description: 'Conoce a los jugadores hispanos. Incluye foto grupal, autografos y recorrido por el camarín de Santa Laura.',
    date: '2026-04-05',
    time: '11:00',
    location: 'Estadio Santa Laura, Independencia',
    spotsTotal: 30,
    spotsRemaining: 8,
    price: 15000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_ue_002',
    title: 'Tour Estadio Santa Laura',
    description: 'Recorre La Catedral: vestuarios, sala de prensa, palcos, zona mixta y pisada de cancha. Con guia historico del club fundado en 1897.',
    date: '2026-04-12',
    time: '10:00',
    location: 'Estadio Santa Laura – Universidad SEK, Independencia',
    spotsTotal: 40,
    spotsRemaining: 18,
    price: 10000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_ue_003',
    title: 'Clinica de Futbol Infantil Hispana',
    description: 'Jornada deportiva para niños de 6 a 12 años con entrenadores del club. Cada participante recibe una camiseta roja hispana.',
    date: '2026-04-19',
    time: '09:00',
    location: 'Complejo Deportivo Santa Laura, Independencia',
    spotsTotal: 50,
    spotsRemaining: 30,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_ue_004',
    title: 'Cena con Leyendas Hispanas',
    description: 'Cena exclusiva con ex jugadores historicos del club. Revive la épica de la Libertadores 1975 y los 7 títulos nacionales. Incluye cena completa y sorteos.',
    date: '2026-04-26',
    time: '20:00',
    location: 'Centro Español de Santiago, Av. Libertador Bernardo O\'Higgins',
    spotsTotal: 60,
    spotsRemaining: 5,
    price: 50000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

const MOCK_EXPERIENCES_SANTIAGO_MORNING: Experience[] = [
  {
    id: 'exp_sm_001',
    title: 'Meet & Greet con el Plantel',
    description:
      'Conoce al plantel de Primera del Chaguito en La Pintana. Foto grupal, autografos y recorrido por zona de calentamiento.',
    date: '2026-03-18',
    time: '11:00',
    location: 'Estadio Municipal de La Pintana',
    spotsTotal: 35,
    spotsRemaining: 12,
    price: 12000,
    currency: 'CLP',
    membersOnly: true,
    image: 'meetgreet',
  },
  {
    id: 'exp_sm_002',
    title: 'Tour Estadio de La Pintana',
    description:
      'Recorre el estadio de 5.000 butacas (Ciudad de Mexico 1589): vestuarios, sala de prensa y acceso a la cancha.',
    date: '2026-03-28',
    time: '10:00',
    location: 'Estadio Municipal de La Pintana, La Pintana',
    spotsTotal: 40,
    spotsRemaining: 24,
    price: 7000,
    currency: 'CLP',
    membersOnly: false,
    image: 'tour',
  },
  {
    id: 'exp_sm_003',
    title: 'Clinica La V Negra',
    description:
      'Jornada deportiva para ninos de 7 a 13 anos con el cuerpo tecnico. Incluye camiseta blanca con detalle negro.',
    date: '2026-04-05',
    time: '09:00',
    location: 'Cancha sintetica adjunta, La Pintana',
    spotsTotal: 45,
    spotsRemaining: 30,
    price: 5000,
    currency: 'CLP',
    membersOnly: false,
    image: 'clinic',
  },
  {
    id: 'exp_sm_004',
    title: 'Cena con campeones de 1942',
    description:
      'Noche bohemia con ex jugadores: recuerdos del Campeonato Nacional de 1942 y la epoca del Club de Deportes Santiago.',
    date: '2026-04-18',
    time: '20:00',
    location: 'Salon Auditorio Santiago Morning, Recoleta',
    spotsTotal: 50,
    spotsRemaining: 8,
    price: 35000,
    currency: 'CLP',
    membersOnly: true,
    image: 'dinner',
  },
];

const EXPERIENCES_BY_CLUB: Record<string, Experience[]> = {
  'puerto-montt': MOCK_EXPERIENCES_PUERTO_MONTT,
  palestino: MOCK_EXPERIENCES_PALESTINO,
  'deportes-concepcion': MOCK_EXPERIENCES_CONCEPCION,
  'union-espanola': MOCK_EXPERIENCES_UNION_ESPANOLA,
  'santiago-morning': MOCK_EXPERIENCES_SANTIAGO_MORNING,
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

const UNION_ESPANOLA_NEWS: NewsArticle[] = [
  {
    id: 'news_ue_001',
    title: 'Unión Española vence 2-1 a Puerto Montt y suma su segunda victoria',
    summary: 'Los Hispanos se impusieron en Santa Laura y escalan posiciones en la tabla de la Primera B.',
    body: 'Unión Española logró una importante victoria por 2-1 ante Deportes Puerto Montt en el Estadio Santa Laura, en partido válido por la fecha 5 de la Primera B 2026.\n\nEl equipo dirigido por Gonzalo Villagra mostró un juego ofensivo desde el inicio. A los 28\', Patricio Rubio abrió el marcador con un cabezazo certero tras un centro preciso desde la derecha.\n\nPuerto Montt logró empatar a los 55\' con un gol de contra, pero la respuesta hispana fue inmediata. A los 63\', Ulises Ojeda selló la victoria con un remate de media distancia que se coló por el ángulo.\n\nCon este resultado, Unión Española llega a 6 puntos y busca encadenar victorias para pelear por el ascenso de vuelta a Primera División.',
    category: 'resultado',
    publishedAt: '2026-03-21T22:45:00',
    author: 'Prensa UE',
  },
  {
    id: 'news_ue_002',
    title: 'Patricio Rubio: "Vine a devolver a Unión Española donde merece"',
    summary: 'El experimentado delantero habló sobre su llegada al club y los objetivos para la temporada.',
    body: 'Patricio Rubio, el refuerzo estrella de Unión Española para la campaña de ascenso 2026, conversó en exclusiva sobre su llegada al club hispano.\n\n"Cuando me llamaron no lo dudé. Unión Española es un club grande, con una historia enorme, 7 títulos, una final de Libertadores. No puede estar en Primera B", señaló el delantero proveniente de Ñublense.\n\nRubio ya suma 2 goles en 5 partidos y se perfila como el goleador del equipo: "El grupo está muy comprometido. Sabemos que el objetivo es uno solo: ascender. Y vamos a dejarlo todo por esta camiseta roja".\n\nEl atacante también destacó el calor de la hinchada en Santa Laura: "La Catedral se llena y eso se siente en la cancha. Los hinchas son el jugador número 12".',
    category: 'fichaje',
    publishedAt: '2026-03-19T14:00:00',
    author: 'Prensa UE',
  },
  {
    id: 'news_ue_003',
    title: 'Unión Española lanza campaña de socios "Volvemos Juntos"',
    summary: 'El club presentó su plan de membresías con beneficios exclusivos para acompañar el camino de vuelta a Primera División.',
    body: 'Unión Española presentó oficialmente su campaña de socios para la temporada 2026, bajo el lema "Volvemos Juntos", en una emotiva ceremonia en el Estadio Santa Laura.\n\nLa nueva estructura incluye tres niveles de membresía: Fan (gratuito), Silver y Gold, cada uno con beneficios que van desde descuentos en boletería hasta acceso preferencial y experiencias exclusivas con el plantel.\n\nEl presidente Francisco Ceresuela señaló: "Este club fue fundado en 1897 por inmigrantes españoles con un sueño. Hoy le pedimos a cada hincha que sea parte de este nuevo sueño: volver a Primera División. Juntos somos más fuertes".\n\nLos interesados pueden inscribirse desde la app oficial o en las oficinas del estadio Santa Laura.',
    category: 'institucional',
    publishedAt: '2026-03-17T10:00:00',
    author: 'Comunicaciones UE',
  },
  {
    id: 'news_ue_004',
    title: 'Sub-17 hispana avanza a cuartos del torneo metropolitano',
    summary: 'Los juveniles rojiblancos vencieron 2-0 a Barnechea y siguen invictos en el certamen.',
    body: 'La selección Sub-17 de Unión Española consiguió una sólida victoria por 2-0 ante Barnechea, asegurando su lugar en los cuartos de final del Torneo Metropolitano de la categoría.\n\nLos goles fueron obra de Sebastián Flores y Diego Contreras, quienes mostraron un nivel destacado durante todo el encuentro en las canchas del complejo deportivo del club.\n\nEl coordinador de cantera expresó su satisfacción: "Estos chicos representan el futuro de Unión Española. La formación es fundamental para el club y estamos viendo frutos del trabajo de años".\n\nEl próximo rival se definirá esta semana.',
    category: 'cantera',
    publishedAt: '2026-03-15T18:30:00',
    author: 'Cantera UE',
  },
  {
    id: 'news_ue_005',
    title: 'Jugadores hispanos visitaron hogar de ancianos en Independencia',
    summary: 'Como parte del programa "La Furia Solidaria", el plantel compartió una jornada con adultos mayores de la comuna.',
    body: 'Un grupo de jugadores del primer equipo de Unión Española visitó el Hogar de Ancianos San José en Independencia, como parte del programa social "La Furia Solidaria".\n\nLos futbolistas compartieron una tarde con los residentes, entregaron camisetas autografiadas y participaron de una merienda comunitaria. José Aja y Bruno Jáuregui lideraron la actividad.\n\n"Es importante estar cerca de nuestra comunidad. El barrio de Independencia es nuestra casa y queremos que la gente sienta que el club está presente no solo los días de partido", comentó el capitán del equipo.\n\nEl programa continuará con actividades en colegios y juntas de vecinos de la comuna.',
    category: 'comunidad',
    publishedAt: '2026-03-13T12:00:00',
    author: 'Comunicaciones UE',
  },
  {
    id: 'news_ue_006',
    title: 'Caída ante Antofagasta complica el inicio de La Furia',
    summary: 'Derrota 2-1 en el norte deja a Unión Española con un inicio irregular en la Primera B.',
    body: 'Unión Española cayó 2-1 ante Deportes Antofagasta en el Estadio Regional de Antofagasta, sumando su tercera derrota en la Primera B 2026.\n\nEl equipo de Gonzalo Villagra abrió el marcador temprano a través de Ariel Uribe a los 15\', pero los locales dieron vuelta el resultado con goles a los 52\' y 78\'.\n\nEl técnico hispano analizó: "Nos faltó mantener la concentración en el segundo tiempo. Competimos bien los primeros 45 minutos pero nos costó sostener el ritmo en la altura".\n\nCon 3 puntos en 4 fechas, el panorama es complicado pero el plantel confía en revertir la situación: "Sabíamos que el inicio iba a ser difícil. Ahora viene una seguidilla de partidos en casa que tenemos que aprovechar", agregó Villagra.',
    category: 'resultado',
    publishedAt: '2026-03-15T21:00:00',
    author: 'Prensa UE',
  },
  {
    id: 'news_ue_007',
    title: 'Nueva camiseta Marathon 2026 ya disponible en la tienda',
    summary: 'Los Hispanos estrenaron indumentaria con su nuevo auspiciador técnico.',
    body: 'Unión Española presentó oficialmente su nueva camiseta para la temporada 2026, fabricada por Marathon Sports, el nuevo auspiciador técnico del club.\n\nEl diseño principal es rojo con detalles en azul, manteniendo los colores históricos del club. La camiseta incorpora un homenaje sutil a los orígenes españoles del club con un detalle en el cuello.\n\nLos precios van desde $39.990 para la versión de hincha hasta $54.990 para la versión jugador. También se presentó la camiseta de visita en blanco con detalles rojos y azules.\n\n"Estamos orgullosos de vestir estos colores. La camiseta de Unión Española tiene una historia que nos trasciende", señaló el capitán en la presentación.\n\nLas camisetas están disponibles en la tienda oficial CYHStore y en el estadio Santa Laura.',
    category: 'institucional',
    publishedAt: '2026-03-10T09:00:00',
    author: 'Comunicaciones UE',
  },
];

const SANTIAGO_MORNING_NEWS: NewsArticle[] = [
  {
    id: 'news_sm_001',
    title: 'Santiago Morning afronta por primera vez la Segunda Division Profesional',
    summary:
      'El Chaguito iniciara la Liga de Ascenso 2026 luego del decrecimiento deportivo en Primera B 2025.',
    body: 'Club de Deportes Santiago Morning confirmo su participacion en la Segunda Division Profesional de Chile en 2026, una categoria que el plantel masculino no disputaba en la era actual del ascenso.\n\nLa institucion —con origen en la fusion de 1936 entre Club de Deportes Santiago y Morning Star Sport Club y fecha de fundacion del legado mas antiguo el 16 de octubre de 1903— enfrenta una etapa exigente con el objetivo de volver cuanto antes al profesionalismo de segunda categoria nacional.\n\nDirigentes y jugadores destacaron el apoyo de la hincha bohemia y llamaron a mantener el aliento desde el Estadio Municipal de La Pintana.',
    category: 'institucional',
    publishedAt: '2026-03-03T09:30:00',
    author: 'Prensa SM',
  },
  {
    id: 'news_sm_002',
    title: 'Esteban Paredes dirige desde el banquillo a sus ex companeros microbuseros',
    summary:
      'La leyenda rojinegra regresa en una nueva funcion al club donde fue figura histórica entre 2005 y 2009.',
    body: 'Esteban Paredes asumio la conduccion tecnica de Santiago Morning, sellando un ciclo cargado de simbolismo: el futbolista emblematico que encabezo la campana de Primera B 2005 ahora proyecta desde el duelo el proceso competitivo.\n\n"El Morning me dio mucho cuando jugaba aca y quiero ayudar a que el club encuentre firmeza. Sabemos donde estamos parados y trabajamos con humildad", comento en la presentacion ante medios locales.\n\nEl cuerpo tecnico prioriza el trabajo físico del plantel profesional reunido para la nueva temporada.',
    category: 'fichaje',
    publishedAt: '2026-03-08T12:15:00',
    author: 'Prensa SM',
  },
  {
    id: 'news_sm_003',
    title: 'Rengo queda con un empate disputado en La Pintana',
    summary: 'Por la segunda fecha amistosa de preparacion, el Chago repartió puntos con Deportes Rengo.',
    body: 'En el Estadio Municipal de La Pintana (Ciudad de Mexico 1589), Santiago Morning igualó ante Deportes Rengo en una jornada de fogueo marcada por el calor capitalino.\n\nEntrenamiento intensivo y rotaciones continuas permitieron a Paredes observar opciones antes del calendario de ascenso. La defensa trabajó lineas compactas ante el avance rival.\n\n"Queremos un equipo que maneje bien la salida cuando sea local; La Pintana tiene que intimidar igual que antes", reflexionó uno de los volantes titulares.',
    category: 'resultado',
    publishedAt: '2026-03-16T21:05:00',
    author: 'Prensa SM',
  },
  {
    id: 'news_sm_004',
    title: 'Las Bohemias siguen ejemplo en primera: filial femenina en la elite',
    summary:
      'Mientras la rama masculina reordena proyecto, Santiago Morning mujeres mantiene hegemonía en primera division nacional.',
    body: 'En paralelo al proceso del plantel profesional masculino, la rama femenina de Santiago Morning continua establecida en la Primera Division de Futbol Femenino de Chile, donde la institucion se ha destacado como referente nacional con multiples titulos entre 2018 y Transicion 2020.\n\nDesde comunicaciones deportivas destacan como politica institucional sostener el desarrollo paralelo entre formativas y equipo adulto profesional masculino.',
    category: 'cantera',
    publishedAt: '2026-03-05T08:45:00',
    author: 'Comunicaciones SM',
  },
];

const NEWS_BY_CLUB: Record<string, NewsArticle[]> = {
  'puerto-montt': PUERTO_MONTT_NEWS,
  'union-espanola': UNION_ESPANOLA_NEWS,
  'santiago-morning': SANTIAGO_MORNING_NEWS,
};

export function getMockNews(slug?: string): NewsArticle[] {
  if (!slug) return [];
  return NEWS_BY_CLUB[slug] ?? [];
}

const SQUAD_PUERTO_MONTT: SquadFormation = {
  name: '4-4-2',
  coach: 'Emiliano Astorga',
  startingEleven: [
    { id: 'sp_pm_01', name: 'G. Collao', number: 29, position: 'GK', role: 'Portero' },
    { id: 'sp_pm_02', name: 'B. Nieto', number: 17, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_pm_03', name: 'A. Morales', number: 2, position: 'DEF', role: 'Central' },
    { id: 'sp_pm_04', name: 'M. Riveros', number: 4, position: 'DEF', role: 'Central' },
    { id: 'sp_pm_05', name: 'K. Egaña', number: 15, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_pm_06', name: 'M. Clerveaux', number: 7, position: 'MID', role: 'Extremo derecho' },
    { id: 'sp_pm_07', name: 'D. Díaz', number: 6, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_pm_08', name: 'G. Castillo', number: 23, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_pm_09', name: 'A. Sabella', number: 18, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pm_10', name: 'L. Vásquez', number: 9, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_pm_11', name: 'R. Castro', number: 11, position: 'FWD', role: 'Delantero centro' },
  ],
  substitutes: [
    { id: 'sp_pm_12', name: 'L. Ureta', number: 13, position: 'GK', role: 'Portero' },
    { id: 'sp_pm_13', name: 'J. Pino', number: 3, position: 'DEF', role: 'Central' },
    { id: 'sp_pm_14', name: 'F. Calisto', number: 5, position: 'DEF', role: 'Central' },
    { id: 'sp_pm_15', name: 'D. Bahamonde', number: 20, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_pm_16', name: 'J. Cárdenas', number: 14, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_pm_17', name: 'C. Vargas', number: 10, position: 'MID', role: 'Mediocampista ofensivo' },
    { id: 'sp_pm_18', name: 'J. Jaime', number: 22, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_pm_19', name: 'J. Flores', number: 16, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pm_20', name: 'S. Pérez', number: 28, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pm_21', name: 'S. Negrete', number: 30, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pm_22', name: 'L. Mansilla', number: 24, position: 'FWD', role: 'Delantero centro' },
  ],
};

const SQUAD_RANGERS: SquadFormation = {
  name: '4-3-3',
  coach: 'Erwin Durán',
  startingEleven: [
    { id: 'sp_rng_01', name: 'J.L. Gamonal', number: 1, position: 'GK', role: 'Portero' },
    { id: 'sp_rng_02', name: 'K. Vásquez', number: 3, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_rng_03', name: 'C. Labrín', number: 2, position: 'DEF', role: 'Central' },
    { id: 'sp_rng_04', name: 'J. Navarrete', number: 4, position: 'DEF', role: 'Central' },
    { id: 'sp_rng_05', name: 'M. Cortés', number: 6, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_rng_06', name: 'A. Márquez', number: 8, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_rng_07', name: 'G. Moya', number: 20, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_rng_08', name: 'M. González', number: 10, position: 'MID', role: 'Mediocampista ofensivo' },
    { id: 'sp_rng_09', name: 'I. Ibáñez', number: 7, position: 'FWD', role: 'Extremo derecho' },
    { id: 'sp_rng_10', name: 'S. Ribas', number: 9, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_rng_11', name: 'M. Vicuña', number: 11, position: 'FWD', role: 'Extremo izquierdo' },
  ],
  substitutes: [
    { id: 'sp_rng_12', name: 'C. Campestrini', number: 17, position: 'GK', role: 'Portero' },
    { id: 'sp_rng_13', name: 'M. Torres', number: 12, position: 'GK', role: 'Portero' },
    { id: 'sp_rng_14', name: 'S. Acuña', number: 14, position: 'DEF', role: 'Central' },
    { id: 'sp_rng_15', name: 'A. Mora', number: 13, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_rng_16', name: 'C. Servetti', number: 27, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_rng_17', name: 'A. Rodríguez', number: 18, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_rng_18', name: 'P. Mora', number: 21, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_rng_19', name: 'D. Plaza', number: 22, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_rng_20', name: 'J. Méndez', number: 23, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_rng_21', name: 'J. Araya', number: 16, position: 'FWD', role: 'Extremo izquierdo' },
    { id: 'sp_rng_22', name: 'J.T. Herrera', number: 26, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_rng_23', name: 'C. Muñoz', number: 31, position: 'FWD', role: 'Delantero centro' },
  ],
};

const SQUAD_PALESTINO: SquadFormation = {
  name: '4-2-3-1',
  coach: 'Cristián Muñoz',
  startingEleven: [
    { id: 'sp_pal_01', name: 'S. Pérez', number: 25, position: 'GK', role: 'Portero' },
    { id: 'sp_pal_02', name: 'V. Espinoza', number: 2, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_pal_03', name: 'A. Ceza', number: 4, position: 'DEF', role: 'Central' },
    { id: 'sp_pal_04', name: 'E. Roco', number: 3, position: 'DEF', role: 'Central' },
    { id: 'sp_pal_05', name: 'J. León', number: 23, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_pal_06', name: 'J. Fernández', number: 5, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_pal_07', name: 'N. Meza', number: 8, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_pal_08', name: 'B. Carrasco', number: 7, position: 'MID', role: 'Extremo derecho' },
    { id: 'sp_pal_09', name: 'J. Abrigo', number: 14, position: 'MID', role: 'Mediocampista ofensivo' },
    { id: 'sp_pal_10', name: 'J. Benítez', number: 11, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pal_11', name: 'R. Fernández', number: 9, position: 'FWD', role: 'Delantero centro' },
  ],
  substitutes: [
    { id: 'sp_pal_12', name: 'S. Salas', number: 1, position: 'GK', role: 'Portero' },
    { id: 'sp_pal_13', name: 'J. Bizama', number: 16, position: 'DEF', role: 'Central' },
    { id: 'sp_pal_14', name: 'F. Meza', number: 6, position: 'DEF', role: 'Central' },
    { id: 'sp_pal_15', name: 'D. Zúñiga', number: 28, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_pal_16', name: 'I. Garguez', number: 29, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_pal_17', name: 'S. Pinto', number: 22, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_pal_18', name: 'F. Montes', number: 15, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_pal_19', name: 'A. Martínez', number: 10, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_pal_20', name: 'S. Gallegos', number: 18, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_pal_21', name: 'C. Munder', number: 27, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_pal_22', name: 'G. Tapia', number: 20, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_pal_23', name: 'N. Da Silva', number: 19, position: 'FWD', role: 'Delantero centro' },
  ],
};

const SQUAD_UNION_ESPANOLA: SquadFormation = {
  name: '4-3-3',
  coach: 'Gonzalo Villagra',
  startingEleven: [
    { id: 'sp_ue_01', name: 'M. Parra', number: 1, position: 'GK', role: 'Portero' },
    { id: 'sp_ue_02', name: 'K. Contreras', number: 2, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_ue_03', name: 'J. Aja', number: 3, position: 'DEF', role: 'Central' },
    { id: 'sp_ue_04', name: 'V. Vidal', number: 4, position: 'DEF', role: 'Central' },
    { id: 'sp_ue_05', name: 'M. Ormeño', number: 6, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_ue_06', name: 'B. Jáuregui', number: 5, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_ue_07', name: 'A. Uribe', number: 8, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_ue_08', name: 'U. Ojeda', number: 10, position: 'MID', role: 'Mediocampista ofensivo' },
    { id: 'sp_ue_09', name: 'W. Machado', number: 7, position: 'FWD', role: 'Extremo derecho' },
    { id: 'sp_ue_10', name: 'P. Rubio', number: 9, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_ue_11', name: 'A. Vilches', number: 11, position: 'FWD', role: 'Extremo izquierdo' },
  ],
  substitutes: [
    { id: 'sp_ue_12', name: 'E. Uribe', number: 12, position: 'GK', role: 'Portero' },
    { id: 'sp_ue_13', name: 'J. Fierro', number: 25, position: 'GK', role: 'Portero' },
    { id: 'sp_ue_14', name: 'M. Rodríguez', number: 13, position: 'GK', role: 'Portero' },
    { id: 'sp_ue_15', name: 'M. Wassenne', number: 14, position: 'FWD', role: 'Delantero centro' },
  ],
};

const SQUAD_SANTIAGO_MORNING: SquadFormation = {
  name: '4-4-2',
  coach: 'Esteban Paredes',
  startingEleven: [
    { id: 'sp_sm_01', name: 'A. Arana', number: 1, position: 'GK', role: 'Portero' },
    { id: 'sp_sm_02', name: 'G. Santelices', number: 2, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_sm_03', name: 'B. Guajardo', number: 3, position: 'DEF', role: 'Lateral izquierdo' },
    { id: 'sp_sm_04', name: 'M. Gatica', number: 5, position: 'DEF', role: 'Central' },
    { id: 'sp_sm_05', name: 'L. Rigazzi', number: 22, position: 'DEF', role: 'Central' },
    { id: 'sp_sm_06', name: 'T. Asprea', number: 6, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_sm_07', name: 'S. Salazar', number: 8, position: 'MID', role: 'Mediocampista central' },
    { id: 'sp_sm_08', name: 'F. Manríquez', number: 21, position: 'MID', role: 'Extremo derecho' },
    { id: 'sp_sm_09', name: 'D. Faúndez', number: 29, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_sm_10', name: 'G. Escobar', number: 11, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_sm_11', name: 'J. Barrientos', number: 30, position: 'FWD', role: 'Delantero centro' },
  ],
  substitutes: [
    { id: 'sp_sm_12', name: 'L. Cañete', number: 12, position: 'GK', role: 'Portero' },
    { id: 'sp_sm_13', name: 'M. Villegas', number: 26, position: 'GK', role: 'Portero' },
    { id: 'sp_sm_14', name: 'D. Cerón', number: 16, position: 'DEF', role: 'Central' },
    { id: 'sp_sm_15', name: 'M. Delgado', number: 23, position: 'DEF', role: 'Central' },
    { id: 'sp_sm_16', name: 'D. Estay', number: 25, position: 'DEF', role: 'Lateral derecho' },
    { id: 'sp_sm_17', name: 'E. Ormeño', number: 20, position: 'MID', role: 'Mediocampista ofensivo' },
    { id: 'sp_sm_18', name: 'P. Violante', number: 31, position: 'MID', role: 'Mediocampista defensivo' },
    { id: 'sp_sm_19', name: 'P. Lobos', number: 33, position: 'MID', role: 'Extremo izquierdo' },
    { id: 'sp_sm_20', name: 'B. Taiva', number: 18, position: 'FWD', role: 'Delantero centro' },
    { id: 'sp_sm_21', name: 'M. Coronado', number: 27, position: 'FWD', role: 'Delantero centro' },
  ],
};

const SQUAD_BY_CLUB: Record<string, SquadFormation> = {
  'puerto-montt': SQUAD_PUERTO_MONTT,
  rangers: SQUAD_RANGERS,
  palestino: SQUAD_PALESTINO,
  'union-espanola': SQUAD_UNION_ESPANOLA,
  'santiago-morning': SQUAD_SANTIAGO_MORNING,
};

export function getMockSquad(slug: string): SquadFormation | null {
  return SQUAD_BY_CLUB[slug] ?? null;
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
