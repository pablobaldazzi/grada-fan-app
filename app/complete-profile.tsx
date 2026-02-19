import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { useClub } from '@/lib/contexts/ClubContext';
import { useClerkAuth } from '@/lib/hooks/useClerkAuth';
import { http } from '@/lib/http';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

function formatRut(value: string) {
  const cleaned = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (cleaned.length <= 1) return cleaned;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1);
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${formatted}-${dv}`;
}

function isValidRut(rut: string): boolean {
  const cleaned = rut.replace(/[.\-]/g, '');
  if (cleaned.length < 2) return false;
  const body = cleaned.slice(0, -1);
  const dv = cleaned.slice(-1).toUpperCase();
  if (!/^\d+$/.test(body)) return false;

  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i], 10) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const remainder = 11 - (sum % 11);
  const expected = remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
  return dv === expected;
}

export default function CompleteProfileScreen() {
  const { club, theme } = useClub();
  const { getToken } = useAuth();
  const { profileStatus, refreshProfile } = useClerkAuth();

  const missing = profileStatus?.missingFields ?? [];

  const [firstName, setFirstName] = useState(profileStatus?.firstName || '');
  const [lastName, setLastName] = useState(profileStatus?.lastName || '');
  const [phone, setPhone] = useState(profileStatus?.phone || '');
  const [nationalId, setNationalId] = useState(profileStatus?.nationalId || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!club) return;

    if (missing.includes('nationalId') && nationalId && !isValidRut(nationalId)) {
      setError('RUT inválido. Verifica el formato (ej: 12.345.678-5)');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      const data: Record<string, string> = {};
      if (missing.includes('firstName') && firstName) data.firstName = firstName;
      if (missing.includes('lastName') && lastName) data.lastName = lastName;
      if (missing.includes('phone') && phone) data.phone = phone;
      if (missing.includes('nationalId') && nationalId) data.nationalId = nationalId.replace(/[.\-]/g, '');

      const res = await http.post('/public/fans/complete-profile', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'x-club-id': club.id,
        },
      });

      if (res.data.profileComplete) {
        await refreshProfile();
        router.replace('/(tabs)');
      } else {
        setError(`Campos faltantes: ${res.data.missingFields.join(', ')}`);
      }
    } catch (e: any) {
      setError(e?.message || 'Error al guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: theme.colors.text }]}>Completa tu perfil</Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Necesitamos algunos datos antes de continuar.
        </Text>

        {error ? (
          <View style={[styles.errorBanner, { backgroundColor: theme.colors.error + '20' }]}>
            <Text style={{ color: theme.colors.error, fontSize: 14 }}>{error}</Text>
          </View>
        ) : null}

        {missing.includes('firstName') && (
          <Input
            label="Nombre"
            placeholder="Juan"
            value={firstName}
            onChangeText={setFirstName}
            autoComplete="given-name"
          />
        )}

        {missing.includes('lastName') && (
          <Input
            label="Apellido"
            placeholder="Pérez"
            value={lastName}
            onChangeText={setLastName}
            autoComplete="family-name"
          />
        )}

        {missing.includes('phone') && (
          <Input
            label="Teléfono"
            placeholder="+56 9 1234 5678"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        )}

        {missing.includes('nationalId') && (
          <Input
            label="RUT"
            placeholder="12.345.678-5"
            value={nationalId}
            onChangeText={(v) => setNationalId(formatRut(v))}
            keyboardType="default"
          />
        )}

        <Button
          title="Guardar"
          onPress={handleSave}
          loading={saving}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 15, marginBottom: 24, lineHeight: 22 },
  errorBanner: { padding: 12, borderRadius: 10, marginBottom: 16 },
});
