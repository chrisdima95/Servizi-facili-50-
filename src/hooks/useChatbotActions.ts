// src/hooks/useChatbotActions.ts
import { useCallback } from 'react';
import type { ChatMessage } from '../components/Chatbot/chatbot-types';

export const useChatbotActions = (
  addMessage: (message: Omit<ChatMessage, 'id'>) => void,
  simulateTyping: (callback: () => void) => void
) => {
  const executeAction = useCallback((action: string) => {
    switch (action) {
      case 'navigateToServices':
        // Logica di navigazione
        break;
      case 'navigateToGlossary':
        // Logica di navigazione
        break;
      default:
        console.log('Azione non riconosciuta:', action);
    }
  }, []);

  const findIntent = useCallback((input: string) => {
    // Logica semplificata per trovare l'intent
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('servizi') || lowerInput.includes('inps') || lowerInput.includes('sanità')) {
      return 'services';
    }
    if (lowerInput.includes('glossario') || lowerInput.includes('termine')) {
      return 'glossary';
    }
    if (lowerInput.includes('aiuto') || lowerInput.includes('help')) {
      return 'help';
    }
    
    return 'general';
  }, []);

  const generateResponse = useCallback((intent: string, input: string) => {
    switch (intent) {
      case 'services':
        return 'Posso aiutarti con i servizi INPS, sanità e altri servizi pubblici. Cosa ti serve?';
      case 'glossary':
        return 'Posso spiegarti i termini tecnici. Dimmi quale termine non ti è chiaro.';
      case 'help':
        return 'Sono qui per aiutarti! Puoi chiedermi informazioni sui servizi pubblici o sui termini tecnici.';
      default:
        return 'Non sono sicuro di aver capito. Puoi essere più specifico?';
    }
  }, []);

  return {
    executeAction,
    findIntent,
    generateResponse
  };
};
