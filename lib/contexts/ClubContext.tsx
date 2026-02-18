import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchClubBySlug } from '../api';
import { config } from '../config';
import { buildTheme, defaultTheme, type Theme } from '../theme';
import type { ClubWithRelations } from '../schemas';

interface ClubContextValue {
  club: ClubWithRelations | null;
  theme: Theme;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

const ClubContext = createContext<ClubContextValue>({
  club: null,
  theme: defaultTheme,
  loading: true,
  error: null,
  retry: () => {},
});

export function ClubProvider({ children }: { children: React.ReactNode }) {
  const [club, setClub] = useState<ClubWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async (attempt = 1): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchClubBySlug(config.clubSlug);
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
          ? `Club not found (slug: "${config.clubSlug}"). Check EXPO_PUBLIC_CLUB_SLUG.`
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
  };

  useEffect(() => {
    load();
  }, []);

  const theme = buildTheme(club);

  return (
    <ClubContext.Provider value={{ club, theme, loading, error, retry: load }}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  return useContext(ClubContext);
}
