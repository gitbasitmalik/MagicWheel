import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  ScrollView,
} from "react-native";
import MyInput from "../../components/MyInput";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { uploadProductData, getCategoryData } from "../../api/api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../api/firebase";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState("");
  const [actualPrice, setActualPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [onsale, setOnSale] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imageExtension, setImageExtension] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoryData();
        const categoriesArray = Array.isArray(categoriesData.data)
          ? categoriesData.data
          : [categoriesData.data];
        setCategories(categoriesArray);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (
      !name ||
      !description ||
      !image ||
      !categoryId ||
      !actualPrice ||
      (onsale && (!salePrice || salePrice >= actualPrice))
    ) {
      alert(
        "Please fill out all required fields, and ensure sale price is less than actual price if on sale."
      );
      return;
    }

    try {
      setLoading(true);
      const storageRef = ref(db, "productImages");
      const imageName = `${Date.now()}_${name}.${imageExtension}`;
      const imageRef = ref(storageRef, imageName);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const productData = {
        name,
        description,
        items,
        category: { id: categoryId, name: category },
        imageUrl,
        imageType: imageExtension,
        actualPrice: parseFloat(actualPrice),
        salePrice: onsale ? parseFloat(salePrice) : 0,
        onSale: onsale,
      };

      await uploadProductData(productData);
      alert("Product uploaded successfully!");

      // Reset form fields after successful submission
      setName("");
      setDescription("");
      setItems("");
      setActualPrice("");
      setSalePrice("");
      setOnSale(false);
      setCategory("");
      setCategoryId("");
      setImage(null);
    } catch (error) {
      console.error("Error uploading product:", error);
      alert("Failed to upload product. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const products = [
    {
      name: "Silencer",
      description: "Exhaust silencer for motorcycle",
      categoryId: "1",
      category: "Motorcycle Parts",
      actualPrice: 100,
      salePrice: 80,
      onSale: true,
      image: "path/to/silencer.jpg",
      imageExtension: "jpg",
    },
    {
      name: "Gear",
      description: "Gear for motorcycle",
      categoryId: "1",
      category: "Motorcycle Parts",
      actualPrice: 50,
      salePrice: 40,
      onSale: false,
      image: "path/to/gear.jpg",
      imageExtension: "jpg",
    },
    // Add the rest of your products here...
  ];

  const bulkUploadProducts = async () => {
    try {
      setLoading(true); // Start loading state
      for (const product of products) {
        // Destructure product fields
        const {
          name,
          description,
          categoryId,
          category,
          actualPrice,
          salePrice,
          onSale,
          image,
          imageExtension,
        } = product;

        // Check if required fields are filled
        if (
          !name ||
          !description ||
          !categoryId ||
          !actualPrice ||
          (onSale && (!salePrice || salePrice >= actualPrice))
        ) {
          alert(
            `Please fill out all required fields for ${name}, and ensure sale price is less than actual price if on sale.`
          );
          continue; // Skip this product and continue with the next
        }

        // Upload image
        const storageRef = ref(db, "productImages");
        const imageName = `${Date.now()}_${name}.${imageExtension}`;
        const imageRef = ref(storageRef, imageName);

        const response = await fetch(image);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const imageUrl = await getDownloadURL(imageRef);

        // Prepare product data
        const productData = {
          name,
          description,
          items: 1, // Adjust this as needed
          category: { id: categoryId, name: category },
          imageUrl,
          imageType: imageExtension,
          actualPrice: parseFloat(actualPrice),
          salePrice: onSale ? parseFloat(salePrice) : 0,
          onSale,
        };

        // Upload product data
        await uploadProductData(productData);
        alert(`${name} uploaded successfully!`);
      }
      console.log("All products uploaded successfully!");
    } catch (error) {
      console.error("Error uploading products:", error);
      alert("Failed to upload products. Please try again.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  // You can call this function when needed, for example, on a button press.

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const uriParts = result.assets[0].uri.split(".");
      const extension = uriParts[uriParts.length - 1];
      setImageExtension(extension);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.header}>Add New Product</Text>
          <MyInput
            label="Product Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter product name"
          />
          <MyInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            placeholder="Enter product description"
            multiline
          />
          <MyInput
            label="Total Items"
            value={items}
            onChangeText={setItems}
            placeholder="Enter total items"
          />
          <MyInput
            label="Actual Price"
            value={actualPrice}
            onChangeText={setActualPrice}
            placeholder="Enter actual price"
            keyboardType="numeric"
          />
          <Picker
            selectedValue={categoryId}
            onValueChange={(itemValue) => {
              const selectedCategory = categories.find(
                (cat) => cat.id === itemValue
              );
              setCategoryId(itemValue);
              setCategory(selectedCategory ? selectedCategory.name : "");
            }}
            style={styles.picker}
          >
            <Picker.Item label="Select Category" value="" />
            {categories.map((cat, index) => (
              <Picker.Item key={index} label={cat.name} value={cat.id} />
            ))}
          </Picker>
          <View style={styles.row}>
            <Text style={styles.label}>On Sale</Text>
            <Button
              title={onsale ? "Yes" : "No"}
              onPress={() => setOnSale(!onsale)}
            />
          </View>
          {onsale && (
            <MyInput
              label="Sale Price"
              value={salePrice}
              onChangeText={setSalePrice}
              placeholder="Enter sale price"
              keyboardType="numeric"
            />
          )}
          <Button title="Choose Image" onPress={handleChooseImage} />
          {image && <Image source={{ uri: image }} style={styles.image} />}
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <Button title="Submit" onPress={handleSubmit} />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContent: { padding: 20 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  picker: { marginVertical: 10 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  label: { fontSize: 16 },
  image: { width: 100, height: 100, marginVertical: 10 },
});

export default AddProduct;
