import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Switch,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { fetchNotificationPrefs, updateNotificationPrefs } from "@/lib/api";
import type { NotificationPrefs } from "@/lib/schemas";

const PREFS_LABELS: Record<keyof NotificationPrefs, string> = {
  matchReminders: 'Recordatorios de partidos',
  promos: 'Promociones',
  newMatches: 'Nuevos partidos',
  newBenefits: 'Nuevos beneficios',
};

export default function NotificationPreferencesScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { theme } = useClub();
  const { isSignedIn } = useClerkAuth();
  const queryClient = useQueryClient();
  const colors = theme.colors;

  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notification-prefs'],
    queryFn: fetchNotificationPrefs,
    enabled: !!isSignedIn,
  });

  const updateMutation = useMutation({
    mutationFn: updateNotificationPrefs,
    onSuccess: (updated) => {
      queryClient.setQueryData(['notification-prefs'], updated);
    },
  });

  const handleToggle = (key: keyof NotificationPrefs, value: boolean) => {
    updateMutation.mutate({ [key]: value });
  };

  if (!isSignedIn) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
          <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Preferencias</Text>
        </View>
        <View style={styles.centered}>
          <Text style={[styles.message, { color: colors.textSecondary }]}>Inicia sesión para gestionar notificaciones.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8, borderBottomColor: colors.divider }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Preferencias de notificaciones</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Text style={[styles.loading, { color: colors.textSecondary }]}>Cargando...</Text>
        ) : (
          (Object.keys(PREFS_LABELS) as (keyof NotificationPrefs)[]).map((key) => (
            <View key={key} style={[styles.row, { borderBottomColor: colors.divider }]}>
              <Text style={[styles.rowLabel, { color: colors.text }]}>{PREFS_LABELS[key]}</Text>
              <Switch
                value={prefs?.[key] ?? true}
                onValueChange={(v) => handleToggle(key, v)}
                trackColor={{ false: colors.surface, true: colors.primary + '80' }}
                thumbColor={prefs?.[key] !== false ? colors.primary : colors.textTertiary}
              />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  rowLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
  },
  loading: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    paddingVertical: 24,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  message: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});
