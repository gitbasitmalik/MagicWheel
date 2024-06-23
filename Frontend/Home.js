// Home.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const defaultProducts = [
    {
      id: 1,
      name: 'Car Spare Part 1',
      category: 'Car',
      price: '$50',
      image: require('./assets/sparepart1.png'),
    },
    {
      id: 2,
      name: 'Bike Spare Part 1',
      category: 'Bike',
      price: '$30',
      image: require('./assets/sparepart2.png'),
    },
    {
      id: 3,
      name: 'Car Spare Part 2',
      category: 'Car',
      price: '$60',
      image: require('./assets/sparepart1.png'),
    },
    {
      id: 4,
      name: 'Bike Spare Part 2',
      category: 'Bike',
      price: '$40',
      image: require('./assets/sparepart2.png'),
    },
    {
      id: 5,
      name: 'Car Spare Part 3',
      category: 'Car',
      price: '$70',
      image: require('./assets/sparepart1.png'),
    },
  ];

  const navigation = useNavigation();

  const [products, setProducts] = useState(defaultProducts);
  const [searchText, setSearchText] = useState('');

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setProducts(defaultProducts);
    } else {
      const filteredProducts = defaultProducts.filter(
        (product) => product.name.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(filteredProducts);
    }
  };

  const handleProductPress = (product) => {
    console.log('Product pressed:', product);
    navigation.navigate('ProductDetail', { product }); // Navigate to ProductDetail screen with the selected product
  };

  // Separate car and bike products
  const carProducts = products.filter((product) => product.category === 'Car');
  const bikeProducts = products.filter((product) => product.category === 'Bike');

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleSearch('')}>
        <Text style={styles.title}>Magic Wheel</Text>
      </TouchableOpacity>

      {/* Product Search and Filter */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search products..."
          value={searchText}
          onChangeText={handleSearch}
        />
      </View>

      {/* Car Products */}
      <Text style={styles.categoryTitle}>Car Products</Text>
      <FlatList
        horizontal
        data={carProducts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={[styles.productItem, styles.carProductItem]}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />

      {/* Bike Products */}
      <Text style={styles.categoryTitle}>Bike Products</Text>
      <FlatList
        horizontal
        data={bikeProducts}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductPress(item)}>
            <View style={[styles.productItem, styles.bikeProductItem]}>
              <Image source={item.image} style={styles.productImage} />
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productList: {
    paddingBottom: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  carProductItem: {
    marginBottom: 5, // Reduce margin bottom for car products
  },
  bikeProductItem: {
    marginBottom: 5, // Reduce margin bottom for bike products
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },
  productDetails: {
    marginLeft: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
  },
});

export default Home;
