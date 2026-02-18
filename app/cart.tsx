import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useCart } from "@/lib/cart-context";
import { useClub } from "@/lib/contexts/ClubContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { checkout } from "@/lib/api";
import { formatCLP } from "@/lib/format";

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const { fan } = useAuth();
  const { items, removeItem, updateQuantity, total, clearCart, itemCount } = useCart();
  const [email, setEmail] = useState(fan?.email ?? '');
  const [checkingOut, setCheckingOut] = useState(false);
  const colors = theme.colors;
  useEffect(() => {
    if (fan?.email && !email) setEmail(fan.email);
  }, [fan?.email]);

  const handleCheckout = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      Alert.alert('Email requerido', 'Ingresa tu email para continuar.');
      return;
    }
    if (!club?.id) {
      Alert.alert('Error', 'No se pudo cargar el club.');
      return;
    }
    const checkoutItems = items
      .filter((i) => i.refId)
      .map((i) => ({
        type: i.type === 'ticket' ? 'TICKET' as const : 'PRODUCT' as const,
        refId: i.refId!,
        quantity: i.quantity,
        ...(i.seatIds?.length ? { seatIds: i.seatIds } : {}),
      }));
    if (checkoutItems.length === 0) {
      Alert.alert('Carrito inválido', 'Algunos productos no son válidos. Elimínalos y vuelve a agregarlos.');
      return;
    }
    setCheckingOut(true);
    try {
      await checkout({
        clubId: club.id,
        email: trimmedEmail,
        items: checkoutItems,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      clearCart();
      Alert.alert(
        'Pedido confirmado',
        'Tu compra ha sido procesada. Recibirás un email con los detalles.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (e: unknown) {
      const err = e as { response?: { status?: number; data?: { message?: string } } };
      const msg = err?.response?.data?.message ?? 'No se pudo procesar el pago. Intenta de nuevo.';
      Alert.alert('Error', msg);
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8, borderBottomColor: colors.divider }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Carrito ({itemCount})</Text>
        {items.length > 0 ? (
          <Pressable
            onPress={() => {
              Alert.alert('Vaciar carrito', 'Estas seguro?', [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Vaciar', style: 'destructive', onPress: clearCart },
              ]);
            }}
            style={styles.clearBtn}
          >
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="bag-outline" size={56} color={colors.textTertiary} />
          <Text style={styles.emptyTitle}>Carrito vacio</Text>
          <Text style={styles.emptyText}>
            Agrega entradas o productos de la tienda
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={styles.shopBtn}
          >
            <Text style={styles.shopBtnText}>Seguir comprando</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView
            contentContainerStyle={[styles.scrollContent, { paddingBottom: 160 }]}
            showsVerticalScrollIndicator={false}
          >
            {items.map(item => (
              <View key={item.id} style={styles.cartItem}>
                <View style={[
                  styles.itemIcon,
                  { backgroundColor: item.type === 'ticket' ? colors.primary + '15' : colors.secondary + '15' },
                ]}>
                  <Ionicons
                    name={item.type === 'ticket' ? 'ticket' : 'bag'}
                    size={20}
                    color={item.type === 'ticket' ? colors.primary : colors.secondary}
                  />
                </View>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  <Text style={styles.itemDetails}>{item.details}</Text>
                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>{formatCLP(item.price * item.quantity)}</Text>
                    <View style={styles.qtyControls}>
                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync();
                          updateQuantity(item.id, item.quantity - 1);
                        }}
                        style={styles.qtyBtn}
                      >
                        <Ionicons name="remove" size={16} color={colors.text} />
                      </Pressable>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                      <Pressable
                        onPress={() => {
                          Haptics.selectionAsync();
                          updateQuantity(item.id, item.quantity + 1);
                        }}
                        style={styles.qtyBtn}
                      >
                        <Ionicons name="add" size={16} color={colors.text} />
                      </Pressable>
                    </View>
                  </View>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    removeItem(item.id);
                  }}
                  style={styles.removeBtn}
                >
                  <Ionicons name="close" size={16} color={colors.textTertiary} />
                </Pressable>
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16), backgroundColor: colors.background, borderTopColor: colors.divider }]}>
            <View style={styles.emailRow}>
              <Text style={[styles.emailLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.emailInput, { backgroundColor: colors.surface, color: colors.text, borderColor: colors.divider }]}
                placeholder="tu@ejemplo.com"
                placeholderTextColor={colors.textTertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
                <Text style={[styles.totalValue, { color: colors.text }]}>{formatCLP(total)}</Text>
              </View>
            </View>

            <Pressable
              onPress={handleCheckout}
              disabled={checkingOut}
              style={({ pressed }) => [styles.checkoutBtn, { backgroundColor: colors.primary, opacity: pressed || checkingOut ? 0.9 : 1 }]}
            >
              {checkingOut ? (
                <ActivityIndicator size="small" color={colors.text} />
              ) : (
                <>
                  <Text style={[styles.checkoutBtnText, { color: colors.text }]}>Confirmar y pagar</Text>
                  <Ionicons name="arrow-forward" size={18} color={colors.text} />
                </>
              )}
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
  clearBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: Colors.text,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  shopBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  shopBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
  },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
  },
  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemContent: { flex: 1 },
  itemName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  itemDetails: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 15,
    color: Colors.primary,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  emailRow: { marginBottom: 12 },
  emailLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  emailInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  totalSection: { marginBottom: 14 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  totalLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.text,
  },
  grandTotalRow: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.text,
  },
  grandTotalValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: Colors.primary,
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
  },
  checkoutBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: Colors.text,
  },
});
