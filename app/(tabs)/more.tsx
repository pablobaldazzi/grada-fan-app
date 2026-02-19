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
import { useClub } from "@/lib/contexts/ClubContext";
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

function BenefitCard({ benefit, colors }: { benefit: Benefit; colors: Record<string, string> }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/benefit-detail", params: { benefitId: benefit.id } });
      }}
      style={({ pressed }) => [styles.benefitCard, { opacity: pressed ? 0.9 : 1, backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
    >
      <View style={styles.benefitLeft}>
        <View style={[styles.discountBadge, { backgroundColor: colors.primary + "20" }]}>
          <Text style={[styles.discountText, { color: colors.primary }]}>{benefit.discount}</Text>
        </View>
      </View>
      <View style={styles.benefitContent}>
        <View style={styles.benefitHeader}>
          <Text style={[styles.benefitPartner, { color: colors.textTertiary }]}>{benefit.partner}</Text>
          {benefit.membersOnly && (
            <View style={styles.memberOnlyBadge}>
              <Ionicons name="star" size={9} color={colors.gold} />
              <Text style={styles.memberOnlyText}>Socios</Text>
            </View>
          )}
        </View>
        <Text style={[styles.benefitTitle, { color: colors.text }]} numberOfLines={2}>
          {benefit.title}
        </Text>
        {benefit.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={colors.textTertiary} />
            <Text style={[styles.locationText, { color: colors.textSecondary }]} numberOfLines={1}>
              {benefit.location}
            </Text>
          </View>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

function ExperienceCard({ experience, colors }: { experience: Experience; colors: Record<string, string> }) {
  const spotsLow = experience.spotsRemaining <= 5;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/experience-detail", params: { experienceId: experience.id } });
      }}
      style={({ pressed }) => [styles.expCard, { opacity: pressed ? 0.9 : 1, backgroundColor: colors.surface, borderColor: colors.cardBorder }]}
    >
      <View style={[styles.expIconArea, { backgroundColor: colors.primary + "15" }]}>
        <MaterialCommunityIcons name="star-four-points" size={28} color={colors.primary} />
      </View>
      <View style={styles.expContent}>
        <View style={styles.expHeaderRow}>
          <Text style={[styles.expTitle, { color: colors.text }]} numberOfLines={1}>
            {experience.title}
          </Text>
          {experience.membersOnly && (
            <View style={styles.memberOnlyBadge}>
              <Ionicons name="star" size={9} color={colors.gold} />
              <Text style={styles.memberOnlyText}>Socios</Text>
            </View>
          )}
        </View>
        <View style={styles.expMetaRow}>
          <Text style={[styles.expMeta, { color: colors.textSecondary }]}>
            {formatDate(experience.date)} - {experience.time}
          </Text>
        </View>
        <View style={styles.expBottomRow}>
          <Text style={[styles.expPrice, { color: colors.primary }]}>{formatCLP(experience.price)}</Text>
          <Text style={[styles.expSpots, { color: colors.textTertiary }, spotsLow && styles.expSpotsLow]}>
            {experience.spotsRemaining} cupos
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

function BenefitsSection({ colors }: { colors: Record<string, string> }) {
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
            style={[
              styles.chip,
              { backgroundColor: selectedCat === cat ? colors.primary : colors.surfaceHighlight },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selectedCat === cat ? colors.text : colors.textSecondary },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {filtered.map((benefit) => (
        <BenefitCard key={benefit.id} benefit={benefit} colors={colors} />
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
  const { theme } = useClub();
  const colors = theme.colors;

  const handleDemoModeToggle = async (value: boolean) => {
    await setUseMockData(value);
    setUseDemoMode(value);
    queryClient.invalidateQueries();
  };

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
      >
        <Text style={[styles.title, { color: colors.text }]}>Mas</Text>

        <View style={[styles.demoRow, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.demoLabel, { color: colors.text }]}>Modo demo</Text>
          <Switch
            value={useDemoMode}
            onValueChange={handleDemoModeToggle}
            trackColor={{ false: colors.surfaceHighlight, true: colors.primary + "80" }}
            thumbColor={useDemoMode ? colors.primary : colors.textTertiary}
          />
        </View>

        <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
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
              style={[styles.tabBtn, activeTab === t.key && { backgroundColor: colors.primary }]}
            >
              <Ionicons
                name={t.icon}
                size={16}
                color={activeTab === t.key ? colors.text : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === t.key ? colors.text : colors.textSecondary },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "benefits" && <BenefitsSection colors={colors} />}

        {activeTab === "experiences" &&
          MOCK_EXPERIENCES.map((exp) => <ExperienceCard key={exp.id} experience={exp} colors={colors} />)}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
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
  tabBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  chipsContainer: { marginBottom: 16 },
  chips: { gap: 8 },
  chip: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  chipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
  },
  benefitCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
  },
  benefitLeft: { alignItems: "center" },
  discountBadge: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 56,
    alignItems: "center",
  },
  discountText: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
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
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  memberOnlyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFD70020",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  memberOnlyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
    color: "#FFD700",
  },
  benefitTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginBottom: 6,
  },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  locationText: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    flex: 1,
  },
  expCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
  },
  expIconArea: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  expContent: { flex: 1 },
  expHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  expTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    flex: 1,
  },
  expMetaRow: { marginTop: 4 },
  expMeta: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  expBottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 8 },
  expPrice: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  expSpots: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  expSpotsLow: {
    color: "#F39C12",
  },
});
