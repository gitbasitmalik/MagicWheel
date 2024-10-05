import React from 'react';
import { View, Text, Button } from 'react-native';

function AdminDashboard({ navigation }) {
  return (
    <View>
      <Text>Admin Dashboard</Text>
      <Button title="Go to Add Product" onPress={() => navigation.navigate('AddProduct')} />
      <Button title="Go to All Product" onPress={() => navigation.navigate('AllProduct')} />
      <Button title="Go to Add Categories" onPress={() => navigation.navigate('AddCategories')} />
      <Button title="Go to All Categories" onPress={() => navigation.navigate('AllCategories')} />
    </View>
  );
}

export default AdminDashboard;
