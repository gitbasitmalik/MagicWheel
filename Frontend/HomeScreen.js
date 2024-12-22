import React, { useEffect, useState } from "react";
import { StyleSheet, View, ScrollView, FlatList } from "react-native";
import {
  Searchbar,
  Card,
  Title,
  Paragraph,
  Badge,
  IconButton,
  Chip,
  DefaultTheme,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useMyContext } from "./CartContext";
import { addToWishlist, getHomeData, removeFromWishlist } from "./api/api";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#6366F1",
    secondary: "#EC4899",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    text: "#111827",
  },
};

const HomeScreen = () => {
  const { isInCart, toggleCartItem, userInfo } = useMyContext();
  const navigation = useNavigation();
  const [text, setText] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [user_ID, setUserID] = useState("");

  useEffect(() => {
    getData();
  }, []);

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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  const renderProduct = ({ item }) => (
    <Card
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetail", { product: item })}
    >
      <Card.Cover source={{ uri: item.imageUrl }} style={styles.productImage} />
      {item.onSale && <Badge style={styles.saleBadge}>SALE</Badge>}
      <Card.Content>
        <Title style={styles.productName}>{item.name}</Title>
        <View style={styles.priceContainer}>
          <Paragraph style={styles.productPrice}>
            ${item.onSale ? item.salePrice : item.price}
          </Paragraph>
          {item.onSale && (
            <Paragraph style={styles.originalPrice}>${item.price}</Paragraph>
          )}
        </View>
        <View style={styles.actionButtons}>
          <IconButton
            icon={isInCart(item.id) ? "cart-off" : "cart-plus"}
            size={24}
            onPress={() => toggleCartItem(item)}
            style={styles.iconButton}
          />
          <IconButton
            icon={isInWishlist(item.id) ? "heart" : "heart-outline"}
            size={24}
            color={theme.colors.secondary}
            onPress={() => toggleWishlistItem(item)}
            style={styles.iconButton}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Magic Wheel</Title>
        <IconButton
          icon="cart"
          size={24}
          onPress={() => navigation.navigate("Cart")}
        />
      </View>

      <Searchbar
        placeholder="Search products..."
        onChangeText={setText}
        value={text}
        style={styles.searchbar}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={selectedCategory === category.id}
            onPress={() => filterByCategory(category.id)}
            style={styles.categoryChip}
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
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.productList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  searchbar: {
    margin: 16,
    borderRadius: 8,
    elevation: 0,
    backgroundColor: "#fff",
  },
  categoriesContainer: {
    height: 40,
    maxHeight: 40,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  productList: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 2,
    borderRadius: 2,
  },
  productImage: {
    height: 200,
    backgroundColor: "#fff",
  },
  saleBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: theme.colors.error,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  originalPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
    color: "#9CA3AF",
    marginLeft: 8,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 2,
  },
  iconButton: {
    marginHorizontal: 1, // Add margin for spacing
  },
});

export default HomeScreen;
