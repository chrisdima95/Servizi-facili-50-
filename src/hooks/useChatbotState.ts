// Hook per gestire lo stato del chatbot: messaggi, preferenze, wizard e stato
import { useState, useCallback } from 'react';
import type { ChatbotState, ChatbotPreferences, WizardState } from '../components/Chatbot/chatbot-types';

export const useChatbotState = () => {
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    isOpen: false,
    isTyping: false,
    currentContext: '',
    preferences: {
      detailLevel: 'basic',
      favoriteServices: [],
      completedTutorials: []
    },
    wizard: {
      isActive: false,
      wizardId: '',
      currentStep: '',
      stepHistory: []
    }
  });

  // Funzione per aggiornare lo stato del chatbot
  const updateState = useCallback((updates: Partial<ChatbotState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Funzione per aggiornare le preferenze del chatbot
  const updatePreferences = useCallback((prefs: Partial<ChatbotPreferences>) => {
    setState(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...prefs }
    }));
  }, []);

  // Funzione per aggiornare lo stato del wizard
  const updateWizard = useCallback((wizard: Partial<WizardState>) => {
    setState(prev => ({
      ...prev,
      wizard: { ...prev.wizard, ...wizard }
    }));
  }, []);

  return {
    state,
    updateState,
    updatePreferences,
    updateWizard
  };
};
