import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Message } from '../../types/chat.types';

interface ChatBubbleProps {
  message: Message;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const { colors } = useTheme();
  
  return (
    <View style={[
      styles.container,
      isUser ? styles.userContainer : styles.aiContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser 
          ? [styles.userBubble, { backgroundColor: colors.userBubble }]
          : [styles.aiBubble, { backgroundColor: colors.aiBubble }]
      ]}>
        <Text style={[
          styles.text,
          isUser 
            ? [styles.userText, { color: colors.userBubbleText }]
            : [styles.aiText, { color: colors.aiBubbleText }]
        ]}>
          {message.content}
        </Text>
      </View>
      <Text style={[styles.timestamp, { color: colors.subtext }]}>
        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userContainer: {
    alignSelf: 'flex-end',
    marginRight: 16,
  },
  aiContainer: {
    alignSelf: 'flex-start',
    marginLeft: 16,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userBubble: {
    // Base styles, colors applied dynamically
  },
  aiBubble: {
    // Base styles, colors applied dynamically
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    // Base styles, colors applied dynamically
  },
  aiText: {
    // Base styles, colors applied dynamically
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default ChatBubble;