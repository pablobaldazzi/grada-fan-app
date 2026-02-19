import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { defaultTheme } from "@/lib/theme";
import { fetchNotifications } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import type { BackendEvent } from "@/lib/schemas";

const Colors = defaultTheme.colors;

function NextMatchCard({ event, colors }: { event: BackendEvent; colors: Record<string, string> }) {
  const eventDate = new Date(event.datetime);
  const now = new Date();
  const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / 86400000);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/match-tickets", params: { matchId: event.id } });
      }}
      style={({ pressed }) => [styles.matchCard, { opacity: pressed ? 0.95 : 1 }]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, '#1a0505']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.matchGradient}
      >
        <Text style={styles.matchLabel}>PROXIMO PARTIDO</Text>
        <View style={styles.matchTeams}>
          <View style={styles.teamCol}>
            <View style={styles.teamBadge}>
              <MaterialCommunityIcons name="shield" size={40} color={colors.text} />
            </View>
            <Text style={[styles.teamName, { color: colors.text }]} numberOfLines={2}>{event.name}</Text>
          </View>
          <View style={styles.vsCol}>
            <Text style={styles.matchTime}>{formatTime(event.datetime)}</Text>
          </View>
        </View>
        <View style={styles.matchMeta}>
          <View style={styles.matchMetaItem}>
            <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.matchMetaText}>{formatDate(event.datetime)}</Text>
          </View>
          {event.venue ? (
            <View style={styles.matchMetaItem}>
              <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
              <Text style={styles.matchMetaText}>{event.venue}</Text>
            </View>
          ) : null}
        </View>
        <View style={styles.matchCta}>
          <Text style={[styles.matchCtaText, { color: colors.text }]}>Comprar Entradas</Text>
          <Ionicons name="arrow-forward" size={16} color={colors.text} />
        </View>
        {diffDays > 0 && (
          <View style={styles.countdownBadge}>
            <Text style={[styles.countdownText, { color: colors.text }]}>{diffDays} dias</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function AnnouncementCard({ title, body, type, colors }: { title: string; body: string; type: string; colors: Record<string, string> }) {
  const iconMap: Record<string, { name: 'ticket' | 'megaphone' | 'pricetag' | 'football'; color: string }> = {
    ticket: { name: 'ticket', color: colors.primary },
    promo: { name: 'megaphone', color: colors.warning },
    offer: { name: 'pricetag', color: colors.success },
    club: { name: 'football', color: colors.info },
  };
  const icon = iconMap[type] || iconMap.club;

  return (
    <View style={[styles.announcementCard, { backgroundColor: colors.surface }]}>
      <View style={[styles.announcementIcon, { backgroundColor: icon.color + '20' }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.announcementContent}>
        <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.announcementBody, { color: colors.textSecondary }]} numberOfLines={2}>{body ?? ''}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </View>
  );
}

function QuickAction({ icon, label, onPress, colors }: { icon: any; label: string; onPress: () => void; colors: Record<string, string> }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.quickAction, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
      </View>
      <Text style={[styles.quickActionLabel, { color: colors.textSecondary }]}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const { token } = useAuth();
  const colors = theme.colors;

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications({ take: 10 }),
    enabled: !!token,
  });
  const notifications = notifData?.items ?? [];
  const unreadCount = notifData?.unreadCount ?? 0;
  const recentNotifs = notifications.slice(0, 3);

  const firstEvent = club?.events?.[0];
  const moreEvents = club?.events?.slice(1, 4) ?? [];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        // We already apply safe-area top padding manually; avoid double inset on iOS
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.clubName, { color: colors.text }]}>{club?.name ?? 'Club'}</Text>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Bienvenido, Socio</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push("/notifications")}
              style={({ pressed }) => [styles.headerBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              {unreadCount > 0 && (
                <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.badgeText, { color: colors.text }]}>{unreadCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable
              onPress={() => router.push("/profile")}
              style={({ pressed }) => [styles.headerBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="person-circle-outline" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {firstEvent ? <NextMatchCard event={firstEvent} colors={colors} /> : null}

        <View style={styles.quickActions}>
          <QuickAction icon="card" label="Mi Carnet" onPress={() => router.push("/(tabs)/membership")} colors={colors} />
          <QuickAction icon="ticket" label="Entradas" onPress={() => router.push("/(tabs)/tickets")} colors={colors} />
          <QuickAction icon="bag" label="Tienda" onPress={() => router.push("/(tabs)/store")} colors={colors} />
          <QuickAction icon="star" label="Beneficios" onPress={() => router.push("/(tabs)/more")} colors={colors} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Proximos Partidos</Text>
            <Pressable onPress={() => router.push("/(tabs)/tickets")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
            </Pressable>
          </View>
          {moreEvents.map((ev) => (
            <Pressable
              key={ev.id}
              onPress={() => router.push({ pathname: "/match-tickets", params: { matchId: ev.id } })}
              style={({ pressed }) => [styles.miniMatchCard, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={[styles.miniMatchDate, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.miniMatchDay, { color: colors.primary }]}>{new Date(ev.datetime).getDate()}</Text>
                <Text style={[styles.miniMatchMonth, { color: colors.primary }]}>
                  {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][new Date(ev.datetime).getMonth()]}
                </Text>
              </View>
              <View style={styles.miniMatchInfo}>
                <Text style={[styles.miniMatchTeams, { color: colors.text }]} numberOfLines={1}>{ev.name}</Text>
                <Text style={[styles.miniMatchVenue, { color: colors.textSecondary }]} numberOfLines={1}>
                  {ev.venue ?? ''} - {formatTime(ev.datetime)}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Noticias</Text>
          </View>
          {recentNotifs.map((n) => (
            <AnnouncementCard key={n.id} title={n.title} body={n.body ?? ''} type={n.type ?? 'club'} colors={colors} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  clubName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
  },
  greeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.text,
  },
  matchCard: { marginBottom: 20, borderRadius: 16, overflow: 'hidden' },
  matchGradient: { padding: 20, borderRadius: 16 },
  matchLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 2,
    marginBottom: 16,
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  teamCol: { alignItems: 'center', flex: 1 },
  teamBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  vsCol: { alignItems: 'center', paddingHorizontal: 12 },
  vsText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: 'rgba(255,255,255,0.4)',
  },
  matchTime: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  matchMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  matchMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchMetaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  matchCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  matchCtaText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  countdownBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countdownText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  quickAction: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
  },
  seeAll: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
  },
  miniMatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 14,
  },
  miniMatchDate: {
    alignItems: 'center',
    backgroundColor: Colors.primary + '15',
    borderRadius: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  miniMatchDay: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.primary,
    lineHeight: 22,
  },
  miniMatchMonth: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.primary,
    textTransform: 'uppercase',
  },
  miniMatchInfo: { flex: 1 },
  miniMatchTeams: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  miniMatchVenue: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  announcementContent: { flex: 1 },
  announcementTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  announcementBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
});
