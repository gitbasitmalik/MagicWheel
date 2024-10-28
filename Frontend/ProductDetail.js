import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Animated,
} from "react-native";
import { CartContext, useMyContext } from "./CartContext";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const SPACING = 20;

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;
  const { isInCart, toggleCartItem } = useMyContext();
  const [imageHeight] = useState(new Animated.Value(height * 0.45));

  const handleAddToCart = () => {
    toggleCartItem(product);
    // Optional: Add animation or feedback here
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.wishlistButton}>
          <Ionicons name="heart-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.productImage}
            resizeMode="cover"
          />
          {product.isNew && (
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
          )}
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.categoryContainer}>
            <Text style={styles.productCategory}>{product.category.name}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.priceContainer}>
           
            {product.oldPrice && (
              <Text style={styles.oldPrice}>${product.oldPrice}</Text>
            )}
          </View>

          {/* Product Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                "Experience premium quality with this amazing product. Perfect for everyday use and designed with you in mind."}
            </Text>
          </View>

          {/* Additional Info */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <Ionicons
                name="shield-checkmark-outline"
                size={24}
                color="#007AFF"
              />
              <Text style={styles.featureText}>Quality Guaranteed</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="refresh-outline" size={24} color="#007AFF" />
              <Text style={styles.featureText}>30-Day Returns</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalPrice}>${product.price}</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.addButton,
            isInCart(product.id) && styles.removeButton,
          ]}
          onPress={handleAddToCart}
        >
          <Ionicons
            name={isInCart(product.id) ? "cart-outline" : "cart"}
            size={24}
            color="#FFF"
          />
          <Text style={styles.buttonText}>
            {isInCart(product.id) ? "Remove from Cart" : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING,
    paddingVertical: 10,
    position: "absolute",
    top: 44,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  wishlistButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: width,
    height: height * 0.45,
    backgroundColor: "#FFF",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  newBadge: {
    position: "absolute",
    top: SPACING,
    right: SPACING,
    backgroundColor: "#FF3B30",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  newBadgeText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 12,
  },
  productInfo: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: SPACING,
  },
  categoryContainer: {
    marginBottom: 10,
  },
  productCategory: {
    fontSize: 16,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  productName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 15,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
   
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "700",
    color: "#007AFF",
    marginRight: 10,
  },
  oldPrice: {
    fontSize: 18,
    color: "#999",
    textDecorationLine: "line-through",
  },
  descriptionContainer: {
    marginVertical: 20,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  featureItem: {
    alignItems: "center",
  },
  featureText: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING,
    paddingBottom: 34,
    borderTopWidth: 1,
    borderTopColor: "#EEE",
  },
  totalText: {
    fontSize: 24,
    color: "#666",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 100,
  },
  removeButton: {
    backgroundColor: "#FF3B30",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProductDetail;
