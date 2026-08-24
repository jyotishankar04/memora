import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemories } from "../context/MemoryContext";

export default function MobileLoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { addMemory } = useMemories(); // trigger context loading if needed

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all credentials.");
      return;
    }

    // Success login simulation
    // In a real app we'd save to AsyncStorage/SecureStore
    Alert.alert("Success", "Welcome back to Memora!");
    router.replace("/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardWrapper}
      >
        <View style={styles.content}>
          
          {/* Logo Brand */}
          <View style={styles.logoBox}>
            <View style={styles.sparkleCircle}>
              <Ionicons name="sparkles" size={24} color="#1447E6" />
            </View>
            <Text style={styles.logoText}>memora</Text>
            <Text style={styles.subtitle}>Your personal memory archive.</Text>
          </View>

          {/* Form fields */}
          <View style={styles.form}>
            <Text style={styles.label}>EMAIL ADDRESS</Text>
            <TextInput
              placeholder="email@example.com"
              placeholderTextColor="#8e8e93"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>PASSWORD</Text>
            <TextInput
              placeholder="••••••••"
              placeholderTextColor="#8e8e93"
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* Social Signups dividers */}
          <View style={styles.dividerRow}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.line} />
          </View>

          {/* Social Buttons */}
          <View style={styles.socials}>
            <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
              <Ionicons name="logo-google" size={18} color="#1c1c1e" />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton} onPress={handleLogin}>
              <Ionicons name="logo-github" size={18} color="#1c1c1e" />
              <Text style={styles.socialText}>GitHub</Text>
            </TouchableOpacity>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardWrapper: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 32,
    gap: 32,
  },
  logoBox: {
    alignItems: "center",
    gap: 8,
  },
  sparkleCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c1c1e",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 13,
    color: "#8e8e93",
  },
  form: {
    gap: 12,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 13,
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
  },
  loginButton: {
    backgroundColor: "#1447E6",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  loginText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e5ea",
  },
  dividerText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
  },
  socials: {
    flexDirection: "row",
    gap: 12,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    height: 44,
  },
  socialText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1c1e",
  }
});
