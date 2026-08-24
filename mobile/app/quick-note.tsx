import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemories } from "../context/MemoryContext";

export default function MobileQuickNoteScreen() {
  const [note, setNote] = useState("");
  const { addMemory } = useMemories();

  const handleSave = () => {
    if (!note.trim()) {
      Alert.alert("Error", "Please enter a note to save.");
      return;
    }
    
    // Extract first line as title
    const firstLine = note.trim().split("\n")[0];
    const computedTitle = firstLine.length > 28 ? `${firstLine.substring(0, 25)}...` : firstLine;
    
    addMemory({
      type: "note",
      title: computedTitle || "Quick Note",
      source: "Personal Note",
      desc: note.trim(),
      tags: ["Ideas", "Note"]
    });

    Alert.alert("Saved", "Memora will organize this automatically.");
    setNote("");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        {/* Header with back trigger */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1c1c1e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New memory</Text>
        </View>

        <Text style={styles.promptLabel}>What's on your mind?</Text>

        {/* Text Input area */}
        <TextInput
          placeholder="I should build a SaaS analytics tool..."
          placeholderTextColor="#8e8e93"
          value={note}
          onChangeText={setNote}
          style={styles.textArea}
          multiline
          autoFocus
        />

        {/* AI helper tag */}
        <View style={styles.aiTag}>
          <Ionicons name="sparkles" size={14} color="#1447E6" />
          <Text style={styles.aiTagText}>Memora will organize this automatically</Text>
        </View>

        {/* Save button */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

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
  promptLabel: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 16,
  },
  textArea: {
    flex: 1,
    fontSize: 14,
    color: "#1c1c1e",
    textAlignVertical: "top",
    lineHeight: 22,
    paddingBottom: 20,
  },
  aiTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 20,
  },
  aiTagText: {
    fontSize: 11,
    color: "#1447E6",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#1447E6",
    borderRadius: 24,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
