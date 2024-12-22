import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { getWishlistItems } from "./api/api";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");
const numColumns = 2;
const SPACING = 16;
const ITEM_WIDTH = (width - SPACING * (numColumns + 1)) / numColumns;

const WishlistScreen = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [filteredWishlist, setFilteredWishlist] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserId();
  }, [userId]);

  useEffect(() => {
    getUserId();
  }, []);

  // Fetch wishlist when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      if (userId) {
        fetchWishlist();
      }
    }, [userId])
  );

  const getUserId = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        const parsedUser = JSON.parse(user);
        setUserId(parsedUser.uid);
      }
    } catch (error) {
      console.error("Error getting user ID:", error);
    }
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await getWishlistItems({ user_id: userId });
      setWishlistProducts(response.data.wishlist);
      setFilteredWishlist(response.data.wishlist);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = wishlistProducts.filter((item) =>
        item.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWishlist(filtered);
    } else {
      setFilteredWishlist(wishlistProducts);
    }
  };

  const EmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>Your wishlist is empty</Text>
      <Text style={styles.emptySubtext}>Items you save will appear here</Text>
    </View>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => {
          /* Handle remove from wishlist */
        }}
      >
        <Ionicons name="close-circle" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search wishlist..."
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={filteredWishlist}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={EmptyList}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    padding: SPACING,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#000",
    marginBottom: SPACING,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E5EA",
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#000",
  },
  listContainer: {
    padding: SPACING,
  },
  row: {
    justifyContent: "space-between",
  },
  productCard: {
    width: ITEM_WIDTH,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: SPACING,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: "100%",
    height: ITEM_WIDTH,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  removeButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 8,
  },
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
