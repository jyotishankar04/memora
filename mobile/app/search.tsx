import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemories } from "../context/MemoryContext";

export default function MobileSearchModal() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { memories } = useMemories();

  const handleSearch = (text: string) => {
    setQuery(text);
    if (!text.trim()) {
      setResults([]);
      return;
    }
    const filtered = memories.filter(m => 
      m.title.toLowerCase().includes(text.toLowerCase()) || 
      m.desc.toLowerCase().includes(text.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(text.toLowerCase()))
    );
    setResults(filtered);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.paddingWrapper}>
        
        {/* Header with back icon */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#1c1c1e" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search your memory</Text>
        </View>

        {/* Input Bar */}
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="#1447E6" style={styles.searchIcon} />
          <TextInput
            placeholder="Search your memories..."
            placeholderTextColor="#8e8e93"
            value={query}
            onChangeText={handleSearch}
            style={styles.searchInput}
            autoFocus
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
              <Text style={styles.matchesTitle}>MEMORA FOUND {results.length} MEMORIES</Text>

              {results.map((item, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.resultCard}
                  onPress={() => router.push({ pathname: "/memories-detail", params: { id: item.id } })}
                >
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardSource}>{item.source}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#8e8e93" />
                </TouchableOpacity>
              ))}

              <Text style={styles.topicsTitle}>RELATED TOPICS</Text>
              <View style={styles.tagWrapper}>
                {["SaaS", "Pricing", "Design"].map((tag, idx) => (
                  <View key={idx} style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>

            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Start typing to search your memory database.</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1c1c1e",
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
  matchesTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
  },
  resultCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  cardSource: {
    fontSize: 10,
    color: "#8e8e93",
    marginTop: 2,
    fontFamily: "monospace",
  },
  topicsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
    marginTop: 10,
  },
  tagWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tagBadge: {
    backgroundColor: "#f2f2f7",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#1c1c1e",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 12,
    color: "#8e8e93",
  }
});
