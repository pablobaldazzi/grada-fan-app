import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
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
  const { isSignedIn, isLoaded, getToken, signOut: clerkSignOut } = useAuth();
  const { user } = useUser();
  const { club } = useClub();
  const isDemo = getUseMockData();

  const [fan, setFan] = useState<Fan | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const clubId = club?.id;

  useEffect(() => {
    if (isDemo) return;
    setHttpAuth(getToken, clubId ?? null);
  }, [getToken, clubId, isDemo]);

  useEffect(() => {
    if (!isDemo || !clubId || fetchedRef.current) {
      if (isDemo && !clubId) setLoading(false);
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
      firstName: p.firstName,
      lastName: p.lastName,
      phone: p.phone,
      nationalId: p.nationalId,
    });
    setLoading(false);
  }, [isDemo, clubId]);

  const fetchFanProfile = useCallback(async () => {
    if (isDemo) return;
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
  }, [isSignedIn, clubId, getToken, isDemo]);

  const fetchProfileStatus = useCallback(async () => {
    if (isDemo) return;
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
  }, [isSignedIn, clubId, getToken, isDemo]);

  useEffect(() => {
    if (isDemo) return;
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
        } catch { /* ignore */ }
      })
      .finally(() => setLoading(false));
  }, [isLoaded, isSignedIn, clubId, fetchFanProfile, fetchProfileStatus, isDemo]);

  const logout = useCallback(async () => {
    if (isDemo) {
      setFan(null);
      setProfileStatus(null);
      fetchedRef.current = false;
      return;
    }
    await unregisterPush(pushToken);
    setPushToken(null);
    setFan(null);
    setProfileStatus(null);
    fetchedRef.current = false;
    await clerkSignOut();
  }, [pushToken, clerkSignOut, isDemo]);

  const refreshProfile = useCallback(async () => {
    if (isDemo) return;
    await Promise.all([fetchFanProfile(), fetchProfileStatus()]);
  }, [fetchFanProfile, fetchProfileStatus, isDemo]);

  return {
    fan,
    user: isDemo ? null : user,
    isSignedIn: isDemo ? true : (isSignedIn ?? false),
    isLoaded: isDemo ? true : (isLoaded ?? false),
    loading,
    profileStatus,
    profileComplete: isDemo ? true : (profileStatus?.profileComplete ?? false),
    pushToken,
    setPushToken,
    getToken: isDemo ? (async () => MOCK_ACCESS_TOKEN) : getToken,
    logout,
    refreshProfile,
  };
}
