import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { PERSONAS } from '../../../constants/personas';
import { useTheme } from '../../../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface MentorCardProps {
  name: string;
  description: string;
  avatarSource: any;
  isSelected: boolean;
  onSelect: () => void;
}

const MentorCard: React.FC<MentorCardProps> = ({ 
  name, 
  description, 
  avatarSource, 
  isSelected,
  onSelect 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.mentorCard, isSelected && styles.selectedMentorCard]} 
      onPress={onSelect}
    >
      <View style={styles.mentorAvatarContainer}>
        <Image source={avatarSource} style={styles.mentorAvatar} />
      </View>
      <View style={styles.mentorInfo}>
        <Text style={styles.mentorName}>{name}</Text>
        <Text style={styles.mentorDescription}>{description}</Text>
      </View>
      {isSelected && (
        <View style={styles.selectedIndicator}>
          <Text style={styles.selectedIndicatorText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);

  const handleStartChat = () => {
    if (selectedPersonaId) {
      router.push(`/chat/${selectedPersonaId}`);
    }
  };

  const navigateToSettings = () => {
    router.push('/(tabs)/settings');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Top section with app icon, welcome message, and settings icon */}
        <View style={styles.headerContainer}>
          <View style={styles.leftHeader}>
            <View style={styles.iconContainer}>
              <Image 
                source={require('../../../assets/images/icon.png')} 
                style={styles.appIcon} 
                resizeMode="contain"
              />
            </View>
            <Text style={styles.welcomeText}>Welcome Back</Text>
          </View>
          <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
            <Ionicons name="person-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Create New Plan Card */}
        <View style={styles.newPlanCard}>
          <Text style={styles.newPlanTitle}>Create New Plan</Text>
          <Text style={styles.newPlanDescription}>Select your mentor and click start.</Text>
        </View>

        {/* Mentor Cards */}
        <View style={styles.mentorsContainer}>
          {PERSONAS.map((persona) => (
            <MentorCard 
              key={persona.id}
              name={persona.name.split(' ')[0]} // Just use the first name
              description={persona.description}
              avatarSource={persona.image}
              isSelected={selectedPersonaId === persona.id}
              onSelect={() => setSelectedPersonaId(persona.id)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Start Button */}
      <TouchableOpacity 
        style={[
          styles.startButtonContainer, 
          !selectedPersonaId && styles.startButtonDisabled
        ]}
        onPress={handleStartChat}
        disabled={!selectedPersonaId}
      >
        <LinearGradient
          colors={['#70A2FF', '#C28AFF', '#FF85D2']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.startButton}
        >
          <Text style={styles.startButtonText}>Start</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80, // Add padding for the start button
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  leftHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 12,
    width: 40,
    height: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
  appIcon: {
    width: 40,
    height: 40,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E1E1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPlanCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  newPlanTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  newPlanDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  mentorsContainer: {
    marginBottom: 24,
  },
  mentorCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMentorCard: {
    borderColor: '#5B61FF',
  },
  mentorAvatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  mentorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  mentorDescription: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#5B61FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorText: {
    color: 'white',
    fontWeight: 'bold',
  },
  startButtonContainer: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
  },
  startButtonDisabled: {
    opacity: 0.5,
  },
  startButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 