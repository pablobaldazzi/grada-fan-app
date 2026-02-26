import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
  Image,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import { useClub } from "@/lib/contexts/ClubContext";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { STORE_IMAGES } from "@/lib/store-images";

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const { club, theme } = useClub();
  const colors = theme.colors;
  const product = club?.products?.find((p) => p.id === productId) ?? null;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);

  const inStock = product ? (product.stock ?? 0) > 0 : false;
  const localImage = product ? STORE_IMAGES[product.id] : undefined;

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      id: `merch-${product.id}-${Date.now()}`,
      type: 'merch',
      name: product.name,
      price: product.price,
      quantity,
      details: 'Producto',
      refId: product.id,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/cart");
  };

  if (!product) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, padding: 24 }}>Producto no encontrado</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: colors.primary }}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <Pressable onPress={() => router.push("/cart")} style={[styles.backBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="bag-outline" size={22} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        <View style={[styles.imageArea, { backgroundColor: colors.surface }]}>
          {localImage ? (
            <Image source={localImage} style={styles.imageFill} resizeMode="contain" />
          ) : product.imageUrl ? (
            <Image source={{ uri: product.imageUrl }} style={styles.imageFill} resizeMode="contain" />
          ) : (
            <MaterialCommunityIcons name="tshirt-crew" size={80} color={inStock ? colors.primary : colors.textTertiary} />
          )}
          {!inStock && (
            <View style={[styles.soldOutOverlay, { backgroundColor: colors.error }]}>
              <Text style={[styles.soldOutText, { color: colors.text }]}>Agotado</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={[styles.productCategory, { color: colors.textTertiary }]}>Producto</Text>
          <Text style={[styles.productName, { color: colors.text }]}>{product.name}</Text>
          <Text style={[styles.productPrice, { color: colors.primary }]}>{formatCLP(product.price)}</Text>
          {product.description ? <Text style={[styles.productDesc, { color: colors.textSecondary }]}>{product.description}</Text> : null}

          <View style={styles.quantitySection}>
            <Text style={[styles.sizeLabel, { color: colors.text }]}>Cantidad</Text>
            <View style={styles.quantityRow}>
              <Pressable onPress={() => { if (quantity > 1) setQuantity((q) => q - 1); Haptics.selectionAsync(); }} style={[styles.qtyBtn, { backgroundColor: colors.surface }]}>
                <Ionicons name="remove" size={20} color={colors.text} />
              </Pressable>
              <Text style={[styles.qtyText, { color: colors.text }]}>{quantity}</Text>
              <Pressable onPress={() => { setQuantity((q) => q + 1); Haptics.selectionAsync(); }} style={[styles.qtyBtn, { backgroundColor: colors.surface }]}>
                <Ionicons name="add" size={20} color={colors.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {inStock && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16), backgroundColor: colors.background, borderTopColor: colors.divider }]}>
          <View style={styles.footerPrice}>
            <Text style={[styles.footerTotal, { color: colors.textSecondary }]}>Total</Text>
            <Text style={[styles.footerAmount, { color: colors.text }]}>{formatCLP(product.price * quantity)}</Text>
          </View>
          <Pressable onPress={handleAddToCart} style={({ pressed }) => [styles.addBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.9 : 1 }]}>
            <Ionicons name="bag-add" size={20} color={colors.text} />
            <Text style={[styles.addBtnText, { color: colors.text }]}>Agregar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16 },
  imageArea: { height: 240, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  imageFill: { width: '100%', height: '100%' },
  soldOutOverlay: { position: 'absolute', top: 16, right: 16, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  soldOutText: { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  productInfo: {},
  productCategory: { fontFamily: 'Inter_500Medium', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  productName: { fontFamily: 'Inter_700Bold', fontSize: 24, marginBottom: 8 },
  productPrice: { fontFamily: 'Inter_700Bold', fontSize: 22, marginBottom: 16 },
  productDesc: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  sizeLabel: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 10 },
  quantitySection: { marginBottom: 24 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  qtyBtn: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontFamily: 'Inter_700Bold', fontSize: 20, minWidth: 30, textAlign: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, borderTopWidth: 1, gap: 16 },
  footerPrice: { flex: 1 },
  footerTotal: { fontFamily: 'Inter_400Regular', fontSize: 12 },
  footerAmount: { fontFamily: 'Inter_700Bold', fontSize: 20 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 24 },
  addBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
