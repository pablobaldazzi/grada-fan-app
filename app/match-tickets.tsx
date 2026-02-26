import React, { useState } from "react";
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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useClub } from "@/lib/contexts/ClubContext";
import { getClubLogo, parseMatchTeams, getTeamSlug } from "@/lib/club-logos";
import { formatCLP, formatDate, formatTime } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { TIER_CONFIG, type MembershipTier } from "@/lib/membership";

const TIER_DISCOUNT: Record<MembershipTier, number> = { gold: 0.20, silver: 0.10, fan: 0 };

function applyDiscount(price: number, tier: MembershipTier): number {
  return Math.round(price * (1 - TIER_DISCOUNT[tier]));
}

const SEATS_PER_ROW = 12;
const NUM_ROWS = 8;

type SeatState = 'available' | 'taken' | 'selected';

function generateSeats(): SeatState[][] {
  return Array.from({ length: NUM_ROWS }, () =>
    Array.from({ length: SEATS_PER_ROW }, () =>
      Math.random() > 0.3 ? 'available' : 'taken'
    )
  );
}

function SeatDot({ state, onPress, colors }: { state: SeatState; onPress: () => void; colors: Record<string, string> }) {
  const color = state === 'selected' ? colors.primary :
    state === 'taken' ? colors.surfaceHighlight : colors.textTertiary;

  return (
    <Pressable
      onPress={state !== 'taken' ? onPress : undefined}
      style={[styles.seat, { backgroundColor: color }]}
    />
  );
}

