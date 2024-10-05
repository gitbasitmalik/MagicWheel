import React, { useState, useEffect } from 'react';
import { View, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';
import MyInput from '../../components/MyInput';
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from 'expo-image-picker';
import { uploadProductData, getCategoryData } from '../../api/api'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../../api/firebase'; 

function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imageExtension, setImageExtension] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategoryData();
        console.log('Categories Data:', categoriesData.data);

        const categoriesArray = Array.isArray(categoriesData.data) ? categoriesData.data : [categoriesData.data];
        setCategories(categoriesArray);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (!name || !description || !image || !categoryId) {
      alert('Name, description, image, and category are required!');
      return;
    }

    try {
      setLoading(true);

      const storageRef = ref(db, 'productImages');
      const imageName = `${Date.now()}_${name}.${imageExtension}`;
      const imageRef = ref(storageRef, imageName);

      const response = await fetch(image);
      const blob = await response.blob();

      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const productData = {
        name,
        description,
        category: { id: categoryId, name: category }, 
        imageUrl,
        imageType: imageExtension, 
      };

      await uploadProductData(productData);

      setLoading(false);
      alert('Product uploaded successfully!');
      
      setName('');
      setDescription('');
      setCategory('');
      setCategoryId('');
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
      <Picker
        selectedValue={categoryId}
        onValueChange={(itemValue, itemIndex) => {
          const selectedCategory = categories.find(cat => cat.id === itemValue);
          console.log('Selected Category:', selectedCategory);
          setCategoryId(itemValue);
          setCategory(selectedCategory ? selectedCategory.name : '');
        }}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((cat,d) => (
          <Picker.Item key={d} label={cat.name} value={cat.id} />
        ))}
      </Picker>
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
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginTop: 10,
  },
});

export default AddProduct;
