import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Image, ImageSourcePropType } from 'react-native';
import { useClub } from '@/lib/contexts/ClubContext';
import { config } from '@/lib/config';

/** Club logos for loading screen - used before club data is fetched. */
const CLUB_LOGOS: Record<string, ImageSourcePropType> = {
  rangers: require('@/assets/clubs/rangers/splash-icon.png'),
  'deportes-concepcion': require('@/assets/clubs/deportes-concepcion/splash-icon.png'),
  palestino: require('@/assets/clubs/palestino/splash-icon.png'),
  'puerto-montt': require('@/assets/clubs/puerto-montt/splash-icon.png'),
};

const LOADING_BG = '#0A0A0A';
const LOADING_TEXT = '#A0A0A0';
const LOADING_SPINNER = '#666666';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen(props: LoadingScreenProps) {
  const message = props.message;
  const { club, theme } = useClub();

  const bundledLogo = CLUB_LOGOS[config.assetVariant] ?? CLUB_LOGOS.rangers;
  const logoSource = club
    ? (club.useFullLogo && club.fullLogoUrl ? { uri: club.fullLogoUrl } : club.logoUrl ? { uri: club.logoUrl } : bundledLogo)
    : bundledLogo;

  const bgColor = club ? theme.colors.background : LOADING_BG;
  const textColor = club ? theme.colors.textSecondary : LOADING_TEXT;
  const spinnerColor = club ? theme.colors.primary : LOADING_SPINNER;

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      {logoSource ? (
        <Image source={logoSource} style={styles.logo} resizeMode="contain" />
      ) : null}
      <ActivityIndicator size="large" color={spinnerColor} style={styles.spinner} />
      {message ? (
        <Text style={[styles.text, { color: textColor }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 24,
  },
  spinner: {
    marginBottom: 8,
  },
  text: {
    marginTop: 8,
    fontSize: 15,
  },
});
