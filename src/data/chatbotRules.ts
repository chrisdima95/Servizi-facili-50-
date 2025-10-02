// src/data/chatbotRules.ts
export interface ChatbotIntent {
  patterns: string[];
  responses: string[];
  actions?: string[];
  followUp?: string[];
}

export interface ChatbotRule {
  intents: Record<string, ChatbotIntent>;
  contextualHelp: Record<string, string>;
  faq: Record<string, string>;
  quickActions: Record<string, { text: string; action: string }>;
}

export const chatbotRules: ChatbotRule = {
  // Intenti principali con pattern matching
  intents: {
    greeting: {
      patterns: ['ciao', 'salve', 'buongiorno', 'buonasera', 'aiuto', 'help', 'assistenza'],
      responses: [
        'Ciao! Sono il tuo assistente digitale. Come posso aiutarti oggi?',
        'Salve! Sono qui per guidarti nell\'uso dei servizi digitali. Di cosa hai bisogno?',
        'Buongiorno! Posso aiutarti a navigare tra i servizi pubblici online. Cosa ti serve?'
      ],
      followUp: ['Puoi chiedermi di: pensioni, sanità, tasse, o spiegarti qualsiasi termine che non capisci.']
    },

    pension: {
      patterns: ['pensione', 'inps', 'domanda pensione', 'pensionato', 'accompagnamento', 'invalidità'],
      responses: [
        'Ti aiuto volentieri con le pensioni INPS! Prima di tutto, hai già lo SPID per accedere?',
        'Perfetto, parliamo di pensioni. Cosa devi fare esattamente: domanda di pensione o altro?'
      ],
      actions: ['navigateToINPS', 'highlightINPS'],
      followUp: ['Se non hai SPID, posso spiegarti come ottenerlo facilmente tramite Poste.']
    },

    health: {
      patterns: ['medico', 'visita', 'prenotazione', 'sanità', 'puglia salute', 'dottore', 'ospedale', 'referto'],
      responses: [
        'Ti aiuto con i servizi sanitari di Puglia Salute. Cosa devi fare: prenotare una visita, vedere un referto, o altro?',
        'Per la sanità posso guidarti su tutte le operazioni di Puglia Salute. Di cosa hai bisogno?'
      ],
      actions: ['navigateToHealth', 'showHealthOptions'],
      followUp: ['Ricorda che per Puglia Salute serve sempre lo SPID per accedere.']
    },

    taxes: {
      patterns: ['tasse', '730', 'fisco', 'agenzia entrate', 'dichiarazione', 'cassetto fiscale'],
      responses: [
        'Ti aiuto con le questioni fiscali dell\'Agenzia delle Entrate. Devi fare il 730 o consultare il cassetto fiscale?',
        'Per le tasse posso guidarti: 730 precompilato, cassetto fiscale, o invio documenti?'
      ],
      actions: ['navigateToTaxes', 'showTaxOptions'],
      followUp: ['L\'Agenzia delle Entrate richiede SPID, CIE o CNS per l\'accesso.']
    },

    poste: {
      patterns: ['poste', 'posteid', 'spid', 'cedolino', 'pagamento', 'bollettino'],
      responses: [
        'Ti aiuto con i servizi di Poste Italiane. Vuoi attivare PosteID, vedere il cedolino pensione, o pagare qualcosa?',
        'Poste Italiane offre molti servizi. Cosa ti serve: SPID, pagamenti, o cedolini?'
      ],
      actions: ['navigateToPoste', 'showPosteOptions'],
      followUp: ['PosteID è il modo più semplice per ottenere lo SPID se vai in ufficio postale.']
    },

    banking: {
      patterns: ['banca', 'bcc', 'conto', 'bonifico', 'homebanking', 'relaxbanking'],
      responses: [
        'Ti aiuto con i servizi bancari BCC. Vuoi informazioni su RelaxBanking o sulla trasparenza?',
        'Per la banca BCC posso guidarti nell\'home banking o nelle informazioni sui prodotti.'
      ],
      actions: ['navigateToBCC', 'showBankingOptions']
    },

    inail: {
      patterns: ['inail', 'infortunio', 'lavoro', 'denuncia', 'prestazioni'],
      responses: [
        'Ti aiuto con INAIL. Devi fare una denuncia di infortunio o consultare le tue pratiche?',
        'Per INAIL posso guidarti: denunce infortuni, consultazione pratiche, o prestazioni economiche?'
      ],
      actions: ['navigateToINAIL', 'showINAILOptions']
    },

    spid_help: {
      patterns: ['cos\'è spid', 'come ottenere spid', 'spid come fare', 'identità digitale', 'accesso'],
      responses: [
        'Lo SPID è la tua identità digitale, come una carta d\'identità per internet. Ti permette di accedere a tutti i servizi pubblici con un\'unica password.',
        'SPID significa Sistema Pubblico di Identità Digitale. È sicuro e ti evita di ricordare tante password diverse.'
      ],
      followUp: ['Il modo più semplice è andare alle Poste con documento e tessera sanitaria. Vuoi che ti spieghi come fare?']
    },

    glossary: {
      patterns: ['non capisco', 'cosa significa', 'spiegami', 'glossario', 'dizionario', 'termine'],
      responses: [
        'Ti spiego volentieri! Scrivi la parola che non capisci e te la spiego in modo semplice.',
        'Perfetto! Sono qui per spiegare tutti i termini tecnici. Quale parola ti crea difficoltà?'
      ],
      actions: ['navigateToGlossary', 'showGlossaryHelp']
    },

    navigation_help: {
      patterns: ['come funziona', 'non so dove andare', 'sono confuso', 'aiuto navigazione', 'dove cliccare'],
      responses: [
        'Ti guido io! Dimmi cosa vuoi fare e ti accompagno passo passo.',
        'Nessun problema, è normale sentirsi confusi all\'inizio. Cosa stai cercando di fare?'
      ],
      followUp: ['Puoi sempre tornare alla pagina principale cliccando su "Home" in alto.']
    },

    security: {
      patterns: ['sicurezza', 'password', 'truffa', 'phishing', 'sicuro'],
      responses: [
        'La sicurezza è importante! Ti do alcuni consigli: usa password diverse per ogni sito, non cliccare su link sospetti nelle email, e controlla sempre che il sito sia quello giusto.',
        'Ottima domanda sulla sicurezza. Ricorda: i siti pubblici veri hanno sempre il lucchetto verde nell\'indirizzo e finiscono con .gov.it'
      ],
      followUp: ['Se ricevi email sospette che sembrano dell\'INPS o altri enti, non cliccare mai sui link. Vai sempre direttamente al sito ufficiale.']
    },

    technical_problems: {
      patterns: ['non funziona', 'errore', 'problema', 'lento', 'non carica', 'bloccato'],
      responses: [
        'Capisco la frustrazione! Proviamo a risolvere insieme. Che tipo di problema stai avendo?',
        'I problemi tecnici capitano. Dimmi cosa succede esattamente e vediamo come risolverlo.'
      ],
      followUp: ['Spesso basta ricaricare la pagina (F5) o controllare la connessione internet.']
    },

    farewell: {
      patterns: ['grazie', 'arrivederci', 'ciao', 'basta', 'chiudi', 'stop'],
      responses: [
        'Prego! Sono sempre qui se hai bisogno. Buona giornata!',
        'È stato un piacere aiutarti! Torna quando vuoi, sono sempre disponibile.',
        'Alla prossima! Ricorda che puoi sempre cliccare sull\'icona del chatbot per chiedere aiuto.'
      ]
    }
  },

  // Aiuto contestuale per ogni pagina
  contextualHelp: {
    '/': 'Benvenuto in Servizi Facili 50+! Da qui puoi accedere a tutti i servizi pubblici. Vuoi che ti mostri come navigare?',
    '/servizi': 'Perfetto! Qui ci sono tutti i servizi disponibili. Quale ti interessa? Posso guidarti passo passo.',
    '/glossario': 'Ottimo posto per imparare! Qui puoi cercare il significato di qualsiasi termine tecnico. Scrivi una parola che non capisci.',
    '/service/inps': 'Sei nella sezione INPS per le pensioni. Vuoi aiuto con la domanda di pensione o altre prestazioni?',
    '/service/sanita': 'Sei nei servizi sanitari di Puglia Salute. Posso aiutarti con prenotazioni, referti o pagamenti.',
    '/service/fisco': 'Sei nell\'Agenzia delle Entrate. Ti aiuto con il 730, cassetto fiscale o invio documenti?',
    '/service/poste': 'Sei in Poste Italiane. Vuoi aiuto con PosteID, cedolini o pagamenti online?',
    '/service/bcc': 'Sei nei servizi BCC. Ti aiuto con RelaxBanking o informazioni sui prodotti?',
    '/service/inail': 'Sei in INAIL. Posso aiutarti con denunce di infortunio o consultazione pratiche?',
    '/guide': 'Stai leggendo la guida completa. Se hai domande specifiche, chiedimi pure!',
    '/profilo': 'Sei nella sezione profilo. Hai bisogno di aiuto per registrarti o accedere?'
  },

  // FAQ predefinite
  faq: {
    'cos\'è spid': 'Lo SPID è la tua identità digitale per accedere ai servizi pubblici online. È come una carta d\'identità per internet, sicura e facile da usare.',
    'come ottenere spid': 'Il modo più semplice è andare alle Poste con documento d\'identità e tessera sanitaria. Ti fanno tutto loro in 10 minuti!',
    'password dimenticata': 'Se hai dimenticato la password, cerca il link "Password dimenticata" nella pagina di login. Ti manderanno un\'email per cambiarla.',
    'sito lento': 'Se il sito è lento, prova a ricaricare la pagina (tasto F5) o controlla la tua connessione internet.',
    'non riesco ad accedere': 'Per accedere ai servizi pubblici serve SPID, CIE o CNS. Se non li hai, posso spiegarti come ottenerli.',
    'è sicuro': 'Sì, tutti i servizi che ti mostro sono ufficiali e sicuri. Riconosci i siti veri dal lucchetto verde e dall\'indirizzo che finisce con .gov.it',
    'serve pagare': 'No, tutti i servizi pubblici sono gratuiti. Se ti chiedono soldi per accedere, è una truffa!',
    'posso fidarmi': 'Assolutamente sì! Ti guido solo verso i siti ufficiali degli enti pubblici. Sono tutti sicuri e verificati.'
  },

  // Azioni rapide
  quickActions: {
    'vai_inps': { text: '🏛️ Vai a INPS', action: 'navigateToINPS' },
    'vai_sanita': { text: '🏥 Vai a Sanità', action: 'navigateToHealth' },
    'vai_fisco': { text: '💰 Vai a Fisco', action: 'navigateToTaxes' },
    'vai_poste': { text: '📮 Vai a Poste', action: 'navigateToPoste' },
    'glossario': { text: '📚 Apri Glossario', action: 'navigateToGlossary' },
    'guida': { text: '📖 Leggi Guida', action: 'navigateToGuide' }
  }
};

export default chatbotRules;
