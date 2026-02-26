import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  RefreshControl,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { fetchNotifications, markNotificationRead } from "@/lib/api";

import { timeAgo } from "@/lib/mock-data";
import type { AppNotification } from "@/lib/schemas";
import { getDisplayType } from "@/lib/notification-utils";

function NotificationItem({
  notification,
  onPress,
  colors,
}: {
  notification: AppNotification;
  onPress: () => void;
  colors: Record<string, string>;
}) {
  const read = !!notification.readAt;
  const typeColors: Record<string, string> = {
    ticket: colors.primary,
    promo: colors.warning,
    offer: colors.success,
    club: colors.info,
  };
  const typeLabels: Record<string, string> = {
    ticket: "Entradas",
    promo: "Promo",
    offer: "Oferta",
    club: "Club",
  };
  const displayType = getDisplayType(notification.type);
  const color = typeColors[displayType] || colors.info;
  const timeStr = notification.createdAt ? timeAgo(notification.createdAt) : "";

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.notifCard,
        { backgroundColor: colors.surface, borderColor: colors.cardBorder },
        !read && { borderColor: colors.primary + "55" },
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.notifDot, { backgroundColor: read ? "transparent" : color }]} />
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <View style={[styles.notifTypeBadge, { backgroundColor: color + "20" }]}>
            <Text style={[styles.notifTypeText, { color }]}>
              {typeLabels[displayType] ?? "Club"}
            </Text>
          </View>
          <Text style={[styles.notifTime, { color: colors.textTertiary }]}>{timeStr}</Text>
        </View>
        <Text style={[styles.notifTitle, { color: colors.text }]}>{notification.title}</Text>
        <Text style={[styles.notifBody, { color: colors.textSecondary }]} numberOfLines={3}>
          {notification.body ?? ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const queryClient = useQueryClient();
  const { theme } = useClub();
  const colors = theme.colors;

  const { data: notifData, isRefetching, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications({ take: 50 }),
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (updated) => {
      queryClient.setQueryData(["notifications"], (prev: any) => {
        if (!prev?.items) return prev;
        return {
          ...prev,
          items: prev.items.map((n: AppNotification) => (n.id === updated.id ? updated : n)),
        };
      });
    },
  });

  const notifications = notifData?.items ?? [];

  const handleNotificationPress = (id: string) => {
    const item = notifData?.items.find((n) => n.id === id);
    if (!item) return;

    if (!item.readAt) {
      markReadMutation.mutate(id);
    }

    const data = item.data as { kind?: string; eventId?: string; refId?: string } | undefined;
    if (data?.kind === "new-match" && data.eventId) {
      router.push({ pathname: "/match-tickets", params: { matchId: data.eventId } });
      return;
    }
    if (data?.kind === "new-benefit" && data.refId) {
      router.push({ pathname: "/benefit-detail", params: { benefitId: data.refId } });
      return;
    }
    if (data?.kind === "promo") {
      router.push("/(tabs)/store");
      return;
    }

    const displayType = getDisplayType(item.type);
    if (displayType === "ticket" || displayType === "club") {
      router.push("/(tabs)/tickets");
      return;
    }
    if (displayType === "promo" || displayType === "offer") {
      router.push("/(tabs)/store");
      return;
    }

    router.push("/(tabs)");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={colors.primary} />
        }
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { backgroundColor: colors.surface, borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Avisos</Text>
          <View style={{ width: 40 }} />
        </View>

        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleNotificationPress(notif.id)}
            colors={colors}
          />
        ))}

        {notifications.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No hay avisos por ahora.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
  },
  notifDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 6,
  },
  notifTypeBadge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  notifTypeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
  },
  notifTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  notifTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  notifBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    marginTop: 4,
  },
  empty: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
});
