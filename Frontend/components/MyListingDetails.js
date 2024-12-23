import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { getListingsOrdersApi, updateListingsOrderStatusApi } from "../api/api";

// deleteListingApi,
//   getOrdersApi,
//updateOrderStatusApi
const MyListingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [orders, setOrders] = useState([]);
  const [orderStatusMap, setOrderStatusMap] = useState({}); // Map to store statuses of individual orders
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const { listing } = route.params; // Access the listing passed from the previous screen

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const result = await getListingsOrdersApi({ id: listing.listing_uid });
      if (result.data.success) {
        setOrders(result.data.orders);

        // Initialize the orderStatusMap with current status for each order
        const initialStatusMap = result.data.orders.reduce((map, order) => {
          map[order.order_uuid] = order.orderStatus; // Set initial status for each order
          return map;
        }, {});
        setOrderStatusMap(initialStatusMap);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      Alert.alert("Error", "Failed to fetch orders.");
    }
  };

  const handleDeleteListing = async () => {
    try {
      const result = await deleteListingApi(listing._id);
      if (result.success) {
        Alert.alert("Success", "Listing deleted successfully.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error deleting listing:", error);
      Alert.alert("Error", "Failed to delete the listing.");
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      const result = await updateListingsOrderStatusApi({
        orderId,
        status: orderStatusMap[orderId],
        courierName,
        trackingId,
      });
      if (result.data.success) {
        Alert.alert("Success", "Order status updated successfully.");
        setCourierName("");
        setTrackingId("");
        fetchOrders();
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      Alert.alert("Error", "Failed to update order status.");
    }
  };

  const handleStatusChange = (orderId, status) => {
    setOrderStatusMap((prevState) => ({
      ...prevState,
      [orderId]: status, // Update status of the specific order
    }));
  };

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Listing Image */}
      <Image source={{ uri: listing.images[0].url }} style={styles.image} />

      {/* Listing Title */}
      <Text style={styles.title}>{listing.name}</Text>

      {/* Listing Price */}
      <Text style={styles.price}>{listing.price}</Text>

      {/* Listing Description */}
      <Text style={styles.description}>{listing.description}</Text>

      {/* Listing Quantity */}
      <Text style={styles.quantity}>Available: {listing.quantity} left</Text>

      {/* Orders */}
      <Text style={styles.ordersTitle}>Orders</Text>
      {orders.length === 0 ? (
        <Text>No orders yet for this listing.</Text>
      ) : (
        orders.map((order) => (
          <View key={order.order_uuid} style={styles.orderCard}>
            <Text style={styles.orderText}>Order ID: {order.id}</Text>
            <Text style={styles.orderText}>User: {order.name}</Text>
            <Text style={styles.orderText}>Status: {order.orderStatus}</Text>

            {/* Order Status Selector */}
            {!order.has_shipped && (
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={orderStatusMap[order.order_uuid]} // Use the status from the map for each order
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    handleStatusChange(order.order_uuid, itemValue)
                  } // Update specific order's status
                >
                  <Picker.Item label="Pending" value="pending" />
                  <Picker.Item label="Processing" value="processing" />
                  <Picker.Item label="Shipped" value="shipped" />
                  <Picker.Item label="Cancelled" value="cancelled" />
                </Picker>
              </View>
            )}

            {/* Conditionally render inputs based on order status */}
            {orderStatusMap[order.order_uuid] == "shipped" &&
              !order.has_shipped && (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Courier Name"
                    value={courierName}
                    onChangeText={setCourierName}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Tracking ID"
                    value={trackingId}
                    onChangeText={setTrackingId}
                  />
                </>
              )}

            {/* Show "Update Order" button if the order is delivered or has been shipped */}
            {!order.has_shipped && (
              <TouchableOpacity
                style={styles.updateButton}
                onPress={() => handleUpdateOrderStatus(order.order_uuid)}
              >
                <Text style={styles.updateText}>Update Order Status</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditListing", { listing })}
        >
          <Ionicons name="pencil-outline" size={24} color="white" />
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteListing}
        >
          <MaterialCommunityIcons
            name="delete-outline"
            size={24}
            color="white"
          />
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2196F3",
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  quantity: {
    fontSize: 16,
    color: "#444",
    marginBottom: 30,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  orderCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  orderText: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  updateText: {
    color: "white",
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  editText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  deleteButton: {
    flexDirection: "row",
    backgroundColor: "#F45156",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  deleteText: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
  pickerContainer: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    color: "#1a1a1a",
  },
});

export default MyListingDetails;
