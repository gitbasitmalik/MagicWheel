import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const STATUSBAR_HEIGHT = Platform.OS === "ios" ? 44 : StatusBar.currentHeight;
const OrderDetails = ({ route }) => {
  const { order } = route.params;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#FFB74D";
      case "completed":
        return "#4CAF50";
      case "delivered":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#2196F3"
        translucent={true}
      />
      <ScrollView style={styles.container}>
        {/* Modern Order Status Header */}
        <View style={styles.statusHeader}>
          <View style={styles.headerContent}>
            <View
              style={[
                styles.statusIconContainer,
                { backgroundColor: getStatusColor(order.orderStatus) },
              ]}
            >
              <MaterialCommunityIcons
                name={
                  order.orderStatus === "pending"
                    ? "clock-outline"
                    : "check-circle"
                }
                size={32}
                color="white"
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>
                {order.orderStatus.toUpperCase()}
              </Text>
            </View>
          </View>
          <View style={styles.orderProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width:
                      order.orderStatus === "pending"
                        ? "30%"
                        : order.orderStatus === "processing"
                        ? "50%"
                        : order.orderStatus === "delivered"
                        ? "100%"
                        : "100%",
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Order ID</Text>
            <Text style={styles.summaryValue}>#{order._id.slice(-6)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items</Text>
            <Text style={styles.summaryValue}>{order.items.length}</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>
              {order.currency.toUpperCase()} {order.totalAmount}
            </Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item._doc.name}</Text>
                <View style={styles.itemMetaContainer}>
                  <View style={styles.quantityChip}>
                    <MaterialCommunityIcons
                      name="package-variant"
                      size={16}
                      color="#666"
                    />
                    <Text style={styles.itemQuantity}>
                      {item._doc.quantity}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>
                    {order.currency.toUpperCase()} {item._doc.price}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons
                name="truck-delivery"
                size={24}
                color="#2196F3"
              />
              <Text style={styles.infoHeaderText}>Shipping Details</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account" size={20} color="#666" />
                <Text style={styles.infoText}>
                  {order.shippingAddress.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="phone" size={20} color="#666" />
                <Text style={styles.infoText}>{order.phoneNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={20}
                  color="#666"
                />
                <Text style={styles.infoText}>
                  {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Payment Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoHeader}>
              <MaterialCommunityIcons
                name="credit-card"
                size={24}
                color="#2196F3"
              />
              <Text style={styles.infoHeaderText}>Payment Details</Text>
            </View>
            <View style={styles.infoContent}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Method</Text>
                <View style={styles.paymentMethodChip}>
                  <MaterialCommunityIcons
                    name={
                      order.paymentDetails.paymentMethod === "card"
                        ? "credit-card"
                        : "cash"
                    }
                    size={16}
                    color="#2196F3"
                  />
                  <Text style={styles.paymentMethodText}>
                    {order.paymentDetails.paymentMethod.toUpperCase()}
                  </Text>
                </View>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Status</Text>
                <View
                  style={[
                    styles.paymentStatus,
                    {
                      backgroundColor:
                        order.paymentDetails.status === "completed"
                          ? "#4CAF50"
                          : "#FFB74D",
                    },
                  ]}
                >
                  <Text style={styles.paymentStatusText}>
                    {order.paymentDetails.status.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#2196F3", // Match with header color
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  statusHeader: {
    backgroundColor: "#2196F3",
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT + 16 : 16,
    paddingBottom: 16,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statusIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
  },
  orderProgress: {
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  summaryCard: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    color: "#333",
    fontWeight: "600",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#EEE",
    marginTop: 8,
    paddingTop: 12,
  },
  section: {
    padding: 16,
  },
  lastSection: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  itemImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  itemMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  quantityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2196F3",
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F8F9FA",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  infoHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 12,
  },
  infoContent: {
    padding: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#666",
  },
  paymentMethodChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentMethodText: {
    fontSize: 14,
    color: "#2196F3",
    fontWeight: "600",
    marginLeft: 6,
  },
  paymentStatus: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  paymentStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
  },
});

export default OrderDetails;
