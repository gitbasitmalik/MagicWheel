import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Picker } from "@react-native-picker/picker"; // Import the Picker component
import { addListing } from "../api/api";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db } from "../api/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListingForm = ({ navigation }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [images, setImages] = useState([]);
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const [userUid, setUserUid] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        Alert.alert("Session Expired", "Please log in again.");
        navigation.navigate("Login");
        return;
      }
      const parsedUser = JSON.parse(user);
      setUserUid(parsedUser.uid);
    } catch (error) {
      console.error("Error retrieving user data:", error);
      Alert.alert("Error", "Unable to fetch user data. Please log in again.");
      navigation.navigate("Login");
    }
  };
  const categories = [
    { label: "Battery", value: "battery" },
    { label: "Angles", value: "angles" },
    { label: "Ac Adapter", value: "acadapter" },
    { label: "Chock Motorcycle", value: "chockmotorcycle" },
    { label: "Air Pump", value: "airpump" },
  ];

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "You need to enable permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      allowsMultipleSelection: true,
      selectionLimit: 5,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.uri.split("/").pop(),
        type: "image/jpeg",
      }));
      setImages((prevImages) => [...prevImages, ...newImages].slice(0, 5));
    }
  };

  const uploadImage = async (uri, name) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      // Storage reference
      const storageRef = ref(db, "listingImages");
      const extension = uri.split(".").pop();
      const imageName = `${Date.now()}_${name}.${extension}`;
      const imageRef = ref(storageRef, imageName);

      // Upload image
      await uploadBytes(imageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(imageRef);

      // Return both URL and reference for deletion
      return { url: downloadURL, reference: imageName };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!userUid) {
      Alert.alert("Unauthorized", "Please log in to create a listing.");
      navigation.navigate("Login");
      return;
    }
    if (!name || !description || !price || !quantity || !category) {
      Alert.alert("Missing Fields", "Please fill in all required fields");
      return;
    }

    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length);

    if (tagArray.length > 5) {
      Alert.alert("Tag Limit Exceeded", "You can add up to 5 tags only");
      return;
    }

    if (quantity <= 0) {
      Alert.alert("Quantity", "Should be greater than 0");
      return;
    }
    setLoading(true);

    try {
      // Upload images and gather download URLs
      const uploadedImages = await Promise.all(
        images.map(async (image) => {
          return await uploadImage(image.uri, name);
        })
      );

      const newListing = {
        name,
        description,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        tags: tagArray,
        category,
        images: uploadedImages,
        user_uuid: userUid,
      };

      // Send data to backend
      const result = await addListing(newListing);

      navigation.goBack();
    } catch (error) {
      console.error("Error creating listing:", error);
      Alert.alert("Error", "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Listing</Text>

      {/* Image Picker Section */}
      <View style={styles.imageSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {images.map((image, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: image.uri }} style={styles.image} />
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 5 && (
            <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
              <Text style={styles.addImageText}>+</Text>
              <Text style={styles.addImageSubtext}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
        <Text style={styles.imageLimit}>
          {`${images.length}/5 photos added`}
        </Text>
      </View>

      {/* Form Fields */}
      <View style={styles.formSection}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="What are you selling?"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your item in detail"
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Price</Text>
        <TextInput
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholder="0.00"
          placeholderTextColor="#999"
        />
        <Text style={styles.label}>Qunatity</Text>
        <TextInput
          style={styles.input}
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
          placeholder="Enter Quantity"
        />

        <Text style={styles.label}>Tags (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={tags}
          onChangeText={setTags}
          placeholder="Enter tags e.g., new, sale, etc."
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select a category" value="" />
            {categories.map((cat) => (
              <Picker.Item
                key={cat.value}
                label={cat.label}
                value={cat.value}
              />
            ))}
          </Picker>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitButtonText}>
            {loading ? "Creating..." : "Create Listing"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Existing styles...

  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    marginTop: 60,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  imageSection: {
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    marginRight: 10,
    position: "relative",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    right: -5,
    top: -5,
    backgroundColor: "#ff4444",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  addImageText: {
    fontSize: 24,
    color: "#666",
  },
  addImageSubtext: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  imageLimit: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  formSection: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    color: "#1a1a1a",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#f8f8f8",
  },
  dropdownOptionSelected: {
    backgroundColor: "#007AFF",
  },
  dropdownOptionText: {
    color: "#1a1a1a",
  },
  dropdownOptionTextSelected: {
    color: "#ffffff",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#99c9ff",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerContainer: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 20,
  },
  picker: {
    color: "#1a1a1a",
  },
});

export default ListingForm;
