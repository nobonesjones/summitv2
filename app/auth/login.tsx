import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  
  // Use dark theme colors directly
  const colors = COLORS.dark;

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    try {
      // Login with Firebase
      await login(email, password);
      
      // Add a timeout to ensure navigation happens
      // This is a fallback in case the auth state change doesn't trigger navigation
      setTimeout(() => {
        setIsLoading(false);
        router.replace('/(tabs)/home');
      }, 2000);
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed login attempts. Please try again later.';
      }
      
      Alert.alert('Login Failed', errorMessage);
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar style="light" />
        
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../assets/images/icon.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={[styles.appTitle, { color: colors.text }]}>Summit AI Chat</Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.title, { color: colors.text }]}>Login</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.subtext }]}>Email</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Enter your email"
              placeholderTextColor={colors.subtext}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.subtext }]}>Password</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Enter your password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleLogin}
            disabled={isLoading}
            style={styles.buttonContainer}
          >
            <LinearGradient
              colors={isLoading ? ['#666666', '#666666'] : [colors.gradientStart, colors.gradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.linksContainer}>
            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={[styles.forgotPassword, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </Link>
            
            <View style={styles.signupContainer}>
              <Text style={[styles.signupText, { color: colors.subtext }]}>Don't have an account? </Text>
              <Link href="/auth/signup" asChild>
                <TouchableOpacity>
                  <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 10,
  },
  button: {
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  linksContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  forgotPassword: {
    fontSize: 16,
    marginBottom: 20,
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 