import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { TextInput } from "react-native-paper";

import {
  addOrUpdateShippingDetailsApi,
  fetchKey,
  fetchPaymentSheetParams,
  getShippingDetailsApi,
  saveTheOrderListing,
} from "../api/api";
import {
  StripeProvider,
  initPaymentSheet,
  presentPaymentSheet,
} from "@stripe/stripe-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Card,
  Button,
  Surface,
  Title,
  Paragraph,
  IconButton,
  useTheme,
  ActivityIndicator,
  Divider,
} from "react-native-paper";

const ListingCheckout = ({ route, navigation }) => {
  const { listing } = route.params;
  const [name, setName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [postalCode, setPostalCode] = useState(null);
  const [publishableKey, setPublishableKey] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [userUid, setUserUid] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [hasShippingInformation, setHasShippingInformation] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    fetchPublishableKey();
  }, []);

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
        await fetchUserShippingDetails(parsedUser.uid);
      }
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Unable to fetch user data. Please log in again.");
      navigation.navigate("Login");
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
      console.log("Sssss12312312321");
      await saveOrder(); // This should be called only after the payment is successful
      clearFields();
      Alert.alert(
        "Success",
        "Thank you for your order! Your payment was successful."
      );
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
      } else {
        setHasShippingInformation(false);
      }
    } catch (error) {
      setHasShippingInformation(false);
    }
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
        userUid,
        shippingInfo,
      });
      if (response.data.success) {
        Alert.alert("Success", "Shipping information updated.");
        setHasShippingInformation(true);
        fetchUserShippingDetails();
      } else {
        Alert.alert("Error", "Failed to save shipping information.");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) {
      Alert.alert("Error", "Please fill in all required fields correctly.");
      return;
    }

    const total = listing.price;
    await initializePaymentSheet(total);
    if (!loading) {
      await openPaymentSheet();
    }
  };

  const saveOrder = async () => {
    try {
      console.log(userUid);
      const orderData = {
        customer: customerId,
        buyer_uuid: userUid,
        seller_uuid: listing.user_uuid,
        listing_uid: listing.listing_uid,
        name: listing.name,
        quantity: 1,
        price: listing.price,
        totalAmount: listing.price,
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

      console.log(orderData);

      await saveTheOrderListing(orderData);
      clearFields();
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Error", "There was a problem processing your order.");
    }
  };

  const initializePaymentSheet = async () => {
    try {
      setLoading(true);
      const response = await fetchPaymentSheetParams({
        total: listing.price,
        userEmail,
      });
      const { paymentIntent, setupIntent, ephemeralKey, customer } =
        response.data;

      setPaymentIntentId(paymentIntent);
      setCustomerId(customer);

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Magic Wheel.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        setupIntentClientSecret: setupIntent, // Add setup intent
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name },
        returnURL: "https://localhost:3000",
        style: "alwaysSave", // Always show save card checkbox
      });

      if (!error) {
        setLoading(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
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

  return (
    <StripeProvider publishableKey={publishableKey}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Title style={styles.title}>Checkout</Title>

        <Card style={styles.section}>
          <Card.Content>{renderShippingInfo()}</Card.Content>
        </Card>

        <Surface style={styles.totalSection} elevation={2}>
          <Divider style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Name</Text>
            <Text style={styles.totalValue}>{listing.name}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>PKR{listing.price}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={styles.totalValue}>Free</Text>
          </View>
          <Divider style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>PKR{listing.price}</Text>
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
  );
};

export default ListingCheckout;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 5,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  paymentOption: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedOption: {
    borderColor: "#007BFF",
    backgroundColor: "#E7F1FF",
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
