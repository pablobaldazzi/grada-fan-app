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
import Colors from "@/constants/colors";
import { MOCK_MEMBER } from "@/lib/mock-data";

function MemberCard() {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/member-card-full");
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <LinearGradient
        colors={['#1a1a1a', '#111111', '#0a0a0a']}
        style={styles.card}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardLogo}>
            <MaterialCommunityIcons name="shield" size={28} color={Colors.primary} />
          </View>
          <View style={styles.cardHeaderRight}>
            <View style={styles.tierBadge}>
              <Ionicons name="star" size={10} color={Colors.gold} />
              <Text style={styles.tierText}>{MOCK_MEMBER.tier}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.roleLabel}>{MOCK_MEMBER.role}</Text>
          <Text style={styles.memberName}>{MOCK_MEMBER.name}</Text>
          <Text style={styles.memberNumber}>N {MOCK_MEMBER.memberNumber}</Text>
        </View>

        <View style={styles.cardDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>RUT</Text>
            <Text style={styles.detailValue}>{MOCK_MEMBER.rut}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Nacimiento</Text>
            <Text style={styles.detailValue}>{MOCK_MEMBER.birthDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Vencimiento</Text>
            <Text style={styles.detailValue}>{MOCK_MEMBER.expirationDate}</Text>
          </View>
        </View>

        <View style={styles.cardBarcode}>
          <View style={styles.barcodeArea}>
            {Array.from({ length: 30 }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.barcodeLine,
                  { width: Math.random() > 0.5 ? 3 : 1.5, opacity: 0.4 + Math.random() * 0.6 },
                ]}
              />
            ))}
          </View>
          <Text style={styles.barcodeNumber}>{MOCK_MEMBER.memberNumber}</Text>
        </View>

        <View style={styles.cardAccentLine} />
      </LinearGradient>
    </Pressable>
  );
}

function InfoRow({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;

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
        <Text style={styles.title}>Rangers ID</Text>
        <Text style={styles.subtitle}>Tu carnet digital de socio</Text>

        <MemberCard />

        <View style={styles.presentNotice}>
          <Ionicons name="information-circle" size={18} color={Colors.primary} />
          <Text style={styles.presentText}>
            Presenta este carnet para acceder a beneficios exclusivos y descuentos
          </Text>
        </View>

        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/member-card-full");
          }}
          style={({ pressed }) => [styles.fullscreenBtn, { opacity: pressed ? 0.85 : 1 }]}
        >
          <Ionicons name="expand" size={18} color={Colors.text} />
          <Text style={styles.fullscreenBtnText}>Ver pantalla completa</Text>
        </Pressable>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Informacion del socio</Text>
          <InfoRow icon="person" label="Nombre" value={MOCK_MEMBER.name} />
          <InfoRow icon="document-text" label="RUT" value={MOCK_MEMBER.rut} />
          <InfoRow icon="calendar" label="Fecha de nacimiento" value={MOCK_MEMBER.birthDate} />
          <InfoRow icon="ribbon" label="Tipo" value={`${MOCK_MEMBER.role} ${MOCK_MEMBER.tier}`} />
          <InfoRow icon="time" label="Vencimiento" value={MOCK_MEMBER.expirationDate} />
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
