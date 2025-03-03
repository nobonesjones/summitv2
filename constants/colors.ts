export type ThemeType = 'light' | 'dark';

interface ThemeColors {
  background: string;
  card: string;
  text: string;
  subtext: string;
  primary: string;
  secondary: string;
  border: string;
  error: string;
  success: string;
  userBubble: string;
  userBubbleText: string;
  aiBubble: string;
  aiBubbleText: string;
  inputBackground: string;
  gradientStart: string;
  gradientEnd: string;
  cardBackground: string;
}

interface ThemeConfig {
  light: ThemeColors;
  dark: ThemeColors;
}

export const COLORS: ThemeConfig = {
  light: {
    background: '#F8F8F8',
    card: '#FFFFFF',
    text: '#333333',
    subtext: '#666666',
    primary: '#007AFF',
    secondary: '#5856D6',
    border: '#E0E0E0',
    error: '#FF3B30',
    success: '#34C759',
    userBubble: '#007AFF',
    userBubbleText: '#FFFFFF',
    aiBubble: '#E9E9EB',
    aiBubbleText: '#000000',
    inputBackground: '#F0F0F0',
    gradientStart: '#007AFF',
    gradientEnd: '#5856D6',
    cardBackground: '#FFFFFF',
  },
  dark: {
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subtext: '#AAAAAA',
    primary: '#6D5CFF',
    secondary: '#A054FF',
    border: '#333333',
    error: '#FF453A',
    success: '#30D158',
    userBubble: '#6D5CFF',
    userBubbleText: '#FFFFFF',
    aiBubble: '#252525',
    aiBubbleText: '#FFFFFF',
    inputBackground: '#252525',
    gradientStart: '#FF57B6',
    gradientEnd: '#A054FF',
    cardBackground: '#252525',
  }
}; 