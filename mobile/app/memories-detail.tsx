import React, { useState, useEffect } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, TextInput, Dimensions, Linking, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemories } from "../context/MemoryContext";

const { width } = Dimensions.get("window");

export default function MobileMemoryDetailPage() {
  const { id } = useLocalSearchParams();
  const { memories, toggleFavorite, deleteMemory } = useMemories();

  // Find current memory or default to first
  const item = memories.find(m => m.id === id) || memories[0];

  const handleMoreOptions = () => {
    if (!item) return;
    Alert.alert(item.title, undefined, [
      { text: "Move to collection", onPress: () => router.push("/(tabs)/memories") },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteMemory(item.id);
          router.back();
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleOpenOriginal = () => {
    if (!item) return;
    if (item.type === "web" || item.type === "video") {
      const url = item.source.startsWith("http") ? item.source : `https://${item.source}`;
      Linking.openURL(url).catch(() => Alert.alert("Couldn't open link", url));
    } else {
      Alert.alert("Nothing to open", "This memory doesn't have an external link.");
    }
  };

  const [note, setNote] = useState("Good reference for Memora");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (item) {
      setNote(item.content || item.desc);
    }
  }, [item]);

  if (!item) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 24 }}>Memory not found.</Text>
      </SafeAreaView>
    );
  }

  let IconName: any = "globe-outline";
  let iconColor = "#1447E6";
  if (item.type === "video") { IconName = "logo-youtube"; iconColor = "#ff0000"; }
  else if (item.type === "note") { IconName = "create-outline"; iconColor = "#1c1c1e"; }
  else if (item.type === "voice") { IconName = "mic-outline"; iconColor = "#8e8e93"; }

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header controls */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1c1c1e" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => toggleFavorite(item.id)}>
            <Ionicons 
              name={item.isFavorite ? "star" : "star-outline"} 
              size={20} 
              color={item.isFavorite ? "#1447E6" : "#1c1c1e"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleMoreOptions}>
            <Ionicons name="ellipsis-horizontal" size={20} color="#1c1c1e" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Source visual preview */}
        <View style={styles.previewContainer}>
          <Ionicons name={IconName} size={32} color={iconColor} />
          <Text style={styles.previewLabel}>{item.type.toUpperCase()} PREVIEW</Text>
        </View>

        {/* Title / Domain details */}
        <View style={styles.detailsGroup}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.domain}>{item.source}</Text>
          
          <View style={styles.tagsRow}>
            {item.tags.map((t, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* AI Summary Block */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>AI Summary</Text>
          <Text style={styles.summaryText}>
            {item.desc || "AI analysis pending. We are extracting concepts from this save."}
          </Text>
        </View>

        {/* User note */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>Your note</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
              <Text style={styles.editText}>{isEditing ? "Done" : "Edit"}</Text>
            </TouchableOpacity>
          </View>
          
          {isEditing ? (
            <TextInput
              style={styles.noteInput}
              value={note}
              onChangeText={setNote}
              multiline
              autoFocus
            />
          ) : (
            <Text style={styles.noteText}>"{note || "Tap edit to write a note."}"</Text>
          )}
        </View>

        {/* Related memories */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Related memories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedScroll}>
            {[
              { title: "Dashboard Ref", desc: "Pricing models layout" },
              { title: "Stripe UI", desc: "Checkout checkout screens" },
              { title: "Stripe CSS", desc: "Gradient configurations" }
            ].map((rel, idx) => (
              <View key={idx} style={styles.relatedCard}>
                <Text style={styles.relTitle}>{rel.title}</Text>
                <Text style={styles.relDesc}>{rel.desc}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Open original button */}
        <TouchableOpacity style={styles.openButton} onPress={handleOpenOriginal}>
          <Text style={styles.openText}>Open original &rarr;</Text>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  headerActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 2,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 60,
  },
  previewContainer: {
    height: 180,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 20,
  },
  previewLabel: {
    fontSize: 12,
    color: "#8e8e93",
    fontWeight: "bold",
  },
  detailsGroup: {
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  domain: {
    fontSize: 13,
    color: "#8e8e93",
    marginTop: 4,
    fontFamily: "monospace",
  },
  tagsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  tagBadge: {
    backgroundColor: "#f2f2f7",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
  },
  section: {
    marginBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8e8e93",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: "#1c1c1e",
    lineHeight: 20,
  },
  editText: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "bold",
  },
  noteText: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#1c1c1e",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
  },
  relatedScroll: {
    gap: 12,
  },
  relatedCard: {
    width: 140,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#ffffff",
  },
  relTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  relDesc: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 4,
  },
  openButton: {
    backgroundColor: "#1447E6",
    borderRadius: 24,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  openText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
