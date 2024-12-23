import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  AntDesign,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {
  const [name, setName] = useState("John Doe");
  const [password, setPassword] = useState("********");
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    phone: "",
    postalCode: "",
  });

  const nameSheetRef = useRef();
  const passwordSheetRef = useRef();
  const shippingSheetRef = useRef();

  const handleChangeName = () => {
    if (newName.trim()) {
      setName(newName.trim());
      Alert.alert("Success", "Name changed successfully!");
      nameSheetRef.current.close();
      setNewName("");
    } else {
      Alert.alert("Error", "Please enter a valid name.");
    }
  };

  const handleChangePassword = () => {
    if (newPassword.trim()) {
      setPassword(newPassword.trim());
      Alert.alert("Success", "Password changed successfully!");
      passwordSheetRef.current.close();
      setNewPassword("");
    } else {
      Alert.alert("Error", "Please enter a valid password.");
    }
  };

  const handleUpdateShipping = () => {
    const { fullName, address, city, phone, postalCode } = shippingInfo;
    if (fullName && address && city && phone && postalCode) {
      Alert.alert("Success", "Shipping information updated successfully!");
      shippingSheetRef.current.close();
    } else {
      Alert.alert("Error", "Please fill in all fields.");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
  };

  const logout = async () => {
    try {
      AsyncStorage.removeItem("user");
      navigation.navigate("Login");
    } catch (error) {}
  };
  const handleHelp = () => {
    Alert.alert(
      "Help & Support",
      "Contact our support team:\nEmail: support@example.com\nPhone: 1-800-123-4567"
    );
  };

  const SettingCard = ({ icon, title, value, onPress, color = "#6C5CE7" }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          {icon}
        </View>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardValue}>{value}</Text>
        </View>
      </View>
      <Feather name="chevron-right" size={24} color="#A0A0A0" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <SettingCard
            icon={<Feather name="help-circle" size={24} color="#6B3C76" />}
            title="Help Information"
            value="Get Help Here"
          />
          <SettingCard
            icon={<Feather name="log-out" size={24} color="#FF6B6B" />}
            title="Log Out"
            value="Logout from this device"
            onPress={() => handleLogout()}
          />
        </View>

        {/* Bottom Sheets */}
        <RBSheet
          ref={nameSheetRef}
          height={300}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheet,
          }}
        >
          <Text style={styles.sheetTitle}>Change Name</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="user"
              size={20}
              color="#6C5CE7"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter new name"
              value={newName}
              onChangeText={setNewName}
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleChangeName}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </RBSheet>

        <RBSheet
          ref={passwordSheetRef}
          height={300}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheet,
          }}
        >
          <Text style={styles.sheetTitle}>Change Password</Text>
          <View style={styles.inputContainer}>
            <Feather
              name="lock"
              size={20}
              color="#6C5CE7"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter new password"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#A0A0A0"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              <Feather
                name={showPassword ? "eye" : "eye-off"}
                size={20}
                color="#A0A0A0"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </RBSheet>

        <RBSheet
          ref={shippingSheetRef}
          height={500}
          openDuration={250}
          customStyles={{
            container: styles.bottomSheet,
          }}
        >
          <Text style={styles.sheetTitle}>Shipping Information</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.inputContainer}>
              <Feather
                name="user"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={shippingInfo.fullName}
                onChangeText={(text) =>
                  setShippingInfo((prev) => ({ ...prev, fullName: text }))
                }
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="map-pin"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                value={shippingInfo.address}
                onChangeText={(text) =>
                  setShippingInfo((prev) => ({ ...prev, address: text }))
                }
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="home"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={shippingInfo.city}
                onChangeText={(text) =>
                  setShippingInfo((prev) => ({ ...prev, city: text }))
                }
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="phone"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                keyboardType="phone-pad"
                value={shippingInfo.phone}
                onChangeText={(text) =>
                  setShippingInfo((prev) => ({ ...prev, phone: text }))
                }
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather
                name="mail"
                size={20}
                color="#6C5CE7"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                keyboardType="number-pad"
                value={shippingInfo.postalCode}
                onChangeText={(text) =>
                  setShippingInfo((prev) => ({ ...prev, postalCode: text }))
                }
                placeholderTextColor="#A0A0A0"
              />
            </View>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleUpdateShipping}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </RBSheet>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D3436",
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    borderRadius: 12,
    marginLeft: 8,
    backgroundColor: "#F0EEFF",
  },
  logoutButton: {
    backgroundColor: "#FFE8E8",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6C5CE7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3436",
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTextContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 14,
    color: "#A0A0A0",
  },
  bottomSheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2D3436",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F6FA",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#2D3436",
  },
  eyeIcon: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: "#6C5CE7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SettingsScreen;
