import React from 'react';
import { Stack } from 'expo-router';
import { useClub } from '@/lib/contexts/ClubContext';

export default function AuthLayout() {
  const { theme } = useClub();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    />
  );
}
