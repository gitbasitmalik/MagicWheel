// Product.js
import React from 'react';
import { View, Text, Button, StyleSheet, Image } from 'react-native';

const Product = ({ product, onDelete, onEdit }) => {
  return (
    <View style={styles.productContainer}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productDescription}>{product.description}</Text>
      <Text style={styles.productCategory}>{product.category.name}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Edit" onPress={() => onEdit(product)} />
        <Button title="Delete" onPress={() => onDelete(product.id)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
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
  productImage: {
    width: 200,
    height: 200,
    marginBottom: 10
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  productDescription: {
    fontSize: 14,
    marginBottom: 5
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default Product;
