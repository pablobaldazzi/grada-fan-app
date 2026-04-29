import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

/**
 * Dev-only runtime override of the club slug. Lets QA point the app at any
 * club without rebuilding or editing .env. Storage is local; the value is
 * only honored in __DEV__ so production builds always use the configured slug.
 */

const OVERRIDE_KEY = 'grada_dev_club_slug_override';
const RECENT_KEY = 'grada_dev_recent_club_slugs';
const RECENT_LIMIT = 5;

export async function getDevClubSlugOverride(): Promise<string | null> {
  if (!__DEV__) return null;
  try {
    return await AsyncStorage.getItem(OVERRIDE_KEY);
  } catch {
    return null;
  }
}

export async function setDevClubSlugOverride(slug: string): Promise<void> {
  if (!__DEV__) return;
  try {
    await AsyncStorage.setItem(OVERRIDE_KEY, slug);
    await pushRecentDevSlug(slug);
  } catch {
    // ignore – dev-only convenience
  }
}

export async function clearDevClubSlugOverride(): Promise<void> {
  if (!__DEV__) return;
  try {
    await AsyncStorage.removeItem(OVERRIDE_KEY);
  } catch {
    // ignore
  }
}

export async function getRecentDevSlugs(): Promise<string[]> {
  if (!__DEV__) return [];
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === 'string') : [];
  } catch {
    return [];
  }
}

async function pushRecentDevSlug(slug: string): Promise<void> {
  const existing = await getRecentDevSlugs();
  const next = [slug, ...existing.filter((s) => s !== slug)].slice(0, RECENT_LIMIT);
  try {
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

/**
 * Reload the JS bundle so the new override is picked up cleanly.
 * On native dev this uses DevSettings; on web it falls back to a hard
 * page reload. No-op in production.
 */
export function reloadAppForDevOverride(): void {
  if (!__DEV__) return;
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') window.location.reload();
    return;
  }
  try {
    const { DevSettings } = require('react-native') as typeof import('react-native');
    DevSettings.reload?.();
  } catch {
    // ignore
  }
}
