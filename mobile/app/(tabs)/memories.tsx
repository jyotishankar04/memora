import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MobileMemoriesScreen() {
  const [filter, setFilter] = useState("all");
  const [showCollections, setShowCollections] = useState(false);

  const collections = [
    { label: "Design", icon: "color-palette-outline", count: 42 },
    { label: "Development", icon: "code-slash-outline", count: 38 },
    { label: "AI", icon: "logo-android", count: 27 },
    { label: "Ideas", icon: "bulb-outline", count: 19 },
    { label: "Learning", icon: "book-outline", count: 51 }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Memories</Text>
          <TouchableOpacity 
            style={styles.colToggleButton}
            onPress={() => setShowCollections(!showCollections)}
          >
            <Ionicons name={showCollections ? "grid" : "folder-open-outline"} size={20} color="#1447E6" />
          </TouchableOpacity>
        </View>

        {/* 🔍 Search box */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color="#8e8e93" style={styles.searchIcon} />
          <TextInput
            placeholder="Search memories..."
            placeholderTextColor="#8e8e93"
            style={styles.searchInput}
          />
        </View>

        {/* Filter Pills */}
        <View style={styles.pillsScroll}>
          {[
            { id: "all", label: "All" },
            { id: "links", label: "Links" },
            { id: "videos", label: "Videos" },
            { id: "notes", label: "Notes" }
          ].map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.pill, filter === item.id && styles.activePill]}
              onPress={() => setFilter(item.id)}
            >
              <Text style={[styles.pillText, filter === item.id && styles.activePillText]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {showCollections ? (
            /* COLLECTIONS PANEL VIEW */
            <View style={styles.collectionsSection}>
              <Text style={styles.subLabel}>COLLECTIONS</Text>
              
              <View style={styles.collectionsList}>
                {collections.map((col, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.colRow}
                    onPress={() => alert(`${col.label} folder opened.`)}
                  >
                    <View style={styles.colIconBox}>
                      <Ionicons name={col.icon as any} size={18} color="#1447E6" />
                    </View>
                    <View style={styles.colInfo}>
                      <Text style={styles.colTitle}>{col.label}</Text>
                      <Text style={styles.colCount}>{col.count} memories</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity style={styles.newColButton} onPress={() => alert("Create collection model...")}>
                <Ionicons name="plus" size={16} color="#1447E6" />
                <Text style={styles.newColText}>New collection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* TIMELINE VERTICAL FEED */
            <View style={styles.timelineSection}>
              
              {/* Today heading */}
              <View style={styles.timeGroup}>
                <Text style={styles.timeGroupTitle}>Today</Text>
                
                {/* Website Card */}
                <TouchableOpacity 
                  style={styles.timelineCard}
                  onPress={() => router.push("/memories-detail")}
                >
                  <View style={styles.cardHeader}>
                    <Ionicons name="globe-outline" size={14} color="#1447E6" />
                    <Text style={styles.cardSource}>linear.app</Text>
                  </View>
                  <Text style={styles.cardTitle}>SaaS Landing Page</Text>
                  <Text style={styles.cardTags}>🎨 Design &middot; SaaS</Text>
                </TouchableOpacity>

                {/* Video Card */}
                <TouchableOpacity 
                  style={styles.timelineCard}
                  onPress={() => router.push("/memories-detail")}
                >
                  <View style={styles.cardHeader}>
                    <Ionicons name="logo-youtube" size={14} color="#ff0000" />
                    <Text style={styles.cardSource}>youtube.com</Text>
                  </View>
                  <Text style={styles.cardTitle}>Building AI Agents</Text>
                  <Text style={styles.cardTags}>🤖 AI &middot; Learning</Text>
                </TouchableOpacity>

              </View>

              {/* Yesterday heading */}
              <View style={styles.timeGroup}>
                <Text style={styles.timeGroupTitle}>Yesterday</Text>

                {/* Note Card */}
                <TouchableOpacity 
                  style={styles.timelineCard}
                  onPress={() => router.push("/memories-detail")}
                >
                  <View style={styles.cardHeader}>
                    <Ionicons name="create-outline" size={14} color="#1c1c1e" />
                    <Text style={styles.cardSource}>Personal Note</Text>
                  </View>
                  <Text style={styles.cardTitle}>Indie SaaS Analytics Idea</Text>
                  <Text style={styles.cardTags}>💡 Ideas &middot; Startup</Text>
                </TouchableOpacity>
              </View>

            </View>
          )}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  paddingWrapper: {
    flex: 1,
    padding: 24,
    paddingBottom: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  colToggleButton: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: "#f2f2f7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f7",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#1c1c1e",
  },
  pillsScroll: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    backgroundColor: "#ffffff",
  },
  activePill: {
    backgroundColor: "rgba(20,71,230,0.1)",
    borderColor: "rgba(20,71,230,0.2)",
  },
  pillText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8e8e93",
  },
  activePillText: {
    color: "#1447E6",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  collectionsSection: {
    gap: 16,
  },
  subLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
  },
  collectionsList: {
    gap: 12,
  },
  colRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 14,
    backgroundColor: "#ffffff",
    gap: 12,
  },
  colIconBox: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: "rgba(20,71,230,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  colInfo: {
    flex: 1,
  },
  colTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  colCount: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 2,
  },
  newColButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#1447E6",
    borderRadius: 12,
    paddingVertical: 10,
    marginTop: 8,
  },
  newColText: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "bold",
  },
  timelineSection: {
    gap: 20,
  },
  timeGroup: {
    gap: 12,
  },
  timeGroupTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  timelineCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  cardSource: {
    fontSize: 10,
    color: "#8e8e93",
    fontFamily: "monospace",
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
  }
});
