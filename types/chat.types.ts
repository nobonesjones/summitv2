export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  personaId: string;
}

export interface Chat {
  id: string;
  userId: string;
  personaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContextType {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string, personaId: string) => Promise<void>;
  clearChat: (personaId: string) => Promise<void>;
  loadMessages: (personaId: string) => Promise<void>;
} 