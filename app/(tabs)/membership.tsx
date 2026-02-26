import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import QRCode from "react-native-qrcode-svg";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { useMembership } from "@/lib/hooks/useMembership";
import { getUseMockData } from "@/lib/demo-mode";
import { getClubLogo } from "@/lib/club-logos";
import Colors from "@/constants/colors";

const demoProfilePic = require("@/assets/images/demo-profile.png");

function displayName(fan: { name?: string | null; firstName?: string | null; lastName?: string | null } | null): string {
  if (!fan) return 'Socio';
  if (fan.name) return fan.name;
  const first = fan.firstName ?? '';
  const last = fan.lastName ?? '';
  return [first, last].filter(Boolean).join(' ') || 'Socio';
}

function MemberCard({ colors, isLight }: { colors: Record<string, string>; isLight: boolean }) {
  const { fan } = useClerkAuth();
  const { club } = useClub();
  const { tierConfig } = useMembership();
  const name = displayName(fan);
  const isDemo = getUseMockData();
  const memberId = fan?.id ? fan.id.slice(-8).toUpperCase() : 'SOCIO001';
  const qrValue = `grada://socio/${club?.slug ?? 'club'}/${memberId}`;

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push("/member-card-full");
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.96 : 1 }]}
    >
      <LinearGradient colors={isLight ? tierConfig.lightGradientColors : tierConfig.gradientColors} style={[styles.card, { borderColor: colors.cardBorder }]}>
        <View style={styles.cardBody}>
          <View style={styles.cardBodyLeft}>
            <View style={[styles.tierBadge, { backgroundColor: tierConfig.color + '20' }]}>
              <MaterialCommunityIcons
                name={tierConfig.icon as any}
                size={14}
                color={tierConfig.color}
              />
              <Text style={[styles.tierText, { color: tierConfig.color }]}>
                {tierConfig.name}
              </Text>
            </View>
            <Text style={[styles.memberName, { color: isLight ? '#1A1A1A' : '#FFFFFF' }]}>{name}</Text>
            {fan?.email ? <Text style={[styles.memberNumber, { color: isLight ? '#555555' : '#A0A0A0' }]}>{fan.email}</Text> : null}
          </View>
          {isDemo ? (
            <Image source={demoProfilePic} style={styles.profilePic} />
          ) : (
            <View style={[styles.profilePicPlaceholder, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="person" size={30} color={colors.primary} />
            </View>
          )}
        </View>
        <View style={[styles.qrSection, { borderTopColor: isLight ? '#E0E0E0' : '#222222' }]}>
          <QRCode
            value={qrValue}
            size={80}
            color={isLight ? '#1A1A1A' : '#FFFFFF'}
            backgroundColor="transparent"
          />
          <Text style={[styles.memberIdText, { color: isLight ? '#888888' : colors.textTertiary }]}>ID: {memberId}</Text>
        </View>
        <View style={[styles.cardAccentLine, { backgroundColor: tierConfig.color }]} />
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

function PlanBanner({ colors }: { colors: Record<string, string> }) {
  const { tier, tierConfig } = useMembership();

  const isGold = tier === 'gold';
  const bannerLabel = isGold ? 'Plan Gold activo' : 'Mejora tu plan';
  const bannerSub = isGold
    ? 'Toca para ver o cambiar tu plan'
    : 'Accede a beneficios exclusivos';
  const accentColor = isGold ? tierConfig.color : '#FFD700';
  const iconName = isGold ? 'crown' : 'arrow-up-circle';

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push("/upgrade-membership");
      }}
      style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
    >
      <LinearGradient
        colors={[accentColor + '20', accentColor + '08']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.upgradeBanner, { borderColor: accentColor + '25' }]}
      >
        <View style={styles.upgradeBannerLeft}>
          <MaterialCommunityIcons name={iconName as any} size={22} color={accentColor} />
          <View>
            <Text style={[styles.upgradeBannerTitle, { color: colors.text }]}>{bannerLabel}</Text>
            <Text style={[styles.upgradeBannerSub, { color: colors.textSecondary }]}>{bannerSub}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
      </LinearGradient>
    </Pressable>
  );
}

export default function MembershipScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme, themeMode } = useClub();
  const { fan, profileStatus } = useClerkAuth();
  const colors = theme.colors;
  const isLight = themeMode === 'light';
  const name = displayName(fan);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.titleRow}>
          <Image source={getClubLogo(club?.slug)} style={styles.titleClubLogo} resizeMode="contain" />
          <View>
            <Text style={[styles.title, { color: colors.text }]}>{club?.nickname ?? club?.name ?? 'Club'} ID</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Tu carnet digital de socio</Text>
          </View>
        </View>

        <MemberCard colors={colors} isLight={isLight} />

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

        <PlanBanner colors={colors} />

        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Informacion del socio</Text>
          <InfoRow icon="person" label="Nombre" value={name} colors={colors} />
          {fan?.email ? <InfoRow icon="mail" label="Email" value={fan.email} colors={colors} /> : null}
          {fan?.phone ? <InfoRow icon="call" label="Telefono" value={fan.phone} colors={colors} /> : null}
          {profileStatus?.nationalId ? <InfoRow icon="id-card" label="RUT" value={profileStatus.nationalId} colors={colors} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 16 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  titleClubLogo: {
    width: 64,
    height: 64,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  cardBodyLeft: {
    flex: 1,
    gap: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tierText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 11,
  },
  profilePic: {
    width: 64,
    height: 72,
    borderRadius: 10,
  },
  profilePicPlaceholder: {
    width: 64,
    height: 72,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  memberIdText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    letterSpacing: 2,
    marginTop: 8,
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
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
  cardAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  presentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  upgradeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#FFD70025',
  },
  upgradeBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  upgradeBannerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
  upgradeBannerSub: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
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
