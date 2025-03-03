import React from 'react';
import { Stack } from "expo-router";
import { AuthProvider } from '../contexts/AuthContext';
import { ChatProvider } from '../contexts/ChatContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ChatProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
          <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
          <Stack.Screen name="auth/forgot-password" options={{ title: 'Forgot Password' }} />
        </Stack>
      </ChatProvider>
    </AuthProvider>
  );
}
