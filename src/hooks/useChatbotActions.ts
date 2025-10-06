// Hook per gestire le azioni del chatbot: navigazione, intent e generazione di risposte
import { useCallback } from "react";

export const useChatbotActions = () => {
  const executeAction = useCallback((action: string) => {
    switch (action) {
      case "navigateToServices":
        // Logica di navigazione
        break;
      case "navigateToGlossary":
        // Logica di navigazione
        break;
      default:
        console.log("Azione non riconosciuta:", action);
    }
  }, []);

  // Funzione per trovare l'intent
  const findIntent = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes("servizi") ||
      lowerInput.includes("inps") ||
      lowerInput.includes("sanità")
    ) {
      return "services";
    }
    if (lowerInput.includes("glossario") || lowerInput.includes("termine")) {
      return "glossary";
    }
    if (lowerInput.includes("aiuto") || lowerInput.includes("help")) {
      return "help";
    }

    return "general";
  }, []);

  // Funzione per generare la risposta
  const generateResponse = useCallback((intent: string) => {
    switch (intent) {
      case "services":
        return "Posso aiutarti con i servizi INPS, sanità e altri servizi pubblici. Cosa ti serve?";
      case "glossary":
        return "Posso spiegarti i termini tecnici. Dimmi quale termine non ti è chiaro.";
      case "help":
        return "Sono qui per aiutarti! Puoi chiedermi informazioni sui servizi pubblici o sui termini tecnici.";
      default:
        return "Non sono sicuro di aver capito. Puoi essere più specifico?";
    }
  }, []);

  return {
    executeAction,
    findIntent,
    generateResponse,
  };
};
