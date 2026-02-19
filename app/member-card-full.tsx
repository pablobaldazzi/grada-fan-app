import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";

function displayName(fan: { name?: string | null; firstName?: string | null; lastName?: string | null } | null): string {
  if (!fan) return 'Socio';
  if (fan.name) return fan.name;
  const first = fan.firstName ?? '';
  const last = fan.lastName ?? '';
  return [first, last].filter(Boolean).join(' ') || 'Socio';
}

export default function MemberCardFullScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const { fan } = useClerkAuth();
  const colors = theme.colors;
  const name = displayName(fan);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.cardWrapper}>
        <LinearGradient colors={['#1a1a1a', '#111111', '#0a0a0a']} style={styles.card}>
          <View style={[styles.cardAccent, { backgroundColor: colors.primary }]} />

          <View style={styles.cardTop}>
            <View style={styles.logoArea}>
              <MaterialCommunityIcons name="shield" size={36} color={colors.primary} />
              <View>
                <Text style={[styles.clubName, { color: colors.text }]}>{club?.name ?? 'Club'}</Text>
                <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Carnet Digital</Text>
              </View>
            </View>
          </View>

          <View style={styles.cardCenter}>
            <Text style={[styles.roleLabel, { color: colors.textTertiary }]}>Socio</Text>
            <Text style={[styles.memberName, { color: colors.text }]}>{name}</Text>
            {fan?.email ? <Text style={[styles.memberNumber, { color: colors.textSecondary }]}>{fan.email}</Text> : null}
          </View>

          <View style={styles.detailsGrid}>
            {fan?.phone ? (
              <View style={styles.detailCol}>
                <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>TELEFONO</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{fan.phone}</Text>
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </View>

      <View style={[styles.presentNotice, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name="shield-checkmark" size={20} color={colors.primary} />
        <Text style={[styles.presentText, { color: colors.textSecondary }]}>
          Presenta este carnet para acceder a beneficios exclusivos
        </Text>
      </View>

      <View style={[styles.brightnessNote, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Ionicons name="sunny" size={16} color={colors.textTertiary} />
        <Text style={[styles.brightnessText, { color: colors.textTertiary }]}>Brillo al maximo para mejor lectura</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: Colors.primary,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  logoArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  clubName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  cardLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textTertiary,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tierText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gold,
  },
  cardCenter: {
    marginBottom: 24,
  },
  roleLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  memberName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.text,
    marginBottom: 4,
  },
  memberNumber: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginBottom: 24,
  },
  detailCol: { flex: 1 },
  detailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 9,
    color: Colors.textTertiary,
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 13,
    color: Colors.text,
  },
  barcodeSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  barcodeStrips: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  strip: {
    backgroundColor: Colors.text,
    borderRadius: 0.5,
  },
  barcodeId: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textTertiary,
    letterSpacing: 3,
  },
  presentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  presentText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  brightnessNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
  },
  brightnessText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
