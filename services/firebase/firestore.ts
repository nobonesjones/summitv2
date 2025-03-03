import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  limit,
  writeBatch
} from 'firebase/firestore';
import { firestore, auth } from './config';
import { Message, Chat } from '../../types/chat.types';

// User type definition
export interface UserData {
  email: string;
  createdAt: Timestamp;
  lastLogin: Timestamp;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark';
}

/**
 * Create a new user document in Firestore
 */
export const createUserDocument = async (userId: string, email: string): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    
    // Create user data object
    const userData: UserData = {
      email,
      createdAt: serverTimestamp() as Timestamp,
      lastLogin: serverTimestamp() as Timestamp,
      notificationsEnabled: true,
      theme: 'light',
    };
    
    // Set the user document
    await setDoc(userRef, userData);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

/**
 * Get a user document from Firestore
 */
export const getUserDocument = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting user document:', error);
    throw error;
  }
};

/**
 * Update a user's last login timestamp
 */
export const updateUserLastLogin = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      lastLogin: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user last login:', error);
    throw error;
  }
};

/**
 * Update a user's theme preference
 */
export const updateUserTheme = async (userId: string, theme: 'light' | 'dark'): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { theme });
  } catch (error) {
    console.error('Error updating user theme:', error);
    throw error;
  }
};

/**
 * Update a user's notification preferences
 */
export const updateUserNotifications = async (userId: string, enabled: boolean): Promise<void> => {
  try {
    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, { notificationsEnabled: enabled });
  } catch (error) {
    console.error('Error updating user notifications:', error);
    throw error;
  }
};

// Create a new chat or get existing one
export async function getOrCreateChat(personaId: string): Promise<string> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Check if chat already exists
    const chatId = `${user.uid}_${personaId}`;
    const chatsRef = collection(firestore, 'chats');
    const q = query(chatsRef, where('userId', '==', user.uid), where('personaId', '==', personaId));
    const querySnapshot = await getDocs(q);

    // If chat doesn't exist, create it
    if (querySnapshot.empty) {
      const newChat: Omit<Chat, 'id'> = {
        userId: user.uid,
        personaId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(firestore, 'chats'), {
        ...newChat,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update the last updated timestamp
      const chatDoc = querySnapshot.docs[0];
      await updateDoc(doc(firestore, 'chats', chatDoc.id), {
        updatedAt: serverTimestamp()
      });
    }

    return chatId;
  } catch (error) {
    console.error('Error getting or creating chat:', error);
    throw error;
  }
}

// Add a message to the chat
export async function addMessage(message: Omit<Message, 'id'>): Promise<string> {
  try {
    const chatId = `${auth.currentUser?.uid}_${message.personaId}`;
    
    // Ensure chat exists
    await getOrCreateChat(message.personaId);
    
    // Add message to Firestore
    const docRef = await addDoc(collection(firestore, 'messages'), {
      ...message,
      chatId,
      timestamp: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding message:', error);
    throw error;
  }
}

// Get messages for a specific chat
export async function getMessages(personaId: string): Promise<Message[]> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const chatId = `${user.uid}_${personaId}`;
    
    // Query messages with ordering by timestamp
    const messagesRef = collection(firestore, 'messages');
    const q = query(
      messagesRef, 
      where('chatId', '==', chatId),
      orderBy('timestamp', 'asc') // Order by timestamp in ascending order
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        content: data.content,
        sender: data.sender,
        timestamp: data.timestamp?.toDate() || new Date(),
        personaId: data.personaId
      } as Message;
    });
  } catch (error) {
    console.error('Error getting messages:', error);
    return [];
  }
}

// Clear chat history - client-side only approach
export async function clearChatHistory(personaId: string): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const chatId = `${user.uid}_${personaId}`;
    
    // Get all messages for this chat
    const messagesRef = collection(firestore, 'messages');
    const q = query(messagesRef, where('chatId', '==', chatId));
    const querySnapshot = await getDocs(q);
    
    // Delete each message
    const batch = writeBatch(firestore);
    querySnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Commit the batch
    await batch.commit();
    console.log(`Successfully deleted ${querySnapshot.size} messages for chat ${chatId}`);
  } catch (error) {
    console.error('Error clearing chat history:', error);
    throw error;
  }
} 