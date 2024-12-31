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

const MyListingDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [orders, setOrders] = useState([]);
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [courierName, setCourierName] = useState("");
  const [trackingId, setTrackingId] = useState("");
  const { listing } = route.params;

  useEffect(() => {
    fetchOrders();
  }, []);

  // Existing fetch and handler functions remain the same...
  const fetchOrders = async () => {
    try {
      const result = await getListingsOrdersApi({ id: listing.listing_uid });
      if (result.data.success) {
        setOrders(result.data.orders);
        const initialStatusMap = result.data.orders.reduce((map, order) => {
          map[order.order_uuid] = order.orderStatus;
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
      [orderId]: status,
    }));
  };

  const OrderStatusBadge = ({ status }) => {
    const getStatusColor = () => {
      switch (status.toLowerCase()) {
        case "pending":
          return { bg: "#FFF3DC", text: "#FFB020" };
        case "processing":
          return { bg: "#E8F5E9", text: "#4CAF50" };
        case "shipped":
          return { bg: "#E3F2FD", text: "#2196F3" };
        case "delivered":
          return { bg: "#E8F5E9", text: "#43A047" };
        case "cancelled":
          return { bg: "#FEECEB", text: "#F44336" };
        default:
          return { bg: "#F5F5F5", text: "#9E9E9E" };
      }
    };

    const colors = getStatusColor();
    return (
      <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
        <Text style={[styles.statusText, { color: colors.text }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
    );
  };

  const OrderCard = ({ order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.orderId}>Order #{order.id}</Text>
          <Text style={styles.orderCustomer}>{order.name}</Text>
        </View>
        <OrderStatusBadge status={order.orderStatus} />
      </View>

      {!order.has_shipped && (
        <View style={styles.orderActions}>
          <View style={styles.pickerContainer}>
            <Text style={styles.inputLabel}>Update Status</Text>
            <Picker
              selectedValue={orderStatusMap[order.order_uuid]}
              style={styles.picker}
              onValueChange={(itemValue) =>
                handleStatusChange(order.order_uuid, itemValue)
              }
            >
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Processing" value="processing" />
              <Picker.Item label="Shipped" value="shipped" />
              <Picker.Item label="Delivered" value="delivered" />
              <Picker.Item label="Cancelled" value="cancelled" />
            </Picker>
          </View>

          {orderStatusMap[order.order_uuid] === "shipped" && (
            <View style={styles.shippingDetails}>
              <Text style={styles.inputLabel}>Shipping Details</Text>
              <TextInput
                style={styles.input}
                placeholder="Courier Name"
                value={courierName}
                onChangeText={setCourierName}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Tracking ID"
                value={trackingId}
                onChangeText={setTrackingId}
                placeholderTextColor="#999"
              />
            </View>
          )}

          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleUpdateOrderStatus(order.order_uuid)}
          >
            <Text style={styles.updateText}>Update Order</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (!listing) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: listing.images[0].url }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{listing.name}</Text>
        <Text style={styles.price}>${listing.price}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <View style={styles.quantityContainer}>
          <MaterialCommunityIcons
            name="package-variant"
            size={20}
            color="#666"
          />
          <Text style={styles.quantity}>
            {listing.quantity} items available
          </Text>
        </View>

        <View style={styles.ordersSection}>
          <Text style={styles.ordersTitle}>Orders</Text>
          {orders.length === 0 ? (
            <View style={styles.noOrders}>
              <MaterialCommunityIcons
                name="package-variant"
                size={48}
                color="#CCC"
              />
              <Text style={styles.noOrdersText}>
                No orders yet for this listing
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <OrderCard key={order.order_uuid} order={order} />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  contentContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1A1A1A",
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
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
    backgroundColor: "#F5F5F5",
    padding: 10,
    borderRadius: 8,
  },
  quantity: {
    fontSize: 16,
    color: "#666",
    marginLeft: 8,
  },
  ordersSection: {
    marginTop: 20,
  },
  ordersTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#1A1A1A",
  },
  noOrders: {
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginTop: 10,
  },
  noOrdersText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 15,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  orderCustomer: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  orderActions: {
    marginTop: 10,
  },
  pickerContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  picker: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 5,
  },
  shippingDetails: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginTop: 5,
    marginBottom: 10,
    fontSize: 16,
    color: "#1A1A1A",
  },
  updateButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  updateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default MyListingDetails;
