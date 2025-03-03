import React from 'react';
import { StyleSheet, View, Text, Switch, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ThemeToggleProps {
  containerStyle?: object;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ containerStyle }) => {
  const { theme, toggleTheme, setTheme, colors } = useTheme();
  const isDarkMode = theme === 'dark';

  const handleToggle = () => {
    console.log('ThemeToggle: handleToggle called, current theme:', theme);
    const newTheme = isDarkMode ? 'light' : 'dark';
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { borderBottomColor: colors.border },
        containerStyle
      ]} 
      onPress={handleToggle}
      activeOpacity={0.7}
    >
      <View style={styles.labelContainer}>
        <Ionicons 
          name={isDarkMode ? "moon" : "sunny"} 
          size={22} 
          color={isDarkMode ? "#6D5CFF" : "#FFA500"} 
          style={styles.icon}
        />
        <Text style={[styles.label, { color: colors.text }]}>
          Theme: {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      </View>
      <Switch
        value={isDarkMode}
        onValueChange={handleToggle}
        trackColor={{ false: '#E0E0E0', true: '#333333' }}
        thumbColor={isDarkMode ? colors.primary : '#FFFFFF'}
        ios_backgroundColor={isDarkMode ? '#333333' : '#E0E0E0'}
        testID="theme-toggle-switch"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  }
});

export default ThemeToggle; 