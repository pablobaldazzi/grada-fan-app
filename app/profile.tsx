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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useClerkAuth } from "@/lib/hooks/useClerkAuth";
import { updateProfile } from "@/lib/api";

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  keyboardType?: any;
}) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={keyboardType}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { fan, refreshProfile, logout } = useClerkAuth();

  const initial = useMemo(
    () => ({
      email: fan?.email ?? "",
      firstName: fan?.firstName ?? "",
      lastName: fan?.lastName ?? "",
      phone: fan?.phone ?? "",
    }),
    [fan]
  );

  const [email, setEmail] = useState(initial.email);
  const [firstName, setFirstName] = useState(initial.firstName);
  const [lastName, setLastName] = useState(initial.lastName);
  const [phone, setPhone] = useState(initial.phone);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile({ email, firstName, lastName, phone });
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
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + webTopInset + 16,
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        // We already apply safe-area top padding manually; avoid double inset on iOS
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </Pressable>
          <Text style={styles.title}>Perfil</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Datos</Text>
          <Field label="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
          <Field label="Nombre" value={firstName} onChangeText={setFirstName} />
          <Field label="Apellido" value={lastName} onChangeText={setLastName} />
          <Field label="Teléfono" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

          <Pressable
            disabled={saving}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              save();
            }}
            style={({ pressed }) => [
              styles.primaryBtn,
              { opacity: saving ? 0.6 : pressed ? 0.9 : 1 },
            ]}
          >
            <Text style={styles.primaryBtnText}>{saving ? "Guardando…" : "Guardar"}</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta</Text>
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  input: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.surfaceHighlight,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    color: Colors.text,
    fontFamily: "Inter_500Medium",
  },
  primaryBtn: {
    marginTop: 6,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  primaryBtnText: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
    color: Colors.text,
  },
  muted: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
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
