import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, FlatList, SafeAreaView } from "react-native";
import { useMyContext } from "./CartContext";
import {
  Card,
  IconButton,
  Button as PaperButton,
  Surface,
  Text,
  Title,
  Paragraph,
  useTheme,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Cart = ({ navigation }) => {
  const theme = useTheme();
  const { cartItems: cart, removeFromCart, updateCartItem } = useMyContext();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  // Calculate total amount
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
    const updatedCart = cartItems.map((item) =>
      item.id === itemId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
    updateCartItem({ ...updatedCart.find((item) => item.id === itemId) });
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    removeFromCart(itemId);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.itemCard} mode="elevated">
      <Card.Content style={styles.itemContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={styles.itemDetails}>
          <Title style={styles.productName}>{item.name}</Title>
          <Paragraph style={styles.productCategory}>
            {item.category.name}
          </Paragraph>
          <View style={styles.priceContainer}>
            <Text style={styles.currency}>$</Text>
            <Title style={styles.productPrice}>{item.price.toFixed(2)}</Title>
          </View>

          <View style={styles.quantityContainer}>
            <IconButton
              icon="minus-circle"
              size={24}
              mode="contained"
              iconColor={theme.colors.primary}
              style={styles.quantityButton}
              onPress={() => handleDecreaseQuantity(item.id)}
              disabled={item.quantity <= 1}
            />
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <IconButton
              icon="plus-circle"
              size={24}
              mode="contained"
              iconColor={theme.colors.primary}
              style={styles.quantityButton}
              onPress={() => handleIncreaseQuantity(item.id)}
            />
          </View>
        </View>
        <IconButton
          icon="delete-outline"
          size={24}
          iconColor={theme.colors.error}
          onPress={() => handleRemoveItem(item.id)}
          style={styles.deleteButton}
        />
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Surface style={styles.header} elevation={2}>
        <Title style={styles.headerTitle}>Shopping Cart</Title>
      </Surface>

      {cartItems && cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.cartList}
            showsVerticalScrollIndicator={false}
          />
          <Surface style={styles.bottomBar} elevation={8}>
            <Divider style={styles.divider} />
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <View style={styles.totalPriceContainer}>
                <Text style={styles.currencyTotal}>$</Text>
                <Title style={styles.totalAmount}>
                  {totalAmount.toFixed(2)}
                </Title>
              </View>
            </View>
            <PaperButton
              mode="contained"
              onPress={() => navigation.navigate("Checkout")}
              style={styles.checkoutButton}
              labelStyle={styles.checkoutButtonLabel}
            >
              Proceed to Checkout
            </PaperButton>
          </Surface>
        </>
      ) : (
        <View style={styles.emptyCart}>
          <MaterialCommunityIcons
            name="cart-off"
            size={80}
            color={theme.colors.primary}
          />
          <Title style={styles.emptyCartText}>Your cart is empty</Title>
          <Paragraph style={styles.emptyCartSubtext}>
            Start adding items to your cart
          </Paragraph>
          <PaperButton
            mode="contained"
            onPress={() => navigation.navigate("MarketPlace")}
            style={styles.startShoppingButton}
            labelStyle={styles.startShoppingLabel}
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
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  cartList: {
    padding: 16,
  },
  itemCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#ffffff",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  currency: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2e2e2e",
    marginRight: 2,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e2e2e",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    margin: 0,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "bold",
    marginHorizontal: 12,
  },
  deleteButton: {
    alignSelf: "flex-start",
  },
  bottomBar: {
    padding: 16,
    backgroundColor: "#ffffff",
  },
  divider: {
    marginBottom: 16,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666666",
  },
  totalPriceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currencyTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2e2e2e",
    marginRight: 2,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2e2e2e",
  },
  checkoutButton: {
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
  },
  checkoutButtonLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyCartText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 24,
    marginBottom: 8,
  },
  emptyCartSubtext: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 24,
  },
  startShoppingButton: {
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 8,
  },
  startShoppingLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Cart;
