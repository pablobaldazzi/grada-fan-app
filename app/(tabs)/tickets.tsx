import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import QRCode from "react-native-qrcode-svg";
import { useQuery } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { getClubLogo, parseMatchTeams, getTeamSlug } from "@/lib/club-logos";
import { fetchOrders } from "@/lib/api";
import { formatDate, formatTime, formatCLP } from "@/lib/format";
import type { BackendEvent, Ticket } from "@/lib/schemas";
import { TIER_CONFIG, type MembershipTier } from "@/lib/membership";

interface TicketWithOrderId extends Ticket {
  _orderId: string;
}

function TeamLogo({ logoUrl, slug, colors }: { logoUrl?: string | null; slug?: string; colors: Record<string, string> }) {
  if (logoUrl) {
    return <Image source={{ uri: logoUrl }} style={styles.matchTeamLogoImg} resizeMode="contain" />;
  }
  return <Image source={getClubLogo(slug)} style={styles.matchTeamLogoImg} resizeMode="contain" />;
}

const TIER_DISCOUNT: Record<MembershipTier, number> = { gold: 0.20, silver: 0.10, fan: 0 };

function applyDiscount(price: number, tier: MembershipTier): number {
  return Math.round(price * (1 - TIER_DISCOUNT[tier]));
}

function EventCard({ event, colors, clubSlug }: { event: BackendEvent; colors: Record<string, string>; clubSlug?: string }) {
  const minPrice = event.ticketTypes?.length
    ? Math.min(...event.ticketTypes.map((tt) => tt.price))
    : 0;

  const hasApiTeams = !!(event.homeTeam || event.awayTeam);
  const parsed = !hasApiTeams ? parseMatchTeams(event.name) : null;

  const homeName = event.homeTeam?.name ?? parsed?.home ?? event.name;
  const awayName = event.awayTeam?.name ?? parsed?.away ?? '';
  const homeLogoUrl = event.homeTeam?.logoUrl;
  const awayLogoUrl = event.awayTeam?.logoUrl;
  const homeSlug = event.homeTeam?.slug ?? (parsed ? getTeamSlug(parsed.home) : clubSlug);
  const awaySlug = event.awayTeam?.slug ?? (parsed ? getTeamSlug(parsed.away) : undefined);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/match-tickets", params: { matchId: event.id } });
      }}
      style={({ pressed }) => [styles.matchCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.matchTeamsRow}>
        <View style={styles.matchTeamCol}>
          <View style={[styles.matchTeamIcon, { backgroundColor: colors.primary + '20' }]}>
            <TeamLogo logoUrl={homeLogoUrl} slug={homeSlug} colors={colors} />
          </View>
          <Text style={[styles.matchTeamName, { color: colors.text }]} numberOfLines={2}>{homeName}</Text>
        </View>
        <Text style={[styles.matchVsText, { color: colors.textSecondary }]}>vs</Text>
        <View style={styles.matchTeamCol}>
          <View style={[styles.matchTeamIcon, { backgroundColor: colors.primary + '20' }]}>
            <TeamLogo logoUrl={awayLogoUrl} slug={awaySlug} colors={colors} />
          </View>
          <Text style={[styles.matchTeamName, { color: colors.text }]} numberOfLines={2}>{awayName}</Text>
        </View>
      </View>
      <View style={[styles.matchBottom, { borderTopColor: colors.divider }]}>
        <View style={styles.matchMetaRow}>
          <Ionicons name="calendar-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.matchMetaText, { color: colors.textSecondary }]}>{formatDate(event.datetime)}</Text>
        </View>
        <View style={styles.matchMetaRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.matchMetaText, { color: colors.textSecondary }]}>{formatTime(event.datetime)}</Text>
        </View>
        {event.venue ? (
          <View style={styles.matchMetaRow}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.matchMetaText, { color: colors.textSecondary }]} numberOfLines={1}>{event.venue}</Text>
          </View>
        ) : null}
      </View>
      {minPrice > 0 && (
        <View style={styles.tierPriceRow}>
          {(['gold', 'silver', 'fan'] as const).map((tier) => {
            const discounted = applyDiscount(minPrice, tier);
            const cfg = TIER_CONFIG[tier];
            return (
              <View key={tier} style={[styles.tierPriceItem, { backgroundColor: cfg.color + '12' }]}>
                <Text style={[styles.tierPriceLabel, { color: cfg.color }]}>{cfg.name}</Text>
                <Text style={[styles.tierPriceValue, { color: cfg.color }]}>{formatCLP(discounted)}</Text>
                {TIER_DISCOUNT[tier] > 0 && (
                  <Text style={[styles.tierPriceDiscount, { color: cfg.color }]}>-{TIER_DISCOUNT[tier] * 100}%</Text>
                )}
              </View>
            );
          })}
        </View>
      )}
      <View style={styles.buyRow}>
        <Text style={[styles.fromPrice, { color: colors.textSecondary }]}>
          {minPrice > 0 ? `Desde ${formatCLP(minPrice)}` : 'Entradas'}
        </Text>
        <View style={[styles.buyBtn, { backgroundColor: colors.primary }]}>
          <Text style={[styles.buyBtnText, { color: colors.text }]}>Comprar</Text>
          <Ionicons name="arrow-forward" size={14} color={colors.text} />
        </View>
      </View>
    </Pressable>
  );
}

