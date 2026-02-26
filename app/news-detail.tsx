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
import { useClub } from "@/lib/contexts/ClubContext";
import { getMockNews, type NewsArticle } from "@/lib/mock-data";

const CATEGORY_LABELS: Record<NewsArticle["category"], string> = {
  resultado: "Resultado",
  fichaje: "Fichaje",
  institucional: "Institucional",
  cantera: "Cantera",
  comunidad: "Comunidad",
};

const CATEGORY_ICONS: Record<NewsArticle["category"], string> = {
  resultado: "football",
  fichaje: "person-add",
  institucional: "megaphone",
  cantera: "school",
  comunidad: "people",
};

function formatFullDate(dateStr: string): string {
  const date = new Date(dateStr);
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${days[date.getDay()]} ${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

export default function NewsDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const { theme } = useClub();
  const colors = theme.colors;

  const allNews = getMockNews();
  const article = allNews.find((n) => n.id === newsId) ?? allNews[0];
  const categoryLabel = CATEGORY_LABELS[article.category];
  const categoryIcon = CATEGORY_ICONS[article.category];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.backBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Noticia</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name={categoryIcon as any} size={14} color={colors.primary} />
          <Text style={[styles.categoryText, { color: colors.primary }]}>{categoryLabel}</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

        <View style={styles.metaRow}>
          {article.author ? (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={13} color={colors.textTertiary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>{article.author}</Text>
            </View>
          ) : null}
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.textTertiary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formatFullDate(article.publishedAt)}</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.divider }]} />

        <Text style={[styles.summary, { color: colors.text }]}>{article.summary}</Text>

        {article.body.split("\n\n").map((paragraph, i) => (
          <Text key={i} style={[styles.bodyParagraph, { color: colors.textSecondary }]}>
            {paragraph}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  scrollContent: { paddingHorizontal: 16 },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
  },
  categoryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 16,
  },
  metaRow: {
    gap: 12,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  summary: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  bodyParagraph: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
});