export default function MatchTicketsScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const { club, theme } = useClub();
  const colors = theme.colors;
  const event = club?.events?.find((e) => e.id === matchId) ?? null;
  const { addItem } = useCart();

  const [step, setStep] = useState<'type' | 'seats' | 'confirm'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [seats, setSeats] = useState(() => generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const ticketTypes = event?.ticketTypes ?? [];
  const ticketType = ticketTypes.find((t) => t.id === selectedType);

  const toggleSeat = (row: number, col: number) => {
    const key = `${row}-${col}`;
    if (selectedSeats.includes(key)) {
      setSelectedSeats(prev => prev.filter(s => s !== key));
      const newSeats = [...seats];
      newSeats[row] = [...newSeats[row]];
      newSeats[row][col] = 'available';
      setSeats(newSeats);
    } else {
      setSelectedSeats(prev => [...prev, key]);
      const newSeats = [...seats];
      newSeats[row] = [...newSeats[row]];
      newSeats[row][col] = 'selected';
      setSeats(newSeats);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleAddToCart = () => {
    if (!ticketType || !event) return;
    const qty = Math.max(1, selectedSeats.length);
    addItem({
      id: `ticket-${event.id}-${ticketType.id}-${Date.now()}`,
      type: 'ticket',
      name: `${ticketType.name} - ${event.name}`,
      price: ticketType.price,
      quantity: qty,
      details: event.venue ? `${formatDate(event.datetime)} - ${event.venue}` : formatDate(event.datetime),
      refId: ticketType.id,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/cart");
  };

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>Evento no encontrado</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {step === 'type' ? 'Seleccionar Zona' : step === 'seats' ? 'Elegir Asientos' : 'Confirmar'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.matchSummary, { backgroundColor: colors.surface }]}>
          <View style={styles.matchSummaryTeams}>
            {(() => {
              const hasApiTeams = !!(event.homeTeam || event.awayTeam);
              const parsed = !hasApiTeams ? parseMatchTeams(event.name) : null;
              const homeLogoUrl = event.homeTeam?.logoUrl;
              const awayLogoUrl = event.awayTeam?.logoUrl;
              const homeSlug = event.homeTeam?.slug ?? (parsed ? getTeamSlug(parsed.home) : club?.slug);
              const awaySlug = event.awayTeam?.slug ?? (parsed ? getTeamSlug(parsed.away) : club?.slug);
              return (
                <>
                  {homeLogoUrl
                    ? <Image source={{ uri: homeLogoUrl }} style={styles.matchSummaryLogo} resizeMode="contain" />
                    : <Image source={getClubLogo(homeSlug)} style={styles.matchSummaryLogo} resizeMode="contain" />}
                  <Text style={[styles.matchSummaryText, { color: colors.text }]} numberOfLines={2}>{event.name}</Text>
                  {awayLogoUrl
                    ? <Image source={{ uri: awayLogoUrl }} style={styles.matchSummaryLogo} resizeMode="contain" />
                    : <Image source={getClubLogo(awaySlug)} style={styles.matchSummaryLogo} resizeMode="contain" />}
                </>
              );
            })()}
          </View>
          <Text style={[styles.matchSummaryMeta, { color: colors.textSecondary }]}>
            {formatDate(event.datetime)} - {formatTime(event.datetime)} - {event.venue ?? ''}
          </Text>
        </View>

        {step === 'type' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Zonas disponibles</Text>
            {ticketTypes.map((tt) => (
              <Pressable
                key={tt.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedType(tt.id);
                }}
                style={[
                  styles.typeCard,
                  { backgroundColor: colors.surface },
                  selectedType === tt.id && [styles.typeCardSelected, { borderColor: colors.primary }],
                ]}
              >
                <View style={styles.typeInfo}>
                  <Text style={[styles.typeName, { color: colors.text }]}>{tt.name}</Text>
                  <Text style={[styles.typeAvail, { color: colors.textSecondary }]}>{(tt.capacity ?? 0) - (tt.sold ?? 0)} disponibles</Text>
                  <View style={styles.typeTierPrices}>
                    {(['gold', 'silver', 'fan'] as const).map((tier) => {
                      const discounted = applyDiscount(tt.price, tier);
                      const cfg = TIER_CONFIG[tier];
                      return (
                        <View key={tier} style={[styles.typeTierItem, { backgroundColor: cfg.color + '12' }]}>
                          <Text style={[styles.typeTierLabel, { color: cfg.color }]}>{cfg.name}</Text>
                          <Text style={[styles.typeTierValue, { color: cfg.color }]}>{formatCLP(discounted)}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
                <View style={styles.typeRight}>
                  <View style={[
                    styles.typeRadio,
                    { borderColor: colors.divider },
                    selectedType === tt.id && [styles.typeRadioSelected, { borderColor: colors.primary }],
                  ]}>
                    {selectedType === tt.id && <View style={[styles.typeRadioDot, { backgroundColor: colors.primary }]} />}
                  </View>
                </View>
              </Pressable>
            ))}
            {selectedType && (
              <Pressable
                onPress={() => setStep('seats')}
                style={[styles.continueBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.continueBtnText, { color: colors.text }]}>Seleccionar Asientos</Text>
                <Ionicons name="arrow-forward" size={18} color={colors.text} />
              </Pressable>
            )}
          </>
        )}

        {step === 'seats' && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{ticketType?.name}</Text>

            <View style={styles.seatLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.textTertiary }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Disponible</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Seleccionado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.surfaceHighlight }]} />
                <Text style={[styles.legendText, { color: colors.text }]}>Ocupado</Text>
              </View>
            </View>

            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="soccer-field" size={20} color={colors.textTertiary} />
              <Text style={[styles.fieldText, { color: colors.textTertiary }]}>CANCHA</Text>
            </View>

            <View style={styles.seatMap}>
              {seats.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.seatRow}>
                  <Text style={styles.rowLabel}>{rowIdx + 1}</Text>
                  {row.map((state, colIdx) => (
                    <SeatDot
                      key={colIdx}
                      state={state}
                      onPress={() => toggleSeat(rowIdx, colIdx)}
                      colors={colors}
                    />
                  ))}
                  <Text style={styles.rowLabel}>{rowIdx + 1}</Text>
                </View>
              ))}
            </View>

            <Text style={styles.selectedCount}>
              {selectedSeats.length} asiento{selectedSeats.length !== 1 ? 's' : ''} seleccionado{selectedSeats.length !== 1 ? 's' : ''}
            </Text>

            <View style={styles.stepBtns}>
              <Pressable onPress={() => setStep('type')} style={styles.backStepBtn}>
                <Text style={styles.backStepBtnText}>Volver</Text>
              </Pressable>
              {selectedSeats.length > 0 && (
                <Pressable onPress={() => setStep('confirm')} style={styles.continueBtn}>
                  <Text style={styles.continueBtnText}>Continuar</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.text} />
                </Pressable>
              )}
            </View>
          </>
        )}

        {step === 'confirm' && ticketType && (
          <>
            <Text style={styles.sectionTitle}>Resumen</Text>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Zona</Text>
              <Text style={styles.confirmValue}>{ticketType.name}</Text>
            </View>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Asientos</Text>
              <Text style={styles.confirmValue}>
                {selectedSeats.map(s => {
                  const [r, c] = s.split('-').map(Number);
                  return `F${r + 1}-A${c + 1}`;
                }).join(', ')}
              </Text>
            </View>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Cantidad</Text>
              <Text style={styles.confirmValue}>{selectedSeats.length}</Text>
            </View>
            <View style={styles.confirmCard}>
              <Text style={styles.confirmLabel}>Total</Text>
              <Text style={[styles.confirmValue, { color: colors.primary }]}>
                {formatCLP(ticketType.price * selectedSeats.length)}
              </Text>
            </View>

            <View style={styles.stepBtns}>
              <Pressable onPress={() => setStep('seats')} style={styles.backStepBtn}>
                <Text style={styles.backStepBtnText}>Volver</Text>
              </Pressable>
              <Pressable onPress={handleAddToCart} style={styles.continueBtn}>
                <Ionicons name="bag-add" size={18} color={colors.text} />
                <Text style={styles.continueBtnText}>Agregar al carrito</Text>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  matchSummary: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  matchSummaryTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  matchSummaryLogo: {
    width: 24,
    height: 24,
  },
  matchSummaryText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  matchSummaryMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 14,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  typeCardSelected: {
    borderColor: Colors.primary,
  },
  typeInfo: { flex: 1, gap: 4 },
  typeName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  typeAvail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  typeTierPrices: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  typeTierItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  typeTierLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    textTransform: 'uppercase',
  },
  typeTierValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 11,
  },
  typeRight: { alignItems: 'flex-end', justifyContent: 'center' },
  typeRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeRadioSelected: {
    borderColor: Colors.primary,
  },
  typeRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  continueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    flex: 1,
  },
  continueBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  seatLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textSecondary,
  },
  fieldLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 12,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  fieldText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  seatMap: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    gap: 6,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textTertiary,
    width: 14,
    textAlign: 'center',
  },
  seat: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  selectedCount: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 12,
  },
  stepBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  backStepBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  backStepBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.textSecondary,
  },
  confirmCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  confirmLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  confirmValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    maxWidth: '60%' as any,
    textAlign: 'right',
  },
});