function TicketCard({ item, colors }: { item: TicketWithOrderId; colors: Record<string, string> }) {
  const qrValue = item.token ?? item.id;
  return (
    <View style={[styles.ticketCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
      <Text style={[styles.ticketEventName, { color: colors.text }]} numberOfLines={2}>
        {item.event?.name ?? 'Evento'}
      </Text>
      {item.event?.datetime && (
        <Text style={[styles.ticketMeta, { color: colors.textSecondary }]}>
          {formatDate(item.event.datetime)} · {formatTime(item.event.datetime)}
        </Text>
      )}
      {item.event?.venue ? (
        <Text style={[styles.ticketVenue, { color: colors.textSecondary }]} numberOfLines={1}>
          {item.event.venue}
        </Text>
      ) : null}
      <View style={styles.ticketBadgeRow}>
        {item.ticketType?.name ? (
          <View style={[styles.ticketBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.ticketBadgeText, { color: colors.primary }]}>{item.ticketType.name}</Text>
          </View>
        ) : null}
        {item.seatLabel ? (
          <Text style={[styles.ticketSeat, { color: colors.textSecondary }]}>Asiento: {item.seatLabel}</Text>
        ) : null}
        {item.sectionName ? (
          <Text style={[styles.ticketSeat, { color: colors.textSecondary }]}>Sección: {item.sectionName}</Text>
        ) : null}
      </View>
      <View style={styles.qrContainer}>
        <QRCode
          value={qrValue}
          size={160}
          color={colors.text}
          backgroundColor={colors.surface}
        />
      </View>
      {item.status ? (
        <Text style={[styles.ticketStatus, { color: colors.textSecondary }]}>Estado: {item.status}</Text>
      ) : null}
    </View>
  );
}

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const { isSignedIn } = useClerkAuth();
  const colors = theme.colors;
  const [tab, setTab] = useState<'upcoming' | 'mytickets'>('upcoming');

  const {
    data: orders,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
    isRefetching: ordersRefetching,
  } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    enabled: tab === 'mytickets' && !!isSignedIn,
  });

  const tickets = useMemo((): TicketWithOrderId[] => {
    if (!orders) return [];
    return orders.flatMap((order) =>
      (order.tickets ?? []).map((t) => ({ ...t, _orderId: order.id }))
    );
  }, [orders]);

  const events = club?.events ?? [];

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
        refreshControl={
          tab === 'mytickets' ? (
            <RefreshControl
              refreshing={ordersRefetching}
              onRefresh={() => refetchOrders()}
              tintColor={colors.primary}
            />
          ) : undefined
        }
      >
        <Text style={[styles.title, { color: colors.text }]}>Entradas</Text>

        <View style={[styles.tabs, { backgroundColor: colors.surface }]}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setTab('upcoming'); }}
            style={[styles.tab, tab === 'upcoming' && [styles.tabActive, { backgroundColor: colors.primary }]]}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'upcoming' && [styles.tabTextActive, { color: colors.text }]]}>
              Proximos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setTab('mytickets'); }}
            style={[styles.tab, tab === 'mytickets' && [styles.tabActive, { backgroundColor: colors.primary }]]}
          >
            <Text style={[styles.tabText, { color: colors.textSecondary }, tab === 'mytickets' && [styles.tabTextActive, { color: colors.text }]]}>
              Mis Entradas
            </Text>
          </Pressable>
        </View>

        {tab === 'upcoming' ? (
          events.length > 0
            ? events.map((ev) => <EventCard key={ev.id} event={ev} colors={colors} clubSlug={club?.slug} />)
            : (
              <View style={styles.emptyState}>
                <Ionicons name="calendar-outline" size={48} color={colors.textTertiary} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin partidos</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No hay partidos proximos por ahora
                </Text>
              </View>
            )
        ) : ordersLoading ? (
          <View style={styles.emptyState}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Cargando entradas...</Text>
          </View>
        ) : ordersError ? (
          <View style={styles.emptyState}>
            <Ionicons name="alert-circle-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No se pudieron cargar las entradas</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tira hacia abajo para reintentar
            </Text>
            <Pressable
              onPress={() => refetchOrders()}
              style={[styles.retryBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.retryBtnText, { color: colors.text }]}>Reintentar</Text>
            </Pressable>
          </View>
        ) : tickets.length > 0 ? (
          tickets.map((item) => <TicketCard key={item.id} item={item} colors={colors} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>Sin entradas</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Tus entradas compradas apareceran aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28, marginBottom: 16 },
  tabs: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabActive: {},
  tabText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  tabTextActive: {},
  matchCard: { borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1 },
  matchTeamsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  matchTeamCol: { flex: 1, alignItems: 'center', gap: 6 },
  matchTeamIcon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  matchTeamLogoImg: { width: 32, height: 32 },
  matchTeamName: { fontFamily: 'Inter_600SemiBold', fontSize: 13, textAlign: 'center' },
  matchVsText: { fontFamily: 'Inter_700Bold', fontSize: 16, marginHorizontal: 12 },
  matchBottom: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingTop: 14, borderTopWidth: 1, borderTopColor: 'transparent', marginBottom: 14 },
  matchMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  matchMetaText: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  tierPriceRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tierPriceItem: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tierPriceLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tierPriceValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  tierPriceDiscount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    marginTop: 1,
  },
  buyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fromPrice: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  buyBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  buyBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, gap: 12 },
  emptyTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18 },
  emptyText: { fontFamily: 'Inter_400Regular', fontSize: 14, textAlign: 'center' },
  retryBtn: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14 },
  ticketCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  ticketEventName: { fontFamily: 'Inter_600SemiBold', fontSize: 17, marginBottom: 4 },
  ticketMeta: { fontFamily: 'Inter_400Regular', fontSize: 13, marginBottom: 2 },
  ticketVenue: { fontFamily: 'Inter_400Regular', fontSize: 13, marginBottom: 10 },
  ticketBadgeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 14 },
  ticketBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  ticketBadgeText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  ticketSeat: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  qrContainer: { alignItems: 'center', paddingVertical: 12 },
  ticketStatus: { fontFamily: 'Inter_400Regular', fontSize: 12, textAlign: 'center', marginTop: 6 },
});
