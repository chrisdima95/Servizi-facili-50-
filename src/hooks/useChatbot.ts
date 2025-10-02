// src/hooks/useChatbot.ts
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import { useUser } from '../context/UserContext';
import { chatbotRules } from '../data/chatbotRules';
import { chatbotWizards } from '../data/chatbotWizards';
import { chatbotHelpers, getRandomMessage, detectFrustration, detectSuccess } from '../data/chatbotHelpers';
import { termini } from '../pages/DizionarioSlang';
import type { ChatMessage, ChatbotPreferences, ChatbotState } from '../types/chatbot-types';

export const useChatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setGlobalQuery } = useSearch();
  const { user, isAuthenticated } = useUser();

  // Stato del chatbot
  const [state, setState] = useState<ChatbotState>({
    messages: [],
    isOpen: false,
    isTyping: false,
    currentContext: location.pathname,
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

  // Carica preferenze dal localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('sf_chatbot_prefs');
    const savedWizard = localStorage.getItem('sf_chatbot_wizard');
    
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        setState(prev => ({ ...prev, preferences: { ...prev.preferences, ...prefs } }));
      } catch (error) {
        console.log('Errore caricamento preferenze chatbot:', error);
      }
    }

    // Ripristina wizard se era attivo
    if (savedWizard) {
      try {
        const wizardState = JSON.parse(savedWizard);
        if (wizardState.isActive) {
          setState(prev => ({ ...prev, wizard: wizardState }));
        }
      } catch (error) {
        console.log('Errore caricamento wizard chatbot:', error);
      }
    }

    // Salva nome utente se autenticato
    if (isAuthenticated && user) {
      savePreferences({ userName: user.firstName });
    }
  }, [isAuthenticated, user]);

  // Salva preferenze nel localStorage
  const savePreferences = useCallback((prefs: Partial<ChatbotPreferences>) => {
    const newPrefs = { ...state.preferences, ...prefs };
    setState(prev => ({ ...prev, preferences: newPrefs }));
    localStorage.setItem('sf_chatbot_prefs', JSON.stringify(newPrefs));
  }, [state.preferences]);

  // Salva stato wizard automaticamente
  useEffect(() => {
    if (state.wizard.isActive) {
      localStorage.setItem('sf_chatbot_wizard', JSON.stringify(state.wizard));
    } else {
      localStorage.removeItem('sf_chatbot_wizard');
    }
  }, [state.wizard]);

  // Genera ID univoco per i messaggi
  const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // Aggiunge un messaggio alla chat
  const addMessage = useCallback((message: Omit<ChatMessage, 'id'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateMessageId()
    };
    
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage]
    }));
  }, []);

  // Simula typing del bot
  const simulateTyping = useCallback((duration = 1000) => {
    setState(prev => ({ ...prev, isTyping: true }));
    return new Promise(resolve => {
      setTimeout(() => {
        setState(prev => ({ ...prev, isTyping: false }));
        resolve(void 0);
      }, duration);
    });
  }, []);

  // Pattern matching per trovare l'intento
  const findIntent = useCallback((userInput: string): { intent: string; confidence: number } | null => {
    const input = userInput.toLowerCase().trim();
    
    // Cerca match esatti nelle FAQ
    for (const [question] of Object.entries(chatbotRules.faq)) {
      if (input.includes(question)) {
        return { intent: 'faq', confidence: 1.0 };
      }
    }

    // Pattern matching per intenti
    let bestMatch = { intent: '', confidence: 0 };
    
    for (const [intentName, intentData] of Object.entries(chatbotRules.intents)) {
      for (const pattern of intentData.patterns) {
        if (input.includes(pattern)) {
          const confidence = pattern.length / input.length; // Confidence basata sulla lunghezza
          if (confidence > bestMatch.confidence) {
            bestMatch = { intent: intentName, confidence };
          }
        }
      }
    }

    return bestMatch.confidence > 0 ? bestMatch : null;
  }, []);

  // Cerca nel glossario
  const searchGlossary = useCallback((userInput: string) => {
    const input = userInput.toLowerCase().trim();
    return termini.find(term => 
      input.includes(term.slang.toLowerCase()) || 
      term.slang.toLowerCase().includes(input)
    );
  }, []);

  // Esegue azioni del chatbot
  const executeAction = useCallback((action: string) => {
    switch (action) {
      case 'navigateToINPS':
        navigate('/service/inps');
        break;
      case 'navigateToHealth':
        navigate('/service/sanita');
        break;
      case 'navigateToTaxes':
        navigate('/service/fisco');
        break;
      case 'navigateToPoste':
        navigate('/service/poste');
        break;
      case 'navigateToBCC':
        navigate('/service/bcc');
        break;
      case 'navigateToINAIL':
        navigate('/service/inail');
        break;
      case 'navigateToGlossary':
        navigate('/glossario');
        break;
      case 'navigateToGuide':
        navigate('/guide');
        break;
      case 'navigateToServices':
        navigate('/servizi');
        break;
      case 'highlightINPS':
        highlightElement('[data-service="inps"]');
        break;
      case 'highlightPensionButton':
        highlightElement('[data-operation="domanda-pensione"]');
        break;
      case 'highlightPosteid':
        highlightElement('[data-operation*="posteid"]');
        break;
      case 'highlightBooking':
        highlightElement('[data-operation*="prenotazione"]');
        break;
      case 'showHealthOptions':
        // Mostra opzioni sanitarie
        addMessage({
          type: 'bot',
          text: 'Ecco cosa puoi fare con Puglia Salute:',
          timestamp: new Date(),
          quickReplies: ['Prenotare visita', 'Vedere referto', 'Pagare ticket', 'Scegliere medico']
        });
        break;
      case 'showTaxOptions':
        addMessage({
          type: 'bot',
          text: 'Per l\'Agenzia delle Entrate puoi:',
          timestamp: new Date(),
          quickReplies: ['Fare il 730', 'Cassetto fiscale', 'Inviare documenti']
        });
        break;
      case 'showPosteOptions':
        addMessage({
          type: 'bot',
          text: 'Con Poste Italiane puoi:',
          timestamp: new Date(),
          quickReplies: ['Attivare PosteID', 'Vedere cedolino', 'Pagare bollettini']
        });
        break;
      default:
        console.log('Azione non riconosciuta:', action);
    }
  }, [navigate, addMessage]);

  // Evidenzia elemento nella pagina
  const highlightElement = useCallback((selector: string) => {
    setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('chatbot-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => {
          element.classList.remove('chatbot-highlight');
        }, 3000);
      }
    }, 500);
  }, []);

  // Inizia un wizard
  const startWizard = useCallback((wizardId: string) => {
    const wizard = chatbotWizards[wizardId];
    if (!wizard) return;

    setState(prev => ({
      ...prev,
      wizard: {
        isActive: true,
        wizardId,
        currentStep: wizard.startStep,
        stepHistory: []
      }
    }));

    const firstStep = wizard.steps[wizard.startStep];
    if (firstStep) {
      addMessage({
        type: 'bot',
        text: firstStep.question,
        timestamp: new Date(),
        quickReplies: firstStep.options
      });
    }
  }, [addMessage]);

  // Processa step del wizard
  const processWizardStep = useCallback(async (userResponse: string) => {
    if (!state.wizard.isActive) return false;

    const wizard = chatbotWizards[state.wizard.wizardId];
    const currentStep = wizard?.steps[state.wizard.currentStep];
    
    if (!wizard || !currentStep) return false;

    // Simula typing
    await simulateTyping(800);

    // Trova la risposta corrispondente
    const response = currentStep.responses[userResponse];
    if (!response) return false;

    // Invia la risposta del bot
    addMessage({
      type: 'bot',
      text: response,
      timestamp: new Date()
    });

    // Esegue azioni se presenti
    const actions = currentStep.actions?.[userResponse];
    if (actions) {
      actions.forEach(action => executeAction(action));
    }

    // Determina il prossimo step
    const nextStepId = currentStep.nextStep?.[userResponse];
    
    if (!nextStepId || currentStep.isEnd) {
      // Fine del wizard
      setState(prev => ({
        ...prev,
        wizard: {
          isActive: false,
          wizardId: '',
          currentStep: '',
          stepHistory: []
        }
      }));
      return true;
    }

    // Vai al prossimo step
    const nextStep = wizard.steps[nextStepId];
    if (nextStep) {
      setState(prev => ({
        ...prev,
        wizard: {
          ...prev.wizard,
          currentStep: nextStepId,
          stepHistory: [...prev.wizard.stepHistory, prev.wizard.currentStep]
        }
      }));

      // Invia la domanda del prossimo step
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: nextStep.question,
          timestamp: new Date(),
          quickReplies: nextStep.options
        });
      }, 1000);
    }

    return true;
  }, [state.wizard, addMessage, simulateTyping, executeAction]);

  // Rileva se l'input dovrebbe iniziare un wizard
  const detectWizardTrigger = useCallback((input: string): string | null => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('domanda') && lowerInput.includes('pensione')) {
      return 'pension_application';
    }
    if (lowerInput.includes('prenotare') || lowerInput.includes('visita') || lowerInput.includes('medico')) {
      return 'health_booking';
    }
    if (lowerInput.includes('spid') && (lowerInput.includes('come') || lowerInput.includes('ottenere'))) {
      return 'spid_setup';
    }
    if (lowerInput.includes('730') || (lowerInput.includes('dichiarazione') && lowerInput.includes('redditi'))) {
      return 'tax_declaration';
    }
    if (lowerInput.includes('tasse') || lowerInput.includes('agenzia') && lowerInput.includes('entrate')) {
      return 'tax_declaration';
    }
    
    return null;
  }, []);

  // Processa input dell'utente
  const processUserInput = useCallback(async (userInput: string) => {
    // Aggiunge messaggio utente
    addMessage({
      type: 'user',
      text: userInput,
      timestamp: new Date()
    });

    // Se siamo in un wizard, processa il step
    if (state.wizard.isActive) {
      const handled = await processWizardStep(userInput);
      if (handled) return;
    }

    // Rileva se dovrebbe iniziare un wizard
    const wizardTrigger = detectWizardTrigger(userInput);
    if (wizardTrigger) {
      startWizard(wizardTrigger);
      return;
    }

    // Rileva frustrazione o successo per risposte empatiche
    const isFrustrated = detectFrustration(userInput);
    const isSuccessful = detectSuccess(userInput);

    // Simula typing
    await simulateTyping(800);

    // Rispondi con empatia se l'utente è frustrato
    if (isFrustrated) {
      const encouragement = getRandomMessage('encouragement');
      const support = getRandomMessage('emotionalSupport');
      
      addMessage({
        type: 'bot',
        text: `${encouragement} ${support} Dimmi esattamente cosa non funziona e ti aiuto passo passo.`,
        timestamp: new Date(),
        quickReplies: ['Non riesco ad accedere', 'Non capisco i termini', 'Il sito è confuso', 'Aiuto generale']
      });
      return;
    }

    // Celebra il successo dell'utente
    if (isSuccessful) {
      const celebration = getRandomMessage('encouragement');
      
      addMessage({
        type: 'bot',
        text: `${celebration} Sono felice di averti aiutato! C'è altro che posso fare per te?`,
        timestamp: new Date(),
        quickReplies: ['Altro servizio', 'Spiegami altro', 'No, grazie', 'Consigli sicurezza']
      });
      return;
    }

    const input = userInput.toLowerCase().trim();

    // 1. Cerca nelle FAQ
    for (const [question, answer] of Object.entries(chatbotRules.faq)) {
      if (input.includes(question)) {
        addMessage({
          type: 'bot',
          text: answer,
          timestamp: new Date(),
          quickReplies: ['Altro aiuto', 'Vai ai servizi', 'Chiudi chat']
        });
        return;
      }
    }

    // 2. Cerca nel glossario e spiegazioni semplificate
    const glossaryMatch = searchGlossary(input);
    if (glossaryMatch) {
      // Controlla se c'è una spiegazione semplificata
      const key = glossaryMatch.slang.toLowerCase();
      const simpleExplanation = key in chatbotHelpers.simpleExplanations 
        ? chatbotHelpers.simpleExplanations[key as keyof typeof chatbotHelpers.simpleExplanations]
        : undefined;
      const explanation = simpleExplanation || glossaryMatch.description;
      
      addMessage({
        type: 'bot',
        text: `📚 **${glossaryMatch.slang}**: ${explanation}`,
        timestamp: new Date(),
        quickReplies: ['Altro termine', 'Vai al glossario', 'Torna ai servizi']
      });
      return;
    }

    // 2b. Cerca direttamente nelle spiegazioni semplificate
    for (const [term, explanation] of Object.entries(chatbotHelpers.simpleExplanations)) {
      if (input.includes(term)) {
        addMessage({
          type: 'bot',
          text: `💡 **${term.charAt(0).toUpperCase() + term.slice(1)}**: ${explanation}`,
          timestamp: new Date(),
          quickReplies: ['Altro termine', 'Vai al glossario', 'Consigli pratici']
        });
        return;
      }
    }

    // 3. Pattern matching per intenti
    const intentMatch = findIntent(input);
    if (intentMatch && intentMatch.confidence > 0.3) {
      const intent = chatbotRules.intents[intentMatch.intent];
      if (intent) {
        const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        
        addMessage({
          type: 'bot',
          text: response,
          timestamp: new Date(),
          actions: intent.actions,
          quickReplies: intent.followUp
        });

        // Esegue azioni se presenti
        if (intent.actions) {
          intent.actions.forEach(action => executeAction(action));
        }
        return;
      }
    }

    // 4. Ricerca intelligente nei servizi
    if (input.includes('cerca') || input.includes('trova') || input.includes('dove') || input.includes('come')) {
      let searchTerm = input.replace(/cerca|trova|dove|come/g, '').trim();
      
      // Migliora il termine di ricerca con sinonimi
      if (searchTerm.includes('dottore') || searchTerm.includes('medico')) {
        searchTerm = 'sanità prenotazione';
      } else if (searchTerm.includes('soldi') || searchTerm.includes('denaro')) {
        searchTerm = 'pensioni inps';
      } else if (searchTerm.includes('tasse') || searchTerm.includes('730')) {
        searchTerm = 'agenzia entrate';
      }
      
      if (searchTerm) {
        setGlobalQuery(searchTerm);
        navigate('/servizi');
        
        // Traccia la ricerca nelle preferenze
        const currentServices = state.preferences.favoriteServices;
        if (searchTerm.includes('inps') && !currentServices.includes('inps')) {
          savePreferences({ favoriteServices: [...currentServices, 'inps'] });
        } else if (searchTerm.includes('sanità') && !currentServices.includes('sanita')) {
          savePreferences({ favoriteServices: [...currentServices, 'sanita'] });
        }
        
        addMessage({
          type: 'bot',
          text: `Ho cercato "${searchTerm}" nei servizi. Guarda i risultati! Se non trovi quello che cerchi, prova a essere più specifico.`,
          timestamp: new Date(),
          quickReplies: ['Pensioni', 'Sanità', 'Tasse', 'Altro aiuto']
        });
        return;
      }
    }

    // 5. Gestione richieste speciali
    if (input.includes('sicurezza') || input.includes('truffa') || input.includes('sicuro')) {
      const securityTip = getRandomMessage('securityTips');
      addMessage({
        type: 'bot',
        text: `🔒 Ecco un consiglio importante per la tua sicurezza:\n\n${securityTip}`,
        timestamp: new Date(),
        quickReplies: ['Altri consigli', 'Consigli pratici', 'Torna ai servizi']
      });
      return;
    }

    if (input.includes('consigli') || input.includes('suggerimenti') || input.includes('pratici')) {
      const practicalTip = getRandomMessage('practicalTips');
      addMessage({
        type: 'bot',
        text: `💡 Ecco un consiglio pratico per usare meglio il computer:\n\n${practicalTip}`,
        timestamp: new Date(),
        quickReplies: ['Altri consigli', 'Consigli sicurezza', 'Torna ai servizi']
      });
      return;
    }

    // 6. Fallback con suggerimenti personalizzati
    const favoriteServices = state.preferences.favoriteServices;
    let suggestions = ['Pensioni INPS', 'Sanità Puglia', 'Tasse e 730', 'Glossario termini'];
    
    // Personalizza i suggerimenti in base alla cronologia
    if (favoriteServices.includes('inps')) {
      suggestions = ['Pensioni INPS', 'Sanità', 'Consigli sicurezza', 'Glossario'];
    } else if (favoriteServices.includes('sanita')) {
      suggestions = ['Prenotare visita', 'Pensioni', 'Consigli pratici', 'Glossario'];
    }

    addMessage({
      type: 'bot',
      text: 'Non ho capito bene la tua richiesta. Puoi provare a chiedere di:',
      timestamp: new Date(),
      quickReplies: suggestions
    });
  }, [addMessage, simulateTyping, findIntent, searchGlossary, executeAction, setGlobalQuery, navigate, state.wizard, processWizardStep, detectWizardTrigger, startWizard, state.preferences.favoriteServices, savePreferences]);

  // Genera messaggio di benvenuto personalizzato
  const getPersonalizedWelcome = useCallback(() => {
    const userName = state.preferences.userName;
    const timeOfDay = new Date().getHours();
    const contextHelp = chatbotRules.contextualHelp[location.pathname];
    
    let greeting = '';
    if (timeOfDay < 12) greeting = 'Buongiorno';
    else if (timeOfDay < 18) greeting = 'Buon pomeriggio';
    else greeting = 'Buonasera';
    
    if (userName) {
      greeting += ` ${userName}!`;
    } else {
      greeting += '!';
    }
    
    if (contextHelp) {
      return `${greeting} ${contextHelp}`;
    }
    
    const favoriteServices = state.preferences.favoriteServices;
    if (favoriteServices.length > 0) {
      const lastService = favoriteServices[favoriteServices.length - 1];
      return `${greeting} Vedo che usi spesso ${lastService}. Vuoi continuare con quello o ti serve altro?`;
    }
    
    return `${greeting} Sono il tuo assistente digitale. Come posso aiutarti oggi?`;
  }, [state.preferences, location.pathname]);

  // Apre/chiude il chatbot
  const toggleChatbot = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    
    // Se si apre per la prima volta, mostra messaggio di benvenuto personalizzato
    if (!state.isOpen && state.messages.length === 0) {
      setTimeout(() => {
        const welcomeMessage = getPersonalizedWelcome();
        
        // Quick replies personalizzate basate sulla cronologia
        const favoriteServices = state.preferences.favoriteServices;
        let quickReplies = ['Pensioni', 'Sanità', 'Tasse', 'Glossario'];
        
        if (favoriteServices.includes('inps')) {
          quickReplies = ['Pensioni INPS', 'Sanità', 'Tasse', 'Altro'];
        } else if (favoriteServices.includes('sanita')) {
          quickReplies = ['Prenotare visita', 'Pensioni', 'Tasse', 'Altro'];
        }
        
        addMessage({
          type: 'bot',
          text: welcomeMessage,
          timestamp: new Date(),
          quickReplies
        });
      }, 500);
    }
  }, [state.isOpen, state.messages.length, getPersonalizedWelcome, state.preferences.favoriteServices, addMessage]);

  // Chiude il chatbot e cancella la chat
  const closeChatbot = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false,
      messages: [] // Cancella tutti i messaggi quando si chiude
    }));
  }, []);

  // Pulisce la chat
  const clearChat = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  // Gestisce quick replies
  const handleQuickReply = useCallback((reply: string) => {
    processUserInput(reply);
  }, [processUserInput]);

  // Aggiorna contesto quando cambia pagina
  useEffect(() => {
    setState(prev => ({ ...prev, currentContext: location.pathname }));
    
    // Se il chatbot è aperto e cambia pagina, offre aiuto contestuale
    if (state.isOpen) {
      const contextHelp = chatbotRules.contextualHelp[location.pathname];
      if (contextHelp) {
        setTimeout(() => {
          addMessage({
            type: 'bot',
            text: `📍 ${contextHelp}`,
            timestamp: new Date()
          });
        }, 1000);
      }
    }
  }, [location.pathname, state.isOpen, addMessage]);

  return {
    // Stato
    messages: state.messages,
    isOpen: state.isOpen,
    isTyping: state.isTyping,
    preferences: state.preferences,
    
    // Azioni
    processUserInput,
    toggleChatbot,
    closeChatbot,
    clearChat,
    handleQuickReply,
    savePreferences,
    executeAction
  };
};
