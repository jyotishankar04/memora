import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MobileCaptureScreen() {
  const [url, setUrl] = useState("");
  const [note, setNote] = useState("");
  const [type, setType] = useState<"link" | "note">("link");

  const handleSave = () => {
    if (type === "link" && !url.trim()) {
      Alert.alert("Error", "Please paste a valid URL to save.");
      return;
    }
    if (type === "note" && !note.trim()) {
      Alert.alert("Error", "Please write a thought down to save.");
      return;
    }
    Alert.alert("Saved", "Successfully saved to your Memora library.");
    setUrl("");
    setNote("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        <Text style={styles.title}>Save something</Text>
        <Text style={styles.subTitle}>Paste links, write thoughts, or upload screenshots.</Text>

        {/* Capture types selectors */}
        <View style={styles.selectors}>
          <TouchableOpacity 
            style={[styles.selectorButton, type === "link" && styles.activeButton]} 
            onPress={() => setType("link")}
          >
            <Ionicons name="link-outline" size={16} color={type === "link" ? "#ffffff" : "#1c1c1e"} />
            <Text style={[styles.selectorText, type === "link" && styles.activeText]}>Link</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.selectorButton, type === "note" && styles.activeButton]} 
            onPress={() => setType("note")}
          >
            <Ionicons name="create-outline" size={16} color={type === "note" ? "#ffffff" : "#1c1c1e"} />
            <Text style={[styles.selectorText, type === "note" && styles.activeText]}>Note</Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Forms */}
        {type === "link" ? (
          <View style={styles.form}>
            <Text style={styles.label}>PASTE LINK URL</Text>
            <TextInput
              placeholder="https://example.com/useful-article"
              placeholderTextColor="#8e8e93"
              value={url}
              onChangeText={setUrl}
              style={styles.textInput}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        ) : (
          <View style={styles.form}>
            <Text style={styles.label}>WRITE A QUICK NOTE</Text>
            <TextInput
              placeholder="Write anything down..."
              placeholderTextColor="#8e8e93"
              value={note}
              onChangeText={setNote}
              style={[styles.textInput, styles.textArea]}
              multiline
              numberOfLines={4}
            />
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Memory</Text>
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  subTitle: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 4,
    marginBottom: 24,
  },
  selectors: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 24,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
  },
  activeButton: {
    backgroundColor: "#1447E6",
    borderColor: "#1447E6",
  },
  selectorText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  activeText: {
    color: "#ffffff",
  },
  form: {
    marginBottom: 28,
  },
  label: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 1,
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    fontSize: 13,
    color: "#1c1c1e",
    backgroundColor: "#f9f9f9",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    paddingBottom: 16,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#1447E6",
    borderRadius: 28,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1447E6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    fontSize: 14,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
