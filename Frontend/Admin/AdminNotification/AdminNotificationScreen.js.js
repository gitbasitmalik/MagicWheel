import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Icon from "react-native-vector-icons/MaterialIcons"; // Importing Icon component
import { getAllAdminNotifications } from "../../api/api";

const AdminNotificationScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const result = await getAllAdminNotifications();
        setNotifications(result.data.notifications);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <View
        style={[styles.notificationContainer, { backgroundColor: "#f0f0f0" }]}
      >
        <Icon
          name={item.bgIcon || "notifications"}
          size={30}
          color="#000"
          style={styles.icon}
        />

        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Loading notifications...</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  notificationItem: {
    marginBottom: 10,
  },
  notificationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center", // Aligns icon and text properly
  },
  icon: {
    marginRight: 10,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AdminNotificationScreen;
