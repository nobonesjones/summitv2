import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useChat } from '../../contexts/ChatContext';
import { useTheme } from '../../contexts/ThemeContext';
import { PERSONAS } from '../../constants/personas';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInput from '../../components/chat/ChatInput';
import TypingIndicator from '../../components/chat/TypingIndicator';

export default function ChatScreen() {
  const { personaId } = useLocalSearchParams<{ personaId: string }>();
  const { messages, isTyping, sendMessage, loadMessages, clearChat } = useChat();
  const { colors, theme } = useTheme();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [userScrolled, setUserScrolled] = useState(false);
  
  // Find the persona
  const persona = PERSONAS.find(p => p.id === personaId);
  
  useEffect(() => {
    if (personaId) {
      loadMessages(personaId);
    }
  }, [personaId, loadMessages]);
  
  // Scroll to bottom only for new messages and if user hasn't scrolled up
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current && !userScrolled) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, userScrolled]);
  
  // Reset userScrolled when a new message is sent
  const handleSendMessage = async (content: string) => {
    if (personaId) {
      setUserScrolled(false); // Reset scroll state when user sends a message
      await sendMessage(content, personaId);
    }
  };
  
  // Handle scroll events
  const handleScroll = () => {
    setUserScrolled(true);
  };
  
  // Handle scroll to end
  const handleScrollToEndReached = () => {
    setUserScrolled(false);
  };
  
  const handleClearChat = async () => {
    if (personaId) {
      // Show confirmation dialog
      if (messages.length > 0) {
        Alert.alert(
          "Clear Chat",
          "Are you sure you want to clear this chat history?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            { 
              text: "Clear", 
              onPress: async () => {
                await clearChat(personaId);
                setUserScrolled(false); // Reset scroll state when chat is cleared
              },
              style: "destructive"
            }
          ]
        );
      } else {
        // No messages to clear
        console.log('No messages to clear');
      }
    }
  };
  
  if (!persona) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Persona not found</Text>
      </View>
    );
  }
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? "light" : "dark"} />
      
      <Stack.Screen 
        options={{
          title: persona.name,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="chevron-back" size={24} color={colors.primary} />
              <Text style={[styles.backText, { color: colors.primary }]}>Back</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleClearChat}
              style={styles.clearButton}
            >
              <Text style={[styles.clearText, { color: colors.primary }]}>Clear</Text>
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.text,
          },
          headerShadowVisible: false,
        }}
      />
      
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.messageList}
          onScroll={handleScroll}
          onMomentumScrollEnd={(event) => {
            // Check if scrolled to the end
            const contentHeight = event.nativeEvent.contentSize.height;
            const layoutHeight = event.nativeEvent.layoutMeasurement.height;
            const scrollY = event.nativeEvent.contentOffset.y;
            
            // If we're at the bottom (with a small threshold for rounding errors)
            if (scrollY + layoutHeight >= contentHeight - 20) {
              handleScrollToEndReached();
            }
          }}
          ListHeaderComponent={
            <View style={styles.header}>
              <Image 
                source={persona.image} 
                style={styles.personaImage} 
                resizeMode="cover"
              />
              <Text style={[styles.welcomeText, { color: colors.text }]}>
                Start chatting with {persona.name}
              </Text>
            </View>
          }
          ListFooterComponent={
            isTyping ? <TypingIndicator /> : null
          }
        />
        
        {userScrolled && messages.length > 0 && (
          <TouchableOpacity 
            style={[styles.scrollToBottomButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              flatListRef.current?.scrollToEnd({ animated: true });
              setUserScrolled(false);
            }}
          >
            <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
        
        <ChatInput 
          onSendMessage={handleSendMessage}
          isLoading={isTyping}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  personaImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  messageList: {
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#007AFF',
    fontSize: 17,
    marginLeft: 4,
  },
  clearButton: {
    paddingHorizontal: 10,
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 17,
  },
  scrollToBottomButton: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
}); 