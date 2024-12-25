import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { useMyContext } from "./CartContext";
import {
  fetchKey,
  fetchPaymentSheetParams,
  getSavedCards,
  getShippingDetailsApi,
  saveTheOrder,
  addOrUpdateShippingDetailsApi,
} from "./api/api";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Checkout = ({ navigation }) => {
  const { cartItems, removeFromCart } = useMyContext();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form states
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [publishableKey, setPublishableKey] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [userUid, setUserUid] = useState(null);

  const [hasShippingInformation, setHasShippingInformation] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      fetchPublishableKey();
    }, [])
  );

  const getData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("Login");
        return;
      }
      const parsedUser = JSON.parse(user);
      setUserUid(parsedUser.uid);
      setUserEmail(parsedUser.email);

      // Fetch saved cards if user exists
      if (parsedUser.uid) {
        await fetchSavedCards(parsedUser.email);
        await fetchUserShippingDetails(parsedUser.uid);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Unable to fetch user data. Please log in again.");
      navigation.navigate("Login");
    }
  };

  const fetchUserShippingDetails = async (userId) => {
    try {
      const response = await getShippingDetailsApi({ userId });
      console.log(response.data);
      if (response.data.data.success) {
        const shippingDetails = response.data.data;
        if (shippingDetails) {
          setName(shippingDetails.fullName);
          setAddress(shippingDetails.address);
          setCity(shippingDetails.city);
          setPhoneNumber(shippingDetails.phone);
          setPostalCode(shippingDetails.postalCode);
          setHasShippingInformation(true);
        }
        console.log("Sssss");
      } else {
        setHasShippingInformation(false);
      }
    } catch (error) {
      setHasShippingInformation(false);
    }
  };

  const fetchSavedCards = async (userId) => {
    try {
    } catch (error) {}
  };

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
      setPublishableKey(result.data?.key);
      getData();
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

  const renderShippingInfo = () => {
    if (!hasShippingInformation) {
      return (
        <View>
          <Text style={styles.sectionTitle}>Shipping Information</Text>
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
          <TouchableOpacity onPress={saveShippingInfo}>
            <Button mode="outlined" style={styles.editButton}>
              Save Information
            </Button>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View>
        <Text style={styles.sectionTitle}>Shipping Information</Text>
        <Text>{name}</Text>
        <Text>{address}</Text>
        <Text>{city}</Text>
        <Text>{phoneNumber}</Text>
        <Text>{postalCode}</Text>
        <TouchableOpacity onPress={() => setHasShippingInformation(false)}>
          <Button mode="outlined" style={styles.editButton}>
            Edit
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  const saveShippingInfo = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly.");
      return;
    }

    const shippingInfo = {
      fullName: name,
      address,
      city,
      phone: phoneNumber,
      postalCode,
    };

    try {
      const response = await addOrUpdateShippingDetailsApi({
        userId: userUid,
        shippingInfo,
      });
      if (response.data.success) {
        Alert.alert("Success", "Shipping information updated.");
        setHasShippingInformation(true);
      } else {
        Alert.alert("Error", "Failed to save shipping information.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const initializePaymentSheet = async (total) => {
    try {
      setLoading(true);
      const response = await fetchPaymentSheetParams({
        total,
        userEmail,
      });
      console.log(response.data);
      const { paymentIntent, setupIntent, ephemeralKey, customer } =
        response.data;

      // Store these values immediately when received
      setPaymentIntentId(paymentIntent);
      setCustomerId(customer);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Magic Wheel.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        setupIntentClientSecret: setupIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name },
        returnURL: "https://localhost:3000",
        style: "alwaysSave",
      });

      if (error) {
        Alert.alert("Error", "Failed to initialize payment sheet");
        setLoading(false);
        return false;
      }

      setLoading(false);
      return true;
    } catch (error) {
      console.error("Payment sheet initialization error:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
      setLoading(false);
      return false;
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly.");
      return;
    }

    const total = calculateTotal();
    const initialized = await initializePaymentSheet(total);

    if (!initialized) {
      return;
    }

    await openPaymentSheet();
  };

  const openPaymentSheet = async () => {
    try {
      const { error } = await presentPaymentSheet();

      if (error) {
        Alert.alert(
          "Payment Error",
          "Please try again or use a different payment method."
        );
        return;
      }

      await saveOrder();
      Alert.alert(
        "Success",
        "Thank you for your order! Your payment was successful."
      );
      navigation.navigate("Home");
    } catch (error) {
      console.error("Payment sheet presentation error:", error);
      Alert.alert("Error", "There was a problem processing your payment.");
    }
  };

  const saveOrder = async () => {
    try {
      const orderData = {
        customer: customerId,
        user_uuid: userUid,
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

      console.log("Saving order with data:", orderData);
      await saveTheOrder(orderData);
      clearCart();
      clearFields();
    } catch (error) {
      console.error("Error saving order:", error);
      Alert.alert("Error", "There was a problem saving your order.");
      throw error; // Re-throw to be handled by the caller
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

  const clearCart = () => {
    cartItems.forEach((item) => {
      removeFromCart(item.id);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StripeProvider publishableKey={publishableKey}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Title style={styles.title}>Checkout</Title>
          <Card style={styles.section}>
            <Card.Content>{renderShippingInfo()}</Card.Content>
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
              disabled={!hasShippingInformation}
              style={styles.payButton}
              contentStyle={styles.payButtonContent}
              labelStyle={styles.payButtonLabel}
            >
              Pay Now
            </Button>
          </Surface>
        </ScrollView>
      </StripeProvider>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    marginTop: 16,
  },
  section: {
    margin: 16,
    marginTop: 32,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  input: {
    marginBottom: 16,
  },
  editButton: {
    marginTop: 16,
  },
  totalSection: {
    margin: 16,
    padding: 16,
  },
  divider: {
    marginVertical: 8,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: "bold",
  },
  payButton: {
    marginTop: 16,
  },
  payButtonContent: {
    height: 56,
  },
  payButtonLabel: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Checkout;
