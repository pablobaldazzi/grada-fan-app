import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getStoredToken, storeToken, clearToken } from '../http';
import { loginPassword, registerPassword, fetchProfile } from '../api';
import { registerPush, unregisterPush } from '../push';
import { getUseMockData } from '../demo-mode';
import type { Fan } from '../schemas';

// Helper to auto-login in demo mode
async function autoLoginDemo() {
  const res = await loginPassword({
    clubId: 'mock-club-id',
    email: 'demo@example.com',
    password: 'demo',
  });
  await storeToken(res.accessToken);
  const pushT = await registerPush();
  return { res, pushT };
}

interface AuthContextValue {
  fan: Fan | null;
  token: string | null;
  loading: boolean;
  pushToken: string | null;
  setPushToken: (t: string | null) => void;
  login: (clubId: string, email: string, password: string) => Promise<void>;
  register: (
    clubId: string,
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  fan: null,
  token: null,
  loading: true,
  pushToken: null,
  setPushToken: () => {},
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [fan, setFan] = useState<Fan | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const stored = await getStoredToken();
        if (stored) {
          setToken(stored);
          const profile = await fetchProfile();
          setFan({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phone: profile.phone,
          });
        } else if (getUseMockData()) {
          // Auto-login in demo mode with demo credentials
          const { res, pushT } = await autoLoginDemo();
          setToken(res.accessToken);
          setFan(res.fan);
          if (pushT) setPushToken(pushT);
        }
      } catch {
        await clearToken();
        setToken(null);
        setFan(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback(
    async (clubId: string, email: string, password: string) => {
      const res = await loginPassword({ clubId, email, password });
      await storeToken(res.accessToken);
      setToken(res.accessToken);
      setFan(res.fan);
      const pushT = await registerPush();
      if (pushT) setPushToken(pushT);
    },
    [],
  );

  const register = useCallback(
    async (
      clubId: string,
      email: string,
      password: string,
      firstName?: string,
      lastName?: string,
    ) => {
      const res = await registerPassword({
        clubId,
        email,
        password,
        firstName,
        lastName,
      });
      await storeToken(res.accessToken);
      setToken(res.accessToken);
      setFan(res.fan);
      const pushT = await registerPush();
      if (pushT) setPushToken(pushT);
    },
    [],
  );

  const logout = useCallback(async () => {
    await unregisterPush(pushToken);
    await clearToken();
    setToken(null);
    setFan(null);
    setPushToken(null);
  }, [pushToken]);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await fetchProfile();
      setFan({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
      });
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        fan,
        token,
        loading,
        pushToken,
        setPushToken,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
