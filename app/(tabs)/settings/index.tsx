import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import ThemeToggle from '../../../components/settings/ThemeToggle';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const { colors, theme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks
    
    setIsLoggingOut(true);
    
    try {
      await logout();
      
      // Add a fallback navigation in case the auth state change doesn't trigger
      setTimeout(() => {
        setIsLoggingOut(false);
        router.replace('/auth/login');
      }, 1000);
    } catch (error) {
      setIsLoggingOut(false);
      Alert.alert('Logout Failed', 'Failed to log out. Please try again.');
      console.error(error);
    }
  };

  const navigateBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === 'dark' ? "light" : "dark"} />
      <ScrollView 
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
          <View style={styles.headerRight} />
        </View>

        <View style={styles.profileSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile</Text>
          <Text style={[styles.email, { color: colors.subtext }]}>{user?.email}</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Settings</Text>
          <ThemeToggle />
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Notifications: On</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Version: 1.0.0</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Terms of Service</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={styles.logoutButtonContainer}
        >
          <LinearGradient
            colors={isLoggingOut ? ['#FFAAA7', '#FFAAA7'] : [colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Text style={styles.logoutText}>
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    justifyContent: 'space-between',
    marginTop: 15,
  },
  backButton: {
    padding: 5,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
    height: 40,
  },
  profileSection: {
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  email: {
    fontSize: 16,
  },
  settingItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
  },
  logoutButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 20,
  },
  logoutButton: {
    padding: 15,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 