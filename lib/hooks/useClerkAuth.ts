import { useCallback, useEffect, useRef, useState } from 'react';
import { useClub } from '../contexts/ClubContext';
import { http, setHttpAuth } from '../http';
import { registerPush, unregisterPush } from '../push';
import { getUseMockData } from '../demo-mode';
import { getMockProfile, MOCK_ACCESS_TOKEN } from '../mock-api-data';
import type { Fan, FanProfile } from '../schemas';

interface ProfileStatus {
  profileComplete: boolean;
  missingFields: string[];
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  nationalId: string | null;
}

export function useClerkAuth() {
  const isDemo = getUseMockData();
  return isDemo ? useClerkAuthDemo() : useClerkAuthReal();
}

function useClerkAuthDemo() {
  const { club } = useClub();
  const clubId = club?.id;

  const [fan, setFan] = useState<Fan | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!clubId || fetchedRef.current) {
      if (!clubId) setLoading(false);
      return;
    }
    fetchedRef.current = true;
    const p = getMockProfile();
    setFan({
      id: p.id,
      email: p.email,
      name: p.name,
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      clubId,
    });
    setProfileStatus({
      profileComplete: true,
      missingFields: [],
      email: p.email,
      firstName: p.firstName ?? null,
      lastName: p.lastName ?? null,
      phone: p.phone ?? null,
      nationalId: p.nationalId ?? null,
    });
    setLoading(false);
  }, [clubId]);

  const logout = useCallback(async () => {
    setFan(null);
    setProfileStatus(null);
    fetchedRef.current = false;
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    // In demo mode we keep profile data in-memory and updates happen via mock-api directly.
  }, []);

  return {
    fan,
    user: null,
    isSignedIn: true,
    isLoaded: true,
    loading,
    profileStatus,
    profileComplete: true,
    pushToken,
    setPushToken,
    getToken: async () => MOCK_ACCESS_TOKEN,
    logout,
    refreshProfile,
  };
}

function useClerkAuthReal() {
  // Avoid importing Clerk in demo mode; importing it triggers native module init.
  const { useAuth, useUser } = require('@clerk/clerk-expo') as typeof import('@clerk/clerk-expo');

  const { isSignedIn, isLoaded, getToken, signOut: clerkSignOut } = useAuth();
  const { user } = useUser();
  const { club } = useClub();

  const clubId = club?.id;

  const [fan, setFan] = useState<Fan | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    setHttpAuth(getToken, clubId ?? null);
  }, [getToken, clubId]);

  const fetchFanProfile = useCallback(async () => {
    if (!isSignedIn || !clubId) return;
    try {
      const token = await getToken();
      if (!token) return;

      const res = await http.get<FanProfile>('/public/fans/me', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-club-id': clubId,
        },
      });
      const p = res.data;
      setFan({
        id: p.id,
        email: p.email,
        name: p.name,
        firstName: p.firstName,
        lastName: p.lastName,
        phone: p.phone,
        clubId,
      });
    } catch {
      setFan(null);
    }
  }, [isSignedIn, clubId, getToken]);

  const fetchProfileStatus = useCallback(async () => {
    if (!isSignedIn || !clubId) return;
    try {
      const token = await getToken();
      if (!token) return;

      const res = await http.get<ProfileStatus>('/public/fans/profile-status', {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-club-id': clubId,
        },
      });
      setProfileStatus(res.data);
    } catch {
      // ignore
    }
  }, [isSignedIn, clubId, getToken]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setFan(null);
      setProfileStatus(null);
      setLoading(false);
      fetchedRef.current = false;
      return;
    }

    if (!clubId || fetchedRef.current) {
      if (!clubId) setLoading(false);
      return;
    }

    fetchedRef.current = true;
    setLoading(true);

    Promise.all([fetchFanProfile(), fetchProfileStatus()])
      .then(async () => {
        try {
          const pushT = await registerPush();
          if (pushT) setPushToken(pushT);
        } catch {
          /* ignore */
        }
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, clubId, fetchFanProfile, fetchProfileStatus]);

  const logout = useCallback(async () => {
    await unregisterPush(pushToken);
    setPushToken(null);
    setFan(null);
    setProfileStatus(null);
    fetchedRef.current = false;
    await clerkSignOut();
  }, [pushToken, clerkSignOut]);

  const refreshProfile = useCallback(async () => {
    await Promise.all([fetchFanProfile(), fetchProfileStatus()]);
  }, [fetchFanProfile, fetchProfileStatus]);

  return {
    fan,
    user,
    isSignedIn: isSignedIn ?? false,
    isLoaded: isLoaded ?? false,
    loading,
    profileStatus,
    profileComplete: profileStatus?.profileComplete ?? false,
    pushToken,
    setPushToken,
    getToken,
    logout,
    refreshProfile,
  };
}
