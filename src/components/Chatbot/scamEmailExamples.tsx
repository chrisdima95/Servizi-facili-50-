// Rilevamento email scam: database di esempi e algoritmo per identificare email pericolose/sospette

export interface ScamEmailExample {
  id: string;
  title: string;
  content: string;
  riskLevel: 'safe' | 'warning' | 'danger';
  description: string;
}

export const scamEmailExamples: ScamEmailExample[] = [
  {
    id: 'safe-1',
    title: 'Email Legittima - Banca',
    riskLevel: 'safe',
    description: 'Email sicura da una banca reale',
    content: `Oggetto: Aggiornamento servizi bancari

Gentile Cliente,

La informiamo che il nostro servizio online sarà temporaneamente non disponibile dalle ore 02:00 alle ore 06:00 del 15 marzo 2024 per manutenzione programmata.

Durante questo periodo non sarà possibile accedere all'home banking.

Per qualsiasi informazione, può contattarci al numero 800-123456.

Cordiali saluti,
Banca Italiana S.p.A.`
  },
  {
    id: 'safe-2',
    title: 'Email Legittima - Poste Italiane',
    riskLevel: 'safe',
    description: 'Email sicura da Poste Italiane',
    content: `Oggetto: Conferma spedizione pacchetto

Buongiorno,

Le confermiamo che il suo pacchetto con numero di tracciamento IT123456789 è stato consegnato con successo.

Il pacchetto è stato ricevuto da: Mario Rossi
Data di consegna: 12 marzo 2024, ore 14:30
Indirizzo: Via Roma 123, 00100 Roma

Grazie per aver scelto Poste Italiane.

Poste Italiane S.p.A.`
  },
  {
    id: 'warning-1',
    title: 'Email Sospetta - Promozione',
    riskLevel: 'warning',
    description: 'Email promozionale che potrebbe essere spam',
    content: `Oggetto: OFFERTA SPECIALE - Solo per te!

Ciao!

Hai vinto un premio speciale! 🎉

Clicca qui per riscattare il tuo regalo:
www.premio-gratis-italia.com

Attenzione: l'offerta scade tra 24 ore!

Non perdere questa opportunità unica.

Il Team Promozioni`
  },
  {
    id: 'warning-2',
    title: 'Email Sospetta - Investimenti',
    riskLevel: 'warning',
    description: 'Email promozionale su investimenti sospetta',
    content: `Oggetto: Guadagna 1000€ al giorno senza rischi

Gentile Signore/Signora,

Sono un consulente finanziario e ho una proposta che non può rifiutare!

I miei clienti guadagnano in media 1000€ al giorno con i nostri investimenti garantiti.

Per maggiori informazioni, risponda a questa email.

Dr. Marco Bianchi
Consulente Finanziario Indipendente
Tel: +39 333-1234567`
  },
  {
    id: 'danger-1',
    title: 'Email Scam - Phishing Banca',
    riskLevel: 'danger',
    description: 'Email di phishing che imita una banca',
    content: `Oggetto: URGENTE - Blocco account bancario

  ATTENZIONE: Il suo conto bancario è stato bloccato per motivi di sicurezza.

  Per riattivare l'account, deve immediatamente verificare i suoi dati:

  Clicchi su questo link: https://banca-italiana-verifica.com/login

  Inserisca:
  - Numero di carta
  - Codice PIN
  - Codice di sicurezza

  Se non compila entro 2 ore, il conto verrà chiuso definitivamente.

  Servizio Clienti Banca Italiana`
  },
  {
    id: 'danger-2',
    title: 'Email Scam - Premio Falso',
    riskLevel: 'danger',
    description: 'Email scam che promette premi inesistenti',
    content: `Oggetto: 🎉 CONGRATULAZIONI! Ha vinto 50.000€!

FELICITAZIONI!

È stato estratto come VINCITORE del nostro concorso "Sogni d'Oro"!

Ha vinto: 50.000€ in contanti!

Per ricevere il premio, deve:

1. Cliccare: www.concorso-premio-oro.net
2. Inserire i suoi dati personali
3. Pagare solo 29€ per le spese di gestione

Il premio sarà trasferito entro 48 ore!

ATTENZIONE: Offerta valida solo 24 ore!

Congratulazioni ancora!
Team Concorsi Italia`
  },
  {
    id: 'danger-3',
    title: 'Email Scam - SPID',
    riskLevel: 'danger',
    description: 'Email di phishing che imita servizi SPID',
    content: `Oggetto: URGENTE - Verifica identità SPID scaduta

Il suo SPID scadrà tra 3 giorni.

Per evitare la sospensione del servizio, deve verificare immediatamente la sua identità.

Clicchi qui per verificare: https://spid-verifica-identita.gov.it

Inserisca:
- Codice fiscale
- Numero di telefono
- Codice OTP ricevuto

IMPORTANTE: Se non verifica entro 24 ore, perderà l'accesso a tutti i servizi pubblici.

Agenzia per l'Italia Digitale`
  },
  {
    id: 'danger-4',
    title: 'Email Scam - INPS',
    riskLevel: 'danger',
    description: 'Email di phishing che imita INPS',
    content: `Oggetto: ERRORE nel calcolo della pensione - Azione richiesta

Gentile Iscritto,

È stato rilevato un errore nel calcolo della sua pensione.

Potrebbe aver ricevuto pagamenti non dovuti per un importo di 2.847€.

Per risolvere il problema:

1. Acceda al link: https://inps-pensione-correzione.it
2. Scarichi il modulo di rettifica
3. Inserisca i suoi dati bancari per il rimborso

Se non agisce entro 7 giorni, verrà avviata una procedura legale.

INPS - Istituto Nazionale Previdenza Sociale`
  },
  {
    id: 'danger-5',
    title: 'Email Scam - Amazon',
    riskLevel: 'danger',
    description: 'Email di phishing che imita Amazon',
    content: `Oggetto: Problema con il suo ordine #123456789

Caro Cliente Amazon,

Il suo ordine recente non può essere elaborato a causa di un problema con il metodo di pagamento.

Per completare l'ordine:

1. Clicchi: https://amazon-verifica-pagamento.com
2. Inserisca i dati della carta
3. Confermi l'ordine

IMPORTANTE: Se non agisce entro 2 ore, l'ordine verrà annullato.

Amazon Italia
Servizio Clienti`
  },
  {
    id: 'safe-3',
    title: 'Email Legittima - Comune',
    riskLevel: 'safe',
    description: 'Email sicura da un comune',
    content: `Oggetto: Avviso servizio TARI 2024

Gentile Cittadino,

Le comunichiamo che è disponibile il nuovo avviso di pagamento TARI per l'anno 2024.

Può consultare e pagare l'importo accedendo al portale del Comune:
www.comune.roma.it/servizi-online

Importo dovuto: € 287,50
Scadenza: 31 marzo 2024

Per informazioni: 06-1234567

Ufficio Tributi
Comune di Roma`
  }
];

