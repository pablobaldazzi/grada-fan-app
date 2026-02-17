import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { MOCK_PRODUCTS, formatCLP } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

export default function ProductDetailScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { productId } = useLocalSearchParams<{ productId: string }>();
  const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) return;
    addItem({
      id: `merch-${product.id}-${selectedSize || 'one'}-${Date.now()}`,
      type: 'merch',
      name: product.name,
      price: product.price,
      quantity,
      details: selectedSize ? `Talla: ${selectedSize}` : product.category,
      size: selectedSize || undefined,
    });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push("/cart");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/cart")}
          style={styles.backBtn}
        >
          <Ionicons name="bag-outline" size={22} color={Colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageArea}>
          <MaterialCommunityIcons
            name="tshirt-crew"
            size={80}
            color={product.inStock ? Colors.primary : Colors.textTertiary}
          />
          {!product.inStock && (
            <View style={styles.soldOutOverlay}>
              <Text style={styles.soldOutText}>Agotado</Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={styles.productCategory}>{product.category}</Text>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatCLP(product.price)}</Text>
          <Text style={styles.productDesc}>{product.description}</Text>

          {product.sizes && (
            <View style={styles.sizesSection}>
              <Text style={styles.sizeLabel}>Talla</Text>
              <View style={styles.sizesRow}>
                {product.sizes.map(size => (
                  <Pressable
                    key={size}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setSelectedSize(size);
                    }}
                    style={[
                      styles.sizeBtn,
                      selectedSize === size && styles.sizeBtnActive,
                    ]}
                  >
                    <Text style={[
                      styles.sizeBtnText,
                      selectedSize === size && styles.sizeBtnTextActive,
                    ]}>{size}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          <View style={styles.quantitySection}>
            <Text style={styles.sizeLabel}>Cantidad</Text>
            <View style={styles.quantityRow}>
              <Pressable
                onPress={() => { if (quantity > 1) setQuantity(q => q - 1); Haptics.selectionAsync(); }}
                style={styles.qtyBtn}
              >
                <Ionicons name="remove" size={20} color={Colors.text} />
              </Pressable>
              <Text style={styles.qtyText}>{quantity}</Text>
              <Pressable
                onPress={() => { setQuantity(q => q + 1); Haptics.selectionAsync(); }}
                style={styles.qtyBtn}
              >
                <Ionicons name="add" size={20} color={Colors.text} />
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {product.inStock && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === "web" ? 34 : 16) }]}>
          <View style={styles.footerPrice}>
            <Text style={styles.footerTotal}>Total</Text>
            <Text style={styles.footerAmount}>{formatCLP(product.price * quantity)}</Text>
          </View>
          <Pressable
            onPress={handleAddToCart}
            style={({ pressed }) => [
              styles.addBtn,
              { opacity: pressed ? 0.9 : 1 },
              (product.sizes && !selectedSize) && styles.addBtnDisabled,
            ]}
            disabled={!!(product.sizes && !selectedSize)}
          >
            <Ionicons name="bag-add" size={20} color={Colors.text} />
            <Text style={styles.addBtnText}>Agregar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: 16 },
  imageArea: {
    height: 240,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  soldOutOverlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: Colors.error,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  soldOutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 12,
    color: Colors.text,
  },
  productInfo: {},
  productCategory: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
  },
  productName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: Colors.text,
    marginBottom: 8,
  },
  productPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 16,
  },
  productDesc: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 24,
  },
  sizesSection: { marginBottom: 24 },
  sizeLabel: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 10,
  },
  sizesRow: {
    flexDirection: 'row',
    gap: 10,
  },
  sizeBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  sizeBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sizeBtnTextActive: {
    color: Colors.primary,
  },
  quantitySection: { marginBottom: 24 },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
    minWidth: 30,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: 16,
  },
  footerPrice: { flex: 1 },
  footerTotal: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  footerAmount: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    color: Colors.text,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  addBtnDisabled: {
    backgroundColor: Colors.surfaceHighlight,
  },
  addBtnText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 15,
    color: Colors.text,
  },
});
