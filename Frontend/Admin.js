import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { launchImageLibrary } from 'react-native-image-picker';

const Admin = () => {
  const [productID, setProductID] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [productData, setProductData] = useState([]);

  const categories = [
    "Electronics",
    "Books",
    "Clothing",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Outdoors"
  ];

  const sendProductData = () => {
    const newProduct = {
      id: productID,
      name: productName,
      price: productPrice,
      image: productImage?.uri,
      category: selectedCategory
    };
    setProductData([...productData, newProduct]);
    clearInputFields();
  };

  const getProductData = () => {

  };

  const clearInputFields = () => {
    setProductID("");
    setProductName("");
    setProductPrice("");
    setProductImage(null);
    setSelectedCategory("");
  };

  const updateProductData = () => {
    // Handle updating product data here
  };

  const deleteProductData = (id) => {
    setProductData(productData.filter(item => item.id !== id));
  };

  const selectImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setProductImage(response.assets[0]);
      }
    });
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.id}</Text>
      <Text style={styles.tableCell}>{item.name}</Text>
      <Text style={styles.tableCell}>{item.price}</Text>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
      </View>
      <Text style={styles.tableCell}>{item.category}</Text>
      <TouchableOpacity onPress={() => deleteProductData(item.id)}>
        <Text style={styles.tableCell}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyles}
        value={productID}
        placeholder="Enter Product ID"
        onChangeText={(text) => setProductID(text)}
      />
      <TextInput
        style={styles.inputStyles}
        value={productName}
        placeholder="Enter Product Name"
        onChangeText={(text) => setProductName(text)}
      />
      <TextInput
        style={styles.inputStyles}
        value={productPrice}
        placeholder="Enter Product Price"
        onChangeText={(text) => setProductPrice(text)}
      />
      <TouchableOpacity style={styles.imagePickerButton} onPress={selectImage}>
        <Text style={styles.imagePickerButtonText}>Pick Image</Text>
      </TouchableOpacity>
      {productImage && (
        <Image source={{ uri: productImage.uri }} style={styles.selectedImage} />
      )}
      <Picker
        selectedValue={selectedCategory}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
      >
        <Picker.Item label="Select a category" value="" />
        {categories.map((category, index) => (
          <Picker.Item key={index} label={category} value={category} />
        ))}
      </Picker>
      <TouchableOpacity onPress={getProductData}>
        <Text style={styles.btnCon}>Get Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={sendProductData}>
        <Text style={styles.btnCon}>Send Data</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearInputFields}>
        <Text style={styles.btnCon}>Clear Fields</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={updateProductData}>
        <Text style={styles.btnCon}>Update Data</Text>
      </TouchableOpacity>
      <FlatList
        data={productData}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        style={styles.tableData}
      />
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  inputStyles: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "#f3f3f3",
    marginBottom: 10,
  },
  btnCon: {
    padding: 20,
    backgroundColor: "#000",
    color: "#fff",
    textAlign: "center",
    borderRadius: 100,
    marginTop: 5,
  },
  tableContainer: {
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#ccc",
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
  },
  tableData: {
    maxHeight: 200,
    marginTop: 20,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    gap: 5,
    paddingHorizontal: 5,
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
  },
  image: {
    width: 50,
    height: 50,
  },
  imagePickerButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center",
  },
  imagePickerButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
});
