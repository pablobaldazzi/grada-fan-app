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
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Colors from "@/constants/colors";
import { MOCK_BENEFITS } from "@/lib/mock-data";

export default function BenefitDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { benefitId } = useLocalSearchParams<{ benefitId: string }>();
  const benefit = MOCK_BENEFITS.find(b => b.id === benefitId) || MOCK_BENEFITS[0];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Beneficio</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.discountArea}>
          <View style={styles.bigDiscount}>
            <Text style={styles.bigDiscountText}>{benefit.discount}</Text>
          </View>
          <Text style={styles.discountLabel}>DESCUENTO</Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.benefitTitle}>{benefit.title}</Text>

          {benefit.membersOnly && (
            <View style={styles.memberBadge}>
              <Ionicons name="star" size={12} color={Colors.gold} />
              <Text style={styles.memberBadgeText}>Exclusivo para socios</Text>
            </View>
          )}

          <Text style={styles.description}>{benefit.description}</Text>

          <View style={styles.detailRow}>
            <Ionicons name="business" size={18} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Comercio</Text>
              <Text style={styles.detailValue}>{benefit.partner}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Ionicons name="pricetag" size={18} color={Colors.primary} />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Categoria</Text>
              <Text style={styles.detailValue}>{benefit.category}</Text>
            </View>
          </View>

          {benefit.location && (
            <View style={styles.detailRow}>
              <Ionicons name="location" size={18} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Ubicacion</Text>
                <Text style={styles.detailValue}>{benefit.location}</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.rulesCard}>
          <Text style={styles.rulesTitle}>Condiciones de uso</Text>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.ruleText}>Presenta tu carnet de socio Rangers ID</Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.ruleText}>Valido en el local indicado</Text>
          </View>
          <View style={styles.ruleItem}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
            <Text style={styles.ruleText}>No acumulable con otras promociones</Text>
          </View>
        </View>
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
  discountArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bigDiscount: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bigDiscountText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.primary,
  },
  discountLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
    color: Colors.textTertiary,
    letterSpacing: 2,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  benefitTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
    marginBottom: 12,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold + '15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  memberBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gold,
  },
  description: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  detailContent: { flex: 1 },
  detailLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textTertiary,
  },
  detailValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  rulesCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
  },
  rulesTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
    marginBottom: 14,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  ruleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
  },
});
