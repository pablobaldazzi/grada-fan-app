import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchClubBySlug } from '../api';
import { config } from '../config';
import { getDevClubSlugOverride } from '../dev-club-override';
import { buildTheme, defaultTheme, type Theme, type ThemeMode } from '../theme';
import type { ClubWithRelations } from '../schemas';

const THEME_MODE_KEY = 'grada_theme_mode';

interface ClubContextValue {
  club: ClubWithRelations | null;
  clubSlug: string;
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const ClubContext = createContext<ClubContextValue>({
  club: null,
  clubSlug: config.clubSlug,
  theme: defaultTheme,
  themeMode: 'dark',
  setThemeMode: () => {},
  loading: true,
  error: null,
  retry: () => {},
});

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [club, setClub] = useState<ClubWithRelations | null>(null);
  const [clubSlug, setClubSlug] = useState<string>(config.clubSlug);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>('dark');

  useEffect(() => {
    AsyncStorage.getItem(THEME_MODE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') setThemeModeState(stored);
    }).catch(() => {});
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_MODE_KEY, mode).catch(() => {});
  }, []);

  const load = useCallback(async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const override = await getDevClubSlugOverride();
      const resolvedSlug = override || config.clubSlug;
      setClubSlug(resolvedSlug);
      const data = await fetchClubBySlug(resolvedSlug);
      setClub(data);
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string; response?: { status?: number } };
      const isTimeout = err?.code === 'ECONNABORTED' || err?.message?.includes('timeout');
      const isNetwork = err?.message?.includes('Network') || err?.code === 'ERR_NETWORK';
      const isServerError = (err?.response?.status ?? 0) >= 500;

      if ((isTimeout || isNetwork || isServerError) && attempt < 3) {
        await new Promise((r) => setTimeout(r, 3000));
        return load(attempt + 1);
      }

      const msg =
        err?.response?.status === 404
          ? `Club not found (slug: "${clubSlug}"). Check EXPO_PUBLIC_CLUB_SLUG or your dev override.`
          : isServerError
            ? 'Server is starting up. Please tap "Try Again" in a moment.'
            : isTimeout
              ? 'Server is waking up and took too long. Tap "Try Again".'
              : isNetwork
                ? "Can't connect to server. Check your internet connection."
                : `Failed to load club: ${err?.message ?? 'Unknown error'}`;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [clubSlug]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const theme = buildTheme(club, themeMode);

  return (
    <ClubContext.Provider value={{ club, clubSlug, theme, themeMode, setThemeMode, loading, error, retry: load }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  return useContext(ClubContext);
}
