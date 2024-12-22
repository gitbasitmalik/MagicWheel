import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import MarketplaceContext from "../MarketplaceContext";
import { deleteListing } from "../api/api";

const ListingDetail = ({ route, navigation }) => {
  const { listing } = route.params;

  const handleDelete = async () => {
    await deleteListing(listing._id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Listing Detail</Text>
      <Text style={styles.name}>{listing.name}</Text>
      <Text>Price: ${listing.price}</Text>
      <Text>Condition: {listing.description}</Text>
      <Button title="Delete Listing" onPress={handleDelete} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    padding: 16 , top: 40 
  },
  name: { 
    fontWeight: "bold", fontSize: 24, marginBottom: 10 
  },
  title: {
    top: 0,
    fontWeight: "700",
    fontSize: 40,
    fontFamily: "Optima",
    alignSelf: "center",
  },
});

export default ListingDetail;
