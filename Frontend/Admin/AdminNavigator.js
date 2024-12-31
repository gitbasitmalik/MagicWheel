import * as React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import AddProduct from "./AddProduct/AddProduct";
import AllProduct from "./AllProduct/AllProduct";
import AddCategories from "./AddCategories/AddCategories";
import AllCategories from "./AllCategories/AllCategories";
import OrdersListScreen from "./Order/OrderList";
import OrderDetailsScreen from "./Order/OrderAdminDetailScreen";
import AdminNotificationScreen from "./AdminNotification/AdminNotificationScreen.js";

const Drawer = createDrawerNavigator();

function AdminNavigator() {
  return (
    <Drawer.Navigator initialRouteName="AdminDashboard">
      <Drawer.Screen name="AdminDashboard" component={AdminDashboard} />
      <Drawer.Screen name="AddProduct" component={AddProduct} />
      <Drawer.Screen name="AllProduct" component={AllProduct} />
      <Drawer.Screen name="AddCategories" component={AddCategories} />
      <Drawer.Screen name="AllOrders" component={OrdersListScreen} />
      <Drawer.Screen name="OrderDetailsAdmin" component={OrderDetailsScreen} />
      <Drawer.Screen name="AllCategories" component={AllCategories} />
      <Drawer.Screen
        name="AllNotifications"
        component={AdminNotificationScreen}
      />
    </Drawer.Navigator>
  );
}

export default AdminNavigator;
