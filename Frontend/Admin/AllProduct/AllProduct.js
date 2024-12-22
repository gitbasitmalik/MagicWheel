// AllProducts.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import Product from './components/Product';
import { getProductData } from '../../api/api';
import axios from 'axios';


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
      try {
        await axios.delete(`http://172.20.10.2:3001/api/products/${id}`);
        setCategories(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting Product:', error);
      }
    
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
