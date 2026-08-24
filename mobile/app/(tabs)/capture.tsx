import React from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MobileCaptureBottomSheetScreen() {
  const options = [
    { label: "Save a link", icon: "link-outline", action: () => alert("Link capture opened.") },
    { label: "Quick note", icon: "create-outline", action: () => router.push("/quick-note") },
    { label: "Take a photo", icon: "camera-outline", action: () => alert("Camera opened.") },
    { label: "From gallery", icon: "image-outline", action: () => alert("Gallery opened.") },
    { label: "Voice note", icon: "mic-outline", action: () => router.push("/voice-capture") },
    { label: "Paste from clipboard", icon: "clipboard-outline", action: () => alert("Pasted from clipboard conceptually.") }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Dim Backdrop simulation */}
      <View style={styles.backdrop}>
        
        {/* Bottom sheet container */}
        <View style={styles.sheet}>
          
          <View style={styles.dragIndicator} />
          
          <Text style={styles.sheetTitle}>Save something</Text>

          <View style={styles.optionsList}>
            {options.map((opt, idx) => (
              <TouchableOpacity key={idx} style={styles.optionRow} onPress={opt.action}>
                <Ionicons name={opt.icon as any} size={20} color="#1c1c1e" style={styles.optionIcon} />
                <Text style={styles.optionLabel}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.cancelButton} onPress={() => router.replace("/")}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    gap: 20,
  },
  dragIndicator: {
    width: 36,
    height: 5,
    backgroundColor: "#e5e5ea",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginBottom: 4,
  },
  optionsList: {
    gap: 4,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
    gap: 12,
  },
  optionIcon: {
    width: 24,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  cancelButton: {
    backgroundColor: "#f2f2f7",
    borderRadius: 16,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  cancelText: {
    fontSize: 13,
    color: "#8e8e93",
    fontWeight: "bold",
  }
});
