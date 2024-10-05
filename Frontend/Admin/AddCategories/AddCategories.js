import React, { useState } from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import MyInput from '../../components/MyInput';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../api/firebase'; 
import { uploadCategoryData } from '../../api/api';
function AddCategory() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState(null);
  const [imageExtension, setImageExtension] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !description || !image) {
      alert('Name, description, and image are required!');
      return;
    }

    try {
      setLoading(true);

      // Upload image to Firebase Storage
      const storageRef = ref(db, 'categoryImages');
      const imageName = `${Date.now()}_${name}.${imageExtension}`;
      const imageRef = ref(storageRef, imageName);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      // Prepare product data to send to backend
      const productData = {
        name,
        description,
        imageUrl, // Firebase Storage download URL
      };

      // Call API to save product data to MongoDB
      await uploadCategoryData(productData);

      setLoading(false);
      alert('Category uploaded successfully!');
      
      // Reset form state
      setName('');
      setDescription('');
      setImage(null);

    } catch (error) {
      console.error('Error uploading product:', error);
      setLoading(false);
      alert('Failed to upload product. Please try again.');
    }
  };

  

  const handleChooseImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      const uriParts = result.assets[0].uri.split('.');
      const extension = uriParts[uriParts.length - 1];
      setImageExtension(extension);
    }
  };

  return (
    <View style={styles.container}>
      <MyInput
        label="Category Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter category name"
      />
      <MyInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter category description"
        multiline
      />
      <Button title="Choose Image" onPress={handleChooseImage} />
      {image && (
        <Image source={{ uri: image }} style={styles.image} />
      )}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Submit" onPress={handleSubmit} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap:10,
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default AddCategory;
