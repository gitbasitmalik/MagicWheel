import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AdminDashboard from './AdminDashboard/AdminDashboard';
import AddProduct from './AddProduct/AddProduct';
import AllProduct from './AllProduct/AllProduct';
import AddCategories from './AddCategories/AddCategories';
import AllCategories from './AllCategories/AllCategories';


const Drawer = createDrawerNavigator();

function AdminNavigator() {
  return (
<Drawer.Navigator initialRouteName="AdminDashboard">
        <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
        <Drawer.Screen name="AddProduct" component={AddProduct} />
        <Drawer.Screen name="AllProduct" component={AllProduct} />
        <Drawer.Screen name="AddCategories" component={AddCategories} />
        <Drawer.Screen name="AllCategories" component={AllCategories} />
      </Drawer.Navigator>
  );
}

export default AdminNavigator;
