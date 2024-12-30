import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import { Text, TextInput } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { app } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMyContext } from "./CartContext";

const LoginScreen = () => {
  const { setUser } = useMyContext();
  const navigation = useNavigation();
  const [email, setEmail] = useState("mirube@logsmarter.net");
  const [password, setPassword] = useState("123456789");
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const auth = getAuth(app);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);

          onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
              if (firebaseUser.emailVerified) {
                if (userData.email === "mbasit467@gmail.com") {
                  navigation.replace("Admin");
                } else {
                  setUser(userData);
                  navigation.replace("Layout");
                }
              } else {
                AsyncStorage.removeItem("user");
                setLoading(false);
              }
            } else {
              AsyncStorage.removeItem("user");
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const validateInputs = () => {
    if (!email?.trim()) return "Please enter your email";
    if (!password?.trim()) return "Please enter your password";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email";
    return null;
  };

  const handleResendVerification = async (user) => {
    try {
      await sendEmailVerification(user);
      Alert.alert(
        "Verification Email Sent",
        "Please check your email and verify your account before logging in."
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification email: " + error.message
      );
    }
  };

  const loginButton = async () => {
    const error = validateInputs();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);

      if (!result.user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Resend Verification",
              onPress: () => handleResendVerification(result.user),
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ]
        );
        setLoading(false);
        return;
      }

      if (email === "mbasit467@gmail.com" && password === "123456789") {
        navigation.replace("Admin");
        setLoading(false);
        return;
      }

      const data = {
        email: result.user.email,
        uid: result.user.uid,
        name: result.user.displayName || "User",
        emailVerified: result.user.emailVerified,
      };

      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("user", jsonValue);
      setUser(data);
      navigation.replace("Layout");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#522C90" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Please sign in to continue</Text>

            <View style={styles.formContainer}>
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                activeOutlineColor="#522C90"
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                style={styles.input}
                secureTextEntry={!showPassword}
                activeOutlineColor="#522C90"
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <TouchableOpacity
                style={styles.forgotPassword}
                onPress={() => navigation.navigate("Forget")}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.loginButton}
                onPress={loginButton}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.loginButtonText}>Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.signupLink}
                onPress={() => navigation.navigate("Signup")}
              >
                <Text style={styles.signupLinkText}>
                  Don't have an account? Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#522C90",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    gap: 16,
  },
  input: {
    backgroundColor: "#fff",
  },
  forgotPassword: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    color: "#522C90",
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#522C90",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupLink: {
    marginTop: 16,
    alignItems: "center",
  },
  signupLinkText: {
    color: "#522C90",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    color: "#522C90",
    fontSize: 16,
  },
});

export default LoginScreen;
