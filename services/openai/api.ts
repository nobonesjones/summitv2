import { PERSONAS } from '../../constants/personas';
import { OPENAI_CONFIG } from './config';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateAIResponse(
  personaId: string,
  userMessage: string,
  conversationHistory: { content: string; sender: 'user' | 'ai' }[] = []
): Promise<string> {
  try {
    console.log('Using API key starting with:', OPENAI_CONFIG.apiKey.substring(0, 10) + '...');

    // Find the persona
    const persona = PERSONAS.find(p => p.id === personaId);
    
    if (!persona) {
      throw new Error(`Persona with ID ${personaId} not found`);
    }

    // Construct messages array for the API
    const messages: Message[] = [
      // System message with persona instructions
      { role: 'system', content: persona.systemPrompt },
    ];

    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.content
      });
    });

    // Add the new user message
    messages.push({ role: 'user', content: userMessage });

    // Make API request
    const response = await fetch(OPENAI_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.model,
        messages,
        temperature: OPENAI_CONFIG.temperature,
        max_tokens: OPENAI_CONFIG.maxTokens
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error details:', JSON.stringify(errorData));
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I'm sorry, I couldn't process your message at the moment. There might be an issue with the API key or your account balance (0.14 left). Please check your OpenAI account.";
  }
} 