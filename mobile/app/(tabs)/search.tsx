import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MobileSearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    // Simulated matches
    setResults([
      { title: "Linear Dashboard", type: "web", desc: "Design inspiration layout", source: "linear.app" },
      { title: "Building a SaaS in 2026", type: "video", desc: "Monorepo configurations", source: "youtube.com" }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        <Text style={styles.title}>Search your memory</Text>
        <Text style={styles.subTitle}>Query your personal library using semantic natural language.</Text>

        {/* Input Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#1447E6" style={styles.searchIcon} />
          <TextInput
            placeholder="Search your memories..."
            placeholderTextColor="#8e8e93"
            value={query}
            onChangeText={handleSearch}
            style={styles.searchInput}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color="#8e8e93" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {results.length > 0 ? (
            <View style={styles.resultsContainer}>
              
              {/* Why they matched */}
              <View style={styles.explanationCard}>
                <View style={styles.expHeader}>
                  <Ionicons name="sparkles" size={16} color="#1447E6" />
                  <Text style={styles.expTitle}>WHY THESE MATCHED</Text>
                </View>
                <Text style={styles.expText}>
                  Found 2 memories matching the concepts of SaaS UI layout references and monorepo configurations.
                </Text>
              </View>

              <Text style={styles.matchesTitle}>BEST MATCHES ({results.length})</Text>

              {results.map((item, idx) => (
                <View key={idx} style={styles.resultCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardType}>{item.type.toUpperCase()}</Text>
                    <Text style={styles.cardSource}>{item.source}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.desc}</Text>
                </View>
              ))}

            </View>
          ) : (
            <View style={styles.initialState}>
              <Text style={styles.initialLabel}>Try asking concepts:</Text>
              {["React native components", "AI indexers comparison", "SaaS designs"].map((s, idx) => (
                <TouchableOpacity key={idx} style={styles.presetButton} onPress={() => handleSearch(s)}>
                  <Text style={styles.presetText}>“{s}”</Text>
                </TouchableOpacity>
              ))}
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
    marginBottom: 20,
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
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1c1c1e",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  resultsContainer: {
    gap: 16,
  },
  explanationCard: {
    borderWidth: 1,
    borderColor: "rgba(20,71,230,0.15)",
    backgroundColor: "rgba(20,71,230,0.05)",
    borderRadius: 16,
    padding: 16,
  },
  expHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 6,
  },
  expTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1447E6",
    letterSpacing: 1,
  },
  expText: {
    fontSize: 11,
    color: "#8e8e93",
    lineHeight: 16,
  },
  matchesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 1,
    marginTop: 10,
  },
  resultCard: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  cardType: {
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "rgba(20,71,230,0.1)",
    color: "#1447E6",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  cardSource: {
    fontSize: 10,
    color: "#8e8e93",
    fontFamily: "monospace",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  cardDesc: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 4,
  },
  initialState: {
    gap: 10,
    marginTop: 10,
  },
  initialLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#8e8e93",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  presetButton: {
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  presetText: {
    fontSize: 13,
    color: "#1447E6",
    fontWeight: "600",
  }
});
