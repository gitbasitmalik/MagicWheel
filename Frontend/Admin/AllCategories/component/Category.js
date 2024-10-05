
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const Category = ({ category, onDelete, onEdit }) => {
  return (
    <View style={styles.categoryContainer}>
         <Image source={{ uri: category.imageUrl }} style={styles.productImage} />
      <Text style={styles.categoryName}>{category.name}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => onEdit(category)} />
        <Button title="Delete" onPress={() => onDelete(category.id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
});

export default Category;
