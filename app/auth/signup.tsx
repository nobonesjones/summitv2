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

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signup } = useAuth();
  
  // Use dark theme colors directly
  const colors = COLORS.dark;

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    
    try {
      // Register with Firebase
      await signup(email, password);
      
      // Show success message and navigate to home screen
      Alert.alert(
        'Account Created',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)/home')
          }
        ]
      );
    } catch (error: any) {
      let errorMessage = 'Could not create account';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak';
      } else if (error.code === 'permission-denied' || error.message?.includes('permission')) {
        // This is likely a Firestore permissions error
        // The account was created but the user document wasn't
        Alert.alert(
          'Account Created',
          'Your account has been created successfully.',
          [
            {
              text: 'OK',
              onPress: () => router.replace('/(tabs)/home')
            }
          ]
        );
        setIsLoading(false);
        return;
      }
      
      Alert.alert('Signup Failed', errorMessage);
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
          <Text style={[styles.title, { color: colors.text }]}>Create Account</Text>
          
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
              placeholder="Create a password"
              placeholderTextColor={colors.subtext}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.subtext }]}>Confirm Password</Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.border,
                color: colors.text
              }]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.subtext}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />
          </View>
          
          <TouchableOpacity 
            onPress={handleSignup}
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
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: colors.subtext }]}>Already have an account? </Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: colors.primary }]}>Login</Text>
              </TouchableOpacity>
            </Link>
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
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
  },
  loginLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 