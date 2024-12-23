import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Animated,
} from "react-native";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getListings } from "./api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

// Dummy categories data with enhanced icons
const categories = [
  { id: 1, name: "All", icon: "grid", color: "#FF7043" },
  { id: 2, name: "Electronics", icon: "phone-portrait", color: "#42A5F5" },
  { id: 3, name: "Fashion", icon: "shirt", color: "#EC407A" },
  { id: 4, name: "Home", icon: "home", color: "#66BB6A" },
  { id: 5, name: "Sports", icon: "basketball", color: "#FFA726" },
  { id: 6, name: "Books", icon: "book", color: "#8D6E63" },
];

// Enhanced dummy listings data with better images and descriptions

const MarketplaceScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    getData();
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
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Unable to fetch user data. Please log in again.");
      navigation.navigate("Login");
    }
  };
  const filteredListings =
    selectedCategory === "All"
      ? listings.filter((item) => item.user_uuid !== userUid)
      : listings.filter(
          (item) =>
            item.category === selectedCategory && item.user_uuid !== userUid
        );

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true); // Set loading state true before fetching
      try {
        const response = await getListings(); // Assume it returns the data structure with listings
        if (response.data.success) {
          setListings(response.data.listings); // Update state with fetched listings
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching is done
      }
    };

    fetchListings();
  }, [navigation]);

  const ListingCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("ListingList", { listing: item })}
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0)"]}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={styles.userInfo}>
              <Image
                source={{ uri: item.user_profile_image }}
                style={styles.userAvatar}
              />
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.user_name}</Text>
                <Text style={styles.timeText}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
          {/* Display images */}
          <View style={styles.cover}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.imageSlider}
            >
              {item.images.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.url }}
                  style={styles.listingImage}
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
          <View style={styles.mainContent}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>PKR</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Marketplace</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.selectedCategory,
                {
                  backgroundColor:
                    selectedCategory === category.name
                      ? `${category.color}20`
                      : "#F0F0F0",
                },
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon}
                size={20}
                color={
                  selectedCategory === category.name ? category.color : "#666"
                }
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category.name && [
                    styles.selectedCategoryText,
                    { color: category.color },
                  ],
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listings */}
      <Animated.FlatList
        data={filteredListings}
        renderItem={({ item }) => <ListingCard item={item} />}
        keyExtractor={(item) => item.listing_uid}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="shopping-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyText}>No listings found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "white",
    paddingTop: 60,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    letterSpacing: -0.5,
  },
  categoriesContainer: {
    backgroundColor: "white",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  categoriesList: {
    paddingHorizontal: 15,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    marginRight: 8,
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: "500",
  },
  listContainer: {
    padding: 15,
    gap: 15,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
  },
  cardGradient: {
    flex: 1,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  userRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 13,
    color: "#666",
    marginLeft: 4,
  },
  bulletPoint: {
    fontSize: 13,
    color: "#666",
    marginHorizontal: 6,
  },
  timeText: {
    fontSize: 13,
    color: "#666",
  },
  mainContent: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  tags: {
    flexDirection: "row",
    gap: 8,
  },
  tag: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginRight: 2,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: "#666",
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  featuredText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    borderRadius: 28,
    overflow: "hidden",
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  fabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  imageSlider: {
    marginVertical: 10,
  },
  listingImage: {
    width: width - 0.3,
    height: 240,

    resizeMode: "fill",
  },
  cover: {
    borderRadius: 8,
    height: 240,
  },
  cardImage: {
    flex: 1,
    width: 240,
    height: 240,
  },
});

export default MarketplaceScreen;
