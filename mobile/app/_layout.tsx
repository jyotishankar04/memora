import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { MemoryProvider } from "../context/MemoryContext";

export default function RootLayout() {
  return (
    <MemoryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="search" options={{ presentation: "fullScreenModal" }} />
        <Stack.Screen name="settings" />
        <Stack.Screen name="memories-detail" />
        <Stack.Screen name="quick-note" />
        <Stack.Screen name="voice-capture" />
        <Stack.Screen name="share-confirm" options={{ presentation: "transparentModal" }} />
      </Stack>
      <StatusBar style="auto" />
    </MemoryProvider>
  );
}
