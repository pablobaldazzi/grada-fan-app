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
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function RegisterScreen() {
  const { club, theme } = useClub();
  const { register } = useAuth();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!club) return;
    if (!email.trim() || !password) {
      setError('Ingresa tu email y contraseña.');
      return;
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await register(
        club.id,
        email.trim().toLowerCase(),
        password,
        firstName.trim() || undefined,
        lastName.trim() || undefined,
      );
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { message?: string } } };
      const status = err?.response?.status;
      if (status === 400) {
        const msg = err?.response?.data?.message;
        if (typeof msg === 'string' && msg.toLowerCase().includes('already')) {
          setError('Ya existe una cuenta con este email. Inicia sesión.');
        } else {
          setError(msg ?? 'Error al registrarse. Revisa los datos.');
        }
      } else {
        setError('No se pudo conectar al servidor. Intenta de nuevo.');
      }
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
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          {logoUri ? (
            <Image
              source={{ uri: logoUri }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <View
              style={[
                styles.logoPlaceholder,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={styles.logoPlaceholderText}>
                {club?.name?.charAt(0) ?? 'C'}
              </Text>
            </View>
          )}
        </View>

        <Text style={[styles.title, { color: theme.colors.text }]}>
          Crear cuenta
        </Text>

        {error ? (
          <View
            style={[
              styles.errorBanner,
              { backgroundColor: theme.colors.error + '20' },
            ]}
          >
            <Text style={{ color: theme.colors.error, fontSize: 14 }}>
              {error}
            </Text>
          </View>
        ) : null}

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

        <Button
          title="Crear cuenta"
          onPress={handleRegister}
          loading={loading}
          style={{ marginTop: 8 }}
        />

        <Pressable onPress={() => router.back()} style={styles.link}>
          <Text style={{ color: theme.colors.textSecondary }}>
            ¿Ya tienes cuenta?{' '}
            <Text style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Iniciar sesión
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 12,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholderText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
  },
  errorBanner: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  link: {
    alignItems: 'center',
    marginTop: 24,
  },
});
