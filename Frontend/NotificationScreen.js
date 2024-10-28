import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const NotificationScreen = () => {
  const notificationsData = [
    { id: '1', title: 'New product launches', description: 'Get notified about new products.' },
    { id: '2', title: 'Sales and discounts', description: 'Be the first to know about promotions.' },
    { id: '3', title: 'Account activity', description: 'Receive updates about your account.' },
  ];

  const renderNotificationItem = ({ item }) => (
    <View style={styles.notificationItem}>
      <Text style={styles.notificationTitle}>{item.title}</Text>
      <Text style={styles.notificationDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notificationsData}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 40,
    flex: 1,
    marginTop:20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationDescription: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationScreen;
