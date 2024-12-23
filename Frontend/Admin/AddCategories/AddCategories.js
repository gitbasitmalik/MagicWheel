import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../../api/firebase";
import MyInput from "../../components/MyInput";
import { uploadCategoryData } from "../../api/api";

function AddCategory({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.description.trim() || !image) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields and add a category image."
      );
      return false;
    }
    return true;
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      const storageRef = ref(db, "categoryImages");
      const extension = uri.split(".").pop();
      const imageName = `${Date.now()}_${formData.name}.${extension}`;
      const imageRef = ref(storageRef, imageName);

      await uploadBytes(imageRef, blob);
      return await getDownloadURL(imageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Upload image and get URL
      const imageUrl = await uploadImage(image.uri);

      // Prepare category data with user information
      const categoryData = {
        ...formData,
        imageUrl,
        atedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await uploadCategoryData(categoryData);

      Alert.alert("Success", "Category uploaded successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.error("Error uploading category:", error);
      Alert.alert("Error", "Failed to upload category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChooseImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add New Category</Text>

      {/* Form Fields */}
      <MyInput
        label="Category Name"
        value={formData.name}
        onChangeText={(text) => handleInputChange("name", text)}
        placeholder="Enter category name"
        style={styles.input}
      />

      <MyInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => handleInputChange("description", text)}
        placeholder="Enter category description"
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      {/* Image Section */}
      <View style={styles.imageSection}>
        <Text style={styles.imageTitle}>Category Image</Text>

        {image ? (
          <View style={styles.imageContainer}>
            <Image source={{ uri: image.uri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.changeImageButton}
              onPress={handleChooseImage}
            >
              <Text style={styles.changeImageText}>Change Image</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addImageButton}
            onPress={handleChooseImage}
          >
            <Text style={styles.addImageText}>+ Add Category Image</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.submitButton, loading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitButtonText}>Create Category</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  userInfo: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  userInfoText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  userInfoEmail: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  input: {
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  imageSection: {
    marginVertical: 20,
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  addImageButton: {
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#cccccc",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  addImageText: {
    fontSize: 16,
    color: "#666666",
  },
  changeImageButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 6,
  },
  changeImageText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 20,
  },
  submitButtonDisabled: {
    backgroundColor: "#cccccc",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AddCategory;
