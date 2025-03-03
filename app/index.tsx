import { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

// Keep the splash screen visible while we check authentication
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const colors = COLORS.dark;

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        console.log('Checking auth status:', { isAuthenticated, isLoading });
        
        // Wait for auth state to be determined
        if (!isLoading) {
          // Navigate based on authentication status
          if (isAuthenticated) {
            console.log('User is authenticated, navigating to home');
            // Navigate to the home tab
            router.replace({
              pathname: '/(tabs)/home',
            });
          } else {
            console.log('User is not authenticated, navigating to login');
            router.replace('/auth/login');
          }
          
          // Hide the splash screen
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.error('Failed to check authentication status:', error);
        router.replace('/auth/login');
        await SplashScreen.hideAsync();
      }
    };

    checkAuthStatus();
  }, [router, isAuthenticated, isLoading]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.contentContainer}>
        <View style={styles.column}>
          <Text style={styles.title}>SUMMIT AI</Text>
        </View>
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    padding: 24,
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  loader: {
    marginTop: 20,
  },
});
