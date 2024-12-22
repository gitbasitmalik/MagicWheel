import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, StyleSheet ,Text } from "react-native";
import ListingCard from "./components/ListingCard";
import { getListings } from "./api/api";
import { AntDesign } from "@expo/vector-icons";

const MarketplaceScreen = ({ navigation }) => {
  const [listing, setListings] = useState([]);

  useEffect(() => {
    getData();
  });

  const getData = async () => {
    try {
      const result = await getListings();
      console.log(result.data);
      setListings(result.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>Marketplace</Text>
      </View>
      <FlatList
        data={listing}
        renderItem={({ item }) => (
          <ListingCard
            item={item}
            onViewDetails={() =>
              navigation.navigate("ListingList", { listing: item })
            }
          />
        )}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={listing.length === 0 ? styles.emptyList : null}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate("ListingForm")}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
  },
  emptyList: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#007AFF",
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    top: 30,
    fontWeight: "700",
    fontSize: 40,
    fontFamily: "Optima",
    alignSelf: "center",
  },
});

export default MarketplaceScreen;
