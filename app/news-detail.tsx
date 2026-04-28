import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useClub } from "@/lib/contexts/ClubContext";
import { fetchClubNewsArticle } from "@/lib/api";
import { NEWS_CATEGORY_ICONS, NEWS_CATEGORY_LABELS, formatFullNewsDate } from "@/lib/news";
import type { NewsArticle } from "@/lib/schemas";

function findCachedArticle(
  queryClient: ReturnType<typeof useQueryClient>,
  slug: string | undefined,
  articleId: string | undefined,
): NewsArticle | undefined {
  if (!slug || !articleId) return undefined;
  const cachedQueries = queryClient.getQueriesData<{ items?: NewsArticle[] }>({
    queryKey: ["club-news", slug],
  });
  for (const [, data] of cachedQueries) {
    const match = data?.items?.find((item) => item.id === articleId);
    if (match) return match;
  }
  return undefined;
}

export default function NewsDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { newsId } = useLocalSearchParams<{ newsId: string }>();
  const { club, theme } = useClub();
  const queryClient = useQueryClient();
  const colors = theme.colors;

  const { data: article, isLoading, isError } = useQuery({
    queryKey: ["club-news", club?.slug, "detail", newsId],
    queryFn: () => fetchClubNewsArticle(club!.slug, newsId),
    enabled: !!club?.slug && !!newsId,
    initialData: () => findCachedArticle(queryClient, club?.slug, newsId),
  });

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
        {isLoading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>Cargando noticia...</Text>
          </View>
        ) : isError || !article ? (
          <View style={styles.stateBox}>
            <Ionicons name="alert-circle-outline" size={24} color={colors.textTertiary} />
            <Text style={[styles.stateTitle, { color: colors.text }]}>Noticia no disponible</Text>
            <Text style={[styles.stateText, { color: colors.textSecondary }]}>
              Esta noticia no existe o ya no está publicada para este club.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.categoryBadge, { backgroundColor: colors.primary + "15" }]}>
              <Ionicons name={NEWS_CATEGORY_ICONS[article.category] as any} size={14} color={colors.primary} />
              <Text style={[styles.categoryText, { color: colors.primary }]}>
                {NEWS_CATEGORY_LABELS[article.category]}
              </Text>
            </View>

            <Text style={[styles.title, { color: colors.text }]}>{article.title}</Text>

            <View style={styles.metaRow}>
              {article.author ? (
                <View style={styles.metaItem}>
                  <Ionicons name="person-outline" size={13} color={colors.textTertiary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>{article.author}</Text>
                </View>
              ) : null}
              {article.publishedAt ? (
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={13} color={colors.textTertiary} />
                  <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                    {formatFullNewsDate(article.publishedAt)}
                  </Text>
                </View>
              ) : null}
            </View>

            <View style={[styles.divider, { backgroundColor: colors.divider }]} />

            <Text style={[styles.summary, { color: colors.text }]}>{article.summary}</Text>

            {article.body.split("\n\n").map((paragraph, i) => (
              <Text key={i} style={[styles.bodyParagraph, { color: colors.textSecondary }]}>
                {paragraph}
              </Text>
            ))}
          </>
        )}
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
  stateBox: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 40,
  },
  stateTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
  },
  stateText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
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
