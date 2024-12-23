import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  Animated,
  TouchableOpacity,
} from "react-native";
import { useMyContext } from "./CartContext";
import {
  IconButton,
  Button as PaperButton,
  Surface,
  Text,
  Title,
  Paragraph,
  useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Cart = ({ navigation }) => {
  const theme = useTheme();
  const { cartItems: cart, removeFromCart, updateCartItem } = useMyContext();
  console.log(cart);
  const [cartItems, setCartItems] = useState([]);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
    updateCartItem({ ...updatedCart.find((item) => item.id === itemId) });
  };

  const handleDecreaseQuantity = (itemId) => {
    console.log(itemId);
    const updatedCart = cartItems.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    updateCartItem({ ...updatedCart.find((item) => item.id === itemId) });
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const renderItem = ({ item, index }) => (
    <Animated.View style={[styles.itemWrapper]}>
      <Surface style={styles.itemCard}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.imageOverlay}
        />
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Title style={styles.productName}>{item.name}</Title>
            <TouchableOpacity
              onPress={() => removeFromCart(item.id)}
              style={styles.deleteButton}
            >
              <IconButton icon="close" size={20} iconColor="#fff" x />
            </TouchableOpacity>
          </View>
          <View style={styles.itemFooter}>
            <View style={styles.priceTag}>
              <Text style={styles.currency}>RS</Text>
              <Text style={styles.price}>{item.price.toFixed(2)}</Text>
            </View>
            <View style={styles.quantityControl}>
              <IconButton
                icon="minus"
                size={18}
                iconColor="#fff"
                onPress={() => handleDecreaseQuantity(item.id)}
                disabled={item.quantity <= 1}
                style={[
                  styles.quantityButton,
                  item.quantity <= 1 && styles.quantityButtonDisabled,
                ]}
              />
              <Text style={styles.quantity}>{item.quantity}</Text>
              <IconButton
                icon="plus"
                size={18}
                iconColor="#fff"
                onPress={() => handleIncreaseQuantity(item.id)}
                style={styles.quantityButton}
              />
            </View>
          </View>
        </View>
      </Surface>
    </Animated.View>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <LinearGradient
          colors={["rgba(255,255,255,0.9)", "rgba(255,255,255,0.7)"]}
          style={styles.headerGradient}
        >
          <Title style={styles.headerTitle}>Cart</Title>
          <Text style={styles.itemCount}>{cartItems.length} items</Text>
        </LinearGradient>
      </Animated.View>

      {cartItems && cartItems.length > 0 ? (
        <>
          <Animated.FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: true }
            )}
          />
          <Surface style={styles.checkoutContainer}>
            <LinearGradient
              colors={["rgba(255,255,255,0.8)", "#ffffff"]}
              style={styles.checkoutGradient}
            >
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <View style={styles.totalAmount}>
                  <Text style={styles.totalCurrency}>RS</Text>
                  <Text style={styles.totalPrice}>
                    {totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <PaperButton
                mode="contained"
                onPress={() => navigation.navigate("Checkout")}
                style={styles.checkoutButton}
                contentStyle={styles.checkoutButtonContent}
              >
                Checkout
              </PaperButton>
            </LinearGradient>
          </Surface>
        </>
      ) : (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name="shopping-outline"
            size={80}
            color={theme.colors.primary}
            style={styles.emptyIcon}
          />
          <Title style={styles.emptyTitle}>Your cart is empty</Title>
          <Paragraph style={styles.emptyText}>
            Looks like you haven't added anything yet
          </Paragraph>
          <PaperButton
            mode="contained"
            onPress={() => navigation.navigate("Home")}
            style={styles.browseButton}
            contentStyle={styles.browseButtonContent}
          >
            Start Shopping
          </PaperButton>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  headerGradient: {
    paddingTop: 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  itemCount: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
  cartList: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  itemWrapper: {
    marginBottom: 20,
  },
  itemCard: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  itemContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  productName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
  itemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginRight: 2,
  },
  price: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    borderRadius: 20,
    padding: 4,
  },
  quantityButton: {
    margin: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 15,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantity: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: "center",
  },
  deleteButton: {
    backgroundColor: "rgba(255,0,0,0.6)",
    borderRadius: 15,
  },
  checkoutContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  checkoutGradient: {
    padding: 20,
    paddingBottom: 30,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    color: "#666",
    fontWeight: "600",
  },
  totalAmount: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  totalCurrency: {
    fontSize: 20,
    color: "#1a1a1a",
    fontWeight: "700",
    marginRight: 2,
  },
  totalPrice: {
    fontSize: 32,
    color: "#1a1a1a",
    fontWeight: "700",
  },
  checkoutButton: {
    borderRadius: 16,
    elevation: 0,
  },
  checkoutButtonContent: {
    paddingVertical: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    marginBottom: 20,
    opacity: 0.9,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  browseButton: {
    borderRadius: 16,
    paddingHorizontal: 30,
    elevation: 0,
  },
  browseButtonContent: {
    paddingVertical: 12,
  },
});

export default Cart;
