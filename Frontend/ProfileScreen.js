import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ImageBackground,
  Alert,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  deleteMyListingApi,
  getTheOrderListingBoughtApi,
  getUserListingsApi,
} from "./api/api";
import { ActivityIndicator } from "react-native-paper";

const { width } = Dimensions.get("window");

const ProfileScreen = () => {
  const [activeTab, setActiveTab] = useState("My listings");
  const [listings, setListings] = useState([]);
  const [orders, setOrders] = useState([]);
  const [boughtListings, setBoughtListings] = useState([]);
  const [userUid, setUserUid] = useState(null);
  const [userData, setUserData] = useState({
    coverPhoto: "",
    user_profile_image: "",
    user_name: "",
    user_email: "",
  });
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const userString = await AsyncStorage.getItem("user");
          if (!userString) {
            Alert.alert("Session Expired", "Please log in again.");
            navigation.navigate("Login");
            return;
          }

          const parsedUser = JSON.parse(userString);
          setUserUid(parsedUser.uid);

          const userListingsResult = await getUserListingsApi(parsedUser.uid);
          if (!userListingsResult?.data) {
            throw new Error("Failed to fetch user listings");
          }
          const filteredListings = userListingsResult.data?.listings?.filter(
            (item) => item.is_deleted === false
          );
          setListings(filteredListings || []);
          setUserData(userListingsResult.data?.userData || {});
          setOrders(userListingsResult.data?.orders || []);

          const boughtListingsResult = await getTheOrderListingBoughtApi(
            parsedUser.uid
          );
          if (boughtListingsResult?.data?.success) {
            setBoughtListings(boughtListingsResult.data.boughtListings || []);
          }
        } catch (error) {
          handleError(error, "Error retrieving user data:");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [navigation])
  );
  const handleError = (error, message) => {
    console.error(message, error);
    if (
      error?.response?.status === 401 ||
      error?.message?.includes("expired")
    ) {
      Alert.alert("Session Expired", "Please log in again.");
      navigation.navigate("Login");
    } else {
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const deleteMyListing = async (listingId) => {
    try {
      const response = await deleteMyListingApi(listingId);
      if (response.data.message === "Listing deleted successfully") {
        // Remove the deleted listing from the frontend state immediately
        setListings((prevListings) =>
          prevListings.filter((item) => item.listing_uid !== listingId)
        );
      }
    } catch (error) {
      handleError(error, "Error deleting listing:");
    }
  };

  const BoughtListingCard = ({ item, allData }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("OrderListingDetail", { ...allData })}
    >
      <Image
        source={{ uri: item?.images?.[0]?.url }}
        style={styles.cardImage}
      />
      <View style={styles.cardOverlay}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <Text style={styles.cardStatsText}>{item.sellerName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("MyListingDetails", { listing: item })}
    >
      <Image source={{ uri: item.images?.[0]?.url }} style={styles.cardImage} />
      <View style={styles.cardOverlay}>
        <View style={styles.cardHeader}>
          <View style={styles.statusChip}>
            <Text style={styles.statusText}>Active</Text>
          </View>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() =>
              Alert.alert(
                "Delete listing",
                "Are you sure you want to delete this listing?",
                [
                  { text: "Cancel" },
                  {
                    text: "Delete",
                    onPress: () => {
                      console.log(item.listing_uid);
                      deleteMyListing(item.listing_uid);
                    },
                  },
                ]
              )
            }
          >
            <MaterialCommunityIcons
              name="delete-outline"
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.cardPrice}>{item.price}</Text>
          <View style={styles.cardStats}>
            <Text style={styles.cardStatsText}>{item.quantity} Quantity</Text>
            <Text style={styles.cardStatsText}>•</Text>
            <Text style={styles.cardStatsText}>{item.likes} likes</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const OrderCard = ({ item }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => navigation.navigate("OrderDetails", { order: item })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.items?.[0]?.image }}
            style={styles.orderImage}
          />
          {item.items.length > 1 && (
            <View style={styles.itemCountBadge}>
              <Text style={styles.itemCountText}>+{item.items.length - 1}</Text>
            </View>
          )}
        </View>
        <View style={styles.orderContent}>
          <View style={styles.orderHeader}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderId}>Order #{item._id.slice(-6)}</Text>
              <Text style={styles.orderDate}>{formatDate(item.createdAt)}</Text>
            </View>
            <View
              style={[
                styles.statusChip,
                {
                  backgroundColor:
                    item.orderStatus === "pending" ? "#FFB74D" : "#4CAF50",
                },
              ]}
            >
              <Text style={styles.statusText}>
                {item.orderStatus.charAt(0).toUpperCase() +
                  item.orderStatus.slice(1)}
              </Text>
            </View>
          </View>
          <View style={styles.itemsContainer}>
            <Text style={styles.itemsText}>
              {item.items[0]._doc.name}{" "}
              {item.items.length > 1
                ? `+ ${item.items.length - 1} more items`
                : ""}
            </Text>
          </View>
          <View style={styles.footer}>
            <Text style={styles.totalAmount}>
              {item.currency.toUpperCase()} {item.totalAmount}
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#666"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderNoItemsMessage = (type) => (
    <View style={styles.noItemsMessageContainer}>
      <MaterialCommunityIcons name="emoticon-sad" size={50} color="#B0BEC5" />
      <Text style={styles.noItemsText}>No {type} available.</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: userData.coverPhoto }}
        style={styles.coverPhoto}
      >
        <View style={styles.headerOverlay}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => navigation.navigate("Settings")}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={30}
              color="white"
            />
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Image
              source={{ uri: userData.user_profile_image }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userData.user_name || "User"}
              </Text>
              <Text style={styles.userEmail}>
                {userData.user_email || "No email"}
              </Text>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{listings?.length || 0}</Text>
              <Text style={styles.statLabel}>Listings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {boughtListings?.length || 0}
              </Text>
              <Text style={styles.statLabel}>Bought</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{orders?.length || 0}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.tabBar}>
        {["My listings", "Orders", "Bought Listings"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "Orders" && orders && orders.length === 0 ? (
        renderNoItemsMessage("Orders")
      ) : activeTab === "My listings" && listings && listings.length === 0 ? (
        renderNoItemsMessage("Listings")
      ) : activeTab === "Bought Listings" &&
        boughtListings &&
        boughtListings.length === 0 ? (
        renderNoItemsMessage("Bought Listings")
      ) : (
        <FlatList
          data={
            activeTab === "My listings"
              ? listings
              : activeTab === "Orders"
              ? orders
              : boughtListings
          }
          keyExtractor={(item, index) => `${item._id || item.id || index}`}
          renderItem={({ item }) =>
            activeTab === "My listings" ? (
              <ListingCard item={item} />
            ) : activeTab === "Orders" ? (
              <OrderCard item={item} />
            ) : (
              <BoughtListingCard
                item={item.listing || ""}
                allData={item || ""}
              />
            )
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("ListingForm")}
      >
        <View style={styles.fabContent}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.fabText}>New Listing</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  coverPhoto: {
    height: 240,
  },
  headerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "space-between",
    padding: 20,
  },
  settingsButton: {
    position: "absolute",
    top: 80,
    right: 20,
    zIndex: 10,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "white",
  },
  userInfo: {
    marginLeft: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: "600",
    color: "white",
  },
  userEmail: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  statLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tab: {
    paddingVertical: 15,
    marginRight: 30,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#2196F3",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#2196F3",
    fontWeight: "600",
  },
  contentContainer: {
    padding: 20,
  },
  card: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "space-between",
    padding: 15,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusChip: {
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#2196F3",
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  heartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F45156",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    padding: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  cardPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2196F3",
    marginTop: 4,
  },
  cardStats: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  cardStatsText: {
    fontSize: 14,
    color: "#666",
    marginHorizontal: 4,
  },
  // OrderCard styles
  orderCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  imageContainer: {
    width: 100,
    height: 120,
    position: "relative",
  },
  orderImage: {
    width: "100%",
    height: "100%",
  },
  itemCountBadge: {
    position: "absolute",
    right: 8,
    bottom: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    padding: 4,
    minWidth: 24,
    alignItems: "center",
  },
  itemCountText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  orderContent: {
    flex: 1,
    padding: 12,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  orderDate: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  itemsContainer: {
    marginTop: 8,
  },
  itemsText: {
    fontSize: 14,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2196F3",
  },

  // OrderDetails styles
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  statusHeader: {
    backgroundColor: "#2196F3",
    padding: 24,
    alignItems: "center",
  },
  statusIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statusTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  itemCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
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
  },
  itemDetails: {
    flex: 1,
    padding: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2196F3",
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
  paymentStatus: {
    backgroundColor: "#4CAF50",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginVertical: 8,
  },
  paymentStatusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#2196F3",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  fabContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fabText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ProfileScreen;
