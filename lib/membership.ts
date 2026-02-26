import AsyncStorage from '@react-native-async-storage/async-storage';

export type MembershipTier = 'gold' | 'silver' | 'fan';

export interface TierBenefit {
  icon: string;
  label: string;
}

export interface TierConfig {
  id: MembershipTier;
  name: string;
  displayName: string;
  tagline: string;
  price: number;
  priceLabel: string;
  color: string;
  gradientColors: [string, string, string];
  lightGradientColors: [string, string, string];
  icon: string;
  benefits: TierBenefit[];
}

export const TIER_ORDER: MembershipTier[] = ['gold', 'silver', 'fan'];

export const TIER_CONFIG: Record<MembershipTier, TierConfig> = {
  gold: {
    id: 'gold',
    name: 'Gold',
    displayName: 'Socio Gold',
    tagline: 'La Experiencia Total',
    price: 14990,
    priceLabel: '$14.990/mes',
    color: '#FFD700',
    gradientColors: ['#2a2310', '#1a1608', '#0a0a0a'],
    lightGradientColors: ['#FFF8E1', '#FFF3C4', '#FFECB3'],
    icon: 'crown',
    benefits: [
      { icon: 'card-account-details', label: 'Carnet de Socio Gold con diseño dinámico y QR' },
      { icon: 'clock-fast', label: 'First Access: compra 48h antes (Clásicos/Finales)' },
      { icon: 'ticket-percent', label: '20% descuento en toda la boletería' },
      { icon: 'store', label: 'Red de Beneficios Global (marcas aliadas)' },
      { icon: 'trophy', label: 'Sorteos mensuales (entrenamientos, Meet & Greet)' },
      { icon: 'video', label: 'Contenido VIP (conferencias, vestuario)' },
      { icon: 'shopping', label: 'Marketplace (tienda oficial)' },
      { icon: 'vote', label: 'Votación Participativa (camiseta, MVP)' },
    ],
  },
  silver: {
    id: 'silver',
    name: 'Silver',
    displayName: 'Socio Silver',
    tagline: 'El Hincha Inteligente',
    price: 7990,
    priceLabel: '$7.990/mes',
    color: '#C0C0C0',
    gradientColors: ['#1e1e1e', '#141414', '#0a0a0a'],
    lightGradientColors: ['#F5F5F5', '#EEEEEE', '#E8E8E8'],
    icon: 'medal',
    benefits: [
      { icon: 'card-account-details', label: 'Carnet de Socio Silver estándar' },
      { icon: 'store', label: 'Descuentos en comercios aliados' },
      { icon: 'ticket-percent', label: '10% descuento en entradas seleccionadas' },
      { icon: 'bell-ring', label: 'Info Premium (fichajes, alineaciones antes que RRSS)' },
      { icon: 'shopping', label: 'Marketplace (tienda oficial)' },
      { icon: 'clock-check', label: 'Preventa 12h antes que público general' },
    ],
  },
  fan: {
    id: 'fan',
    name: 'Fan',
    displayName: 'Fan',
    tagline: 'El Punto de Entrada',
    price: 0,
    priceLabel: 'Gratis',
    color: '#CD7F32',
    gradientColors: ['#1a1a1a', '#111111', '#0a0a0a'],
    lightGradientColors: ['#FFF0E0', '#FFE8D0', '#FFDFC0'],
    icon: 'account',
    benefits: [
      { icon: 'soccer', label: 'Resultados en vivo, calendario y tabla' },
      { icon: 'newspaper', label: 'Newsletter semanal' },
      { icon: 'shopping', label: 'Marketplace (tienda oficial)' },
      { icon: 'gamepad-variant', label: 'Trivias y juegos para puntos canjeables' },
    ],
  },
};

const STORAGE_KEY = 'grada_membership_tier';

let currentTier: MembershipTier = 'fan';

type Listener = () => void;
const listeners = new Set<Listener>();

function emitChange() {
  listeners.forEach((fn) => fn());
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getMembershipTier(): MembershipTier {
  return currentTier;
}

export function getMembershipTierSnapshot(): MembershipTier {
  return currentTier;
}

export async function setMembershipTier(tier: MembershipTier): Promise<void> {
  currentTier = tier;
  emitChange();
  try {
    await AsyncStorage.setItem(STORAGE_KEY, tier);
  } catch {
    // ignore
  }
}

export async function loadStoredMembershipTier(): Promise<void> {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored === 'gold' || stored === 'silver' || stored === 'fan') {
      currentTier = stored;
      emitChange();
    }
  } catch {
    // keep default
  }
}

const TIER_RANK: Record<MembershipTier, number> = { gold: 0, silver: 1, fan: 2 };

export function isUpgrade(from: MembershipTier, to: MembershipTier): boolean {
  return TIER_RANK[to] < TIER_RANK[from];
}

export function isDowngrade(from: MembershipTier, to: MembershipTier): boolean {
  return TIER_RANK[to] > TIER_RANK[from];
}

export function getLostBenefits(from: MembershipTier, to: MembershipTier): TierBenefit[] {
  const fromBenefits = TIER_CONFIG[from].benefits;
  const toBenefitLabels = new Set(TIER_CONFIG[to].benefits.map((b) => b.label));
  return fromBenefits.filter((b) => !toBenefitLabels.has(b.label));
}
