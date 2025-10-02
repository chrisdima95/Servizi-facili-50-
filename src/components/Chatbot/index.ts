// src/components/Chatbot/index.ts
export { default as ChatbotFab } from './ChatbotFab';
export { default as ChatbotWindow } from './ChatbotWindow';
export { default as ChatbotMessage } from './ChatbotMessage';
export { default as ChatbotInput } from './ChatbotInput';

// Re-export types for convenience
export type { ChatMessage, ChatbotPreferences, WizardState, ChatbotState } from '../../types/chatbot-types';
