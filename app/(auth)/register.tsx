import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useSignUp } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useClub } from '@/lib/contexts/ClubContext';
import { config } from '@/lib/config';
import { getUseMockData } from '@/lib/demo-mode';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const CLUB_LOGOS: Record<string, ImageSourcePropType> = {
  rangers: require('@/assets/clubs/rangers/splash-icon.png'),
  'deportes-concepcion': require('@/assets/clubs/deportes-concepcion/splash-icon.png'),
  palestino: require('@/assets/clubs/palestino/splash-icon.png'),
  'puerto-montt': require('@/assets/clubs/puerto-montt/splash-icon.png'),
};

WebBrowser.maybeCompleteAuthSession();

export default function RegisterScreen() {
  const { club, theme } = useClub();
  const { signUp, setActive, isLoaded } = useSignUp();
  const isDemo = getUseMockData();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (isDemo) {
      setLoading(true);
      setError('');
      await new Promise((r) => setTimeout(r, 300));
      setLoading(false);
      router.replace('/(tabs)');
      return;
    }

    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');
    try {
      await signUp.create({
        emailAddress: email.trim().toLowerCase(),
        password,
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (e: any) {
      const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message;
      if (msg?.toLowerCase()?.includes('already')) {
        setError('Ya existe una cuenta con este email. Inicia sesión.');
      } else {
        setError(msg || 'Error al registrarse. Revisa los datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded || !signUp) return;
    if (!code.trim()) {
      setError('Ingresa el código de verificación.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: code.trim() });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('La verificación no se completó. Intenta de nuevo.');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message;
      setError(msg || 'Código inválido.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = useCallback(async () => {
    if (!isLoaded || !signUp) return;
    setLoading(true);
    setError('');
    try {
      const redirectUrl = Linking.createURL('');
      const { createdSessionId, signUp: su } = await signUp.create({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const externalUrl = (su as any)?.verifications?.externalAccount?.externalVerificationRedirectURL;
      if (externalUrl) {
        await WebBrowser.openAuthSessionAsync(externalUrl.toString(), redirectUrl);
      }

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message;
      setError(msg || 'Error al registrarse con Google.');
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signUp, setActive]);

  const logoUri = club?.useFullLogo ? club?.fullLogoUrl : club?.logoUrl;
  const bundledLogo = CLUB_LOGOS[config.assetVariant] ?? CLUB_LOGOS.rangers;
  const logoSource = logoUri ? { uri: logoUri } : bundledLogo;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          {pendingVerification ? 'Verifica tu email' : 'Crear cuenta'}
        </Text>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={{ color: theme.colors.error, fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

        {pendingVerification ? (
          <>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              Te enviamos un código a {email}. Ingrésalo abajo.
            </Text>
            <Input
              label="Código de verificación"
              placeholder="123456"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
            />
            <Button title="Verificar" onPress={handleVerify} loading={loading} style={{ marginTop: 8 }} />
          </>
        ) : (
          <>
            <Input
              label="Nombre"
              placeholder="Juan"
              value={firstName}
              onChangeText={setFirstName}
              autoComplete="given-name"
            />
            <Input
              label="Apellido"
              placeholder="Pérez"
              value={lastName}
              onChangeText={setLastName}
              autoComplete="family-name"
            />
            <Input
              label="Email"
              placeholder="tu@ejemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Contraseña"
              placeholder="Mín. 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            <Button title="Crear cuenta" onPress={handleRegister} loading={loading} style={{ marginTop: 8 }} />

            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.divider }]} />
              <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>o</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.colors.divider }]} />
            </View>

            <Pressable
              style={[styles.googleButton, { borderColor: theme.colors.divider }]}
              onPress={handleGoogleSignUp}
              disabled={loading}
            >
              <Text style={[styles.googleButtonText, { color: theme.colors.text }]}>
                Registrarse con Google
              </Text>
            </Pressable>
          </>
        )}

        <Pressable onPress={() => router.back()} style={styles.link}>
          <Text style={{ color: theme.colors.textSecondary }}>
            ¿Ya tienes cuenta?{' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Iniciar sesión</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logo: { width: 80, height: 80 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  subtitle: { fontSize: 15, marginBottom: 16, lineHeight: 22 },
  errorBanner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  link: { alignItems: 'center', marginTop: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 14 },
  googleButton: { borderWidth: 1, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  googleButtonText: { fontSize: 16, fontWeight: '600' },
});
