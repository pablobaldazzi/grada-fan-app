import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { MOCK_EXPERIENCES, formatCLP, formatDate } from "@/lib/mock-data";

export default function ExperienceDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { experienceId } = useLocalSearchParams<{ experienceId: string }>();
  const exp = MOCK_EXPERIENCES.find(e => e.id === experienceId) || MOCK_EXPERIENCES[0];
  const spotsLow = exp.spotsRemaining <= 5;

  const handleReserve = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      'Reserva confirmada',
      `Tu reserva para "${exp.title}" ha sido registrada. Recibirás un email de confirmación.`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Experiencia</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroArea}>
          <MaterialCommunityIcons name="star-four-points" size={60} color={Colors.primary} />
        </View>

        <View style={styles.content}>
          <View style={styles.badges}>
            {exp.membersOnly && (
              <View style={styles.memberBadge}>
                <Ionicons name="star" size={12} color={Colors.gold} />
                <Text style={styles.memberBadgeText}>Exclusivo socios</Text>
              </View>
            )}
            <View style={[styles.spotsBadge, spotsLow && styles.spotsBadgeLow]}>
              <Text style={[styles.spotsBadgeText, spotsLow && styles.spotsBadgeTextLow]}>
                {exp.spotsRemaining} cupos restantes
              </Text>
            </View>
          </View>

          <Text style={styles.expTitle}>{exp.title}</Text>
          <Text style={styles.expDesc}>{exp.description}</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={18} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Fecha</Text>
                <Text style={styles.detailValue}>{formatDate(exp.date)}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time" size={18} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Hora</Text>
                <Text style={styles.detailValue}>{exp.time}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="location" size={18} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Lugar</Text>
                <Text style={styles.detailValue}>{exp.location}</Text>
              </View>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="people" size={18} color={Colors.primary} />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>Capacidad</Text>
                <Text style={styles.detailValue}>
                  {exp.spotsRemaining}/{exp.spotsTotal} disponibles
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.capacityBar}>
            <View
              style={[
                styles.capacityFill,
                {
                  width: `${((exp.spotsTotal - exp.spotsRemaining) / exp.spotsTotal) * 100}%` as any,
                  backgroundColor: spotsLow ? Colors.warning : Colors.primary,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerLabel}>Precio</Text>
          <Text style={styles.footerAmount}>{formatCLP(exp.price)}</Text>
        </View>
        <Pressable
          onPress={handleReserve}
          style={({ pressed }) => [styles.reserveBtn, { opacity: pressed ? 0.9 : 1 }]}
        >
          <Ionicons name="bookmark" size={18} color={Colors.text} />
          <Text style={styles.reserveBtnText}>Reservar</Text>
        </Pressable>
      </View>
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
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },
  heroArea: {
    height: 180,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  content: {},
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.gold + '15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  memberBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.gold,
  },
  spotsBadge: {
    backgroundColor: Colors.primary + '15',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  spotsBadgeLow: {
    backgroundColor: Colors.warning + '15',
  },
  spotsBadgeText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.primary,
  },
  spotsBadgeTextLow: {
    color: Colors.warning,
  },
  expTitle: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 12,
  },
  expDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
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
  capacityBar: {
    height: 6,
    backgroundColor: Colors.surfaceHighlight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  capacityFill: {
    height: '100%',
    borderRadius: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 16,
  },
  footerPrice: { flex: 1 },
  footerLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerAmount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  reserveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 28,
  },
  reserveBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
});
