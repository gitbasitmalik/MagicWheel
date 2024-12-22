import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { addListing } from "../api/api";

const ListingForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async () => {
    const newListing = {
      name,
      description,
      price: parseFloat(price),
    };
    await addListing(newListing);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a new Listing</Text>
      <Text style={styles.label}>Name:</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} color="#007AFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 40,
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  label: {
    marginVertical: 10,
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
  },
  title: {
    top: 10,
    fontWeight: "700",
    fontSize: 40,
    fontFamily: "Optima",
    alignSelf: "center",
  },
});

export default ListingForm;
