import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Button,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { updateAdminOrderStatus } from "../../api/api";

const OrderDetailsScreen = () => {
  const { params } = useRoute();
  const { orderId, orderDetails } = params;

  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (newStatus) => {
    // Prevent status update if the order is already in the desired status
    setLoading(true);
    if (orderDetails.orderStatus === newStatus) {
      Alert.alert("No changes", `Order is already ${newStatus}`);
      return;
    }

    const orderData = {
      order_id: orderId,
      status: newStatus,
    };
    const result = await updateAdminOrderStatus(orderData);
    if (result.status === 200) {
      Alert.alert(
        "Order status updated",
        `Order status updated to ${newStatus}`
      );
      setLoading(false);
    } else {
      Alert.alert("Error", "Failed to update order status");
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.orderId}>Order ID: {orderDetails._id}</Text>
      <Text style={styles.orderStatus}>Status: {orderDetails.orderStatus}</Text>
      <Text style={styles.orderTotal}>
        Total Amount: {orderDetails.totalAmount} {orderDetails.currency}
      </Text>

      <Text style={styles.sectionTitle}>Shipping Address:</Text>
      <Text>{orderDetails.shippingAddress.name}</Text>
      <Text>{orderDetails.shippingAddress.address}</Text>
      <Text>
        {orderDetails.shippingAddress.city},{" "}
        {orderDetails.shippingAddress.postalCode}
      </Text>

      <Text style={styles.sectionTitle}>Items:</Text>
      {orderDetails.items.map((item, index) => (
        <View key={index}>
          <Text>
            {item.name} - Quantity: {item.quantity} - Price: {item.price}
          </Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Phone: {orderDetails.phoneNumber}</Text>
      <Text style={styles.sectionTitle}>
        Payment Method: {orderDetails.paymentDetails.paymentMethod}
      </Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Set as Pending"
          disabled={orderDetails.orderStatus === "pending"}
          onPress={() => updateOrderStatus("pending")}
        />
        <Button
          title="Set as Processing"
          disabled={orderDetails.orderStatus === "processing"}
          onPress={() => updateOrderStatus("processing")}
        />
        <Button
          title="Set as Shipped"
          disabled={orderDetails.orderStatus === "shipped"}
          onPress={() => updateOrderStatus("shipped")}
        />
        <Button
          title="Set as Delivered"
          disabled={orderDetails.orderStatus === "delivered"}
          onPress={() => updateOrderStatus("delivered")}
        />
        <Button
          title="Set as Cancelled"
          disabled={orderDetails.orderStatus === "cancelled"}
          onPress={() => updateOrderStatus("cancelled")}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  orderId: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 16,
    color: "#555",
  },
  orderTotal: {
    fontSize: 18,
    marginVertical: 10,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  buttonContainer: {
    marginTop: 20,
    gap: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderDetailsScreen;
