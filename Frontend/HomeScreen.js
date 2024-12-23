import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import {
  Searchbar,
  Card,
  Title,
  IconButton,
  Chip,
  DefaultTheme,
  Text,
  Surface,
  Avatar,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useMyContext } from "./CartContext";
import { addToWishlist, getHomeData, removeFromWishlist } from "./api/api";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 20;

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#0EA5E9",
    secondary: "#F472B6",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    text: "#0F172A",
    error: "#EF4444",
    success: "#10B981",
  },
};

const LoadingPlaceholder = () => (
  <Surface style={styles.loadingCard}>
    <Animated.View style={styles.loadingImage} />
    <View style={styles.loadingContent}>
      <View style={styles.loadingText} />
      <View style={styles.loadingPrice} />
    </View>
  </Surface>
);

const HomeScreen = ({ navigation }) => {
  const scrollY = new Animated.Value(0);
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: "clamp",
  });
  const { isInCart, toggleCartItem, userInfo } = useMyContext();

  const [text, setText] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [user_ID, setUserID] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [userInfo])
  );

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value !== null) {
        const parsedValue = JSON.parse(value);
        setUserID(parsedValue.uid);
        const result = await getHomeData({ user_id: parsedValue.uid });
        setCategories(result.data?.categories || []);
        setProducts(result.data?.products || []);
        setFilteredProducts(result.data?.products || []);
        setWishlistProducts(result.data?.wishlist || []);
      }
    } catch (error) {}
  };

  const filterByCategory = (categoryId) => {
    if (categoryId === selectedCategory) {
      setFilteredProducts(products);
      setSelectedCategory(null);
    } else {
      const filtered = products.filter(
        (product) => product.category.id === categoryId
      );
      setFilteredProducts(filtered);
      setSelectedCategory(categoryId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistProducts.some(
      (item) => item.id === productId || item === productId
    );
  };

  const toggleWishlistItem = async (product) => {
    try {
      let updatedWishlist;
      if (isInWishlist(product.id)) {
        const response = await removeFromWishlist({
          user_id: user_ID,
          product_id: product.id,
        });
        updatedWishlist = response.data.wishlist;
      } else {
        const response = await addToWishlist({
          user_id: user_ID,
          product_id: product.id,
        });
        updatedWishlist = response.data.wishlist;
      }
      setWishlistProducts(updatedWishlist);
      await AsyncStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      getData();
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const renderProduct = ({ item }) => (
    <Surface style={styles.productCard}>
      <View style={styles.imageContainer}>
        <Card.Cover
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
        />
        {item.onSale && (
          <View style={styles.saleBadge}>
            <MaterialCommunityIcons name="flash" size={14} color="white" />
            <Text style={styles.saleText}>SALE</Text>
          </View>
        )}
        <IconButton
          icon={isInWishlist(item.id) ? "heart" : "heart-outline"}
          size={20}
          color={isInWishlist(item.id) ? theme.colors.error : theme.colors.text}
          onPress={() => toggleWishlistItem(item)}
          style={styles.wishlistButton}
        />
      </View>
      <View style={styles.cardContent}>
        <Text numberOfLines={2} style={styles.productName}>
          {item.name}
        </Text>
        <View style={styles.priceContainer}>
          <Text style={styles.productPrice}>
            ${item.onSale ? item.salePrice : item.price}
          </Text>
          {item.onSale && (
            <Text style={styles.originalPrice}>${item.price}</Text>
          )}
        </View>
        <IconButton
          icon={isInCart(item.id) ? "cart-remove" : "cart-plus"}
          size={24}
          color={isInCart(item.id) ? theme.colors.error : theme.colors.primary}
          onPress={() => toggleCartItem(item)}
          style={styles.cartButton}
        />
      </View>
    </Surface>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Avatar.Image
              size={40}
              source={{
                uri:
                  userInfo?.avatar || "https://ui-avatars.com/api/?name=User",
              }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Title style={styles.title}>Magic Wheel</Title>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <IconButton
              icon={({ size }) => (
                <Feather
                  name="shopping-bag"
                  size={size}
                  color={theme.colors.text}
                />
              )}
              size={24}
              onPress={() => navigation.navigate("Cart")}
            />
          </View>
        </View>
        <Searchbar
          placeholder="Search products..."
          onChangeText={setText}
          value={text}
          style={styles.searchbar}
          iconColor={theme.colors.primary}
          inputStyle={styles.searchInput}
          placeholderTextColor="#94A3B8"
        />
      </Animated.View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => filterByCategory(category.id)}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedChip,
            ]}
            textStyle={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedChipText,
            ]}
          >
            {category.name}
          </Chip>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
        columnWrapperStyle={styles.productRow}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        ListEmptyComponent={
          <View style={styles.loadingContainer}>
            {[1, 2, 3, 4].map((key) => (
              <LoadingPlaceholder key={key} />
            ))}
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    marginRight: 12,
    backgroundColor: theme.colors.surface,
  },
  welcomeText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
    letterSpacing: -0.5,
  },
  searchbar: {
    elevation: 0,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    height: 46,
    shadowColor: "transparent",
  },
  searchInput: {
    fontSize: 16,
    color: theme.colors.text,
  },
  categoriesContainer: {
    height: 100, // Increased height to accommodate larger chips
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12, // Increased padding
  },
  categoryChip: {
    marginRight: 12, // Increased margin between chips
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40, // Fixed height for consistency
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
  },
  selectedChip: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.text,
    marginVertical: 0, // Remove vertical margin
    includeFontPadding: false, // Remove extra padding
    textAlignVertical: "center", // Center text vertically
  },
  selectedChipText: {
    color: "white",
  },
  productList: {
    padding: 16,
  },
  productRow: {
    justifyContent: "space-between",
    gap: 16,
  },
  productCard: {
    width: CARD_WIDTH,
    marginBottom: 20,
    borderRadius: 16,
    overflow: "hidden",
    elevation: Platform.OS === "android" ? 2 : 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    backgroundColor: "white",
  },
  imageContainer: {
    position: "relative",
  },
  productImage: {
    height: 180,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    padding: 12,
  },
  saleBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.error,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saleText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  discountBadge: {
    backgroundColor: "#FEF2F2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
    alignSelf: "flex-start",
  },
  discountText: {
    color: theme.colors.error,
    fontSize: 12,
    fontWeight: "600",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 0,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  priceContainer: {
    flexDirection: "column",
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  originalPrice: {
    fontSize: 13,
    textDecorationLine: "line-through",
    color: "#94A3B8",
    marginTop: 2,
  },
  cartButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    margin: 0,
  },
  loadingContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 16,
    gap: 16,
  },
  loadingCard: {
    width: CARD_WIDTH,
    height: 260,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
  },
  loadingImage: {
    height: 180,
    backgroundColor: "#E2E8F0",
  },
  loadingContent: {
    padding: 12,
    gap: 8,
  },
  loadingText: {
    height: 16,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
  },
  loadingPrice: {
    height: 20,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    width: "40%",
  },
});

export default HomeScreen;
