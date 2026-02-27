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
import { router } from "expo-router";
import { useClub } from "@/lib/contexts/ClubContext";
import { getMockSquad, type SquadPlayer } from "@/lib/mock-data";

const POSITION_COLORS: Record<string, string> = {
  GK: '#F5A623',
  DEF: '#4A90D9',
  MID: '#50C878',
  FWD: '#E74C3C',
};

const FORMATION_ROWS: Record<string, { y: number; players: number[] }[]> = {
  '4-4-2': [
    { y: 0.88, players: [0] },
    { y: 0.70, players: [1, 2, 3, 4] },
    { y: 0.46, players: [5, 6, 7, 8] },
    { y: 0.22, players: [9, 10] },
  ],
  '4-3-3': [
    { y: 0.88, players: [0] },
    { y: 0.70, players: [1, 2, 3, 4] },
    { y: 0.48, players: [5, 6, 7] },
    { y: 0.22, players: [8, 9, 10] },
  ],
  '4-2-3-1': [
    { y: 0.88, players: [0] },
    { y: 0.72, players: [1, 2, 3, 4] },
    { y: 0.56, players: [5, 6] },
    { y: 0.38, players: [7, 8, 9] },
    { y: 0.18, players: [10] },
  ],
};

function PlayerDot({ player }: { player: SquadPlayer }) {
  const posColor = POSITION_COLORS[player.position];
  return (
    <View style={s.playerContainer}>
      <View style={[s.playerCircle, { backgroundColor: posColor, borderColor: '#fff' }]}>
        <Text style={s.playerNumber}>{player.number}</Text>
      </View>
      <Text style={s.playerName} numberOfLines={1}>{player.name}</Text>
    </View>
  );
}

