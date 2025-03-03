import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const { colors } = useTheme();

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.card,
      borderTopColor: colors.border
    }]}>
      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.inputBackground,
          color: colors.text
        }]}
        placeholder="Type a message..."
        placeholderTextColor={colors.subtext}
        value={message}
        onChangeText={setMessage}
        multiline
        maxLength={500}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[styles.sendButton, (!message.trim() || isLoading) && styles.disabledButton]}
        onPress={handleSend}
        disabled={!message.trim() || isLoading}
      >
        <Ionicons 
          name="send" 
          size={24} 
          color={!message.trim() || isLoading ? colors.subtext : colors.primary} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 12,
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatInput;
