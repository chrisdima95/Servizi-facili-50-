// Hook principale del chatbot: gestisce logica conversazionale, wizard, rilevamento scam e navigazione
import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from '../../contexts/SearchContext';
import { useUser } from '../../contexts/UserContext';
import { chatbotRules } from './chatbotRules';
import { chatbotWizards } from './chatbotWizards';
import { chatbotHelpers, getRandomMessage, detectFrustration, detectSuccess } from './chatbotHelpers';
import { termini } from '../../data/glossaryData';
import { detectScamKeywords } from './scamEmailExamples';
import type { ChatMessage, ChatbotPreferences, ChatbotState } from './chatbot-types';

export const useChatbot = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setGlobalQuery } = useSearch();
  const { user, isAuthenticated } = useUser();

  // Riferimenti per timeout attivi per cleanup
  const activeTimeouts = useRef<Set<number>>(new Set());

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
        // Errore caricamento preferenze chatbot
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
        // Errore caricamento wizard chatbot
      }
    }

    // Ripristina messaggio pending se presente
    const savedPendingMessage = localStorage.getItem('sf_chatbot_pending');
    if (savedPendingMessage) {
      try {
        setState(prev => ({ ...prev, pendingAccessMessage: savedPendingMessage }));
      } catch (error) {
        // Errore caricamento pending message
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
    
    setState(prev => {
      const newMessages = [...prev.messages, newMessage];
      // Limita a 50 messaggi per evitare problemi di performance
      const limitedMessages = newMessages.length > 50 
        ? newMessages.slice(-50) 
        : newMessages;
      
      return {
        ...prev,
        messages: limitedMessages
      };
    });
  }, []);

  // Simula typing del bot con gestione timeout ottimizzata
  const simulateTyping = useCallback((duration = 1000) => {
    setState(prev => ({ ...prev, isTyping: true }));
    return new Promise(resolve => {
      const timeoutId = setTimeout(() => {
        setState(prev => ({ ...prev, isTyping: false }));
        resolve(void 0);
      }, duration);
      
      // Aggiungi il timeout alla lista per cleanup
      activeTimeouts.current.add(timeoutId);
      
      // Cleanup function
      return () => {
        clearTimeout(timeoutId);
        activeTimeouts.current.delete(timeoutId);
      };
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
      case 'navigateToServices':
        navigate('/servizi');
        break;
      case 'navigateToProfile':
        // Non navigare al profilo se l'utente è già autenticato
        if (!isAuthenticated) {
          navigate('/profilo');
        }
        break;
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
      // Azioni specifiche per operazioni
      case 'navigateToPensionApplication':
        navigate('/operation/inps/0'); // Domanda pensione è la prima operazione INPS
        break;
      case 'navigateToHealthBooking':
        navigate('/operation/sanita/0'); // Gestione prenotazioni è la prima operazione sanità
        break;
      case 'navigateToTaxDeclaration':
        navigate('/operation/fisco/1'); // Dichiarazione precompilata è la seconda operazione fisco
        break;
      case 'navigateToPosteid':
        navigate('/operation/poste/1'); // PosteID è la seconda operazione poste
        break;
      case 'navigateToINAILDenuncia':
        navigate('/operation/inail/0'); // Denuncia infortunio è la prima operazione INAIL
        break;
      case 'navigateToBCCTransparency':
        navigate('/operation/bcc/0'); // Trasparenza è la prima operazione BCC
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
        // Azione non riconosciuta
    }
  }, [navigate, addMessage, isAuthenticated]);

  // Evidenzia elemento nella pagina con gestione timeout ottimizzata
  const highlightElement = useCallback((selector: string) => {
    const timeoutId1 = setTimeout(() => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('chatbot-highlight');
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const timeoutId2 = setTimeout(() => {
          element.classList.remove('chatbot-highlight');
        }, 3000);
        
        // Aggiungi entrambi i timeout alla lista
        activeTimeouts.current.add(timeoutId2);
      }
    }, 500);
    
    // Aggiungi il timeout alla lista
    activeTimeouts.current.add(timeoutId1);
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId1);
      activeTimeouts.current.delete(timeoutId1);
    };
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

      // Invia la domanda del prossimo step immediatamente
      addMessage({
        type: 'bot',
        text: nextStep.question,
        timestamp: new Date(),
        quickReplies: nextStep.options
      });
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

  // Ottiene il messaggio di accesso corretto per ogni servizio
  const getAccessMessage = useCallback((accessIntentKey: string): string => {
    switch (accessIntentKey) {
      case 'access_message_health':
        return 'Per accedere ai servizi sanitari devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      case 'access_message_inps':
        return 'Per accedere ai servizi INPS devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      case 'access_message_taxes':
        return 'Per accedere ai servizi fiscali devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      case 'access_message_poste':
        return 'Per accedere ai servizi di Poste Italiane devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      case 'access_message_bcc':
        return 'Per accedere ai servizi bancari devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      case 'access_message_inail':
        return 'Per accedere ai servizi INAIL devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
      default:
        return 'Per accedere ai servizi devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.';
    }
  }, []);

  // Genera messaggio di benvenuto personalizzato
  const getPersonalizedWelcome = useCallback(() => {
    const userName = state.preferences.userName;
    const timeOfDay = new Date().getHours();
    
    let greeting = '';
    if (timeOfDay < 12) greeting = 'Buongiorno';
    else if (timeOfDay < 18) greeting = 'Buon pomeriggio';
    else greeting = 'Buonasera';
    
    if (userName) {
      greeting += ` ${userName}!`;
    } else {
      greeting += '!';
    }
    
    const favoriteServices = state.preferences.favoriteServices;
    if (favoriteServices.length > 0) {
      const lastService = favoriteServices[favoriteServices.length - 1];
      return `${greeting} Vedo che usi spesso ${lastService}. Vuoi continuare con quello o ti serve altro?`;
    }
    
    return `${greeting} Sono il tuo assistente digitale. Come posso aiutarti oggi?`;
  }, [state.preferences]);

  // Memoizza le funzioni che non cambiano spesso
  const memoizedDetectScamKeywords = useCallback(detectScamKeywords, []);
  const memoizedGetPersonalizedWelcome = useCallback(getPersonalizedWelcome, [state.preferences.userName, state.preferences.favoriteServices]);
  const memoizedGetAccessMessage = useCallback(getAccessMessage, []);

  // Detect scam immediato senza debounce
  const detectScamImmediate = useCallback((text: string) => {
    return memoizedDetectScamKeywords(text);
  }, [memoizedDetectScamKeywords]);

  // Processa input dell'utente
  const processUserInput = useCallback(async (userInput: string) => {
    // Protezione contro input troppo lunghi che potrebbero causare problemi
    if (userInput.length > 5000) {
      addMessage({
        type: 'bot',
        text: 'Il messaggio è troppo lungo. Per favore, riduci il testo e riprova.',
        timestamp: new Date()
      });
      return;
    }

    // Aggiunge messaggio utente
    addMessage({
      type: 'user',
      text: userInput,
      timestamp: new Date()
    });


    // Se siamo in un wizard, processa il step
    const currentWizard = state.wizard;
    if (currentWizard.isActive) {
      const handled = await processWizardStep(userInput);
      if (handled) return;
    }

    // Rileva se dovrebbe iniziare un wizard
    const wizardTrigger = detectWizardTrigger(userInput);
    if (wizardTrigger) {
      startWizard(wizardTrigger);
      return;
    }

    // PRIORITÀ MASSIMA: Rilevamento e analisi email scam (prima di tutto il resto)
    const input = userInput.toLowerCase().trim();
    
    // Escludi i quickReplies specifici dall'analisi email scam
    const quickReplyActions = [
      'controlla altra email', 'come riconoscere email sicure', 'torna ai servizi',
      'altro termine', 'vai al glossario', 'consigli pratici', 'altri consigli',
      'consigli sicurezza', 'altro aiuto', 'vai ai servizi', 'chiudi chat',
      'pensioni inps', 'sanità puglia', 'tasse e 730', 'glossario termini', 'mail scam'
    ];
    
    const isQuickReplyAction = quickReplyActions.some(action => input.includes(action));
    
    // Controllo specifico per evitare che "Pensioni INPS" venga processato come email scam
    const isServiceSelection = input === 'pensioni inps' || input === 'sanità puglia' || 
                              input === 'tasse e 730' || input === 'glossario termini' || 
                              input === 'mail scam';
    
    if (!isQuickReplyAction && !isServiceSelection) {
      const emailIndicators = [
        '@', 'oggetto:', 'gentile', 'buongiorno', 'email', 'ciao', 'premio', 'vinto', 'congratulazioni',
        'offerta', 'scade', 'clicca qui', 'www.', 'http', 'team', 'staff', 'servizio clienti',
        'banca', 'poste', 'agenzia', 'comune', 'amazon', 'paypal', 'ebay'
      ];
      
      const hasEmailIndicators = emailIndicators.some(indicator => input.includes(indicator));
      
      // Se l'utente ha cliccato su "Mail scam" e ha scritto qualcosa, analizza sempre come email
      const currentMessages = state.messages;
      const lastBotMessage = currentMessages.filter(msg => msg.type === 'bot').pop();
      const isAfterMailScamClick = lastBotMessage && lastBotMessage.text.includes('controllare se un\'email è sicura');
      
      if (isAfterMailScamClick || ((input.length > 50 || hasEmailIndicators) && hasEmailIndicators)) {
      // Probabilmente è un'email incollata
      const riskLevel = detectScamImmediate(input);
      
      let responseText = '';
      
      switch (riskLevel) {
        case 'safe':
          responseText = '🟢 **SICURA** - Questa email sembra legittima e sicura. Puoi fidarti del contenuto.';
          break;
        case 'warning':
          responseText = '🟡 **ATTENZIONE** - Questa email potrebbe essere sospetta. Controlla bene prima di cliccare su qualsiasi link o fornire dati personali.';
          break;
        case 'danger':
          responseText = '🔴 **PERICOLOSA** - Questa email è molto probabilmente una truffa! NON cliccare su link, NON fornire dati personali, NON rispondere. Elimina l\'email immediatamente.';
          break;
      }
      
      responseText += '\n\n**Consigli di sicurezza:**\n• Mai cliccare su link in email sospette\n• Mai fornire password o dati bancari via email\n• Se hai dubbi, contatta direttamente l\'azienda\n• Le banche e uffici pubblici NON chiedono mai dati via email';
      
      addMessage({
        type: 'bot',
        text: responseText,
        timestamp: new Date(),
        quickReplies: ['Controlla altra email', 'Come riconoscere email sicure', 'Torna ai servizi']
      });
      
      return;
      }
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

    // Gestione speciale per "Come navigare" o "Mostrami come navigare"
    if (input.includes('come navigare') || input.includes('mostrami come navigare')) {
      addMessage({
        type: 'bot',
        text: 'Perfetto! Ti spiego come navigare su Servizi Facili 50+:\n\n**In alto nella pagina trovi:**\n• **Home** - Torna alla pagina principale\n• **Servizi** - Tutti i servizi pubblici (INPS, Sanità, Fisco, ecc.) - *Visibile solo dopo aver fatto l\'accesso*\n• **Guide** - Istruzioni dettagliate per usare il sito\n• **👤 Profilo** - I tuoi dati personali e accesso\n\n**🔍 Barra di ricerca:**\nClicca sulla lente di ingrandimento per cercare quello che ti serve (es. "pensione" o "visita medica")\n\n**♿ Pulsanti di accessibilità:**\nIn basso a sinistra trovi pulsanti per:\n• Ingrandire il testo\n• Aumentare il contrasto\n• Modalità focus\n\n**💬 Assistente (questo chatbot):**\nClicca sull\'icona blu in basso a destra per parlarmi\n\nVuoi che ti mostri un servizio specifico?',
        timestamp: new Date(),
        quickReplies: ['Pensioni INPS', 'Sanità Puglia', 'Tasse e 730', 'Glossario termini']
      });
      return;
    }

    // Gestione speciale per "si" o "sì" in risposta al messaggio di benvenuto
    const currentMessagesLength = state.messages.length;
    if ((input === 'si' || input === 'sì') && currentMessagesLength <= 2) {
      addMessage({
        type: 'bot',
        text: 'Perfetto! Ti spiego come navigare su Servizi Facili 50+:\n\n**In alto nella pagina trovi:**\n• **Home** - Torna alla pagina principale\n• **Servizi** - Tutti i servizi pubblici (INPS, Sanità, Fisco, ecc.) - *Visibile solo dopo aver fatto l\'accesso*\n• **Guide** - Istruzioni dettagliate per usare il sito\n• **👤 Profilo** - I tuoi dati personali e accesso\n\n**🔍 Barra di ricerca:**\nClicca sulla lente di ingrandimento per cercare quello che ti serve (es. "pensione" o "visita medica")\n\n**♿ Pulsanti di accessibilità:**\nIn basso a sinistra trovi pulsanti per:\n• Ingrandire il testo\n• Aumentare il contrasto\n• Modalità focus\n\n**💬 Assistente (questo chatbot):**\nClicca sull\'icona blu in basso a destra per parlarmi\n\nVuoi che ti mostri un servizio specifico?',
        timestamp: new Date(),
        quickReplies: ['Pensioni INPS', 'Sanità Puglia', 'Tasse e 730', 'Glossario termini']
      });
      return;
    }

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

    // 2. Pattern matching per intenti (priorità agli intenti specifici)
    const intentMatch = findIntent(input);
    if (intentMatch && intentMatch.confidence > 0.3) {
      const intent = chatbotRules.intents[intentMatch.intent];
      if (intent) {
        const response = intent.responses[Math.floor(Math.random() * intent.responses.length)];
        
        // Non mostrare quickReplies se il followUp contiene solo access_message_
        const shouldShowQuickReplies = !(intent.followUp && intent.followUp.length === 1 && intent.followUp[0].startsWith('access_message_'));
        
        // Non mostrare il messaggio di accesso se l'utente è già loggato e c'è un followUp access_message_
        const shouldShowAccessMessage = !(isAuthenticated && intent.followUp && intent.followUp.length === 1 && intent.followUp[0].startsWith('access_message_'));
        
        if (shouldShowAccessMessage) {
          addMessage({
            type: 'bot',
            text: response,
            timestamp: new Date(),
            actions: intent.actions,
            quickReplies: shouldShowQuickReplies ? intent.followUp : undefined
          });
        }

        // Esegue azioni se presenti
        if (intent.actions) {
          intent.actions.forEach(action => executeAction(action));
        }

        // Gestisce i messaggi di accesso per gli intenti principali
        if (intent.followUp && intent.followUp.length === 1 && intent.followUp[0].startsWith('access_message_')) {
          const accessIntentKey = intent.followUp![0];
          
          // Controlla se questo followUp è già stato elaborato per evitare duplicazioni
          const alreadyProcessed = state.messages.some(msg => 
            msg.type === 'bot' && msg.text.includes(accessIntentKey)
          );
          
          if (!alreadyProcessed) {
            // Invia il messaggio immediatamente invece di usare setTimeout
            const accessIntent = chatbotRules.intents[accessIntentKey];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
        }

        // Gestisce gli intenti specifici per le operazioni - RIMOSSO setTimeout multipli
        if (intentMatch.intent === 'pension_application_intent') {
          if (isAuthenticated) {
            // Se l'utente è già loggato, mostra il messaggio del servizio immediatamente
            const accessIntent = chatbotRules.intents['access_message_inps'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }

        if (intentMatch.intent === 'health_booking_intent') {
          if (isAuthenticated) {
            const accessIntent = chatbotRules.intents['access_message_health'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }

        if (intentMatch.intent === 'tax_declaration_intent') {
          if (isAuthenticated) {
            const accessIntent = chatbotRules.intents['access_message_taxes'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }

        if (intentMatch.intent === 'posteid_intent') {
          if (isAuthenticated) {
            const accessIntent = chatbotRules.intents['access_message_poste'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }

        if (intentMatch.intent === 'relaxbanking_intent') {
          if (isAuthenticated) {
            const accessIntent = chatbotRules.intents['access_message_bcc'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }

        if (intentMatch.intent === 'accident_report_intent') {
          if (isAuthenticated) {
            const accessIntent = chatbotRules.intents['access_message_inail'];
            if (accessIntent) {
              addMessage({
                type: 'bot',
                text: accessIntent.responses[0],
                timestamp: new Date(),
                quickReplies: accessIntent.followUp
              });
            }
          }
          return;
        }
        return;
      }
    }


    // 3. Cerca nel glossario SOLO per domande esplicite
    const isGlossaryQuestion = input.includes('che cosa significa') || input.includes('cosa significa') || 
                              input.includes('che significa') || input.includes('cos\'è') || 
                              input.includes('spiegami') || input.includes('definizione di') ||
                              input.includes('significato di') || input.includes('?');
    
    if (isGlossaryQuestion) {
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

      // Cerca direttamente nelle spiegazioni semplificate
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


    // 7. Fallback con suggerimenti personalizzati
    const favoriteServices = state.preferences.favoriteServices;
    let suggestions = ['Pensioni INPS', 'Sanità Puglia', 'Tasse e 730', 'Glossario termini', 'Mail scam'];
    
    // Personalizza i suggerimenti in base alla cronologia
    if (favoriteServices.includes('inps')) {
      suggestions = ['Pensioni INPS', 'Sanità', 'Consigli sicurezza', 'Glossario', 'Mail scam'];
    } else if (favoriteServices.includes('sanita')) {
      suggestions = ['Prenotare visita', 'Pensioni', 'Consigli pratici', 'Glossario', 'Mail scam'];
    }

    addMessage({
      type: 'bot',
      text: 'Non ho capito bene la tua richiesta. Puoi provare a chiedere di:',
      timestamp: new Date(),
      quickReplies: suggestions
    });
  }, [addMessage, simulateTyping, findIntent, searchGlossary, executeAction, setGlobalQuery, navigate, processWizardStep, detectWizardTrigger, startWizard, savePreferences, detectScamImmediate, memoizedGetPersonalizedWelcome, memoizedGetAccessMessage, state.messages, state.wizard, state.preferences, isAuthenticated]);

  // Apre/chiude il chatbot
  const toggleChatbot = useCallback(() => {
    setState(prev => {
      const newIsOpen = !prev.isOpen;
      // Se stiamo aprendo il chatbot (da false a true), cancella i messaggi
      if (newIsOpen && !prev.isOpen) {
        return { ...prev, isOpen: newIsOpen, messages: [] };
      }
      return { ...prev, isOpen: newIsOpen };
    });
  }, []);

  // Chiude il chatbot e cancella la chat
  const closeChatbot = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isOpen: false,
      // NON cancellare i messaggi se c'è un pendingAccessMessage attivo
      // per mantenere il contesto della conversazione
      messages: prev.pendingAccessMessage ? prev.messages : []
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
  }, [location.pathname]);

  // Pulisce i messaggi pending quando l'utente fa logout
  useEffect(() => {
    if (!isAuthenticated && state.pendingAccessMessage) {
      // Se l'utente fa logout, cancella il messaggio pending
      setState(prev => ({
        ...prev,
        pendingAccessMessage: undefined
      }));
      // Rimuovi anche dal localStorage
      localStorage.removeItem('sf_chatbot_pending');
    }
  }, [isAuthenticated, state.pendingAccessMessage]);

  // Cleanup timeout quando il componente viene smontato
  useEffect(() => {
    return () => {
      // Cancella tutti i timeout attivi per evitare memory leaks
      activeTimeouts.current.forEach(timeout => clearTimeout(timeout));
      activeTimeouts.current.clear();
    };
  }, []);


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
