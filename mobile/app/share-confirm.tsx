import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MobileShareConfirmModal() {
  const [note, setNote] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backdrop}>
        
        {/* Share card popup */}
        <View style={styles.card}>
          
          <View style={styles.checkRow}>
            <Ionicons name="checkmark-circle" size={24} color="#1447E6" />
            <Text style={styles.savedLabel}>Saved to Memora</Text>
          </View>

          <View style={styles.details}>
            <Text style={styles.title}>How to Build Better SaaS</Text>
            <Text style={styles.source}>YouTube</Text>
          </View>

          {/* Extracted tags list */}
          <View style={styles.tagsGroup}>
            {["SaaS", "Development", "Learning"].map((tag, idx) => (
              <View key={idx} style={styles.tagBadge}>
                <Text style={styles.tagText}>✦ {tag}</Text>
              </View>
            ))}
          </View>

          {/* Add note input */}
          <View style={styles.noteWrapper}>
            <TextInput
              placeholder="Add note..."
              placeholderTextColor="#8e8e93"
              value={note}
              onChangeText={setNote}
              style={styles.noteInput}
            />
          </View>

          {/* Done Button */}
          <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 320,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    gap: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  savedLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  details: {
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  source: {
    fontSize: 11,
    color: "#8e8e93",
    fontFamily: "monospace",
  },
  tagsGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagBadge: {
    backgroundColor: "rgba(20,71,230,0.05)",
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.1)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1447E6",
  },
  noteWrapper: {
    marginTop: 4,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 12,
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
  },
  doneButton: {
    backgroundColor: "#1447E6",
    borderRadius: 16,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  doneText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
