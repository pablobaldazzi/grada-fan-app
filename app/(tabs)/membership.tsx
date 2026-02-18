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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useClub } from "@/lib/contexts/ClubContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import Colors from "@/constants/colors";

function displayName(fan: { name?: string | null; firstName?: string | null; lastName?: string | null } | null): string {
  if (!fan) return 'Socio';
  if (fan.name) return fan.name;
  const first = fan.firstName ?? '';
  const last = fan.lastName ?? '';
  return [first, last].filter(Boolean).join(' ') || 'Socio';
}

function MemberCard({ colors }: { colors: Record<string, string> }) {
  const { fan } = useAuth();
  const name = displayName(fan);

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/member-card-full");
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <LinearGradient colors={['#1a1a1a', '#111111', '#0a0a0a']} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardLogo, { backgroundColor: colors.primary + '15' }]}>
            <MaterialCommunityIcons name="shield" size={28} color={colors.primary} />
          </View>
        </View>
        <View style={styles.cardBody}>
          <Text style={[styles.roleLabel, { color: colors.textTertiary }]}>Socio</Text>
          <Text style={[styles.memberName, { color: colors.text }]}>{name}</Text>
          {fan?.email ? <Text style={[styles.memberNumber, { color: colors.textSecondary }]}>{fan.email}</Text> : null}
        </View>
        <View style={styles.cardAccentLine} />
      </LinearGradient>
    </Pressable>
  );
}

function InfoRow({ icon, label, value, colors }: { icon: any; label: string; value: string; colors: Record<string, string> }) {
  return (
    <View style={[styles.infoRow, { backgroundColor: colors.surface }]}>
      <View style={[styles.infoIcon, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: colors.text }]}>{value}</Text>
      </View>
    </View>
  );
}

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const { fan } = useAuth();
  const colors = theme.colors;
  const name = displayName(fan);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <Text style={[styles.title, { color: colors.text }]}>{club?.name ?? 'Club'} ID</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tu carnet digital de socio</Text>

        <MemberCard colors={colors} />

        <View style={[styles.presentNotice, { backgroundColor: colors.primary + '10' }]}>
          <Ionicons name="information-circle" size={18} color={colors.primary} />
          <Text style={[styles.presentText, { color: colors.textSecondary }]}>
            Presenta este carnet para acceder a beneficios exclusivos y descuentos
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/member-card-full");
          }}
          style={({ pressed }) => [styles.fullscreenBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.85 : 1 }]}
        >
          <Ionicons name="expand" size={18} color={colors.text} />
          <Text style={[styles.fullscreenBtnText, { color: colors.text }]}>Ver pantalla completa</Text>
        </Pressable>

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informacion del socio</Text>
          <InfoRow icon="person" label="Nombre" value={name} colors={colors} />
          {fan?.email ? <InfoRow icon="mail" label="Email" value={fan.email} colors={colors} /> : null}
          {fan?.phone ? <InfoRow icon="call" label="Telefono" value={fan.phone} colors={colors} /> : null}
        </View>
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
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderRight: { flexDirection: 'row', gap: 8 },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.gold + '20',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.gold,
  },
  cardBody: { marginBottom: 20 },
  roleLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 4,
  },
  memberName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.text,
    marginBottom: 4,
  },
  memberNumber: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  cardDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  detailItem: { flex: 1 },
  detailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.text,
  },
  cardBarcode: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  barcodeArea: {
    flexDirection: 'row',
    gap: 2,
    height: 50,
    alignItems: 'center',
    marginBottom: 6,
  },
  barcodeLine: {
    height: 40,
    backgroundColor: Colors.text,
    borderRadius: 0.5,
  },
  barcodeNumber: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  cardAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: Colors.primary,
  },
  presentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: Colors.primary + '10',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  presentText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  fullscreenBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 12,
  },
  fullscreenBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  infoSection: { marginTop: 24 },
  sectionTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.text,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textTertiary,
  },
  infoValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
});
