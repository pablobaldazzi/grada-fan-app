import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useQueryClient } from "@tanstack/react-query";
import Colors from "@/constants/colors";
import {
  MOCK_BENEFITS,
  MOCK_EXPERIENCES,
  BENEFIT_CATEGORIES,
  Benefit,
  Experience,
  formatCLP,
  formatDate,
} from "@/lib/mock-data";
import { getUseMockData, setUseMockData } from "@/lib/demo-mode";

type MoreTab = "benefits" | "experiences";

function BenefitCard({ benefit }: { benefit: Benefit }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/benefit-detail", params: { benefitId: benefit.id } });
      }}
      style={({ pressed }) => [styles.benefitCard, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.benefitLeft}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{benefit.discount}</Text>
        </View>
      </View>
      <View style={styles.benefitContent}>
        <View style={styles.benefitHeader}>
          <Text style={styles.benefitPartner}>{benefit.partner}</Text>
          {benefit.membersOnly && (
            <View style={styles.memberOnlyBadge}>
              <Ionicons name="star" size={9} color={Colors.gold} />
              <Text style={styles.memberOnlyText}>Socios</Text>
            </View>
          )}
        </View>
        <Text style={styles.benefitTitle} numberOfLines={2}>
          {benefit.title}
        </Text>
        {benefit.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.locationText} numberOfLines={1}>
              {benefit.location}
            </Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
    </Pressable>
  );
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const spotsLow = experience.spotsRemaining <= 5;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/experience-detail", params: { experienceId: experience.id } });
      }}
      style={({ pressed }) => [styles.expCard, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.expIconArea}>
        <MaterialCommunityIcons name="star-four-points" size={28} color={Colors.primary} />
      </View>
      <View style={styles.expContent}>
        <View style={styles.expHeaderRow}>
          <Text style={styles.expTitle} numberOfLines={1}>
            {experience.title}
          </Text>
          {experience.membersOnly && (
            <View style={styles.memberOnlyBadge}>
              <Ionicons name="star" size={9} color={Colors.gold} />
              <Text style={styles.memberOnlyText}>Socios</Text>
            </View>
          )}
        </View>
        <View style={styles.expMetaRow}>
          <Text style={styles.expMeta}>
            {formatDate(experience.date)} - {experience.time}
          </Text>
        </View>
        <View style={styles.expBottomRow}>
          <Text style={styles.expPrice}>{formatCLP(experience.price)}</Text>
          <Text style={[styles.expSpots, spotsLow && styles.expSpotsLow]}>
            {experience.spotsRemaining} cupos
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function BenefitsSection() {
  const [selectedCat, setSelectedCat] = useState("TODO");

  const filtered =
    selectedCat === "TODO" ? MOCK_BENEFITS : MOCK_BENEFITS.filter((b) => b.category === selectedCat);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsContainer}
      >
        {BENEFIT_CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => {
              Haptics.selectionAsync();
              setSelectedCat(cat);
            }}
            style={[styles.chip, selectedCat === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>{cat}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {filtered.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} />
      ))}
    </>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [activeTab, setActiveTab] = useState<MoreTab>("benefits");
  const [useDemoMode, setUseDemoMode] = useState(getUseMockData);
  const queryClient = useQueryClient();

  const handleDemoModeToggle = async (value: boolean) => {
    await setUseMockData(value);
    setUseDemoMode(value);
    queryClient.invalidateQueries();
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        // We already apply safe-area top padding manually; avoid double inset on iOS
        contentInsetAdjustmentBehavior="never"
      >
        <Text style={styles.title}>Mas</Text>

        <View style={[styles.demoRow, { backgroundColor: Colors.surface, borderColor: Colors.cardBorder }]}>
          <Text style={[styles.demoLabel, { color: Colors.text }]}>Modo demo</Text>
          <Switch
            value={useDemoMode}
            onValueChange={handleDemoModeToggle}
            trackColor={{ false: Colors.surfaceHighlight, true: Colors.primary + "80" }}
            thumbColor={useDemoMode ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.tabBar}>
          {([
            { key: "benefits", label: "Beneficios", icon: "pricetag" },
            { key: "experiences", label: "Experiencias", icon: "sparkles" },
          ] as const).map((t) => (
            <Pressable
              key={t.key}
              onPress={() => {
                Haptics.selectionAsync();
                setActiveTab(t.key);
              }}
              style={[styles.tabBtn, activeTab === t.key && styles.tabBtnActive]}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={activeTab === t.key ? Colors.text : Colors.textSecondary}
              />
              <Text style={[styles.tabBtnText, activeTab === t.key && styles.tabBtnTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "benefits" && <BenefitsSection />}

        {activeTab === "experiences" &&
          MOCK_EXPERIENCES.map((exp) => <ExperienceCard key={exp.id} experience={exp} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 16 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
    marginBottom: 16,
  },
  demoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  demoLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.text,
  },
  chipsContainer: { marginBottom: 16 },
  chips: { gap: 8 },
  chip: {
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.text },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  benefitLeft: { alignItems: "center" },
  discountBadge: {
    backgroundColor: Colors.primary + "20",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 56,
    alignItems: "center",
  },
  discountText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    color: Colors.primary,
  },
  benefitContent: { flex: 1 },
  benefitHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  benefitPartner: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  memberOnlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.gold + "20",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  memberOnlyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: Colors.gold,
  },
  benefitTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    flex: 1,
  },
  expCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  expIconArea: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  expContent: { flex: 1 },
  expHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  expTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
    flex: 1,
  },
  expMetaRow: { marginTop: 4 },
  expMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  expPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.primary,
  },
  expSpots: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textTertiary,
  },
  expSpotsLow: {
    color: Colors.warning,
  },
});
