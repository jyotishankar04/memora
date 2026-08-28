import React, { useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemories, Memory } from "../../context/MemoryContext";

export default function MobileMemoriesScreen() {
  const [filter, setFilter] = useState("all");
  const [showCollections, setShowCollections] = useState(false);
  const [tagFilter, setTagFilter] = useState<string[] | null>(null);
  const { memories } = useMemories();

  const collections = [
    { label: "Design", icon: "color-palette-outline", tags: ["Design"], count: memories.filter(m => m.tags.includes("Design")).length + 40 },
    { label: "Development", icon: "code-slash-outline", tags: ["Dev"], count: memories.filter(m => m.tags.includes("Dev")).length + 36 },
    { label: "AI", icon: "logo-android", tags: ["AI", "Database"], count: memories.filter(m => m.tags.includes("AI") || m.tags.includes("Database")).length + 24 },
    { label: "Ideas", icon: "bulb-outline", tags: ["Ideas"], count: memories.filter(m => m.tags.includes("Ideas")).length + 18 },
    { label: "Learning", icon: "book-outline", tags: ["Learning"], count: memories.filter(m => m.tags.includes("Learning")).length + 50 }
  ];

  // Dynamic filter application
  const filteredMemories = memories.filter((m) => {
    if (tagFilter && !m.tags.some(t => tagFilter.includes(t))) return false;
    if (filter === "links") return m.type === "web";
    if (filter === "videos") return m.type === "video";
    if (filter === "notes") return m.type === "note" || m.type === "voice";
    return true;
  });

  // Grouping by Date headings
  const todayMemories = filteredMemories.filter(m => m.timeAgo === "Just now" || m.timeAgo === "2 min ago" || m.timeAgo === "1 hour ago");
  const yesterdayMemories = filteredMemories.filter(m => m.timeAgo === "Yesterday");
  const earlierMemories = filteredMemories.filter(m => m.timeAgo !== "Just now" && m.timeAgo !== "2 min ago" && m.timeAgo !== "1 hour ago" && m.timeAgo !== "Yesterday");

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
            onTouchStart={() => router.push("/search")}
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

        {tagFilter && (
          <TouchableOpacity style={styles.activeTagFilter} onPress={() => setTagFilter(null)}>
            <Text style={styles.activeTagFilterText}>Filtering: {tagFilter.join(", ")}</Text>
            <Ionicons name="close-circle" size={16} color="#1447E6" />
          </TouchableOpacity>
        )}

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
                    onPress={() => {
                      setTagFilter(col.tags);
                      setFilter("all");
                      setShowCollections(false);
                    }}
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

              <TouchableOpacity style={styles.newColButton} onPress={() => Alert.alert("New collection", "Creating collections isn't available yet.")}>
                <Ionicons name="add" size={16} color="#1447E6" />
                <Text style={styles.newColText}>New collection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* TIMELINE VERTICAL FEED */
            <View style={styles.timelineSection}>
              
              {/* Today heading */}
              {todayMemories.length > 0 && (
                <View style={styles.timeGroup}>
                  <Text style={styles.timeGroupTitle}>Today</Text>
                  {todayMemories.map(item => (
                    <MemoryCardRow key={item.id} item={item} />
                  ))}
                </View>
              )}

              {/* Yesterday heading */}
              {yesterdayMemories.length > 0 && (
                <View style={styles.timeGroup}>
                  <Text style={styles.timeGroupTitle}>Yesterday</Text>
                  {yesterdayMemories.map(item => (
                    <MemoryCardRow key={item.id} item={item} />
                  ))}
                </View>
              )}

              {/* Earlier heading */}
              {earlierMemories.length > 0 && (
                <View style={styles.timeGroup}>
                  <Text style={styles.timeGroupTitle}>Earlier</Text>
                  {earlierMemories.map(item => (
                    <MemoryCardRow key={item.id} item={item} />
                  ))}
                </View>
              )}

              {filteredMemories.length === 0 && (
                <Text style={styles.emptyFeed}>No saves matched this filter.</Text>
              )}

            </View>
          )}
        </ScrollView>

      </View>
    </SafeAreaView>
  );
}

// Subcomponent to render rows cleanly
function MemoryCardRow({ item }: { item: Memory }) {
  let IconName: any = "globe-outline";
  let iconColor = "#1447E6";
  if (item.type === "video") { IconName = "logo-youtube"; iconColor = "#ff0000"; }
  else if (item.type === "note") { IconName = "create-outline"; iconColor = "#1c1c1e"; }
  else if (item.type === "voice") { IconName = "mic-outline"; iconColor = "#8e8e93"; }

  return (
    <TouchableOpacity 
      style={styles.timelineCard}
      onPress={() => router.push({ pathname: "/memories-detail", params: { id: item.id } })}
    >
      <View style={styles.cardHeader}>
        <Ionicons name={IconName} size={14} color={iconColor} />
        <Text style={styles.cardSource}>{item.source}</Text>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardTags}>{item.tags.map(t => `#${t}`).join("  ")}</Text>
    </TouchableOpacity>
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
  activeTagFilter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(20,71,230,0.06)",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  activeTagFilterText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#1447E6",
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
  emptyFeed: {
    fontSize: 12,
    color: "#8e8e93",
    textAlign: "center",
    paddingVertical: 40,
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
