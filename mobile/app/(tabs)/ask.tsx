import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function MobileAskScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([
    {
      sender: "ai",
      text: "You have 24 memories about AI agents.",
      summary: true,
      topics: [
        { label: "Memory", count: 8 },
        { label: "Tool calling", count: 6 },
        { label: "RAG", count: 5 },
        { label: "Evaluation", count: 3 }
      ],
      sources: ["AI Agents Guide", "Agent Memory Architecture", "Building Reliable Agents"]
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "ai",
        text: "Based on your PostgreSQL notes, you saved 5 guides on query optimizations, B-Tree index adjustments, and indexing jsonb fields for SaaS schemas.",
        sources: ["PG index tuning tips", "JSONB queries syntax"]
      }]);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardWrapper}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ask Memora</Text>
          <Text style={styles.subTitle}>Chat with your memory.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.promptLabel}>What do you want to remember?</Text>
          
          <View style={styles.chatFeed}>
            {messages.map((msg, idx) => (
              <View 
                key={idx} 
                style={[
                  styles.msgContainer,
                  msg.sender === "user" ? styles.userContainer : styles.aiContainer
                ]}
              >
                {msg.sender === "user" ? (
                  <View style={styles.userBubble}>
                    <Text style={styles.userText}>{msg.text}</Text>
                  </View>
                ) : (
                  <View style={styles.aiContent}>
                    <View style={styles.aiHeader}>
                      <Ionicons name="sparkles" size={14} color="#1447E6" />
                      <Text style={styles.aiBubbleText}>{msg.text}</Text>
                    </View>

                    {/* Topics table */}
                    {msg.topics && (
                      <View style={styles.topicsTable}>
                        <Text style={styles.tableTitle}>MAIN TOPICS</Text>
                        {msg.topics.map((t: any, tIdx: number) => (
                          <View key={tIdx} style={styles.tableRow}>
                            <Text style={styles.rowLabel}>{t.label}</Text>
                            <Text style={styles.rowCount}>{t.count}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {/* Sources lists */}
                    {msg.sources && (
                      <View style={styles.sourcesBox}>
                        <Text style={styles.tableTitle}>SOURCES</Text>
                        {msg.sources.map((src: string, sIdx: number) => (
                          <Text key={sIdx} style={styles.sourceRow}>&bull; {src}</Text>
                        ))}
                      </View>
                    )}

                  </View>
                )}
              </View>
            ))}
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TextInput
            placeholder="Ask a follow-up..."
            placeholderTextColor="#8e8e93"
            value={input}
            onChangeText={setInput}
            style={styles.footerInput}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={!input.trim()}>
            <Ionicons name="arrow-up" size={18} color="#ffffff" />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  keyboardWrapper: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f7",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1c1c1e",
  },
  subTitle: {
    fontSize: 12,
    color: "#8e8e93",
    marginTop: 2,
  },
  scrollContent: {
    padding: 24,
  },
  promptLabel: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#8e8e93",
    marginBottom: 20,
  },
  chatFeed: {
    gap: 20,
  },
  msgContainer: {
    width: "100%",
  },
  userContainer: {
    alignItems: "flex-end",
  },
  aiContainer: {
    alignItems: "flex-start",
  },
  userBubble: {
    backgroundColor: "#1447E6",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  userText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "500",
  },
  aiContent: {
    backgroundColor: "#f2f2f7",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 20,
    padding: 16,
    width: "100%",
    gap: 14,
  },
  aiHeader: {
    flexDirection: "row",
    gap: 6,
    alignItems: "flex-start",
  },
  aiBubbleText: {
    flex: 1,
    fontSize: 13,
    color: "#1c1c1e",
    lineHeight: 18,
  },
  topicsTable: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
    paddingTop: 10,
    gap: 6,
  },
  tableTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#8e8e93",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 12,
    color: "#1c1c1e",
    fontWeight: "500",
  },
  rowCount: {
    fontSize: 11,
    fontFamily: "monospace",
    color: "#8e8e93",
  },
  sourcesBox: {
    borderTopWidth: 1,
    borderTopColor: "#e5e5ea",
    paddingTop: 10,
    gap: 4,
  },
  sourceRow: {
    fontSize: 11,
    color: "#1c1c1e",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f7",
    gap: 10,
    alignItems: "center",
  },
  footerInput: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 13,
    color: "#1c1c1e",
  },
  sendButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#1447E6",
    alignItems: "center",
    justifyContent: "center",
  }
});
