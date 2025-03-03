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

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const { resetPassword } = useAuth();
  
  // Use dark theme colors directly
  const colors = COLORS.dark;

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Send password reset email with Firebase
      await resetPassword(email);
      
      setResetSent(true);
    } catch (error: any) {
      let errorMessage = 'Failed to send password reset email';
      
      // Handle specific Firebase error codes
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      
      Alert.alert('Error', errorMessage);
      console.error(error);
    } finally {
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
          <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
          
          {resetSent ? (
            <View style={styles.successContainer}>
              <Text style={[styles.successText, { color: '#4CAF50' }]}>
                Password reset instructions have been sent to your email.
              </Text>
              <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={() => router.back()}
              >
                <LinearGradient
                  colors={[colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Back to Login</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={[styles.instructions, { color: colors.subtext }]}>
                Enter your email address and we'll send you instructions to reset your password.
              </Text>
              
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
              
              <TouchableOpacity 
                style={styles.buttonContainer}
                onPress={handleResetPassword}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={isLoading ? ['#666666', '#666666'] : [colors.gradientStart, colors.gradientEnd]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Sending...' : 'Reset Password'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.backContainer}>
                <Link href="/auth/login" asChild>
                  <TouchableOpacity>
                    <Text style={[styles.backLink, { color: colors.primary }]}>Back to Login</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </>
          )}
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
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    marginBottom: 30,
    lineHeight: 22,
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
  backContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backLink: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
}); 