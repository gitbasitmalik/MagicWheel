import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Button, ActivityIndicator, Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import HomeProduct from './HomeProduct';
import { getProductData } from './api/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductData();
        const productsData = response.data;

        // Get unique categories from products
        const uniqueCategories = [...new Set(productsData.map(product => product.category.name))];
        const categoryRoutes = uniqueCategories.map((category, idx) => ({
          key: category,
          title: category,
        }));

        setProducts(productsData);
        setOriginalProducts(productsData); // Save the original products list
        setCategories(uniqueCategories);
        setRoutes(categoryRoutes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      // Reset products to original data if search text is cleared
      setProducts(originalProducts);
    } else {
      const filteredProducts = originalProducts.filter(
        (product) => product.name.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity style={styles.productItem}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Button title="Add to Cart" onPress={() => {}} />
      </View>
    </TouchableOpacity>
  );

  const renderScene = ({ route }) => {
    const filteredProducts = products.filter(product => product.category.name === route.key);
    return (
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Magic Wheel</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {searchText !== '' ? (
        // Show filtered products if search text is not empty
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.productList}
        />
      ) : (
        // Show TabView if search text is empty
        <TabView
          navigationState={{ index, routes }}
          renderScene={SceneMap(
            routes.reduce((acc, route) => {
              acc[route.key] = renderScene;
              return acc;
            }, {})
          )}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => (
            <TabBar
              {...props}
              indicatorStyle={styles.tabIndicator}
              style={styles.tabBar}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  productList: {
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  productItem: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    width: '45%',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
  productDetails: {
    alignItems: 'center',
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  productDescription: {
    fontSize: 14,
    color: 'gray',
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBar: {
    backgroundColor: '#fff',
  },
  tabIndicator: {
    backgroundColor: '#000',
  },
  tabLabel: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default Home;
