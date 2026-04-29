import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useQuery } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { darkenHex } from "@/lib/theme";
import { getClubLogo, parseMatchTeams, getTeamSlug } from "@/lib/club-logos";
import { fetchClubNews, fetchClubStandings, fetchNotifications } from "@/lib/api";
import { formatDate, formatTime } from "@/lib/format";
import { NEWS_CATEGORY_ICONS } from "@/lib/news";
import type {
  BackendEvent,
  ClubStandings,
  NewsArticle,
  StandingEntry,
} from "@/lib/schemas";

function NextMatchCard({ event, colors, clubSlug, isLight }: { event: BackendEvent; colors: Record<string, string>; clubSlug?: string; isLight?: boolean }) {
  const eventDate = new Date(event.datetime);
  const now = new Date();
  const diffDays = Math.ceil((eventDate.getTime() - now.getTime()) / 86400000);
  const teams = parseMatchTeams(event.name);
  const homeSlug = teams ? getTeamSlug(teams.home) : clubSlug;
  const awaySlug = teams ? getTeamSlug(teams.away) : undefined;
  const homeLogo = event.homeTeam?.logoUrl ? { uri: event.homeTeam.logoUrl } : getClubLogo(homeSlug);
  const awayLogo = event.awayTeam?.logoUrl ? { uri: event.awayTeam.logoUrl } : getClubLogo(awaySlug);
  const gradientEnd = darkenHex(colors.primary, isLight ? 0.4 : 0.85);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/match-tickets", params: { matchId: event.id } });
      }}
      style={({ pressed }) => [styles.matchCard, { opacity: pressed ? 0.95 : 1 }]}
    >
      <LinearGradient
        colors={[colors.primary, colors.primaryDark, gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.matchGradient}
      >
        <Text style={styles.matchLabel}>PROXIMO PARTIDO</Text>
        <View style={styles.matchTeams}>
          <View style={styles.teamCol}>
            <View style={styles.teamBadge}>
              <Image source={homeLogo} style={styles.teamBadgeImg} resizeMode="contain" />
            </View>
            <Text style={[styles.teamName, { color: '#FFFFFF' }]} numberOfLines={2}>{teams?.home ?? event.name}</Text>
          </View>
          <View style={styles.vsCol}>
            <Text style={styles.vsText}>vs</Text>
            <Text style={styles.matchTime}>{formatTime(event.datetime)}</Text>
          </View>
          <View style={styles.teamCol}>
            <View style={styles.teamBadge}>
              <Image source={awayLogo} style={styles.teamBadgeImg} resizeMode="contain" />
            </View>
            <Text style={[styles.teamName, { color: '#FFFFFF' }]} numberOfLines={2}>{teams?.away ?? ''}</Text>
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
          <Text style={[styles.matchCtaText, { color: '#FFFFFF' }]}>Comprar Entradas</Text>
          <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
        </View>
        {diffDays > 0 && (
          <View style={styles.countdownBadge}>
            <Text style={[styles.countdownText, { color: '#FFFFFF' }]}>{diffDays} dias</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

function NewsPreviewCard({ article, colors }: { article: NewsArticle; colors: Record<string, string> }) {
  const icon = NEWS_CATEGORY_ICONS[article.category] ?? 'newspaper';

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/news-detail", params: { newsId: article.id } });
      }}
      style={({ pressed }) => [styles.announcementCard, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={[styles.announcementIcon, { backgroundColor: colors.primary + '20' }]}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.announcementContent}>
        <Text style={[styles.announcementTitle, { color: colors.text }]} numberOfLines={1}>{article.title}</Text>
        <Text style={[styles.announcementBody, { color: colors.textSecondary }]} numberOfLines={2}>{article.summary}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
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

function StandingsRow({ entry, colors }: { entry: StandingEntry; colors: Record<string, string> }) {
  const logoSource = entry.logoUrl ? { uri: entry.logoUrl } : getClubLogo(entry.teamSlug);
  const rowBg = entry.isHighlighted ? colors.primary + '15' : 'transparent';
  const borderLeft = entry.isHighlighted ? colors.primary : 'transparent';

  return (
    <View style={[standingsStyles.row, { backgroundColor: rowBg, borderLeftColor: borderLeft }]}>
      <Text style={[standingsStyles.pos, { color: colors.textSecondary }]}>{entry.position}</Text>
      <Image source={logoSource} style={standingsStyles.logo} resizeMode="contain" />
      <Text
        style={[
          standingsStyles.teamName,
          { color: colors.text },
          entry.isHighlighted && { fontFamily: 'Inter_700Bold' },
        ]}
        numberOfLines={1}
      >
        {entry.shortName}
      </Text>
      <Text style={[standingsStyles.stat, { color: colors.textSecondary }]}>{entry.played}</Text>
      <Text style={[standingsStyles.stat, { color: colors.textSecondary }]}>{entry.won}</Text>
      <Text style={[standingsStyles.stat, { color: colors.textSecondary }]}>{entry.drawn}</Text>
      <Text style={[standingsStyles.stat, { color: colors.textSecondary }]}>{entry.lost}</Text>
      <Text style={[standingsStyles.statGd, { color: entry.goalDifference > 0 ? '#22C55E' : entry.goalDifference < 0 ? '#EF4444' : colors.textSecondary }]}>
        {entry.goalDifference > 0 ? `+${entry.goalDifference}` : entry.goalDifference}
      </Text>
      <Text style={[standingsStyles.pts, { color: colors.text }]}>{entry.points}</Text>
    </View>
  );
}

function StandingsTable({ standings, colors }: { standings: ClubStandings; colors: Record<string, string> }) {
  const updatedAt = new Date(standings.league.updatedAt);
  const formattedUpdatedAt = isNaN(updatedAt.getTime())
    ? null
    : updatedAt.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  return (
    <View style={[standingsStyles.container, { backgroundColor: colors.surface }]}>
      <View style={standingsStyles.headerRow}>
        <Text style={[standingsStyles.headerPos, { color: colors.textTertiary }]}>#</Text>
        <View style={standingsStyles.headerTeamSpacer} />
        <Text style={[standingsStyles.headerTeamLabel, { color: colors.textTertiary }]}>Equipo</Text>
        <Text style={[standingsStyles.headerStat, { color: colors.textTertiary }]}>PJ</Text>
        <Text style={[standingsStyles.headerStat, { color: colors.textTertiary }]}>G</Text>
        <Text style={[standingsStyles.headerStat, { color: colors.textTertiary }]}>E</Text>
        <Text style={[standingsStyles.headerStat, { color: colors.textTertiary }]}>P</Text>
        <Text style={[standingsStyles.headerStatGd, { color: colors.textTertiary }]}>DG</Text>
        <Text style={[standingsStyles.headerPts, { color: colors.textTertiary }]}>PTS</Text>
      </View>
      {standings.entries.map((entry) => (
        <StandingsRow key={entry.teamId} entry={entry} colors={colors} />
      ))}
      {(formattedUpdatedAt || standings.league.matchdayLabel) && (
        <Text style={[standingsStyles.updated, { color: colors.textTertiary }]}>
          {formattedUpdatedAt ? `Actualizado: ${formattedUpdatedAt}` : ''}
          {formattedUpdatedAt && standings.league.matchdayLabel ? ' · ' : ''}
          {standings.league.matchdayLabel ?? ''}
        </Text>
      )}
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme, themeMode } = useClub();
  const { isSignedIn } = useClerkAuth();
  const colors = theme.colors;

  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications({ take: 10 }),
    enabled: isSignedIn,
  });
  const { data: newsData } = useQuery({
    queryKey: ['club-news', club?.slug, 'home'],
    queryFn: () => fetchClubNews(club!.slug, { limit: 3 }),
    enabled: !!club?.slug,
  });
  const unreadCount = notifData?.unreadCount ?? 0;

  const { data: standingsData } = useQuery({
    queryKey: ['club-standings', club?.slug],
    queryFn: () => fetchClubStandings(club!.slug),
    enabled: !!club?.slug,
    // 404 means "no league configured" — return null and don't retry needlessly.
    retry: false,
  });

  const recentNews = newsData?.items ?? [];

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
                  <Text style={[styles.badgeText, { color: '#FFFFFF' }]}>{unreadCount}</Text>
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

        {firstEvent ? <NextMatchCard event={firstEvent} colors={colors} clubSlug={club?.slug} isLight={themeMode === 'light'} /> : null}

        <View style={styles.quickActions}>
          <QuickAction icon="card" label="Mi Carnet" onPress={() => router.push("/(tabs)/membership")} colors={colors} />
          <QuickAction icon="newspaper" label="Noticias" onPress={() => router.push({ pathname: "/(tabs)/more", params: { tab: "noticias" } })} colors={colors} />
          <QuickAction icon="people" label="Plantel" onPress={() => router.push("/plantel")} colors={colors} />
          <QuickAction icon="star" label="Beneficios" onPress={() => router.push({ pathname: "/(tabs)/more", params: { tab: "benefits" } })} colors={colors} />
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

        {standingsData && standingsData.entries.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tabla de Posiciones</Text>
              <Text style={[styles.seeAll, { color: colors.primary }]}>{standingsData.league.name}</Text>
            </View>
            <StandingsTable standings={standingsData} colors={colors} />
          </View>
        ) : null}

        {recentNews.length > 0 ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Noticias</Text>
              <Pressable onPress={() => router.push({ pathname: "/(tabs)/more", params: { tab: "noticias" } })}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Ver todos</Text>
              </Pressable>
            </View>
            {recentNews.map((article) => (
              <NewsPreviewCard key={article.id} article={article} colors={colors} />
            ))}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
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
  teamBadgeImg: {
    width: 40,
    height: 40,
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
    borderRadius: 14,
    paddingVertical: 14,
    gap: 6,
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
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
    borderRadius: 10,
    width: 48,
    height: 48,
    justifyContent: 'center',
  },
  miniMatchDay: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    lineHeight: 22,
  },
  miniMatchMonth: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  miniMatchInfo: { flex: 1 },
  miniMatchTeams: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
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

const standingsStyles = StyleSheet.create({
  container: {
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 2,
  },
  headerPos: {
    width: 20,
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textAlign: 'center',
  },
  headerTeamSpacer: {
    width: 22,
    marginHorizontal: 6,
  },
  headerTeamLabel: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
  },
  headerStat: {
    width: 22,
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textAlign: 'center',
  },
  headerStatGd: {
    width: 28,
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    textAlign: 'center',
  },
  headerPts: {
    width: 28,
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 4,
    borderLeftWidth: 3,
    borderRadius: 4,
    marginVertical: 1,
  },
  pos: {
    width: 20,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    textAlign: 'center',
  },
  logo: {
    width: 22,
    height: 22,
    marginHorizontal: 6,
  },
  teamName: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
  },
  stat: {
    width: 22,
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    textAlign: 'center',
  },
  statGd: {
    width: 28,
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    textAlign: 'center',
  },
  pts: {
    width: 28,
    fontFamily: 'Inter_700Bold',
    fontSize: 12,
    textAlign: 'center',
  },
  updated: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    textAlign: 'center',
    paddingTop: 8,
    paddingBottom: 4,
  },
});
