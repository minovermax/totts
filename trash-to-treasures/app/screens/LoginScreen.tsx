import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const isEduEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.(edu)$/i.test(email); // Regex for .edu email validation
  };

  const handleLogin = async () => {
    if (!isEduEmail(email)) {
      Alert.alert("Invalid Email", "Please use a .edu email address.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        Alert.alert(
          "Email Not Verified",
          "Your email is not verified. Would you like to resend the verification email?",
          [
            {
              text: "Yes",
              onPress: async () => {
                try {
                  await sendEmailVerification(user);
                  Alert.alert(
                    "Verification Email Sent",
                    `A verification email has been sent to ${user.email}. Please check your inbox.`
                  );
                } catch (error: any) {
                  Alert.alert("Error", error.message);
                }
              },
            },
            {
              text: "No",
              onPress: () => {
                // nothing happens just exits
              },
              style: "cancel", // This styles the "No" button as a cancel option
            },
          ]
        );
        return; // Prevent navigation to the Home Screen
      }

      // Successful login with a verified email
      Alert.alert("Login Successful", `Welcome, ${user.email}!`);
      router.push("/home");
    } catch (error: any) {
      Alert.alert("Login Failed", error.message);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.logoText}>TTOTS</Text>
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>Don’t have an account?</Text>
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Go to Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF8DC", // Light yellow background
  },
  logoText: {
    fontSize: 60,
    fontWeight: "bold",
    color: "#F4A300", // Yellowish orange
    marginBottom: 20,
    fontFamily: "Cochin",
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#333", // Dark contrast
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    color: "#333",
  },
  loginButton: {
    backgroundColor: "#333333", // Dark button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#F4A300", // Yellowish orange text
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  footerText: {
    marginTop: 20,
    fontSize: 16,
    color: "#333",
  },
  registerButton: {
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#F4A300", // Yellowish orange button
    borderRadius: 10,
  },
  registerButtonText: {
    color: "#FFF8DC", // Light yellow text
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
