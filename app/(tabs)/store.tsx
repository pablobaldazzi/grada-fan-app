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
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { MOCK_PRODUCTS, PRODUCT_CATEGORIES, formatCLP, Product } from "@/lib/mock-data";
import { useCart } from "@/lib/cart-context";

const productIcons: Record<string, { name: any; family: string }> = {
  jersey_home: { name: 'tshirt-crew', family: 'mci' },
  jersey_away: { name: 'tshirt-crew-outline', family: 'mci' },
  scarf: { name: 'scarf', family: 'mci' },
  cap: { name: 'hat-fedora', family: 'mci' },
  hoodie: { name: 'tshirt-crew', family: 'mci' },
  ball: { name: 'soccer', family: 'mci' },
};

function ProductCard({ product }: { product: Product }) {
  const iconDef = productIcons[product.image] || { name: 'bag', family: 'ion' };

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({ pathname: "/product-detail", params: { productId: product.id } });
      }}
      style={({ pressed }) => [styles.productCard, { opacity: pressed ? 0.9 : 1 }]}
    >
      <View style={styles.productImage}>
        <MaterialCommunityIcons
          name={iconDef.name}
          size={40}
          color={product.inStock ? Colors.primary : Colors.textTertiary}
        />
        {!product.inStock && (
          <View style={styles.soldOutBadge}>
            <Text style={styles.soldOutText}>Agotado</Text>
          </View>
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{product.category}</Text>
        <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.productPrice}>{formatCLP(product.price)}</Text>
      </View>
    </Pressable>
  );
}

export default function StoreScreen() {
  const insets = useSafeAreaInsets();
  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { itemCount } = useCart();

  const filteredProducts = selectedCategory === 'Todos'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter(p => p.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + webTopInset + 16, paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Tienda</Text>
          <Pressable
            onPress={() => router.push("/cart")}
            style={({ pressed }) => [styles.cartBtn, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Ionicons name="bag-outline" size={22} color={Colors.text} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
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
          {PRODUCT_CATEGORIES.map(cat => (
            <Pressable
              key={cat}
              onPress={() => { Haptics.selectionAsync(); setSelectedCategory(cat); }}
              style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            >
              <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.productGrid}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter_700Bold',
    fontSize: 28,
    color: Colors.text,
  },
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 10,
    color: Colors.text,
  },
  chipsContainer: { marginBottom: 20 },
  chips: { gap: 8 },
  chip: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 13,
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.text,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  productCard: {
    width: '48%' as any,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    flexGrow: 1,
    flexBasis: '45%',
    maxWidth: '49%',
  },
  productImage: {
    height: 140,
    backgroundColor: Colors.surfaceHighlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  soldOutBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error + '90',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soldOutText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 10,
    color: Colors.text,
  },
  productInfo: {
    padding: 12,
  },
  productCategory: {
    fontFamily: 'Inter_500Medium',
    fontSize: 10,
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  productName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: Colors.text,
    marginBottom: 6,
  },
  productPrice: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: Colors.primary,
  },
});
