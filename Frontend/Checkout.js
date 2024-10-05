import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';

const Checkout = ({navigation , route}) => {

  const [cartItems, setCartItems] = useState([]);
 
  useEffect(() => {
    const { item } = route.params;
    setCartItems([item]);
  }, []);

  const renderItem = ({ item }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.imageUri }} style={styles.itemImage} />
      <Card.Content>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price}</Text>
      </Card.Content>
      <Card.Actions>
        <Button style={styles.btn} icon="cart-remove" mode="contained" onPress={() => removeItem(item.id)}>
          Remove
        </Button>
      </Card.Actions>
    </Card>
  );

  const removeItem = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    console.log('Removing item with ID:', itemId);
  };

  const calculateTotal = () => {
    let total = 0;
    cartItems.forEach((item) => {
      total += item.price;
    });
    return total;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id?.toString()}

      />

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${calculateTotal()}</Text>
        <Button style={styles.btn} mode="contained" onPress={()=>navigation.navigate("PlaceOrder")}>
          Checkout
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 5,
  },
  itemImage: {
    height: 200, 
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 16,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  btn: {
    backgroundColor: '#0D6EFD',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    marginLeft: 155,
    marginTop: 30,
  },
});

export default Checkout;