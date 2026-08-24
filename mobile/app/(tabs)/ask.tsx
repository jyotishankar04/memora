import React, { useState } from "react";
import { 
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, Platform 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function MobileAskScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input;
    setMessages(prev => [...prev, { sender: "user", text: userText }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let aiText = "You've saved 24 memories related to AI agents. Most cover vector databases indexing structures and RAG evaluations.";
      if (userText.toLowerCase().includes("design") || userText.toLowerCase().includes("ui")) {
        aiText = "Based on your saves, 'Linear Dashboard' (saved today) and 'raycast.com/store' focus heavily on clean layout grids and sidebar menus.";
      }
      setMessages(prev => [...prev, { sender: "ai", text: aiText }]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardWrapper}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Ask Memora</Text>
          <Text style={styles.subTitle}>Chat conceptually with your collection library.</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emojiCircle}>
                <Ionicons name="sparkles" size={24} color="#1447E6" />
              </View>
              <Text style={styles.emptyLabel}>Ask anything about your memories:</Text>
              {[
                "What have I saved about AI agents?",
                "What design patterns appear in my saves?",
                "Summarize my PostgreSQL guides."
              ].map((q, idx) => (
                <TouchableOpacity key={idx} style={styles.presetButton} onPress={() => setInput(q)}>
                  <Text style={styles.presetText}>{q}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.chatContainer}>
              {messages.map((msg, idx) => (
                <View 
                  key={idx} 
                  style={[
                    styles.bubble,
                    msg.sender === "user" ? styles.userBubble : styles.aiBubble
                  ]}
                >
                  <Text style={[styles.bubbleText, msg.sender === "user" ? styles.userText : styles.aiText]}>
                    {msg.text}
                  </Text>
                </View>
              ))}

              {isTyping && (
                <View style={styles.typingIndicator}>
                  <Text style={styles.typingText}>Memora is analyzing...</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Message Input Footer */}
        <View style={styles.footer}>
          <TextInput
            placeholder="Ask Memora about your saves..."
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
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  emojiCircle: {
    height: 48,
    width: 48,
    borderRadius: 24,
    backgroundColor: "rgba(20,71,230,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#8e8e93",
    textTransform: "uppercase",
    marginBottom: 4,
    textAlign: "center",
  },
  presetButton: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#e5e5ea",
    borderRadius: 16,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  presetText: {
    fontSize: 12,
    color: "#1447E6",
    fontWeight: "bold",
  },
  chatContainer: {
    gap: 12,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#1447E6",
    alignSelf: "flex-end",
  },
  aiBubble: {
    backgroundColor: "#f2f2f7",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#e5e5ea",
  },
  bubbleText: {
    fontSize: 13,
  },
  userText: {
    color: "#ffffff",
    fontWeight: "500",
  },
  aiText: {
    color: "#1c1c1e",
    lineHeight: 18,
  },
  typingIndicator: {
    alignSelf: "flex-start",
    paddingLeft: 6,
  },
  typingText: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#8e8e93",
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