export default function PlantelScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const colors = theme.colors;
  const squad = getMockSquad(club?.slug ?? '');

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [s.backBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[s.headerTitle, { color: colors.text }]}>Plantel</Text>
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!squad ? (
          <View style={[s.emptyContainer, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
            <MaterialCommunityIcons name="account-group" size={48} color={colors.textTertiary} />
            <Text style={[s.emptyText, { color: colors.textSecondary }]}>Plantel no disponible</Text>
          </View>
        ) : (
          <>
            <View style={[s.coachCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
              <MaterialCommunityIcons name="whistle" size={20} color={colors.primary} />
              <View>
                <Text style={[s.coachLabel, { color: colors.textTertiary }]}>DIRECTOR TÉCNICO</Text>
                <Text style={[s.coachName, { color: colors.text }]}>{squad.coach}</Text>
              </View>
              <View style={[s.formationBadge, { backgroundColor: colors.primary + '20' }]}>
                <Text style={[s.formationText, { color: colors.primary }]}>{squad.name}</Text>
              </View>
            </View>

            <View style={s.pitchOuter}>
              <View style={s.pitch}>
                <View style={s.halfLine} />
                <View style={s.centerCircle} />
                <View style={s.centerDot} />
                <View style={s.penaltyAreaTop} />
                <View style={s.goalAreaTop} />
                <View style={s.penaltyArcTop} />
                <View style={s.penaltyAreaBottom} />
                <View style={s.goalAreaBottom} />
                <View style={s.penaltyArcBottom} />
                <View style={s.cornerTL} />
                <View style={s.cornerTR} />
                <View style={s.cornerBL} />
                <View style={s.cornerBR} />

                {(FORMATION_ROWS[squad.name] ?? FORMATION_ROWS['4-4-2']).map((row, rowIdx) => (
                  <View
                    key={rowIdx}
                    style={[s.playerRow, { top: `${row.y * 100}%` }]}
                  >
                    {row.players.map((pIdx) => (
                      <PlayerDot key={squad.startingEleven[pIdx].id} player={squad.startingEleven[pIdx]} />
                    ))}
                  </View>
                ))}
              </View>
            </View>

            <View style={s.legendRow}>
              {([
                { key: 'GK', label: 'Portero' },
                { key: 'DEF', label: 'Defensa' },
                { key: 'MID', label: 'Medio' },
                { key: 'FWD', label: 'Delantero' },
              ] as const).map((item) => (
                <View key={item.key} style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: POSITION_COLORS[item.key] }]} />
                  <Text style={[s.legendLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                </View>
              ))}
            </View>

            <Text style={[s.sectionTitle, { color: colors.text }]}>Suplentes</Text>
            <View style={s.subsGrid}>
              {squad.substitutes.map((player) => (
                <View
                  key={player.id}
                  style={[s.subCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
                >
                  <View style={[s.subNumber, { backgroundColor: POSITION_COLORS[player.position] + '25' }]}>
                    <Text style={[s.subNumberText, { color: POSITION_COLORS[player.position] }]}>{player.number}</Text>
                  </View>
                  <View style={s.subInfo}>
                    <Text style={[s.subName, { color: colors.text }]} numberOfLines={1}>{player.name}</Text>
                    <Text style={[s.subRole, { color: colors.textTertiary }]} numberOfLines={1}>{player.role}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const LINE_COLOR = 'rgba(255,255,255,0.35)';

const s = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    flex: 1,
  },
  headerSpacer: { width: 36 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 60,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  emptyText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  coachCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 16,
  },
  coachLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  coachName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    marginTop: 2,
  },
  formationBadge: {
    marginLeft: 'auto',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  formationText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 13,
  },
  pitchOuter: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pitch: {
    backgroundColor: '#2E7D32',
    aspectRatio: 0.68,
    width: '100%',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: LINE_COLOR,
    position: 'relative',
    overflow: 'hidden',
  },
  halfLine: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: LINE_COLOR,
  },
  centerCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 80,
    height: 80,
    marginLeft: -40,
    marginTop: -40,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: LINE_COLOR,
  },
  centerDot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 6,
    height: 6,
    marginLeft: -3,
    marginTop: -3,
    borderRadius: 3,
    backgroundColor: LINE_COLOR,
  },
  penaltyAreaTop: {
    position: 'absolute',
    top: 0,
    left: '20%',
    width: '60%',
    height: '16%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: LINE_COLOR,
  },
  goalAreaTop: {
    position: 'absolute',
    top: 0,
    left: '32%',
    width: '36%',
    height: '7%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: LINE_COLOR,
  },
  penaltyArcTop: {
    position: 'absolute',
    top: '16%',
    left: '50%',
    width: 60,
    height: 30,
    marginLeft: -30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: LINE_COLOR,
  },
  penaltyAreaBottom: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    width: '60%',
    height: '16%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: LINE_COLOR,
  },
  goalAreaBottom: {
    position: 'absolute',
    bottom: 0,
    left: '32%',
    width: '36%',
    height: '7%',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: LINE_COLOR,
  },
  penaltyArcBottom: {
    position: 'absolute',
    bottom: '16%',
    left: '50%',
    width: 60,
    height: 30,
    marginLeft: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: LINE_COLOR,
  },
  cornerTL: {
    position: 'absolute',
    top: -8,
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LINE_COLOR,
  },
  cornerTR: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LINE_COLOR,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -8,
    left: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LINE_COLOR,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: LINE_COLOR,
  },
  playerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    transform: [{ translateY: -30 }],
  },
  playerContainer: {
    alignItems: 'center',
    width: 60,
  },
  playerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 3,
    elevation: 4,
  },
  playerNumber: {
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
    color: '#fff',
  },
  playerName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    color: '#fff',
    marginTop: 3,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    marginBottom: 12,
  },
  subsGrid: {
    gap: 8,
  },
  subCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    gap: 12,
  },
  subNumber: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subNumberText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
  },
  subInfo: {
    flex: 1,
  },
  subName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  subRole: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    marginTop: 2,
  },
});
