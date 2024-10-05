// AllProducts.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import Product from './components/Product';
import { getProductData } from '../../api/api';


const AllProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProductData();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    
  };

  const handleEdit = (product) => {
   
  };

  const renderItem = ({ item }) => (
    <Product product={item} onDelete={handleDelete} onEdit={handleEdit} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Products</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  }
});

export default AllProducts;
