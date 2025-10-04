// src/components/Chatbot/index.tsx
export { default as ChatbotFab } from './ChatbotFab';
export { default as ChatbotWindow } from './ChatbotWindow';
export { default as ChatbotMessage } from './ChatbotMessage';
export { default as ChatbotInput } from './ChatbotInput';

// Export the hook
export { useChatbot } from './useChatbot';

// Re-export types for convenience
export type { ChatMessage, ChatbotPreferences, WizardState, ChatbotState } from './chatbot-types';
