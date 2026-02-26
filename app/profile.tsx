import React, { useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useClub } from "@/lib/contexts/ClubContext";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { updateProfile } from "@/lib/api";
import { getUseMockData } from "@/lib/demo-mode";
import { ImageSourcePropType } from "react-native";

const demoProfilePic: ImageSourcePropType = require("@/assets/images/demo-profile.png");

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

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  colors,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
  colors: Record<string, string>;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={[
          styles.input,
          {
            backgroundColor: colors.surfaceHighlight ?? colors.surface,
            borderColor: colors.cardBorder,
            color: colors.text,
          },
        ]}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { theme } = useClub();
  const colors = theme.colors;
  const { fan, user, profileStatus, refreshProfile, logout } = useClerkAuth();
  const isDemo = getUseMockData();

  const initial = useMemo(
    () => ({
      email: fan?.email ?? "",
      firstName: fan?.firstName ?? "",
      lastName: fan?.lastName ?? "",
      phone: fan?.phone ?? "",
      nationalId: profileStatus?.nationalId ?? "",
    }),
    [fan, profileStatus]
  );

  const [email, setEmail] = useState(initial.email);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [nationalId, setNationalId] = useState(initial.nationalId);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  const clerkImageUrl = user?.imageUrl ?? null;
  const hasImage = profileImageUri || isDemo || clerkImageUrl;
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (nationalId && !isValidRut(nationalId)) {
      Alert.alert("Error", "RUT inválido. Verifica el formato (ej: 12.345.678-5)");
      return;
    }

    setSaving(true);
    try {
      await updateProfile({ email, firstName, lastName, phone, nationalId: nationalId || undefined });
      await refreshProfile();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Listo", "Perfil actualizado.");
    } catch {
      Alert.alert("Error", "No se pudo actualizar el perfil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + webTopInset + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { backgroundColor: colors.surface, borderColor: colors.cardBorder, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Ionicons name="chevron-back" size={22} color={colors.text} />
          </Pressable>
          <Text style={[styles.title, { color: colors.text }]}>Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.avatarSection}>
          <Pressable onPress={pickImage} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
            {hasImage ? (
              <Image
                source={
                  profileImageUri
                    ? { uri: profileImageUri }
                    : isDemo
                      ? demoProfilePic
                      : { uri: clerkImageUrl! }
                }
                style={styles.avatarImage}
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="person" size={40} color={colors.primary} />
              </View>
            )}
            <View style={[styles.avatarEditBadge, { backgroundColor: colors.primary }]}>
              <Ionicons name="camera" size={14} color={colors.text} />
            </View>
          </Pressable>
          <Pressable onPress={pickImage}>
            <Text style={[styles.avatarEditText, { color: colors.primary }]}>Cambiar foto</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.cardBorder }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Datos</Text>
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" colors={colors} />
          <Field label="Nombre" value={firstName} onChangeText={setFirstName} colors={colors} />
          <Field label="Apellido" value={lastName} onChangeText={setLastName} colors={colors} />
          <Field label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" colors={colors} />
          <Field
            label="RUT"
            value={nationalId}
            onChangeText={(v) => setNationalId(formatRut(v))}
            placeholder="12.345.678-5"
            colors={colors}
          />

          <Pressable
            disabled={saving}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              save();
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: saving ? 0.6 : pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={[styles.primaryBtnText, { color: colors.text }]}>
              {saving ? "Guardando…" : "Guardar"}
            </Text>
          </Pressable>
        </View>

        <Pressable
          onPress={() => {
            Alert.alert("Cerrar sesión", "¿Estás seguro?", [
              { text: "Cancelar", style: "cancel" },
              {
                text: "Cerrar sesión",
                style: "destructive",
                onPress: async () => {
                  await logout();
                  router.replace("/");
                },
              },
            ]);
          }}
          style={({ pressed }) => [
            styles.dangerBtn,
            { opacity: pressed ? 0.9 : 1 },
          ]}
        >
          <Text style={styles.dangerBtnText}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
  },
  avatarSection: {
    alignItems: "center",
    marginBottom: 20,
    gap: 10,
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  avatarPlaceholder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#000",
  },
  avatarEditText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  card: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    marginBottom: 10,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    fontFamily: "Inter_500Medium",
  },
  primaryBtn: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  dangerBtn: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#dc262620",
    borderWidth: 1,
    borderColor: "#dc262640",
  },
  dangerBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: "#dc2626",
  },
});
