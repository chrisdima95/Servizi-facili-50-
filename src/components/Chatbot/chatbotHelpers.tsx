// src/data/chatbotHelpers.ts
export const chatbotHelpers = {
  // Frasi di incoraggiamento per anziani
  encouragement: [
    "Non preoccuparti, è normale sentirsi confusi all'inizio. Ci sono qui per aiutarti!",
    "Stai andando benissimo! Passo dopo passo arriviamo alla soluzione.",
    "Perfetto! Vedo che stai imparando velocemente.",
    "Ottimo lavoro! Continua così.",
    "Non c'è fretta, prendiamoci tutto il tempo che serve.",
    "Bravo! Hai capito perfettamente.",
    "Eccellente! Sei sulla strada giusta."
  ],

  // Spiegazioni semplificate per termini comuni
  simpleExplanations: {
    'browser': 'Il browser è il programma che usi per navigare su internet, come quando apri Google o Facebook.',
    'password': 'La password è come la chiave di casa: serve per entrare nei tuoi account in modo sicuro.',
    'email': 'L\'email è come una lettera digitale che invii e ricevi attraverso internet.',
    'download': 'Scaricare significa copiare un file da internet al tuo computer o telefono.',
    'wifi': 'Il Wi-Fi è la connessione internet senza fili, come la radio ma per internet.',
    'app': 'Un\'app è un piccolo programma sul telefono, come WhatsApp o il meteo.',
    'account': 'Un account è il tuo "profilo" su un sito, con il tuo nome e le tue informazioni.',
    'link': 'Un link è come un ponte: cliccandoci sopra vai in un\'altra pagina internet.'
  },

  // Consigli di sicurezza specifici per anziani
  securityTips: [
    "🔒 Non condividere mai le tue password, nemmeno con familiari fidati.",
    "📧 Se ricevi email sospette dall'INPS o altri enti, non cliccare sui link. Vai sempre direttamente al sito ufficiale.",
    "💳 Non inserire mai dati della carta di credito se non sei sicuro al 100% del sito.",
    "📱 Se qualcuno ti chiama dicendo di essere della banca, riaggancia e chiama tu il numero ufficiale.",
    "🔍 I siti sicuri hanno sempre il lucchetto verde nell'indirizzo e finiscono con .gov.it per gli enti pubblici.",
    "👥 Se hai dubbi, chiedi sempre aiuto a un familiare o vieni in ufficio di persona."
  ],

  // Messaggi di supporto emotivo
  emotionalSupport: [
    "Capisco che la tecnologia possa sembrare complicata, ma tu stai facendo benissimo!",
    "Non ti preoccupare se sbagli, è così che si impara. Io sono qui per aiutarti.",
    "Ogni piccolo passo è un progresso. Sei più bravo di quanto pensi!",
    "È normale aver bisogno di tempo per abituarsi. Non c'è fretta.",
    "Ricorda: non esistono domande stupide. Chiedi pure tutto quello che vuoi!"
  ],

  // Suggerimenti pratici per l'uso del computer
  practicalTips: [
    "💡 Tieni sempre a portata di mano carta e penna per annotare i passaggi importanti.",
    "🖱️ Se il mouse ti dà problemi, prova a muoverlo più lentamente e con movimenti piccoli.",
    "⌨️ Per scrivere le lettere maiuscole, tieni premuto il tasto Shift mentre digiti la lettera.",
    "🔍 Se il testo è troppo piccolo, premi Ctrl e + insieme per ingrandirlo.",
    "💾 Salva sempre il tuo lavoro spesso, premendo Ctrl e S insieme.",
    "🔄 Se una pagina non si carica, prova a premere F5 per ricaricarla."
  ]
};

// Funzione per ottenere un messaggio casuale da una categoria
export const getRandomMessage = (category: keyof typeof chatbotHelpers): string => {
  const messages = chatbotHelpers[category];
  if (Array.isArray(messages)) {
    return messages[Math.floor(Math.random() * messages.length)];
  }
  return '';
};

// Funzione per rilevare frustrazione nell'input dell'utente
export const detectFrustration = (input: string): boolean => {
  const frustrationWords = [
    'non funziona', 'non riesco', 'non capisco', 'è difficile', 
    'non so', 'aiuto', 'confuso', 'complicato', 'impossibile',
    'non ce la faccio', 'troppo difficile', 'non va'
  ];
  
  const lowerInput = input.toLowerCase();
  return frustrationWords.some(word => lowerInput.includes(word));
};

// Funzione per rilevare successo/soddisfazione
export const detectSuccess = (input: string): boolean => {
  const successWords = [
    'grazie', 'perfetto', 'ottimo', 'bene', 'funziona', 
    'ce l\'ho fatta', 'risolto', 'capito', 'chiaro'
  ];
  
  const lowerInput = input.toLowerCase();
  return successWords.some(word => lowerInput.includes(word));
};

export default chatbotHelpers;
