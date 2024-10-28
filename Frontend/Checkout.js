import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, ScrollView } from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useMyContext } from "./CartContext";
import { fetchKey, fetchPaymentSheetParams, saveTheOrder } from "./api/api";
import {
  Text,
  Card,
  TextInput,
  Button,
  Surface,
  Title,
  Paragraph,
  IconButton,
  useTheme,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Checkout = ({ navigation }) => {
  const theme = useTheme();
  const { cartItems, removeFromCart } = useMyContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form states
  const [name, setName] = useState("Nazeef Masood");
  const [address, setAddress] = useState("ABC, Road Abbottabad");
  const [city, setCity] = useState("Abbottabad");
  const [phoneNumber, setPhoneNumber] = useState("03000892092");
  const [postalCode, setPostalCode] = useState("392822");
  const [publishableKey, setPublishableKey] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    fetchPublishableKey();
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!name.trim()) errors.name = "Name is required";
    if (!address.trim()) errors.address = "Address is required";
    if (!city.trim()) errors.city = "City is required";
    if (!phoneNumber.trim()) errors.phoneNumber = "Phone number is required";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchPublishableKey = async () => {
    try {
      const result = await fetchKey();
      setPublishableKey(result.data.key);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch payment information.");
    }
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total.toFixed(2);
  };

  const renderItem = ({ item }) => (
    <Card style={styles.itemCard} mode="elevated">
      <Card.Content style={styles.itemContainer}>
        <View style={styles.itemInfo}>
          <Title style={styles.itemName}>{item.name}</Title>
          <View style={styles.priceQuantityContainer}>
            <Paragraph style={styles.itemPrice}>
              ${(item.price * item.quantity).toFixed(2)}
            </Paragraph>
            <Text style={styles.quantityText}>Qty: {item.quantity}</Text>
          </View>
        </View>
        <IconButton
          icon="delete-outline"
          size={24}
          iconColor={theme.colors.error}
          onPress={() => removeFromCart(item.id)}
        />
      </Card.Content>
    </Card>
  );

  const initializePaymentSheet = async (total) => {
    try {
      const response = await fetchPaymentSheetParams({ total });
      const { paymentIntent, ephemeralKey, customer } = response.data;

      setPaymentIntentId(paymentIntent);
      setCustomerId(customer);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name },
        returnURL: "https://localhost:3000",
      });

      if (!error) {
        setLoading(true);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(
        `Payment Error`,
        "Please try again or use a different payment method."
      );
    } else {
      await saveOrder();
      clearFields();
      Alert.alert(
        "Success",
        "Thank you for your order! Your payment was successful."
      );
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly.");
      return;
    }

    const total = calculateTotal();
    await initializePaymentSheet(total);
    if (loading) {
      await openPaymentSheet();
    }
  };

  const saveOrder = async () => {
    try {
      const orderData = {
        customer: customerId,
        items: cartItems.map((item) => ({
          productId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: calculateTotal(),
        phoneNumber,
        shippingAddress: {
          name,
          address,
          postalCode,
          city,
        },
        paymentDetails: {
          paymentIntentId,
          customerId,
          paymentMethod: "card",
          status: "completed",
        },
      };

      await saveTheOrder(orderData);
    } catch (error) {
      console.error("Error saving order:", error);
      Alert.alert("Error", "There was a problem processing your order.");
    }
  };

  const clearFields = () => {
    setName("");
    setAddress("");
    setPhoneNumber("");
    setPostalCode("");
    setPaymentIntentId("");
    setCustomerId("");
    setCity("");
  };

  if (!publishableKey) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Preparing checkout...</Text>
      </View>
    );
  }

  return (
    <StripeProvider publishableKey={publishableKey}>
      <Surface style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title style={styles.title}>Checkout</Title>

          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Order Summary</Title>
              <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
              />
            </Card.Content>
          </Card>

          <Card style={styles.section}>
            <Card.Content>
              <Title style={styles.sectionTitle}>Shipping Information</Title>
              <TextInput
                mode="outlined"
                label="Full Name"
                value={name}
                onChangeText={setName}
                style={styles.input}
                error={formErrors.name}
                left={<TextInput.Icon icon="account" />}
              />
              <TextInput
                mode="outlined"
                label="Address"
                value={address}
                onChangeText={setAddress}
                style={styles.input}
                error={formErrors.address}
                left={<TextInput.Icon icon="home" />}
              />
              <TextInput
                mode="outlined"
                label="City"
                value={city}
                onChangeText={setCity}
                style={styles.input}
                error={formErrors.city}
                left={<TextInput.Icon icon="city" />}
              />
              <TextInput
                mode="outlined"
                label="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                style={styles.input}
                error={formErrors.phoneNumber}
                left={<TextInput.Icon icon="phone" />}
              />
              <TextInput
                mode="outlined"
                label="Postal Code"
                value={postalCode}
                onChangeText={setPostalCode}
                keyboardType="number-pad"
                style={styles.input}
                error={formErrors.postalCode}
                left={<TextInput.Icon icon="post" />}
              />
            </Card.Content>
          </Card>

          <Surface style={styles.totalSection} elevation={2}>
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${calculateTotal()}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Shipping</Text>
              <Text style={styles.totalValue}>Free</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandTotalLabel}>Total</Text>
              <Text style={styles.grandTotalValue}>${calculateTotal()}</Text>
            </View>

            <Button
              mode="contained"
              onPress={handleCheckout}
              loading={loading}
              style={styles.payButton}
              contentStyle={styles.payButtonContent}
              labelStyle={styles.payButtonLabel}
            >
              Pay Now
            </Button>
          </Surface>
        </ScrollView>
      </Surface>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  itemCard: {
    marginBottom: 12,
    borderRadius: 8,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    marginBottom: 4,
  },
  priceQuantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 16,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  quantityText: {
    fontSize: 14,
    color: "#666",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  totalSection: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "500",
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 24,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 12,
  },
  payButton: {
    marginTop: 20,
    borderRadius: 8,
  },
  payButtonContent: {
    paddingVertical: 8,
  },
  payButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Checkout;