// Funzione per rilevare parole chiave di scam
export const detectScamKeywords = (emailText: string): 'safe' | 'warning' | 'danger' => {
  const text = emailText.toLowerCase();
  
  // Parole chiave pericolose (scam diretti) - richiedono azione immediata o dati sensibili
  const dangerKeywords = [
    'clicca su questo link', 'urgente', 'blocco account', 'scadenza 24 ore',
    'verifica immediatamente', 'errore nel calcolo', 'problema con il pagamento',
    'spid-verifica', 'inps-pensione', 'amazon-verifica', 'banca-italiana-verifica',
    'dati bancari', 'password', 'codice pin', 'carta di credito', 'inserisca i suoi dati',
    'inserisca:', 'inserire i suoi dati', 'numero di carta', 'codice di sicurezza'
  ];
  
  // Parole chiave di warning (sospette/promozioni) - incluse quelle che erano in danger ma sono più promozionali
  const warningKeywords = [
    'clicca qui', 'ha vinto', 'premio', 'congratulazioni', 'offerta speciale',
    'investimenti', 'consulente finanziario', 'guadagna', 'opportunità',
    'offerta', 'promozione', 'regalo', 'concorso', 'scade tra', 'non perdere',
    'guadagna 1000€', 'senza rischi', 'garantito', 'solo per te', 'non può rifiutare'
  ];
  
  // Parole chiave sicure
  const safeKeywords = [
    'poste italiane', 'comune di', 'banca italiana', 'agenzia delle entrate',
    'manutenzione programmata', 'conferma spedizione', 'avviso di pagamento',
    'servizio clienti', 'numero verde', '800-', 'ufficio'
  ];
  
  // Conta le occorrenze
  let dangerCount = 0;
  let warningCount = 0;
  let safeCount = 0;
  
  dangerKeywords.forEach(keyword => {
    if (text.includes(keyword)) dangerCount++;
  });
  
  warningKeywords.forEach(keyword => {
    if (text.includes(keyword)) warningCount++;
  });
  
  safeKeywords.forEach(keyword => {
    if (text.includes(keyword)) safeCount++;
  });
  
  // Logica di decisione migliorata
  // Se ci sono keyword di pericolo (azioni immediate o dati sensibili), è pericolosa
  // Questo ha priorità anche se ci sono keyword sicure (phishing imita enti legittimi)
  if (dangerCount > 0) return 'danger';
  
  // Se ci sono keyword sicure e nessun pericolo, probabilmente è sicura
  if (safeCount > 0 && dangerCount === 0) return 'safe';
  
  // Se ci sono keyword di warning (promozioni sospette), è warning
  if (warningCount > 0) return 'warning';
  
  return 'safe';
};
