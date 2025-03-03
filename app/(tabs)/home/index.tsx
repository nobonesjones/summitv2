import React from 'react';
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useAuth } from '../../../contexts/AuthContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { PERSONAS } from '../../../constants/personas';
import PersonaCard from '../../../components/home/PersonaCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: colors.text }]}>Summit AI Chat</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Choose an AI persona to chat with</Text>
        
        {PERSONAS.map((persona) => (
          <PersonaCard key={persona.id} persona={persona} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
}); 