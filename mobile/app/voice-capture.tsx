import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function MobileVoiceCaptureScreen() {
  const [recording, setRecording] = useState(true);
  const [saving, setSaving] = useState(false);

  const stopRecording = () => {
    setRecording(false);
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        {/* Top Header close */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color="#1c1c1e" />
          </TouchableOpacity>
        </View>

        {recording && (
          /* RECORDING STATE */
          <View style={styles.centerContainer}>
            <Text style={styles.stateLabel}>Recording...</Text>
            
            <View style={styles.recordCircle}>
              <View style={styles.redDot} />
            </View>

            <Text style={styles.timer}>00:14</Text>
            <Text style={styles.transcriptPreview}>"I just had an idea about SaaS analytics..."</Text>

            <TouchableOpacity style={styles.stopButton} onPress={stopRecording}>
              <Text style={styles.stopText}>Stop recording</Text>
            </TouchableOpacity>
          </View>
        )}

        {saving && (
          /* PROCESSING STATE */
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#1447E6" />
            <Text style={styles.savingLabel}>Analyzing voice clip...</Text>
          </View>
        )}

        {!recording && !saving && (
          /* SAVED STATE */
          <View style={styles.centerContainer}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark" size={32} color="#1447E6" />
            </View>
            <Text style={styles.successLabel}>✓ Saved</Text>

            <View style={styles.summaryCard}>
              <Text style={styles.summarySub}>AI GENERATED</Text>
              
              <Text style={styles.summaryTitleLabel}>Title:</Text>
              <Text style={styles.summaryTitleValue}>Indie SaaS Analytics Idea</Text>

              <Text style={styles.summaryTitleLabel}>Topics:</Text>
              <Text style={styles.summaryTagsValue}>SaaS &middot; Analytics &middot; Startup</Text>
            </View>

            <TouchableOpacity style={styles.viewButton} onPress={() => router.replace("/memories-detail")}>
              <Text style={styles.viewButtonText}>View memory</Text>
            </TouchableOpacity>
          </View>
        )}

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
    alignItems: "flex-start",
    marginBottom: 20,
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  stateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ff3b30",
  },
  recordCircle: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,59,48,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  redDot: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: "#ff3b30",
  },
  timer: {
    fontSize: 20,
    fontFamily: "monospace",
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  transcriptPreview: {
    fontSize: 13,
    fontStyle: "italic",
    color: "#8e8e93",
    textAlign: "center",
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  stopButton: {
    borderWidth: 1,
    borderColor: "#ff3b30",
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  stopText: {
    fontSize: 13,
    color: "#ff3b30",
    fontWeight: "bold",
  },
  savingLabel: {
    fontSize: 12,
    color: "#8e8e93",
  },
  successIcon: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  successLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1447E6",
  },
  summaryCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    width: "100%",
    backgroundColor: "#ffffff",
  },
  summarySub: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  summaryTitleLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    marginTop: 6,
  },
  summaryTitleValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
    marginTop: 2,
  },
  summaryTagsValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1447E6",
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: "#1447E6",
    borderRadius: 24,
    height: 48,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  viewButtonText: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "bold",
  }
});
