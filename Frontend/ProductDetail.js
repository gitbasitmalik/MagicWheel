import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { Text } from "react-native-paper";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useMyContext } from "./CartContext";
const { width, height } = Dimensions.get("window");

const ProductDetail = ({ route, navigation }) => {
  const { product, wishlistProducts } = route.params;
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(false);
  const { isInCart, toggleCartItem, userInfo } = useMyContext();

  const isInWishlist = (productId) => {
    return wishlistProducts.some(
      (item) => item.id === productId || item === productId
    );
  };
  const handleAddToCart = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggleCartItem(product);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {product.onSale && (
            <BlurView intensity={80} style={styles.saleBadge}>
              <MaterialCommunityIcons name="flash" size={16} color="#6366F1" />
              <Text style={styles.saleText}>SALE</Text>
            </BlurView>
          )}
        </View>

        <LinearGradient
          colors={["rgba(99, 102, 241, 0.1)", "rgba(99, 102, 241, 0.05)"]}
          style={styles.detailsContainer}
        >
          <Text style={styles.category}>{product.category.name}</Text>
          <Text style={styles.title}>{product.name}</Text>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>
              Rs {product.onSale ? product.salePrice : product.price}
            </Text>
            {product.onSale && (
              <Text style={styles.originalPrice}>Rs {product.price}</Text>
            )}
          </View>

          <View style={styles.divider} />

          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={24}
                color="#6366F1"
              />
              <Text style={styles.featureText}>Free Delivery</Text>
            </View>
            <View style={styles.featureItem}>
              <MaterialCommunityIcons
                name="shield-check"
                size={24}
                color="#6366F1"
              />
              <Text style={styles.featureText}>1 Year Warranty</Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>

      <BlurView intensity={80} style={styles.bottomBar}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>
            Rs {product.onSale ? product.salePrice : product.price}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            isInCart(product.id) && styles.removeButton,
            loading && styles.loadingButton,
          ]}
          onPress={handleAddToCart}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons
                name={isInCart(product.id) ? "cart-remove" : "cart-plus"}
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.buttonText}>
                {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 24, // Added more space from the top
    backgroundColor: "#fff", // Added a subtle background to the header
    borderBottomWidth: 1, // Optional border for definition
    borderBottomColor: "#fff",
  },
  backButton: { padding: 8 },
  wishlistButton: { padding: 8 },
  imageContainer: { width, height: height / 2 },
  mainImage: { width: "100%", height: "100%" },
  saleBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 8,
  },
  saleText: { marginLeft: 4, color: "#6366F1", fontWeight: "bold" },
  detailsContainer: { padding: 16 },
  category: { fontSize: 14, color: "#9CA3AF", marginBottom: 8 },
  title: { fontSize: 24, fontWeight: "bold", color: "#1F2937" },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  price: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  originalPrice: {
    fontSize: 16,
    color: "#9CA3AF",
    textDecorationLine: "line-through",
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  descriptionTitle: { fontSize: 18, fontWeight: "bold", color: "#1F2937" },
  description: { fontSize: 16, color: "#4B5563", marginTop: 8 },
  featuresContainer: { flexDirection: "row", marginTop: 16 },
  featureItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  featureText: { marginLeft: 8, color: "#4B5563" },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  totalContainer: {},
  totalLabel: { fontSize: 16, color: "#9CA3AF" },
  totalPrice: { fontSize: 20, fontWeight: "bold", color: "#1F2937" },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 16, // Increased padding for a better look
    paddingHorizontal: 20,
    borderRadius: 12, // Slightly rounded for a modern design
    shadowColor: "#000", // Added shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4, // For Android shadow
  },
  removeButton: { backgroundColor: "#EF4444" },
  loadingButton: { backgroundColor: "#9CA3AF" },
  buttonText: { marginLeft: 8, color: "#FFFFFF", fontWeight: "bold" },
});
export default ProductDetail;
