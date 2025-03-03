import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, ChatContextType } from '../types/chat.types';
import { useAuth } from './AuthContext';
import { getMessages, addMessage, clearChatHistory } from '../services/firebase/firestore';
import { generateAIResponse } from '../services/openai/api';

// Create the context with a default value
const ChatContext = createContext<ChatContextType>({
  messages: [],
  isTyping: false,
  sendMessage: async () => {},
  clearChat: async () => {},
  loadMessages: async () => {},
});

// Custom hook to use the chat context
export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPersonaId, setCurrentPersonaId] = useState<string | null>(null);
  const { user } = useAuth();

  // Load messages when the persona changes
  const loadMessages = async (personaId: string) => {
    if (!user) return;
    
    try {
      setCurrentPersonaId(personaId);
      const chatMessages = await getMessages(personaId);
      
      // Create a Map to deduplicate messages by ID
      const uniqueMessages = new Map<string, Message>();
      chatMessages.forEach(msg => {
        uniqueMessages.set(msg.id, msg);
      });
      
      // Convert Map back to array and sort by timestamp
      const sortedMessages = Array.from(uniqueMessages.values())
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      
      setMessages(sortedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Send a message to the AI
  const sendMessage = async (content: string, personaId: string) => {
    if (!user || !content.trim()) return;
    
    try {
      // Set current persona
      if (currentPersonaId !== personaId) {
        setCurrentPersonaId(personaId);
        await loadMessages(personaId);
      }
      
      // Create user message
      const userMessage: Omit<Message, 'id'> = {
        content,
        sender: 'user',
        timestamp: new Date(),
        personaId,
      };
      
      // Add user message to Firestore
      const messageId = await addMessage(userMessage);
      
      // Update local state with user message
      const newUserMessage: Message = { ...userMessage, id: messageId };
      
      // Add message to state, ensuring no duplicates
      setMessages(prevMessages => {
        // Check if message with this ID already exists
        if (prevMessages.some(msg => msg.id === messageId)) {
          return prevMessages;
        }
        // Add new message and sort by timestamp
        const updatedMessages = [...prevMessages, newUserMessage];
        return updatedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      });
      
      // Show typing indicator
      setIsTyping(true);
      
      // Get conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.personaId === personaId)
        .slice(-10) // Only use the last 10 messages for context
        .map(msg => ({ content: msg.content, sender: msg.sender }));
      
      // Generate AI response
      const aiResponseContent = await generateAIResponse(
        personaId,
        content,
        conversationHistory
      );
      
      // Create AI message
      const aiMessage: Omit<Message, 'id'> = {
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
        personaId,
      };
      
      // Add AI message to Firestore
      const aiMessageId = await addMessage(aiMessage);
      
      // Update local state with AI message
      const newAiMessage: Message = { ...aiMessage, id: aiMessageId };
      
      // Add AI message to state, ensuring no duplicates
      setMessages(prevMessages => {
        // Check if message with this ID already exists
        if (prevMessages.some(msg => msg.id === aiMessageId)) {
          return prevMessages;
        }
        // Add new message and sort by timestamp
        const updatedMessages = [...prevMessages, newAiMessage];
        return updatedMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
      });
      
      // Hide typing indicator
      setIsTyping(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
    }
  };

  // Clear chat history
  const clearChat = async (personaId: string) => {
    try {
      // Call the firestore function to delete messages from Firestore
      await clearChatHistory(personaId);
      
      // Clear messages from local state after successful Firestore deletion
      setMessages([]);
      
      console.log('Chat cleared successfully from both Firestore and local state');
    } catch (error) {
      console.error('Error clearing chat from Firestore:', error);
      
      // If Firestore deletion fails, still clear the local state
      // so the user sees immediate feedback
      setMessages([]);
      console.log('Chat cleared from local state only');
    }
  };

  // Value to be provided by the context
  const value: ChatContextType = {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    loadMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 