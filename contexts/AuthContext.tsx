import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { User } from 'firebase/auth';
import * as SecureStore from 'expo-secure-store';
import { 
  registerUser, 
  loginUser, 
  logoutUser, 
  resetPassword, 
  subscribeToAuthChanges, 
  getCurrentUser 
} from '../services/firebase/auth';
import { 
  createUserDocument, 
  updateUserLastLogin, 
  getUserDocument,
  UserData
} from '../services/firebase/firestore';

// Define the shape of our auth context
interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user is authenticated
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (authUser) => {
      setUser(authUser);
      
      if (authUser) {
        // User is signed in
        try {
          // Get user data from Firestore
          const userDoc = await getUserDocument(authUser.uid);
          setUserData(userDoc);
          
          // Update last login time
          try {
            await updateUserLastLogin(authUser.uid);
          } catch (loginError) {
            // Silently handle login update errors
            // This is not critical functionality
          }
          
          // Store auth state in secure storage
          try {
            await SecureStore.setItemAsync('isAuthenticated', 'true');
          } catch (storageError) {
            // Silently handle storage errors
          }
        } catch (error) {
          // Silently handle Firestore errors
          // The user is still authenticated, which is what matters
        }
      } else {
        // User is signed out
        setUserData(null);
        try {
          await SecureStore.deleteItemAsync('isAuthenticated');
        } catch (storageError) {
          // Silently handle storage errors
        }
      }
      
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await loginUser(email, password);
      
      // Update last login time
      await updateUserLastLogin(userCredential.user.uid);
      
      return userCredential;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Signup function
  const signup = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Register with Firebase Authentication
      const userCredential = await registerUser(email, password);
      
      // Wait a moment to ensure the user is fully authenticated
      // This helps with Firestore permissions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        // Create user document in Firestore
        await createUserDocument(userCredential.user.uid, email);
      } catch (firestoreError) {
        // Silently handle Firestore errors - don't log to console
        // The user is still authenticated, which is what matters
      }
      
      // Return to allow navigation to continue
      return userCredential;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      // We don't need to set isLoading to false here
      // The auth state change listener will handle that
      // when it detects that the user is signed out
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  // Reset password function
  const resetPasswordFunc = async (email: string) => {
    try {
      await resetPassword(email);
    } catch (error) {
      throw error;
    }
  };

  // Context value
  const value: AuthContextType = {
    user,
    userData,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    resetPassword: resetPasswordFunc,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 