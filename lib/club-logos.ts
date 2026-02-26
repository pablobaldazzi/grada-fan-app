import { ImageSourcePropType } from 'react-native';

const logos: Record<string, ImageSourcePropType> = {
  rangers: require('@/assets/clubs/rangers/splash-icon.png'),
  'puerto-montt': require('@/assets/clubs/puerto-montt/splash-icon.png'),
  'deportes-concepcion': require('@/assets/clubs/deportes-concepcion/splash-icon.png'),
  palestino: require('@/assets/clubs/palestino/splash-icon.png'),
  antofagasta: require('@/assets/clubs/antofagasta/splash-icon.png'),
  recoleta: require('@/assets/clubs/recoleta/splash-icon.png'),
  'santa-cruz': require('@/assets/clubs/santa-cruz/splash-icon.png'),
};

const fallback: ImageSourcePropType = require('@/assets/_default/splash-icon.png');

export function getClubLogo(slug: string | undefined | null): ImageSourcePropType {
  if (!slug) return fallback;
  return logos[slug] ?? fallback;
}

const teamNameToSlug: Record<string, string> = {
  'Rangers': 'rangers',
  'Deportes Puerto Montt': 'puerto-montt',
  'Puerto Montt': 'puerto-montt',
  'Deportes Concepción': 'deportes-concepcion',
  'D. Concepción': 'deportes-concepcion',
  'Concepción': 'deportes-concepcion',
  'Palestino': 'palestino',
  'Antofagasta': 'antofagasta',
  'Deportes Antofagasta': 'antofagasta',
  'Recoleta': 'recoleta',
  'Deportes Recoleta': 'recoleta',
  'Santa Cruz': 'santa-cruz',
  'Deportes Santa Cruz': 'santa-cruz',
  'Colo-Colo': 'colo-colo',
  'U. Católica': 'u-catolica',
  'Universidad Católica': 'u-catolica',
  'U. de Chile': 'u-de-chile',
  'Universidad de Chile': 'u-de-chile',
};

export function getTeamSlug(teamName: string): string | undefined {
  return teamNameToSlug[teamName.trim()];
}

export function parseMatchTeams(matchName: string): { home: string; away: string } | null {
  const parts = matchName.split(/\s+vs\.?\s+/i);
  if (parts.length !== 2) return null;
  return { home: parts[0].trim(), away: parts[1].trim() };
}
