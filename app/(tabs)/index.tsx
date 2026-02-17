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
import Colors from "@/constants/colors";
import { MOCK_MATCHES, MOCK_NOTIFICATIONS, formatDate } from "@/lib/mock-data";

function NextMatchCard() {
  const match = MOCK_MATCHES[0];
  const matchDate = new Date(match.date);
  const now = new Date();
  const diffDays = Math.ceil((matchDate.getTime() - now.getTime()) / 86400000);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/match-tickets", params: { matchId: match.id } });
      }}
      style={({ pressed }) => [styles.matchCard, { opacity: pressed ? 0.95 : 1 }]}
    >
      <LinearGradient
        colors={[Colors.primary, Colors.primaryDark, '#1a0505']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.matchGradient}
      >
        <Text style={styles.matchLabel}>PROXIMO PARTIDO</Text>
        <View style={styles.matchTeams}>
          <View style={styles.teamCol}>
            <View style={styles.teamBadge}>
              <MaterialCommunityIcons name="shield" size={40} color={Colors.text} />
            </View>
            <Text style={styles.teamName}>{match.homeTeam}</Text>
          </View>
          <View style={styles.vsCol}>
            <Text style={styles.vsText}>VS</Text>
            <Text style={styles.matchTime}>{match.time} hrs</Text>
          </View>
          <View style={styles.teamCol}>
            <View style={styles.teamBadge}>
              <MaterialCommunityIcons name="shield-outline" size={40} color={Colors.textSecondary} />
            </View>
            <Text style={styles.teamName}>{match.awayTeam}</Text>
          </View>
        </View>
        <View style={styles.matchMeta}>
          <View style={styles.matchMetaItem}>
            <Ionicons name="calendar" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.matchMetaText}>{formatDate(match.date)}</Text>
          </View>
          <View style={styles.matchMetaItem}>
            <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.matchMetaText}>{match.venue}</Text>
          </View>
        </View>
        <View style={styles.matchCta}>
          <Text style={styles.matchCtaText}>Comprar Entradas</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.text} />
        </View>
        {diffDays > 0 && (
          <View style={styles.countdownBadge}>
            <Text style={styles.countdownText}>{diffDays} dias</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function AnnouncementCard({ title, body, type }: { title: string; body: string; type: string }) {
  const iconMap: Record<string, { name: any; color: string }> = {
    ticket: { name: 'ticket', color: Colors.primary },
    promo: { name: 'megaphone', color: Colors.warning },
    offer: { name: 'pricetag', color: Colors.success },
    club: { name: 'football', color: Colors.info },
  };
  const icon = iconMap[type] || iconMap.club;

  return (
    <View style={styles.announcementCard}>
      <View style={[styles.announcementIcon, { backgroundColor: icon.color + '20' }]}>
        <Ionicons name={icon.name} size={20} color={icon.color} />
      </View>
      <View style={styles.announcementContent}>
        <Text style={styles.announcementTitle} numberOfLines={1}>{title}</Text>
        <Text style={styles.announcementBody} numberOfLines={2}>{body}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </View>
  );
}

function QuickAction({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.quickAction, { opacity: pressed ? 0.7 : 1 }]}
    >
      <View style={styles.quickActionIcon}>
        <Ionicons name={icon} size={22} color={Colors.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
  const recentNotifs = MOCK_NOTIFICATIONS.slice(0, 3);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.clubName}>Rojinegro App</Text>
            <Text style={styles.greeting}>Bienvenido, Socio</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => router.push("/cart")}
              style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="bag-outline" size={22} color={Colors.text} />
            </Pressable>
            <Pressable
              onPress={() => {
                const moreTab = 4;
              }}
              style={({ pressed }) => [styles.headerBtn, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.text} />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <NextMatchCard />

        <View style={styles.quickActions}>
          <QuickAction icon="card" label="Mi Carnet" onPress={() => router.push("/(tabs)/membership")} />
          <QuickAction icon="ticket" label="Entradas" onPress={() => router.push("/(tabs)/tickets")} />
          <QuickAction icon="bag" label="Tienda" onPress={() => router.push("/(tabs)/store")} />
          <QuickAction icon="star" label="Beneficios" onPress={() => router.push("/(tabs)/more")} />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Proximos Partidos</Text>
            <Pressable onPress={() => router.push("/(tabs)/tickets")}>
              <Text style={styles.seeAll}>Ver todos</Text>
            </Pressable>
          </View>
          {MOCK_MATCHES.slice(1, 4).map(match => (
            <Pressable
              key={match.id}
              onPress={() => router.push({ pathname: "/match-tickets", params: { matchId: match.id } })}
              style={({ pressed }) => [styles.miniMatchCard, { opacity: pressed ? 0.85 : 1 }]}
            >
              <View style={styles.miniMatchDate}>
                <Text style={styles.miniMatchDay}>{new Date(match.date).getDate()}</Text>
                <Text style={styles.miniMatchMonth}>
                  {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][new Date(match.date).getMonth()]}
                </Text>
              </View>
              <View style={styles.miniMatchInfo}>
                <Text style={styles.miniMatchTeams}>
                  {match.homeTeam} vs {match.awayTeam}
                </Text>
                <Text style={styles.miniMatchVenue}>{match.venue} - {match.time}</Text>
              </View>
              <View style={[styles.compBadge, !match.isHome && styles.compBadgeAway]}>
                <Text style={styles.compBadgeText}>{match.isHome ? 'LOCAL' : 'VISITA'}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Novedades</Text>
          </View>
          {recentNotifs.map(n => (
            <AnnouncementCard key={n.id} title={n.title} body={n.body} type={n.type} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
    color: Colors.text,
  },
  greeting: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
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
    color: Colors.text,
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
    color: Colors.text,
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
    color: Colors.text,
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
    color: Colors.textSecondary,
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
    color: Colors.text,
  },
  seeAll: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.primary,
  },
  miniMatchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
    color: Colors.textSecondary,
    marginTop: 2,
  },
  compBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  compBadgeAway: {
    backgroundColor: Colors.textTertiary + '20',
  },
  compBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
    color: Colors.primary,
    letterSpacing: 1,
  },
  announcementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
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
    color: Colors.text,
  },
  announcementBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
