// Regole e configurazione del chatbot: intenti, pattern matching, FAQ e risposte predefinite
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
      followUp: ['Puoi chiedermi di: pensioni, sanità, tasse, controllare email sospette, o spiegarti qualsiasi termine che non capisci.']
    },

    pension: {
      patterns: ['pensione', 'inps', 'pensionato', 'accompagnamento', 'invalidità'],
      responses: [
        'Per accedere ai servizi INPS devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_inps']
    },

    access_message_inps: {
      patterns: ['access_message_inps'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni INPS. Clicca su una di queste operazioni.'
      ],
      followUp: ['Domanda pensione', 'Indennità di accompagnamento agli invalidi civili', 'Assistenza domiciliare per non autosufficienti', 'Come ottenere SPID']
    },

    // Intenti specifici per le operazioni INPS
    pension_application_intent: {
      patterns: ['domanda pensione'],
      responses: [
        'Perfetto! Ti guido passo passo nella domanda di pensione INPS.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_inps']
    },

    health: {
      patterns: ['medico', 'visita', 'prenotazione', 'sanità', 'puglia salute', 'dottore', 'ospedale', 'referto'],
      responses: [
        'Per accedere ai servizi sanitari devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_health']
    },

    access_message_health: {
      patterns: ['access_message_health'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni sanitarie. Clicca su una di queste operazioni.'
      ],
      followUp: ['Gestione prenotazioni', 'Pagamento ticket', 'Referto on-line', 'Diario Vaccinazioni', 'Scelta/Revoca Medico']
    },

    // Intenti specifici per le operazioni Sanità
    health_booking_intent: {
      patterns: ['gestione prenotazioni'],
      responses: [
        'Perfetto! Ti guido passo passo per gestire le prenotazioni mediche.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_health']
    },

    taxes: {
      patterns: ['tasse', '730', 'fisco', 'agenzia entrate', 'cassetto fiscale'],
      responses: [
        'Per accedere ai servizi dell\'Agenzia delle Entrate devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_taxes']
    },

    access_message_taxes: {
      patterns: ['access_message_taxes'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni fiscali. Clicca su una di queste operazioni.'
      ],
      followUp: ['Cassetto fiscale', 'Dichiarazione precompilata', 'Consegna documenti e istanze', 'Come ottenere SPID']
    },

    // Intenti specifici per le operazioni Tasse
    tax_declaration_intent: {
      patterns: ['dichiarazione precompilata'],
      responses: [
        'Perfetto! Ti guido passo passo per la dichiarazione precompilata.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_taxes']
    },

    poste: {
      patterns: ['poste', 'spid', 'cedolino', 'pagamento', 'bollettino'],
      responses: [
        'Per accedere ai servizi di Poste Italiane devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_poste']
    },

    access_message_poste: {
      patterns: ['access_message_poste'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni di Poste Italiane. Clicca su una di queste operazioni.'
      ],
      followUp: ['Richiesta cedolino pensione', 'PosteID (attivazione SPID tramite Poste)', 'Pagamenti online', 'Come ottenere SPID']
    },

    // Intenti specifici per le operazioni Poste
    posteid_intent: {
      patterns: ['posteid (attivazione spid tramite poste)'],
      responses: [
        'Perfetto! Ti guido passo passo per attivare SPID tramite Poste.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_poste']
    },

    banking: {
      patterns: ['banca', 'bcc', 'conto', 'bonifico', 'homebanking'],
      responses: [
        'Per accedere ai servizi BCC devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_bcc']
    },

    access_message_bcc: {
      patterns: ['access_message_bcc'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni bancarie. Clicca su una di queste operazioni.'
      ],
      followUp: ['Trasparenza', 'Registrazione RelaxBanking', 'Informazioni prodotti', 'Altro aiuto']
    },

    // Intenti specifici per le operazioni BCC
    relaxbanking_intent: {
      patterns: ['registrazione relaxbanking'],
      responses: [
        'Perfetto! Ti guido passo passo per registrarti a RelaxBanking.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_bcc']
    },

    inail: {
      patterns: ['inail', 'infortunio', 'lavoro', 'prestazioni'],
      responses: [
        'Per accedere ai servizi INAIL devi prima fare l\'accesso alla web app. Ti sto portando alla pagina di accesso.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_inail']
    },

    access_message_inail: {
      patterns: ['access_message_inail'],
      responses: [
        'Perfetto, ti spiego tutto quello che devi sapere delle operazioni INAIL. Clicca su una di queste operazioni.'
      ],
      followUp: ['Denuncia infortunio', 'Consultazione pratiche', 'Prestazioni economiche', 'Altro aiuto']
    },

    // Intenti specifici per le operazioni INAIL
    accident_report_intent: {
      patterns: ['denuncia infortunio'],
      responses: [
        'Perfetto! Ti guido passo passo per denunciare un infortunio.'
      ],
      actions: ['navigateToProfile'],
      followUp: ['access_message_inail']
    },

    // Intenti per il rilevamento scam email
    scam_email_check: {
      patterns: ['mail scam', 'controlla email', 'email sospetta', 'phishing', 'truffa email'],
      responses: [
        'Perfetto! Ti aiuto a controllare se un\'email è sicura o potrebbe essere una truffa. Incolla qui il testo completo dell\'email che hai ricevuto e io ti dirò se è sicura, sospetta o pericolosa.'
      ],
      followUp: []
    },

    scam_email_another: {
      patterns: ['controlla altra email', 'altra email', 'controlla un\'altra email'],
      responses: [
        'Perfetto! Ti aiuto a controllare se un\'altra email è sicura o potrebbe essere una truffa. Incolla qui il testo completo dell\'email che hai ricevuto e io ti dirò se è sicura, sospetta o pericolosa.'
      ],
      followUp: []
    },

    scam_email_analysis: {
      patterns: ['scam_email_analysis'],
      responses: [
        'Analizzo l\'email...'
      ],
      followUp: []
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

    show_navigation: {
      patterns: ['si mostrami come navigare', 'sì mostrami come navigare', 'mostrami come navigare', 'come navigare', 'aiutami a navigare', 'si, mostrami', 'sì, mostrami'],
      responses: [
        'Perfetto! Ti spiego come navigare su Servizi Facili 50+:\n\n**In alto nella pagina trovi:**\n• **Home** - Torna alla pagina principale\n• **Servizi** - Tutti i servizi pubblici (INPS, Sanità, Fisco, ecc.) - *Visibile solo dopo aver fatto l\'accesso*\n• **Guide** - Istruzioni dettagliate per usare il sito\n• **👤 Profilo** - I tuoi dati personali e accesso\n\n**🔍 Barra di ricerca:**\nClicca sulla lente di ingrandimento per cercare quello che ti serve (es. "pensione" o "visita medica")\n\n**♿ Pulsanti di accessibilità:**\nIn basso a sinistra trovi pulsanti per:\n• Ingrandire il testo\n• Aumentare il contrasto\n• Modalità focus\n\n**💬 Assistente (questo chatbot):**\nClicca sull\'icona blu in basso a destra per parlarmi\n\nVuoi che ti mostri un servizio specifico? Clicca su una di queste operazioni.'
      ],
      followUp: ['Pensioni INPS', 'Sanità Puglia', 'Tasse e 730', 'Glossario termini', 'Mail scam']
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
    '/': 'Ciao! Sono il tuo assistente digitale\nSono qui per aiutarti a navigare tra i servizi pubblici online. Puoi chiedermi qualsiasi cosa!\n\nProva a chiedere:',
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
