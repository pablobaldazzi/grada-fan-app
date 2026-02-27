import React, { useEffect, useState } from "react";
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
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useClub } from "@/lib/contexts/ClubContext";
import {
  BENEFIT_CATEGORIES,
  NEWS_CATEGORIES,
  Benefit,
  Experience,
  NewsArticle,
  formatCLP,
  formatDate,
  getMockBenefits,
  getMockExperiences,
  getMockNews,
  getBenefitTierLabel,
  getBenefitTierColor,
} from "@/lib/mock-data";
import { TIER_CONFIG } from "@/lib/membership";

type MoreTab = "noticias" | "benefits" | "experiences";

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
          {(() => {
            const tierColor = getBenefitTierColor(benefit.requiredTier);
            const tierLabel = benefit.requiredTier === 'fan' ? 'Todos' : getBenefitTierLabel(benefit.requiredTier);
            const iconName = benefit.requiredTier === 'gold' ? 'crown' : benefit.requiredTier === 'silver' ? 'medal' : 'account-group';
            return (
              <View style={[styles.tierBadge, { backgroundColor: tierColor + '20' }]}>
                <MaterialCommunityIcons name={iconName as any} size={10} color={tierColor} />
                <Text style={[styles.tierBadgeText, { color: tierColor }]}>{tierLabel}</Text>
              </View>
            );
          })()}
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
            <View style={[styles.tierBadge, { backgroundColor: colors.gold + '20' }]}>
              <Ionicons name="star" size={9} color={colors.gold} />
              <Text style={[styles.tierBadgeText, { color: colors.gold }]}>Socios</Text>
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

const NEWS_CATEGORY_MAP: Record<string, NewsArticle["category"]> = {
  Resultados: "resultado",
  Fichajes: "fichaje",
  Institucional: "institucional",
  Cantera: "cantera",
  Comunidad: "comunidad",
};

const NEWS_CATEGORY_ICONS: Record<NewsArticle["category"], string> = {
  resultado: "football",
  fichaje: "person-add",
  institucional: "megaphone",
  cantera: "school",
  comunidad: "people",
};

const NEWS_CATEGORY_LABELS: Record<NewsArticle["category"], string> = {
  resultado: "Resultado",
  fichaje: "Fichaje",
  institucional: "Institucional",
  cantera: "Cantera",
  comunidad: "Comunidad",
};

function NewsCard({ article, colors }: { article: NewsArticle; colors: Record<string, string> }) {
  const icon = NEWS_CATEGORY_ICONS[article.category];
  const label = NEWS_CATEGORY_LABELS[article.category];
  const date = new Date(article.publishedAt);
  const timeStr = `${date.getDate()} ${["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"][date.getMonth()]}`;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/news-detail", params: { newsId: article.id } });
      }}
      style={({ pressed }) => [styles.newsCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder, opacity: pressed ? 0.85 : 1 }]}
    >
      <View style={[styles.newsIconArea, { backgroundColor: colors.primary + "15" }]}>
        <Ionicons name={icon as any} size={22} color={colors.primary} />
      </View>
      <View style={styles.newsContent}>
        <View style={styles.newsHeaderRow}>
          <Text style={[styles.newsCategoryLabel, { color: colors.primary }]}>{label}</Text>
          <Text style={[styles.newsDate, { color: colors.textTertiary }]}>{timeStr}</Text>
        </View>
        <Text style={[styles.newsTitle, { color: colors.text }]} numberOfLines={2}>{article.title}</Text>
        <Text style={[styles.newsSummary, { color: colors.textSecondary }]} numberOfLines={2}>{article.summary}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textTertiary} />
    </Pressable>
  );
}

function NewsSection({ colors }: { colors: Record<string, string> }) {
  const [selectedCat, setSelectedCat] = useState("Todas");
  const allNews = getMockNews();

  const filtered = selectedCat === "Todas"
    ? allNews
    : allNews.filter((n) => n.category === NEWS_CATEGORY_MAP[selectedCat]);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsContainer}
      >
        {NEWS_CATEGORIES.map((cat) => (
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
                { color: selectedCat === cat ? "#FFFFFF" : colors.textSecondary },
              ]}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {filtered.map((article) => (
        <NewsCard key={article.id} article={article} colors={colors} />
      ))}
    </>
  );
}

function BenefitsSection({ colors }: { colors: Record<string, string> }) {
  const [selectedCat, setSelectedCat] = useState("TODO");
  const { club } = useClub();
  const benefits = getMockBenefits(club?.slug ?? 'rangers');

  const filtered =
    selectedCat === "TODO" ? benefits : benefits.filter((b) => b.category === selectedCat);

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
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<MoreTab>((params.tab as MoreTab) || "noticias");
  const { club, theme, themeMode, setThemeMode } = useClub();
  const colors = theme.colors;
  const experiences = getMockExperiences(club?.slug ?? 'rangers');

  useEffect(() => {
    if (params.tab && (params.tab === "noticias" || params.tab === "benefits" || params.tab === "experiences")) {
      setActiveTab(params.tab);
    }
  }, [params.tab]);

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
          <View style={styles.settingRow}>
            <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={18} color={colors.primary} />
            <Text style={[styles.demoLabel, { color: colors.text }]}>Modo claro</Text>
          </View>
          <Switch
            value={themeMode === 'light'}
            onValueChange={(val) => setThemeMode(val ? 'light' : 'dark')}
            trackColor={{ false: colors.surfaceHighlight, true: colors.primary + "80" }}
            thumbColor={themeMode === 'light' ? colors.primary : colors.textTertiary}
          />
        </View>

        <View style={[styles.tabBar, { backgroundColor: colors.surface }]}>
          {([
            { key: "noticias", label: "Noticias", icon: "newspaper" },
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
                color={activeTab === t.key ? "#FFFFFF" : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabBtnText,
                  { color: activeTab === t.key ? "#FFFFFF" : colors.textSecondary },
                ]}
              >
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {activeTab === "noticias" && <NewsSection colors={colors} />}

        {activeTab === "benefits" && <BenefitsSection colors={colors} />}

        {activeTab === "experiences" &&
          experiences.map((exp) => <ExperienceCard key={exp.id} experience={exp} colors={colors} />)}
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
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
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
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tierBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 10,
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
    color: '#F39C12',
  },
  newsCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
  },
  newsIconArea: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  newsContent: { flex: 1 },
  newsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  newsCategoryLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  newsDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
  newsTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginBottom: 4,
  },
  newsSummary: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
});
