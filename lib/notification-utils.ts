export const BACKEND_TYPE_TO_DISPLAY: Record<string, string> = {
  NEW_MATCH: 'ticket',
  MATCH_REMINDER: 'ticket',
  PROMO: 'promo',
  NEW_BENEFIT: 'offer',
  GENERAL: 'club',
};

export function getDisplayType(backendType: string | undefined): string {
  if (!backendType) return 'club';
  return BACKEND_TYPE_TO_DISPLAY[backendType] ?? 'club';
}
