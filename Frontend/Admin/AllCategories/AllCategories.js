// AllCategories.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { getCategoryData } from '../../api/api';
import Category from './component/Category';

const AllCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await getCategoryData();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.1.13:3001/api/categories/${id}`);
      setCategories(categories.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEdit = (category) => {
    // Navigate to edit screen with category details
  };

  const renderItem = ({ item }) => (
    <Category category={item} onDelete={handleDelete} onEdit={handleEdit} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Categories</Text>
      <FlatList
        data={categories}
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

export default AllCategories;
