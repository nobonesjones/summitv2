// OpenAI API configuration
export const OPENAI_CONFIG = {
  apiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY || '',
  apiUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 500
};