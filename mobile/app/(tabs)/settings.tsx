import React from "react";
import { 
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MobileSettingsScreen() {
  const settingsList = [
    { label: "Account profile", sub: "Avatar, name, email credentials", icon: "person-outline" },
    { label: "Theme appearance", sub: "Dark mode, light mode, accent colors", icon: "color-palette-outline" },
    { label: "AI features config", sub: "Related memories, intent organization", icon: "sparkles-outline" },
    { label: "Privacy & Data exports", sub: "Download JSON dump, clear archives", icon: "shield-checkmark-outline" }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>SJ</Text>
          </View>
          <View>
            <Text style={styles.profileName}>Subham Jyoti</Text>
            <Text style={styles.profileEmail}>subham@memora.io</Text>
          </View>
        </View>

        {/* Pro Plan Card CTA */}
        <View style={styles.proCard}>
          <View style={styles.proHeader}>
            <Text style={styles.proTitle}>UPGRADE TO PRO</Text>
            <Text style={styles.proBadge}>FREE TIER</Text>
          </View>
          <Text style={styles.proDesc}>
            You've hit the memory limit for the free tier (500 / 500 saves). Unlock unlimited slots, full RAG chat query, and desktop extensions auto-sync.
          </Text>
          <TouchableOpacity style={styles.proButton} onPress={() => alert("Upgrade request sent...")}>
            <Text style={styles.proButtonText}>Upgrade — ₹499 / month</Text>
          </TouchableOpacity>
        </View>

        {/* List items settings */}
        <View style={styles.settingsGroup}>
          <Text style={styles.groupTitle}>PREFERENCES</Text>
          {settingsList.map((item, idx) => (
            <TouchableOpacity key={idx} style={styles.listItem} onPress={() => alert(`${item.label} opened.`)}>
              <View style={styles.listItemIcon}>
                <Ionicons name={item.icon as any} size={18} color="#1447E6" />
              </View>
              <View style={styles.listItemContent}>
                <Text style={styles.listItemLabel}>{item.label}</Text>
                <Text style={styles.listItemSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => alert("Logging out...")}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>

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
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 28,
  },
  avatarCircle: {
    height: 54,
    width: 54,
    borderRadius: 27,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1447E6",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  profileEmail: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  proCard: {
    backgroundColor: "rgba(20,71,230,0.05)",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 28,
  },
  proHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  proTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1447E6",
    letterSpacing: 1,
  },
  proBadge: {
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "rgba(20,71,230,0.1)",
    color: "#1447E6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  proDesc: {
    fontSize: 11,
    color: "#8e8e93",
    lineHeight: 16,
    marginBottom: 14,
  },
  proButton: {
    backgroundColor: "#1447E6",
    borderRadius: 12,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  proButtonText: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
  },
  settingsGroup: {
    gap: 12,
    marginBottom: 28,
  },
  groupTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 1,
    marginBottom: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  listItemIcon: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: "rgba(20,71,230,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  listItemContent: {
    flex: 1,
  },
  listItemLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  listItemSub: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 2,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    marginTop: 8,
  },
  logoutText: {
    fontSize: 13,
    color: "#ff3b30",
    fontWeight: "bold",
  }
});
