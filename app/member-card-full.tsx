import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import Colors from "@/constants/colors";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { useMembership } from "@/lib/hooks/useMembership";
import { getUseMockData } from "@/lib/demo-mode";
import { getClubLogo } from "@/lib/club-logos";

const demoProfilePic = require("@/assets/images/demo-profile.png");

function displayName(fan: { name?: string | null; firstName?: string | null; lastName?: string | null } | null): string {
  if (!fan) return 'Socio';
  if (fan.name) return fan.name;
  const first = fan.firstName ?? '';
  const last = fan.lastName ?? '';
  return [first, last].filter(Boolean).join(' ') || 'Socio';
}

export default function MemberCardFullScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme, themeMode } = useClub();
  const { fan } = useClerkAuth();
  const { tierConfig } = useMembership();
  const colors = theme.colors;
  const isLight = themeMode === 'light';
  const name = displayName(fan);
  const isDemo = getUseMockData();
  const memberId = fan?.id ? fan.id.slice(-8).toUpperCase() : 'SOCIO001';
  const qrValue = `grada://socio/${club?.slug ?? 'club'}/${memberId}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.cardWrapper}>
        <View style={styles.titleRow}>
          <Image source={getClubLogo(club?.slug)} style={styles.titleClubLogo} resizeMode="contain" />
          <View>
            <Text style={[styles.titleText, { color: colors.text }]}>{club?.nickname ?? club?.name ?? 'Club'} ID</Text>
            <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>Tu carnet digital de socio</Text>
          </View>
        </View>

        <LinearGradient colors={isLight ? tierConfig.lightGradientColors : tierConfig.gradientColors} style={[styles.card, { borderColor: colors.cardBorder }]}>
          <View style={styles.cardBody}>
            <View style={styles.cardBodyLeft}>
              <View style={[styles.tierBadge, { backgroundColor: tierConfig.color + '20' }]}>
                <MaterialCommunityIcons
                  name={tierConfig.icon as any}
                  size={16}
                  color={tierConfig.color}
                />
                <Text style={[styles.tierText, { color: tierConfig.color }]}>
                  {tierConfig.name}
                </Text>
              </View>
              <Text style={[styles.memberName, { color: isLight ? '#1A1A1A' : '#FFFFFF' }]}>{name}</Text>
              {fan?.email ? <Text style={[styles.memberDetail, { color: isLight ? '#555555' : '#A0A0A0' }]}>{fan.email}</Text> : null}
              {fan?.phone ? <Text style={[styles.memberDetail, { color: isLight ? '#555555' : '#A0A0A0' }]}>{fan.phone}</Text> : null}
            </View>
            {isDemo ? (
              <Image source={demoProfilePic} style={styles.profilePic} />
            ) : (
              <View style={[styles.profilePicPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="person" size={38} color={colors.primary} />
              </View>
            )}
          </View>

          <View style={[styles.qrSection, { borderTopColor: isLight ? '#E0E0E0' : '#222222' }]}>
            <QRCode
              value={qrValue}
              size={180}
              color={isLight ? '#1A1A1A' : '#FFFFFF'}
              backgroundColor="transparent"
            />
            <Text style={[styles.memberIdText, { color: isLight ? '#888888' : colors.textTertiary }]}>ID: {memberId}</Text>
          </View>

          <View style={[styles.cardAccentLine, { backgroundColor: tierConfig.color }]} />
        </LinearGradient>
      </View>

      <View style={[styles.presentNotice, { backgroundColor: tierConfig.color + '15' }]}>
        <Ionicons name="shield-checkmark" size={20} color={tierConfig.color} />
        <Text style={[styles.presentText, { color: colors.textSecondary }]}>
          Presenta este carnet para acceder a beneficios exclusivos
        </Text>
      </View>

      <View style={[styles.brightnessNote, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
        <Ionicons name="sunny" size={16} color={colors.textTertiary} />
        <Text style={[styles.brightnessText, { color: colors.textTertiary }]}>Brillo al maximo para mejor lectura</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 20,
  },
  titleClubLogo: {
    width: 56,
    height: 56,
  },
  titleText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.text,
  },
  subtitleText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 16,
  },
  cardBodyLeft: {
    flex: 1,
    gap: 2,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 4,
  },
  tierText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
  },
  memberName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 26,
    color: Colors.text,
    marginBottom: 4,
  },
  memberDetail: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  profilePic: {
    width: 80,
    height: 90,
    borderRadius: 12,
  },
  profilePicPlaceholder: {
    width: 80,
    height: 90,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrSection: {
    alignItems: 'center',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222222',
  },
  memberIdText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    letterSpacing: 3,
    marginTop: 10,
  },
  cardAccentLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  presentNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  presentText: {
    flex: 1,
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  brightnessNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  brightnessText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textTertiary,
  },
});
