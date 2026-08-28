import React from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Dimensions 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemories } from "../../context/MemoryContext";

const { width } = Dimensions.get("window");

function useGreeting() {
  const hr = new Date().getHours();
  if (hr < 12) return "Good morning";
  if (hr < 18) return "Good afternoon";
  return "Good evening";
}

export default function MobileHomeScreen() {
  const { memories } = useMemories();
  const greeting = useGreeting();

  // Get latest 3 memories for recently saved feed
  const recentMemories = memories.slice(0, 3);
  
  // Find a rediscovery candidate (e.g. older than 1 day or index 3)
  const rediscoverCandidate = memories.find(m => m.tags.includes("Database") || m.tags.includes("Design")) || memories[memories.length - 1];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Top Header Row with Avatar settings trigger */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.subGreeting}>Your memory is growing.</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.avatarButton} 
            onPress={() => router.push("/settings")}
          >
            <Text style={styles.avatarText}>JD</Text>
          </TouchableOpacity>
        </View>

        {/* 🔍 Search Input Trigger */}
        <TouchableOpacity 
          style={styles.searchWrapper}
          onPress={() => router.push("/search")}
          activeOpacity={0.9}
        >
          <Ionicons name="search" size={20} color="#1447E6" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Search your memory...</Text>
        </TouchableOpacity>

        {/* Quick Capture Row */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick capture</Text>
          <View style={styles.captureRow}>
            {[
              { label: "Link", icon: "link-outline", route: "/capture" },
              { label: "Note", icon: "create-outline", route: "/quick-note" },
              { label: "Image", icon: "camera-outline", route: "/capture" },
              { label: "Voice", icon: "mic-outline", route: "/voice-capture" }
            ].map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.captureItem}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={item.icon as any} size={20} color="#1c1c1e" />
                </View>
                <Text style={styles.captureLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Saved Vertical feed */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recently saved</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/memories")}>
              <Text style={styles.viewAll}>See &rarr;</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentFeed}>
            {recentMemories.map((item) => {
              let IconName: any = "globe-outline";
              let iconColor = "#1447E6";
              if (item.type === "video") { IconName = "logo-youtube"; iconColor = "#ff0000"; }
              else if (item.type === "note") { IconName = "create-outline"; iconColor = "#1c1c1e"; }
              else if (item.type === "voice") { IconName = "mic-outline"; iconColor = "#8e8e93"; }

              return (
                <TouchableOpacity 
                  key={item.id}
                  style={styles.memoryCard}
                  onPress={() => router.push({ pathname: "/memories-detail", params: { id: item.id } })}
                >
                  <View style={styles.cardPreviewPlaceholder}>
                    <Ionicons name={IconName} size={24} color={iconColor} />
                    <Text style={styles.previewText}>{item.type.toUpperCase()} PREVIEW</Text>
                  </View>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardTags}>
                      {item.tags.map(t => `✦ ${t}`).join("  ")} &middot; {item.source}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rediscovery card from past */}
        {rediscoverCandidate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>You saved this for a reason.</Text>
            <View style={styles.rediscoverCard}>
              <View style={styles.rediscoverHeader}>
                <Ionicons name="sparkles" size={16} color="#1447E6" />
                <Text style={styles.rediscoverLabel}>SAVED {rediscoverCandidate.timeAgo.toUpperCase()}</Text>
              </View>
              
              <Text style={styles.rediscoverTitle}>{rediscoverCandidate.title}</Text>
              <Text style={styles.rediscoverDesc}>
                {rediscoverCandidate.desc}
              </Text>
              
              <TouchableOpacity 
                style={styles.revisitButton}
                onPress={() => router.push({ pathname: "/memories-detail", params: { id: rediscoverCandidate.id } })}
              >
                <Text style={styles.revisitText}>Revisit &rarr;</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  subGreeting: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 2,
  },
  avatarButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(20,71,230,0.1)",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1447E6",
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
    marginBottom: 28,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: "#8e8e93",
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#8e8e93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "600",
  },
  captureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  captureItem: {
    alignItems: "center",
    width: (width - 48 - 30) / 4,
  },
  iconCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "#f2f2f7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  captureLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  recentFeed: {
    gap: 16,
  },
  memoryCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  cardPreviewPlaceholder: {
    height: 120,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  previewText: {
    fontSize: 11,
    color: "#8e8e93",
    fontWeight: "600",
  },
  cardContent: {
    padding: 14,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  cardTags: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 4,
  },
  rediscoverCard: {
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "rgba(20,71,230,0.03)",
  },
  rediscoverHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  rediscoverLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1447E6",
    letterSpacing: 0.5,
  },
  rediscoverTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  rediscoverDesc: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 4,
    lineHeight: 18,
  },
  revisitButton: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  revisitText: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "bold",
  }
});
