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
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { getListings } from "./api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { BlurView } from "expo-blur";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = width - CARD_MARGIN * 2;

const categories = [
  {
    id: 1,
    name: "All",
    icon: "grid",
    color: "#FF7043",
    gradient: ["#FF7043", "#FF9A76"],
  },
  {
    id: 2,
    name: "Angles",
    icon: "hand-right",
    color: "#42A5F5",
    gradient: ["#42A5F5", "#64B5F6"],
  },
  {
    id: 3,
    name: "AC Adapter",
    icon: "flash",
    color: "#EC407A",
    gradient: ["#EC407A", "#F48FB1"],
  },
  {
    id: 4,
    name: "Chock Motorcycle",
    icon: "bicycle",
    color: "#66BB6A",
    gradient: ["#66BB6A", "#81C784"],
  },
  {
    id: 5,
    name: "Air Pump",
    icon: "speedometer",
    color: "#FFA726",
    gradient: ["#FFA726", "#FFB74D"],
  },
  {
    id: 6,
    name: "Battery",
    icon: "battery-charging",
    color: "#8D6E63",
    gradient: ["#8D6E63", "#A1887F"],
  },
];

const CategoryButton = ({ category, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryButton,
      isSelected && {
        backgroundColor: `${category.color}15`,
        borderColor: category.color,
      },
    ]}
    onPress={onPress}
  >
    <LinearGradient
      colors={isSelected ? category.gradient : ["transparent", "transparent"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        styles.categoryIcon,
        isSelected && { backgroundColor: "transparent" },
      ]}
    >
      <Ionicons
        name={category.icon}
        size={20}
        color={isSelected ? "white" : category.color}
      />
    </LinearGradient>
    <Text
      style={[
        styles.categoryText,
        isSelected && { color: category.color, fontWeight: "600" },
      ]}
    >
      {category.name}
    </Text>
  </TouchableOpacity>
);

const ListingCard = ({ item, navigation }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => navigation.navigate("ListingList", { listing: item })}
    activeOpacity={0.95}
  >
    <View style={styles.cardImageContainer}>
      <Image source={{ uri: item.images[0].url }} style={styles.cardImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.cardGradient}
      >
        <View style={styles.cardContent}>
          <View style={styles.priceTag}>
            <Text style={styles.currency}>PKR</Text>
            <Text style={styles.price}>{item.price.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.userInfoOverlay}>
        <Image
          source={{ uri: item.user_profile_image }}
          style={styles.userAvatar}
        />
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{item.user_name}</Text>
          <Text style={styles.timeAgo}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </View>

    <View style={styles.cardBody}>
      <Text style={styles.cardTitle}>{item.name}</Text>
      <Text numberOfLines={2} style={styles.description}>
        {item.description}
      </Text>
    </View>
  </TouchableOpacity>
);

const MarketplaceScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userUid, setUserUid] = useState(null);
  const scrollY = new Animated.Value(0);

  useFocusEffect(
    React.useCallback(() => {
      getData();
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
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Unable to fetch user data. Please log in again.");
      navigation.navigate("Login");
    }
  };

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await getListings();
        if (response.data.success) {
          setListings(response.data.listings);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [selectedCategory]);

  const filteredListings =
    selectedCategory === "All"
      ? listings.filter((item) => item.user_uuid !== userUid)
      : listings.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase() &&
            item.user_uuid !== userUid
        );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [100, 60],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <BlurView intensity={100} style={styles.headerContent}>
          <Text style={styles.title}>Marketplace</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="search" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="filter" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesList}
      >
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            category={category}
            isSelected={selectedCategory === category.name}
            onPress={() => setSelectedCategory(category.name)}
          />
        ))}
      </ScrollView>

      <Animated.FlatList
        data={filteredListings}
        renderItem={({ item }) => (
          <ListingCard item={item} navigation={navigation} />
        )}
        keyExtractor={(item) => item.listing_uid}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
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
    backgroundColor: "rgba(255,255,255,0.9)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    zIndex: 1000,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1A1A1A",
    letterSpacing: -1,
  },
  headerButtons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    backgroundColor: "white",
    paddingVertical: 16,
    minHeight: 120,
    maxHeight: 120,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  categoriesList: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    padding: 12,
    minWidth: 90,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    padding: CARD_MARGIN,
    gap: CARD_MARGIN,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardImageContainer: {
    height: 220,
    backgroundColor: "#F0F0F0",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "flex-end",
    padding: 16,
  },
  userInfoOverlay: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 8,
    borderRadius: 12,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    textTransform: "capitalize",
    fontWeight: "600",
    color: "#1A1A1A",
  },
  timeAgo: {
    fontSize: 12,
    color: "#666",
  },
  cardBody: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  priceTag: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)",
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: "#666",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  fabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  skeletonCard: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
    height: 360,
  },
  skeletonImage: {
    width: "100%",
    height: 220,
    backgroundColor: "#F0F0F0",
  },
  skeletonContent: {
    padding: 16,
  },
  skeletonTitle: {
    width: "60%",
    height: 24,
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    marginBottom: 12,
  },
  skeletonDescription: {
    width: "90%",
    height: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
    marginBottom: 8,
  },
  skeletonStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  skeletonStat: {
    width: 80,
    height: 16,
    backgroundColor: "#F0F0F0",
    borderRadius: 8,
  },
  shimmer: {
    opacity: 0.5,
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.9)",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  refreshButton: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    marginRight: 16,
  },
  sortButtonText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 16,
  },
  priceRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
  },
  priceInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  applyButton: {
    backgroundColor: "#2196F3",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  resetButton: {
    paddingVertical: 16,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    color: "#666",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.05)",
    gap: 4,
  },
  chipText: {
    fontSize: 14,
    color: "#666",
  },
  removeChip: {
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  distanceSlider: {
    marginTop: 16,
  },
  distanceLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  distanceLabel: {
    fontSize: 12,
    color: "#999",
  },
});

export default MarketplaceScreen;
