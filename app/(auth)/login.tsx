import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useSignIn } from '@clerk/clerk-expo';
import * as WebBrowser from 'expo-web-browser';
import { useClub } from '@/lib/contexts/ClubContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { club, theme } = useClub();
  const { signIn, setActive, isLoaded } = useSignIn();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!isLoaded || !signIn) return;
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signIn.create({
        identifier: email.trim().toLowerCase(),
        password,
      });

      if (result.status === 'complete' && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        router.replace('/(tabs)');
      } else {
        setError('Verificación adicional requerida. Revisa tu email.');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message;
      if (msg) {
        setError(msg);
      } else {
        setError('Email o contraseña incorrectos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = useCallback(async () => {
    if (!isLoaded || !signIn) return;
    setLoading(true);
    setError('');
    try {
      const redirectUrl = Linking.createURL('');
      const { createdSessionId, signIn: si } = await signIn.create({
        strategy: 'oauth_google',
        redirectUrl,
      });

      const externalUrl = (si as any)?.firstFactorVerification?.externalVerificationRedirectURL;
      if (externalUrl) {
        await WebBrowser.openAuthSessionAsync(externalUrl.toString(), redirectUrl);
      }

      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (e: any) {
      const msg = e?.errors?.[0]?.longMessage || e?.errors?.[0]?.message;
      setError(msg || 'Error al iniciar sesión con Google.');
    } finally {
      setLoading(false);
    }
  }, [isLoaded, signIn, setActive]);

  const logoUri = club?.useFullLogo ? club?.fullLogoUrl : club?.logoUrl;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          {logoUri ? (
            <Image source={{ uri: logoUri }} style={styles.logo} resizeMode="contain" />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.logoPlaceholderText}>{club?.name?.charAt(0) ?? 'C'}</Text>
            </View>
          )}
          <Text style={[styles.clubName, { color: theme.colors.primary }]}>{club?.name ?? 'Club'}</Text>
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>Iniciar sesión</Text>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={{ color: theme.colors.error, fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

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
          placeholder="Tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Entrar" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.dividerText, { color: theme.colors.textSecondary }]}>o</Text>
          <View style={[styles.dividerLine, { backgroundColor: theme.colors.border }]} />
        </View>

        <Pressable
          style={[styles.googleButton, { borderColor: theme.colors.border }]}
          onPress={handleGoogleSignIn}
          disabled={loading}
        >
          <Text style={[styles.googleButtonText, { color: theme.colors.text }]}>
            Continuar con Google
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push('/(auth)/register')} style={styles.link}>
          <Text style={{ color: theme.colors.textSecondary }}>
            ¿No tienes cuenta? <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>Registrarse</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 80, height: 80, borderRadius: 16 },
  logoPlaceholder: { width: 80, height: 80, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  logoPlaceholderText: { color: '#fff', fontSize: 36, fontWeight: '700' },
  clubName: { fontSize: 18, fontWeight: '700', marginTop: 12 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 24 },
  errorBanner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  link: { alignItems: 'center', marginTop: 24 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { marginHorizontal: 12, fontSize: 14 },
  googleButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  googleButtonText: { fontSize: 16, fontWeight: '600' },
});
