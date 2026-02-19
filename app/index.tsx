import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { useClub } from '@/lib/contexts/ClubContext';
import { useClerkAuth } from '@/lib/hooks/useClerkAuth';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { ErrorBox } from '@/components/ui/ErrorBox';

export default function Index() {
  const { loading: clubLoading, error: clubError, retry, theme } = useClub();
  const { isSignedIn, isLoaded, loading: authLoading, profileComplete, profileStatus } = useClerkAuth();

  if (clubLoading || !isLoaded || authLoading) {
    return (
      <LoadingScreen message="Connecting to server... This may take a moment." />
    );
  }

  if (clubError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorBox message={clubError} onRetry={retry} />
      </View>
    );
  }

  if (isSignedIn) {
    if (profileStatus && !profileComplete) {
      return <Redirect href="/complete-profile" />;
    }
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
