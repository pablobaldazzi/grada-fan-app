import React, { useState } from "react";
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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { MOCK_MATCHES, formatDate, formatCLP, Match } from "@/lib/mock-data";

function MatchCard({ match }: { match: Match }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push({ pathname: "/match-tickets", params: { matchId: match.id } });
      }}
      style={({ pressed }) => [styles.matchCard, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.matchCardTop}>
        <View style={styles.matchCompBadge}>
          <Text style={styles.matchCompText}>{match.competition}</Text>
        </View>
        {match.isHome && (
          <View style={styles.homeBadge}>
            <Text style={styles.homeBadgeText}>LOCAL</Text>
          </View>
        )}
      </View>

      <View style={styles.matchTeamsRow}>
        <View style={styles.matchTeamCol}>
          <View style={styles.matchTeamIcon}>
            <MaterialCommunityIcons name="shield" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.matchTeamName} numberOfLines={1}>{match.homeTeam}</Text>
        </View>
        <View style={styles.matchVsCol}>
          <Text style={styles.matchVsText}>vs</Text>
        </View>
        <View style={styles.matchTeamCol}>
          <View style={styles.matchTeamIcon}>
            <MaterialCommunityIcons name="shield-outline" size={32} color={Colors.textSecondary} />
          </View>
          <Text style={styles.matchTeamName} numberOfLines={1}>{match.awayTeam}</Text>
        </View>
      </View>

      <View style={styles.matchBottom}>
        <View style={styles.matchMetaRow}>
          <Ionicons name="calendar-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.matchMetaText}>{formatDate(match.date)}</Text>
        </View>
        <View style={styles.matchMetaRow}>
          <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.matchMetaText}>{match.time}</Text>
        </View>
        <View style={styles.matchMetaRow}>
          <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.matchMetaText} numberOfLines={1}>{match.venue}</Text>
        </View>
      </View>

      <View style={styles.buyRow}>
        <Text style={styles.fromPrice}>Desde {formatCLP(5000)}</Text>
        <View style={styles.buyBtn}>
          <Text style={styles.buyBtnText}>Comprar</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.text} />
        </View>
      </View>
    </Pressable>
  );
}

export default function TicketsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [tab, setTab] = useState<'upcoming' | 'mytickets'>('upcoming');

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
        <Text style={styles.title}>Entradas</Text>

        <View style={styles.tabs}>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setTab('upcoming'); }}
            style={[styles.tab, tab === 'upcoming' && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === 'upcoming' && styles.tabTextActive]}>
              Proximos
            </Text>
          </Pressable>
          <Pressable
            onPress={() => { Haptics.selectionAsync(); setTab('mytickets'); }}
            style={[styles.tab, tab === 'mytickets' && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === 'mytickets' && styles.tabTextActive]}>
              Mis Entradas
            </Text>
          </Pressable>
        </View>

        {tab === 'upcoming' ? (
          MOCK_MATCHES.map(match => <MatchCard key={match.id} match={match} />)
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="ticket-outline" size={48} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>Sin entradas</Text>
            <Text style={styles.emptyText}>
              Tus entradas compradas apareceran aqui
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 16 },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
    marginBottom: 16,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.text,
  },
  matchCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  matchCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  matchCompBadge: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  matchCompText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  homeBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  homeBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.primary,
    letterSpacing: 1,
  },
  matchTeamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  matchTeamCol: { flex: 1, alignItems: 'center', gap: 6 },
  matchTeamIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchTeamName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
  },
  matchVsCol: { paddingHorizontal: 16 },
  matchVsText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.textTertiary,
  },
  matchBottom: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginBottom: 14,
  },
  matchMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  matchMetaText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  buyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fromPrice: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  buyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buyBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: Colors.text,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
