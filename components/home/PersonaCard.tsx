import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { Persona } from '../../constants/personas';
import { LinearGradient } from 'expo-linear-gradient';

interface PersonaCardProps {
  persona: Persona;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  const router = useRouter();
  const { colors } = useTheme();

  const handleChatPress = () => {
    // Navigate to the chat screen with the persona ID as a param
    router.push(`/chat/${persona.id}`);
  };

  return (
    <View style={[styles.card, { 
      backgroundColor: colors.cardBackground,
      shadowColor: colors.text,
      borderColor: colors.border
    }]}>
      <Image 
        source={persona.image} 
        style={styles.image} 
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.text }]}>{persona.name}</Text>
        <Text style={[styles.description, { color: colors.subtext }]}>{persona.description}</Text>
        <TouchableOpacity 
          onPress={handleChatPress}
          style={styles.buttonContainer}
        >
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Chat</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default PersonaCard; 