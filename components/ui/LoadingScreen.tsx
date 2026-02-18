import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useClub } from '@/lib/contexts/ClubContext';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
  const message = props.message;
  const { theme } = useClub();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      {message ? (
        <Text style={[styles.text, { color: theme.colors.textSecondary }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 15,
  },
});
