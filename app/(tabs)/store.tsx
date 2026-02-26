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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { useClub } from "@/lib/contexts/ClubContext";
import { formatCLP } from "@/lib/format";
import { useCart } from "@/lib/cart-context";
import { STORE_IMAGES } from "@/lib/store-images";
import type { BackendProduct } from "@/lib/schemas";

function ProductCard({ product, colors }: { product: BackendProduct; colors: Record<string, string> }) {
  const inStock = (product.stock ?? 0) > 0;
  const localImage = STORE_IMAGES[product.id];

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/product-detail", params: { productId: product.id } });
      }}
      style={({ pressed }) => [styles.productCard, { backgroundColor: colors.surface, borderColor: colors.cardBorder, opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={[styles.productImage, { backgroundColor: colors.primary + '15' }]}>
        {localImage ? (
          <Image source={localImage} style={styles.productImageImg} resizeMode="cover" />
        ) : product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.productImageImg} resizeMode="cover" />
        ) : (
          <MaterialCommunityIcons
            name="tshirt-crew"
            size={40}
            color={inStock ? colors.primary : colors.textTertiary}
          />
        )}
        {!inStock && (
          <View style={[styles.soldOutBadge, { backgroundColor: colors.error }]}>
            <Text style={[styles.soldOutText, { color: '#FFFFFF' }]}>Agotado</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={[styles.productCategory, { color: colors.textTertiary }]}>Producto</Text>
        <Text style={[styles.productName, { color: colors.text }]} numberOfLines={2}>{product.name}</Text>
        <Text style={[styles.productPrice, { color: colors.primary }]}>{formatCLP(product.price)}</Text>
      </View>
    </Pressable>
  );
}

const PRODUCT_CATEGORIES = ['Todos'];

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const { club, theme } = useClub();
  const colors = theme.colors;
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { itemCount } = useCart();

  const products = club?.products ?? [];
  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        // We already apply safe-area top padding manually; avoid double inset on iOS
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Tienda</Text>
          <Pressable
            onPress={() => router.push("/cart")}
            style={({ pressed }) => [styles.cartBtn, { backgroundColor: colors.surface, opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="bag-outline" size={22} color={colors.text} />
            {itemCount > 0 && (
              <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.cartBadgeText, { color: '#FFFFFF' }]}>{itemCount}</Text>
              </View>
            )}
          </Pressable>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={styles.chipsContainer}
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => { Haptics.selectionAsync(); setSelectedCategory(cat); }}
              style={[styles.chip, { backgroundColor: colors.surface }, selectedCategory === cat && { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.chipText, { color: colors.textSecondary }, selectedCategory === cat && { color: '#FFFFFF' }]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.productGrid}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} colors={colors} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontFamily: 'Inter_700Bold', fontSize: 28 },
  cartBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cartBadge: { position: 'absolute', top: -2, right: -2, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartBadgeText: { fontFamily: 'Inter_700Bold', fontSize: 10 },
  chipsContainer: { marginBottom: 20 },
  chips: { gap: 8 },
  chip: { borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  chipText: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  productCard: { width: '48%' as any, borderRadius: 14, overflow: 'hidden', borderWidth: 1, flexGrow: 1, flexBasis: '45%', maxWidth: '49%' },
  productImage: { height: 140, alignItems: 'center', justifyContent: 'center' },
  productImageImg: { width: '100%', height: '100%' },
  soldOutBadge: { position: 'absolute', top: 8, right: 8, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  soldOutText: { fontFamily: 'Inter_600SemiBold', fontSize: 10 },
  productInfo: { padding: 12 },
  productCategory: { fontFamily: 'Inter_500Medium', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  productName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, marginBottom: 6 },
  productPrice: { fontFamily: 'Inter_700Bold', fontSize: 16 },
});
