import { useSyncExternalStore, useCallback } from 'react';
import {
  subscribe,
  getMembershipTierSnapshot,
  setMembershipTier,
  TIER_CONFIG,
  type MembershipTier,
  type TierConfig,
} from '../membership';

export function useMembership() {
  const tier = useSyncExternalStore(subscribe, getMembershipTierSnapshot, getMembershipTierSnapshot);
  const tierConfig: TierConfig = TIER_CONFIG[tier];

  const upgradeTo = useCallback(async (newTier: MembershipTier) => {
    await setMembershipTier(newTier);
  }, []);

  return { tier, tierConfig, upgradeTo };
}
