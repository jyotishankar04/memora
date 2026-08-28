import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function MobileSettingsPage() {
  const { logout } = useAuth();
  const [aiToggles, setAiToggles] = useState({
    "AI organization": true,
    "AI summaries": true,
    "Search settings": true,
  });
  const [theme, setTheme] = useState("System Default");

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header with Back arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1c1c1e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Settings</Text>
        </View>

        {/* Account Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View>
              <Text style={styles.profileName}>Subham Jyoti</Text>
              <Text style={styles.profileEmail}>email@example.com</Text>
            </View>
          </View>
        </View>

        {/* Capture Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Capture</Text>
          <View style={styles.settingsGroup}>
            {[
              { label: "Browser Extension", state: "Connected" },
              { label: "Connected apps", state: "Notion, YouTube" },
              { label: "Keyboard shortcuts", state: "⌘K Configured" }
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.settingsItem}
                onPress={() => Alert.alert(item.label, `Current status: ${item.state}`)}
              >
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemState}>{item.state}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Features */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI Features</Text>
          <View style={styles.settingsGroup}>
            {Object.entries(aiToggles).map(([label, enabled], idx) => (
              <View key={idx} style={styles.settingsItem}>
                <Text style={styles.itemLabel}>{label}</Text>
                <Switch
                  value={enabled}
                  onValueChange={(value) => setAiToggles((prev) => ({ ...prev, [label]: value }))}
                  trackColor={{ true: "#1447E6" }}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Data exports */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Data</Text>
          <View style={styles.settingsGroup}>
            {[
              { label: "Import Bookmarks" },
              { label: "Export Library" },
              { label: "Local storage limit" }
            ].map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.settingsItem}
                onPress={() => Alert.alert(item.label, "This isn't available yet.")}
              >
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={14} color="#8e8e93" />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Appearance Theme */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Appearance</Text>
          <View style={styles.settingsGroup}>
            {["System Default", "Light theme", "Dark theme"].map((themeOpt, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.settingsItem}
                onPress={() => setTheme(themeOpt)}
              >
                <Text style={styles.itemLabel}>{themeOpt}</Text>
                {theme === themeOpt && <Ionicons name="checkmark" size={16} color="#1447E6" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Privacy options / Logout */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={18} color="#ff3b30" />
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1447E6",
  },
  profileName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  profileEmail: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  settingsGroup: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  itemLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  itemState: {
    fontSize: 12,
    color: "#8e8e93",
  },
  logoutRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 16,
    height: 48,
    marginTop: 8,
  },
  logoutText: {
    fontSize: 13,
    color: "#ff3b30",
    fontWeight: "bold",
  }
});
