import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";

const OrderListingDetail = () => {
  const route = useRoute();
  console.log(route.params);
  const {
    listing,
    order_id,
    seller,
    orderAddress,
    orderStatus,
    orderAddressName,
    orderAddressCity,
    orderPhoneNumber,
    orderAddressPC,
  } = route.params;

  // Check if data exists
  if (!listing || !seller) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Error: Listing or Seller information is missing.
        </Text>
      </View>
    );
  }

  const handleContactSeller = () => {
    Alert.alert(
      "Contact Seller",
      `Would you like to contact ${seller.seller_name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Email",
          onPress: () => Alert.alert("Opening Email...", seller.seller_email),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Listing Image */}
      {listing.images?.length > 0 && (
        <Image
          source={{ uri: listing.images[0].url }}
          style={styles.listingImage}
        />
      )}

      {/* Listing Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{listing.name}</Text>
        <Text style={styles.category}>{listing.category}</Text>
        <Text style={styles.price}>PKR {listing.price}</Text>
      </View>

      {/* Seller Details */}
      <View style={styles.sellerContainer}>
        <Text style={styles.sectionTitle}>Seller Information</Text>
        <View style={styles.sellerDetails}>
          <Image
            source={{ uri: seller.seller_profile_image }}
            style={styles.sellerImage}
          />
          <View style={styles.sellerInfo}>
            <Text style={styles.sellerName}>{seller.seller_name}</Text>
            <Text style={styles.sellerEmail}>{seller.seller_email}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={handleContactSeller}
        >
          <Text style={styles.contactButtonText}>Contact Seller</Text>
        </TouchableOpacity>
      </View>

      {/* Order Details */}
      <View style={styles.orderContainer}>
        <Text style={styles.sectionTitle}>Order Information</Text>
        <Text style={styles.orderId}>Status: {orderStatus}</Text>
        <Text style={styles.orderId}>Name: {orderAddressName}</Text>
        <Text style={styles.orderId}>Adress: {orderAddress}</Text>
        <Text style={styles.orderId}>City: {orderAddressCity}</Text>
        <Text style={styles.orderId}>Postal Code: {orderAddressPC}</Text>
        <Text style={styles.orderId}>Phone Number: {orderPhoneNumber}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  listingImage: { width: "100%", height: 200, resizeMode: "cover" },
  detailsContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 16, color: "#555", marginBottom: 8 },
  price: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 16 },
  description: { fontSize: 16, color: "#555" },
  sellerContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  sellerDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sellerImage: { width: 60, height: 60, borderRadius: 30, marginRight: 16 },
  sellerInfo: { flex: 1 },
  sellerName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  sellerEmail: { fontSize: 16, color: "#555" },
  contactButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  contactButtonText: { fontSize: 16, color: "#fff", fontWeight: "bold" },
  orderContainer: { padding: 16 },
  orderId: { fontSize: 16, color: "#555" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red" },
});

export default OrderListingDetail;
