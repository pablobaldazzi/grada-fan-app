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
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { MOCK_MATCHES, MOCK_TICKET_TYPES, formatCLP, formatDate } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

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

function SeatDot({ state, onPress }: { state: SeatState; onPress: () => void }) {
  const color = state === 'selected' ? Colors.primary :
    state === 'taken' ? Colors.surfaceHighlight : Colors.textTertiary;

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
  const match = MOCK_MATCHES.find(m => m.id === matchId) || MOCK_MATCHES[0];
  const { addItem } = useCart();

  const [step, setStep] = useState<'type' | 'seats' | 'confirm'>('type');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [seats, setSeats] = useState(() => generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const ticketType = MOCK_TICKET_TYPES.find(t => t.id === selectedType);

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
    if (!ticketType) return;
    selectedSeats.forEach((seatKey, i) => {
      const [row, col] = seatKey.split('-').map(Number);
      addItem({
        id: `ticket-${match.id}-${seatKey}-${Date.now()}`,
        type: 'ticket',
        name: `${ticketType.name} - ${match.homeTeam} vs ${match.awayTeam}`,
        price: ticketType.price,
        quantity: 1,
        details: `Fila ${row + 1}, Asiento ${col + 1} - ${formatDate(match.date)}`,
      });
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>
          {step === 'type' ? 'Seleccionar Zona' : step === 'seats' ? 'Elegir Asientos' : 'Confirmar'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.matchSummary}>
          <View style={styles.matchSummaryTeams}>
            <MaterialCommunityIcons name="shield" size={24} color={Colors.primary} />
            <Text style={styles.matchSummaryText}>
              {match.homeTeam} vs {match.awayTeam}
            </Text>
            <MaterialCommunityIcons name="shield-outline" size={24} color={Colors.textSecondary} />
          </View>
          <Text style={styles.matchSummaryMeta}>
            {formatDate(match.date)} - {match.time} - {match.venue}
          </Text>
        </View>

        {step === 'type' && (
          <>
            <Text style={styles.sectionTitle}>Zonas disponibles</Text>
            {MOCK_TICKET_TYPES.map(tt => (
              <Pressable
                key={tt.id}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedType(tt.id);
                }}
                style={[
                  styles.typeCard,
                  selectedType === tt.id && styles.typeCardSelected,
                ]}
              >
                <View style={styles.typeInfo}>
                  <Text style={styles.typeName}>{tt.name}</Text>
                  <Text style={styles.typeAvail}>{tt.available} disponibles</Text>
                </View>
                <View style={styles.typeRight}>
                  <Text style={styles.typePrice}>{formatCLP(tt.price)}</Text>
                  <View style={[
                    styles.typeRadio,
                    selectedType === tt.id && styles.typeRadioSelected,
                  ]}>
                    {selectedType === tt.id && <View style={styles.typeRadioDot} />}
                  </View>
                </View>
              </Pressable>
            ))}
            {selectedType && (
              <Pressable
                onPress={() => setStep('seats')}
                style={styles.continueBtn}
              >
                <Text style={styles.continueBtnText}>Seleccionar Asientos</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.text} />
              </Pressable>
            )}
          </>
        )}

        {step === 'seats' && (
          <>
            <Text style={styles.sectionTitle}>{ticketType?.name}</Text>

            <View style={styles.seatLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.textTertiary }]} />
                <Text style={styles.legendText}>Disponible</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
                <Text style={styles.legendText}>Seleccionado</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.surfaceHighlight }]} />
                <Text style={styles.legendText}>Ocupado</Text>
              </View>
            </View>

            <View style={styles.fieldLabel}>
              <MaterialCommunityIcons name="soccer-field" size={20} color={Colors.textTertiary} />
              <Text style={styles.fieldText}>CANCHA</Text>
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
                  <Ionicons name="arrow-forward" size={18} color={Colors.text} />
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
              <Text style={[styles.confirmValue, { color: Colors.primary }]}>
                {formatCLP(ticketType.price * selectedSeats.length)}
              </Text>
            </View>

            <View style={styles.stepBtns}>
              <Pressable onPress={() => setStep('seats')} style={styles.backStepBtn}>
                <Text style={styles.backStepBtnText}>Volver</Text>
              </Pressable>
              <Pressable onPress={handleAddToCart} style={styles.continueBtn}>
                <Ionicons name="bag-add" size={18} color={Colors.text} />
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
  typeInfo: { flex: 1 },
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
  typeRight: { alignItems: 'flex-end', gap: 8 },
  typePrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.primary,
  },
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
