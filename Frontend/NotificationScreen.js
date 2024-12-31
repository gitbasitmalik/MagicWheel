import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
  Animated,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getNotificationUserApi } from "./api/api";

const { width } = Dimensions.get("window");

const NotificationScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userUid, setUserUid] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // Animation value for expansion
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const fetchNotifications = async (uid) => {
    try {
      const response = await getNotificationUserApi(uid);
      if (response.data.success) {
        setNotifications(response.data?.notifications.filter((n) => n.message));
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const toggleExpansion = (id) => {
    setExpandedId(expandedId === id ? null : id);
    Animated.spring(animatedHeight, {
      toValue: expandedId === id ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
      tension: 40,
    }).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);
          const userString = await AsyncStorage.getItem("user");

          if (!userString) {
            Alert.alert("Session Expired", "Please log in again.");
            navigation.navigate("Login");
            return;
          }

          const parsedUser = JSON.parse(userString);
          setUserUid(parsedUser.uid);
          await fetchNotifications(parsedUser.uid);
        } catch (error) {
          console.error("Error retrieving user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, [])
  );

  const getNotificationConfig = (type) => {
    const configs = {
      order: {
        icon: "shopping-outline",
        backgroundColor: "#F8FAFF",
        accentColor: "#4F46E5",
        borderColor: "#E0E7FF",
      },
      payment: {
        icon: "credit-card-outline",
        backgroundColor: "#F7FDF9",
        accentColor: "#059669",
        borderColor: "#DCFCE7",
      },
      shipping: {
        icon: "truck-fast-outline",
        backgroundColor: "#FDF2F8",
        accentColor: "#DB2777",
        borderColor: "#FCE7F3",
      },
      default: {
        icon: "bell-outline",
        backgroundColor: "#F5F6FF",
        accentColor: "#6366F1",
        borderColor: "#E0E7FF",
      },
    };
    return configs[type] || configs.default;
  };

  const renderNotification = ({ item, index }) => {
    const config = getNotificationConfig(item.type);
    const isFirst = index === 0;
    const isExpanded = expandedId === item.id;

    return (
      <Animated.View
        style={[styles.notificationWrapper, isFirst && styles.firstItem]}
      >
        <Pressable
          onPress={() => toggleExpansion(item.id)}
          style={({ pressed }) => [
            styles.notificationItem,
            {
              backgroundColor: config.backgroundColor,
              borderColor: config.borderColor,
              transform: [
                {
                  scale: pressed ? 0.98 : 1,
                },
              ],
            },
          ]}
        >
          <View
            style={[styles.iconContainer, { backgroundColor: item.bgColor }]}
          >
            <MaterialCommunityIcons
              name={config.icon}
              size={24}
              color="#FFFFFF"
            />
          </View>
          <View style={styles.contentContainer}>
            <Text
              style={[
                styles.notificationMessage,
                !isExpanded && { numberOfLines: 2 },
              ]}
            >
              {item.message}
            </Text>
            <View style={styles.timeContainer}>
              <MaterialCommunityIcons
                name="clock-outline"
                size={14}
                color="#6B7280"
              />
              <Text style={styles.notificationDate}>
                {new Date(item.date).toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
              <MaterialCommunityIcons
                name={isExpanded ? "chevron-up" : "chevron-down"}
                size={16}
                color="#6B7280"
                style={styles.expandIcon}
              />
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {notifications.length > 0
              ? `You have ${notifications.length} notification${
                  notifications.length > 1 ? "s" : ""
                }`
              : "No new notifications"}
          </Text>
        </View>
        <View style={styles.bellIconContainer}>
          <MaterialCommunityIcons
            name="bell-ring-outline"
            size={24}
            color="#4F46E5"
          />
          {notifications.length > 0 && (
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>{notifications.length}</Text>
            </View>
          )}
        </View>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <MaterialCommunityIcons
              name="bell-sleep-outline"
              size={32}
              color="#6B7280"
            />
          </View>
          <Text style={styles.emptyText}>No notifications yet</Text>
          <Text style={styles.emptySubtext}>
            We'll notify you when something arrives
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : StatusBar.currentHeight + 20,
    paddingBottom: 24,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  bellIconContainer: {
    position: "relative",
    padding: 8,
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#EF4444",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  listContainer: {
    padding: 16,
  },
  notificationWrapper: {
    marginBottom: 12,
  },
  firstItem: {
    marginTop: 8,
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
    lineHeight: 22,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationDate: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    flex: 1,
  },
  expandIcon: {
    marginLeft: "auto",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    color: "#374151",
    fontWeight: "600",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});

export default NotificationScreen;
