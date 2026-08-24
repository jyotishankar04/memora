import React from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function MobileHomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Dynamic Greeting */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning, Subham.</Text>
          <Text style={styles.subGreeting}>What's on your mind?</Text>
        </View>

        {/* Global Search Input */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#1447E6" style={styles.searchIcon} />
          <TextInput
            placeholder="Search your memory..."
            placeholderTextColor="#8e8e93"
            style={styles.searchInput}
            onTouchStart={() => router.push("/search")}
          />
        </View>

        {/* Try Concept Search Prompts */}
        <View style={styles.tryContainer}>
          <Text style={styles.tryTitle}>Try searching conceptually:</Text>
          <View style={styles.tagWrapper}>
            {["SaaS inspiration", "AI agents", "PostgreSQL guides"].map((tag, idx) => (
              <TouchableOpacity key={idx} style={styles.tagButton} onPress={() => router.push({ pathname: "/search", params: { q: tag } })}>
                <Text style={styles.tagText}>“{tag}”</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Something Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SAVE SOMETHING</Text>
          <View style={styles.grid}>
            {[
              { label: "Save Link", icon: "link-outline" },
              { label: "Quick Note", icon: "create-outline" },
              { label: "Upload Image", icon: "image-outline" },
              { label: "Save File", icon: "document-text-outline" }
            ].map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.gridItem} onPress={() => router.push("/capture")}>
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={20} color="#1447E6" />
                </View>
                <Text style={styles.gridLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Saved List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>RECENTLY SAVED</Text>
            <TouchableOpacity onPress={() => router.push("/search")}>
              <Text style={styles.viewAll}>View all →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="globe-outline" size={16} color="#1447E6" />
              <Text style={styles.cardDomain}>linear.app</Text>
              <Text style={styles.cardTime}>2 min ago</Text>
            </View>
            <Text style={styles.cardTitle}>Linear Dashboard</Text>
            <Text style={styles.cardDesc}>SaaS Dashboard inspiration. Clean side navigation, metrics grids, shortcuts.</Text>
            <View style={styles.cardTags}>
              <Text style={styles.cardTag}>DESIGN</Text>
              <Text style={styles.cardTag}>SAAS</Text>
            </View>
          </View>
        </View>

        {/* Rediscovery card from past */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>FROM 6 MONTHS AGO</Text>
          <View style={styles.rediscoverCard}>
            <Text style={styles.rediscoverTitle}>PostgreSQL index tuning guides</Text>
            <Text style={styles.rediscoverDesc}>Saved Feb 24, 2026 &middot; 3 similar saves identified</Text>
            <TouchableOpacity style={styles.revisitButton}>
              <Text style={styles.revisitText}>Revisit memory</Text>
            </TouchableOpacity>
          </View>
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
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  subGreeting: {
    fontSize: 15,
    color: "#8e8e93",
    marginTop: 4,
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1c1c1e",
  },
  tryContainer: {
    marginBottom: 28,
  },
  tryTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8e8e93",
    textTransform: "uppercase",
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  tagButton: {
    backgroundColor: "rgba(20,71,230,0.05)",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.1)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 10,
    color: "#1447E6",
    fontWeight: "bold",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 1,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  gridItem: {
    width: (width - 60) / 2,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    minHeight: 110,
    justifyContent: "space-between",
  },
  iconCircle: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  recentCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardDomain: {
    fontSize: 11,
    color: "#8e8e93",
    marginLeft: 6,
    flex: 1,
  },
  cardTime: {
    fontSize: 10,
    color: "#8e8e93",
    fontFamily: "monospace",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: "#8e8e93",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardTags: {
    flexDirection: "row",
    gap: 6,
  },
  cardTag: {
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "#f2f2f7",
    color: "#8e8e93",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rediscoverCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  rediscoverTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  rediscoverDesc: {
    fontSize: 11,
    color: "#8e8e93",
    marginTop: 4,
  },
  revisitButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1447E6",
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: "center",
  },
  revisitText: {
    fontSize: 11,
    color: "#1447E6",
    fontWeight: "bold",
  }
});
