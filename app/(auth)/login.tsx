import React, { useState } from 'react';
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
import { useClub } from '@/lib/contexts/ClubContext';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getUseMockData } from '@/lib/demo-mode';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function LoginScreen() {
  const { club, theme } = useClub();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!club) {
      setError('El club todavía no carga. Reintenta en unos segundos.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(club.id, email.trim().toLowerCase(), password);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { message?: string } } };
      const status = err?.response?.status;
      if (status === 401) setError('Email o contraseña incorrectos.');
      else if (status === 400) setError(err?.response?.data?.message ?? 'Datos inválidos.');
      else setError('No se pudo conectar al servidor. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

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
        {getUseMockData() && (
          <View style={[styles.demoBanner, { backgroundColor: theme.colors.info + '20' }]}>
            <Text style={{ color: theme.colors.info, fontSize: 13 }}>
              Modo Demo: Puedes usar cualquier email y contraseña
            </Text>
          </View>
        )}
        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={{ color: theme.colors.error, fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}
        <Input label="Email" placeholder="tu@ejemplo.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
        <Input label="Contraseña" placeholder="Tu contraseña" value={password} onChangeText={setPassword} secureTextEntry />
        <Button title="Entrar" onPress={handleLogin} loading={loading} style={{ marginTop: 8 }} />
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
  demoBanner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  errorBanner: { padding: 12, borderRadius: 10, marginBottom: 16 },
  link: { alignItems: 'center', marginTop: 24 },
});
