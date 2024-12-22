import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ListingCard = ({ item, onViewDetails }) => (
  <View style={styles.card}>
    <Text style={styles.name}>{item.name}</Text>
    <Text>Price: ${item.price}</Text>
    <Text>Description: {item.description}</Text>
    <Button title="View Details" onPress={() => onViewDetails(item)} />
  </View>
);

const styles = StyleSheet.create({
  card: { padding: 16, margin: 8, borderRadius: 6, backgroundColor: '#f0f0f0' , top: 40 },
  name: { fontWeight: 'bold', fontSize: 18 }
});

export default ListingCard;
