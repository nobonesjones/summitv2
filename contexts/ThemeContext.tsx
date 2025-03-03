import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS, ThemeType } from '../constants/colors';
import { updateUserTheme } from '../services/firebase/firestore';
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
  
  // Get the colors for the current theme
  const colors = COLORS[theme];
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };
  
  // Set a specific theme and update in Firestore if user is logged in
  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    
    // Update theme preference in Firestore if user is logged in
    if (user) {
      updateUserTheme(user.uid, newTheme).catch(error => {
        console.error('Error updating theme preference:', error);
      });
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