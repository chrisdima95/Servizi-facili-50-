// src/types/chatbot-types.ts
export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  text: string;
  timestamp: Date;
  actions?: string[];
  quickReplies?: string[];
}

export interface ChatbotPreferences {
  detailLevel: 'basic' | 'detailed';
  favoriteServices: string[];
  completedTutorials: string[];
  userName?: string;
}

export interface WizardState {
  isActive: boolean;
  wizardId: string;
  currentStep: string;
  stepHistory: string[];
}

export interface ChatbotState {
  messages: ChatMessage[];
  isOpen: boolean;
  isTyping: boolean;
  currentContext: string;
  preferences: ChatbotPreferences;
  wizard: WizardState;
  pendingAccessMessage?: string;
}
