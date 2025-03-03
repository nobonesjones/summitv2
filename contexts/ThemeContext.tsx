import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, ThemeType } from '../constants/colors';
import { updateUserTheme, getUserDocument } from '../services/firebase/firestore';
import { useAuth } from './AuthContext';

// Define the shape of our theme context
interface ThemeContextType {
  theme: ThemeType;
  colors: typeof COLORS.light;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Create the context with default values
const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  colors: COLORS.dark,
  toggleTheme: () => {},
  setTheme: () => {},
});

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Initialize with dark theme as default
  const [theme, setThemeState] = useState<ThemeType>('dark');
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user's theme preference from Firestore when the user changes
  useEffect(() => {
    const loadUserTheme = async () => {
      if (user) {
        try {
          setIsLoading(true);
          console.log('Loading theme preference for user:', user.uid);
          const userData = await getUserDocument(user.uid);
          
          if (userData && userData.theme) {
            console.log('Found user theme preference:', userData.theme);
            setThemeState(userData.theme);
          } else {
            console.log('No theme preference found, using default dark theme');
          }
        } catch (error) {
          console.error('Error loading user theme preference:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('No user logged in, using default dark theme');
        setIsLoading(false);
      }
    };
    
    loadUserTheme();
  }, [user]);
  
  // Get the colors for the current theme
  const colors = COLORS[theme];
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('Toggling theme from', theme, 'to', newTheme);
    setTheme(newTheme);
  };
  
  // Set a specific theme and update in Firestore if user is logged in
  const setTheme = (newTheme: ThemeType) => {
    console.log('Setting theme to', newTheme);
    setThemeState(newTheme);
    
    // Update theme preference in Firestore if user is logged in
    if (user) {
      console.log('Updating theme in Firestore for user', user.uid);
      updateUserTheme(user.uid, newTheme)
        .then(() => console.log('Theme updated successfully in Firestore'))
        .catch(error => {
          console.error('Error updating theme preference:', error);
        });
    } else {
      console.log('No user logged in, not updating theme in Firestore');
    }
  };
  
  // Value to be provided by the context
  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}; 