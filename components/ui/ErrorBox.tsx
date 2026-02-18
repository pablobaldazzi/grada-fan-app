import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useClub } from '@/lib/contexts/ClubContext';

interface ErrorBoxProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorBox({ message, onRetry }: ErrorBoxProps) {
  const { theme } = useClub();

  return (
    <View style={styles.container}>
      <Text style={[styles.emoji]}>!</Text>
      <Text style={[styles.message, { color: theme.colors.text }]}>
        {message}
      </Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.retryBtn,
            {
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.primary,
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <Text style={[styles.retryText, { color: theme.colors.primary }]}>
            Try Again
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emoji: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    color: '#E74C3C',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#E74C3C',
    textAlign: 'center',
    lineHeight: 44,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 2,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
