import type { NewsArticle } from './schemas';

export const NEWS_CATEGORIES = [
  'Todas',
  'Resultados',
  'Fichajes',
  'Institucional',
  'Cantera',
  'Comunidad',
] as const;

export const NEWS_CATEGORY_MAP: Record<
  Exclude<(typeof NEWS_CATEGORIES)[number], 'Todas'>,
  NewsArticle['category']
> = {
  Resultados: 'resultado',
  Fichajes: 'fichaje',
  Institucional: 'institucional',
  Cantera: 'cantera',
  Comunidad: 'comunidad',
};

export const NEWS_CATEGORY_LABELS: Record<NewsArticle['category'], string> = {
  resultado: 'Resultado',
  fichaje: 'Fichaje',
  institucional: 'Institucional',
  cantera: 'Cantera',
  comunidad: 'Comunidad',
};

export const NEWS_CATEGORY_ICONS: Record<NewsArticle['category'], string> = {
  resultado: 'football',
  fichaje: 'person-add',
  institucional: 'megaphone',
  cantera: 'school',
  comunidad: 'people',
};

export function formatFullNewsDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export function formatShortNewsDate(dateStr: string): string {
  const date = new Date(dateStr);
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
}
