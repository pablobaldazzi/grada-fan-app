import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/contexts/AuthContext';
import { useClub } from '@/lib/contexts/ClubContext';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorBox } from '@/components/ui/ErrorBox';

/**
 * Root index: redirect based on auth state.
 * - If club or auth loading -> show loading
 * - If club failed -> show error with retry
 * - If authenticated -> tabs
 * - Else -> auth login
 */
export default function Index() {
  const { loading: clubLoading, error: clubError, retry, theme } = useClub();
  const { token, loading: authLoading } = useAuth();

  if (clubLoading || authLoading) {
    return (
      <LoadingScreen message="Connecting to server... This may take a moment." />
    );
  }

  if (clubError) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <ErrorBox message={clubError} onRetry={retry} />
      </View>
    );
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
