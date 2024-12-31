import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import axios from "axios"; // Assuming axios for API calls
import { useNavigation } from "@react-navigation/native";
import { getAllOrdersAdmin } from "../../api/api";

const OrdersListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch orders from the backend
    getData();
  }, []);

  const getData = async () => {
    try {
      const result = await getAllOrdersAdmin();
      if (result.data.success) {
        console.log(result.data.orders);
        setOrders(result.data.orders);
        setLoading(false);
      }
    } catch (error) {}
  };

  const updateOrderStatus = (orderId, newStatus) => {
    // Update the order status
    axios
      .put(`https://your-backend-api.com/orders/${orderId}`, {
        orderStatus: newStatus,
      })
      .then((response) => {
        const updatedOrders = orders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        );
        setOrders(updatedOrders);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const renderOrderItem = ({ item }) => {
    return (
      <View style={styles.orderCard}>
        <Text style={styles.orderId}>Order ID: {item._id}</Text>
        <Text style={styles.orderStatus}>Status: {item.orderStatus}</Text>
        <Text style={styles.orderTotal}>
          Total: {item.totalAmount} {item.currency}
        </Text>

        <TouchableOpacity
          style={styles.viewDetailsButton}
          onPress={() =>
            navigation.navigate("OrderDetailsAdmin", {
              orderId: item._id,
              orderDetails: item,
            })
          }
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <Button
            title="Pending"
            disabled={item.orderStatus === "pending"}
            onPress={() => updateOrderStatus(item._id, "pending")}
          />
          <Button
            title="Shipped"
            disabled={item.orderStatus === "shipped"}
            onPress={() => updateOrderStatus(item._id, "shipped")}
          />
          <Button
            title="Delivered"
            disabled={item.orderStatus === "delivered"}
            onPress={() => updateOrderStatus(item._id, "delivered")}
          />
          <Button
            title="Cancel"
            disabled={item.orderStatus === "cancelled"}
            onPress={() => updateOrderStatus(item._id, "cancelled")}
          />
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  orderStatus: {
    fontSize: 14,
    color: "#888",
  },
  orderTotal: {
    fontSize: 16,
    marginVertical: 5,
    color: "#555",
  },
  viewDetailsButton: {
    marginVertical: 10,
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
  },
  viewDetailsText: {
    color: "#fff",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrdersListScreen;
