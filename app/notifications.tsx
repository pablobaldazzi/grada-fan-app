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
import Colors from "@/constants/colors";
import { fetchNotifications, markNotificationRead } from "@/lib/api";
import { timeAgo } from "@/lib/mock-data";
import type { AppNotification } from "@/lib/schemas";

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const read = !!notification.readAt;
  const typeColors: Record<string, string> = {
    ticket: Colors.primary,
    promo: Colors.warning,
    offer: Colors.success,
    club: Colors.info,
  };
  const typeLabels: Record<string, string> = {
    ticket: "Entradas",
    promo: "Promo",
    offer: "Oferta",
    club: "Club",
  };
  const color = typeColors[notification.type ?? ""] || Colors.info;
  const timeStr = notification.createdAt ? timeAgo(notification.createdAt) : "";

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [
        styles.notifCard,
        !read && styles.notifUnread,
        { opacity: pressed ? 0.9 : 1 },
      ]}
    >
      <View style={[styles.notifDot, { backgroundColor: read ? "transparent" : color }]} />
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <View style={[styles.notifTypeBadge, { backgroundColor: color + "20" }]}>
            <Text style={[styles.notifTypeText, { color }]}>
              {typeLabels[notification.type ?? ""] ?? "Club"}
            </Text>
          </View>
          <Text style={styles.notifTime}>{timeStr}</Text>
        </View>
        <Text style={styles.notifTitle}>{notification.title}</Text>
        <Text style={styles.notifBody} numberOfLines={3}>
          {notification.body ?? ""}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const queryClient = useQueryClient();

  const { data: notifData, isRefetching, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchNotifications({ take: 50 }),
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    // Avoid full refetch (can cause iOS list "jump" / scroll bounce)
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

    // Mark read (but don't refetch / jump)
    if (!item.readAt) {
      markReadMutation.mutate(id);
    }

    // Simple routing rules (until backend provides deep-link data)
    const t = (item.type ?? "").toLowerCase();
    if (t === "ticket" || t === "club") {
      router.push("/(tabs)/tickets");
      return;
    }
    if (t === "promo" || t === "offer") {
      router.push("/(tabs)/store");
      return;
    }

    // Fallback
    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
        // We already apply safe-area top padding manually; avoid double inset on iOS
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} tintColor={Colors.primary} />
        }
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Avisos</Text>
          <View style={{ width: 40 }} />
        </View>

        {notifications.map((notif) => (
          <NotificationItem
            key={notif.id}
            notification={notif}
            onPress={() => handleNotificationPress(notif.id)}
          />
        ))}

        {notifications.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No hay avisos por ahora.</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  notifUnread: {
    borderColor: Colors.primary + "55",
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
    color: Colors.textTertiary,
  },
  notifTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  notifBody: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  empty: {
    marginTop: 20,
    padding: 14,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    alignItems: "center",
  },
  emptyText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
});
