import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Button, FlatList } from 'react-native';

const Cart = ({ route }) => {
  const { products } = route.params; 

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      const initialCartItems = products.map((product) => ({ ...product, quantity: 1 }));
      setCartItems(initialCartItems);
    }
  }, [products]);

  const handleIncreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleDecreaseQuantity = (itemId) => {
    const updatedCart = cartItems.map((item) =>
      item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleRemoveItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={item.image} style={styles.productImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.quantityContainer}>
          <Button title="+" onPress={() => handleIncreaseQuantity(item.id)} />
          <Text>{item.quantity}</Text>
          <Button title="-" onPress={() => handleDecreaseQuantity(item.id)} />
        </View>
        <Button title="Remove" onPress={() => handleRemoveItem(item.id)} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      ) : (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productCategory: {
    fontSize: 16,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
    marginBottom: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emptyCartText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Cart;
