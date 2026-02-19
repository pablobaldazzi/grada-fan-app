import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Colors from "@/constants/colors";
import {
  MOCK_BENEFITS,
  MOCK_EXPERIENCES,
  BENEFIT_CATEGORIES,
  Benefit,
  Experience,
  formatCLP,
  formatDate,
  timeAgo,
} from "@/lib/mock-data";
import { useAuth } from "@/lib/contexts/AuthContext";
import { getUseMockData, setUseMockData } from "@/lib/demo-mode";
import { fetchNotifications, markNotificationRead } from "@/lib/api";
import type { AppNotification } from "@/lib/schemas";

type MoreTab = 'benefits' | 'experiences' | 'notifications';

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
        <Text style={styles.benefitTitle} numberOfLines={2}>{benefit.title}</Text>
        {benefit.location && (
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={12} color={Colors.textTertiary} />
            <Text style={styles.locationText} numberOfLines={1}>{benefit.location}</Text>
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
          <Text style={styles.expTitle} numberOfLines={1}>{experience.title}</Text>
          {experience.membersOnly && (
            <View style={styles.memberOnlyBadge}>
              <Ionicons name="star" size={9} color={Colors.gold} />
              <Text style={styles.memberOnlyText}>Socios</Text>
            </View>
          )}
        </View>
        <View style={styles.expMetaRow}>
          <Text style={styles.expMeta}>{formatDate(experience.date)} - {experience.time}</Text>
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

function NotificationItem({
  notification,
  onPress,
}: {
  notification: AppNotification;
  onPress: () => void;
}) {
  const read = !!notification.readAt;
  const typeColors: Record<string, string> = {
    ticket: Colors.primary,
    promo: Colors.warning,
    offer: Colors.success,
    club: Colors.info,
  };
  const typeLabels: Record<string, string> = {
    ticket: 'Entradas',
    promo: 'Promo',
    offer: 'Oferta',
    club: 'Club',
  };
  const color = typeColors[notification.type ?? ''] || Colors.info;
  const timeStr = notification.createdAt ? timeAgo(notification.createdAt) : '';

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      style={({ pressed }) => [styles.notifCard, !read && styles.notifUnread, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.notifDot, { backgroundColor: read ? 'transparent' : color }]} />
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <View style={[styles.notifTypeBadge, { backgroundColor: color + '20' }]}>
            <Text style={[styles.notifTypeText, { color }]}>{typeLabels[notification.type ?? ''] ?? 'Club'}</Text>
          </View>
          <Text style={styles.notifTime}>{timeStr}</Text>
        </View>
        <Text style={styles.notifTitle}>{notification.title}</Text>
        <Text style={styles.notifBody} numberOfLines={2}>{notification.body ?? ''}</Text>
      </View>
    </Pressable>
  );
}

function BenefitsSection() {
  const [selectedCat, setSelectedCat] = useState('TODO');

  const filtered = selectedCat === 'TODO'
    ? MOCK_BENEFITS
    : MOCK_BENEFITS.filter(b => b.category === selectedCat);

  return (
    <>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        style={styles.chipsContainer}
      >
        {BENEFIT_CATEGORIES.map(cat => (
          <Pressable
            key={cat}
            onPress={() => { Haptics.selectionAsync(); setSelectedCat(cat); }}
            style={[styles.chip, selectedCat === cat && styles.chipActive]}
          >
            <Text style={[styles.chipText, selectedCat === cat && styles.chipTextActive]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      {filtered.map(benefit => <BenefitCard key={benefit.id} benefit={benefit} />)}
    </>
  );
}

export default function MoreScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const params = useLocalSearchParams<{ tab?: string }>();
  const [activeTab, setActiveTab] = useState<MoreTab>(() =>
    params.tab === 'notifications' ? 'notifications' : 'benefits'
  );
  const [useDemoMode, setUseDemoMode] = useState(getUseMockData);
  const { token } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (params.tab === 'notifications') {
      setActiveTab('notifications');
    }
  }, [params.tab]);

  const handleDemoModeToggle = async (value: boolean) => {
    await setUseMockData(value);
    setUseDemoMode(value);
    queryClient.invalidateQueries();
  };
  const { data: notifData } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications({ take: 50 }),
    enabled: !!token && activeTab === 'notifications',
  });
  const notifications = notifData?.items ?? [];
  const unreadCount = notifData?.unreadCount ?? 0;
  const markReadMutation = useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
  const handleNotificationPress = (id: string) => {
    if (!notifData?.items.find((n) => n.id === id)?.readAt) {
      markReadMutation.mutate(id);
    }
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
            trackColor={{ false: Colors.surfaceHighlight, true: Colors.primary + '80' }}
            thumbColor={useDemoMode ? Colors.primary : Colors.textTertiary}
          />
        </View>

        <View style={styles.tabBar}>
          {(['benefits', 'experiences', 'notifications'] as MoreTab[]).map(tab => {
            const labels: Record<MoreTab, string> = {
              benefits: 'Beneficios',
              experiences: 'Experiencias',
              notifications: 'Avisos',
            };
            const icons: Record<MoreTab, any> = {
              benefits: 'pricetag',
              experiences: 'sparkles',
              notifications: 'notifications',
            };
            return (
              <Pressable
                key={tab}
                onPress={() => { Haptics.selectionAsync(); setActiveTab(tab); }}
                style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              >
                <Ionicons
                  name={icons[tab]}
                  size={16}
                  color={activeTab === tab ? Colors.text : Colors.textSecondary}
                />
                <Text style={[styles.tabBtnText, activeTab === tab && styles.tabBtnTextActive]}>
                  {labels[tab]}
                </Text>
                {tab === 'notifications' && unreadCount > 0 && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>

        {activeTab === 'benefits' && <BenefitsSection />}

        {activeTab === 'experiences' && (
          MOCK_EXPERIENCES.map(exp => <ExperienceCard key={exp.id} experience={exp} />)
        )}

        {activeTab === 'notifications' && (
          <>
            {token && (
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  router.push('/notification-preferences');
                }}
                style={({ pressed }) => [styles.prefsRow, { opacity: pressed ? 0.9 : 1 }]}
              >
                <Ionicons name="settings-outline" size={20} color={Colors.textSecondary} />
                <Text style={styles.prefsRowText}>Preferencias de notificaciones</Text>
                <Ionicons name="chevron-forward" size={18} color={Colors.textTertiary} />
              </Pressable>
            )}
            {notifications.map(notif => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onPress={() => handleNotificationPress(notif.id)}
              />
            ))}
          </>
        )}
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
    marginBottom: 16,
  },
  demoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  demoLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 15,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    gap: 4,
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: Colors.primary,
  },
  tabBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.text,
  },
  tabBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 9,
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
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  chipTextActive: { color: Colors.text },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  benefitLeft: { alignItems: 'center' },
  discountBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 56,
    alignItems: 'center',
  },
  discountText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.primary,
  },
  benefitContent: { flex: 1 },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  benefitPartner: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberOnlyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.gold + '15',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  memberOnlyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 9,
    color: Colors.gold,
  },
  benefitTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textTertiary,
  },
  expCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  expIconArea: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expContent: { flex: 1 },
  expHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  expTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
    flex: 1,
  },
  expMetaRow: { marginBottom: 6 },
  expMeta: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  expPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.primary,
  },
  expSpots: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  expSpotsLow: {
    color: Colors.warning,
  },
  prefsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  prefsRowText: {
    flex: 1,
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  notifUnread: {
    borderColor: Colors.primary + '30',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  notifTypeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  notifTypeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notifTime: {
    fontFamily: 'Inter_400Regular',
    fontSize: 11,
    color: Colors.textTertiary,
  },
  notifTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 4,
  },
  notifBody: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
