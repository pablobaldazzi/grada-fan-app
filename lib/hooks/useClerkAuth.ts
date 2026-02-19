import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useClub } from '../contexts/ClubContext';
import { http, setHttpAuth } from '../http';
import { registerPush, unregisterPush } from '../push';
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

  const [fan, setFan] = useState<Fan | null>(null);
  const [profileStatus, setProfileStatus] = useState<ProfileStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const clubId = club?.id;

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
        } catch { /* ignore */ }
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
