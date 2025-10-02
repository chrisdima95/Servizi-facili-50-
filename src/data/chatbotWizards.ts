// src/data/chatbotWizards.ts
export interface WizardStep {
  id: string;
  question: string;
  options?: string[];
  responses: Record<string, string>;
  nextStep?: Record<string, string>;
  actions?: Record<string, string[]>;
  isEnd?: boolean;
}

export interface Wizard {
  id: string;
  name: string;
  description: string;
  steps: Record<string, WizardStep>;
  startStep: string;
}

export const chatbotWizards: Record<string, Wizard> = {
  pension_application: {
    id: 'pension_application',
    name: 'Domanda di Pensione',
    description: 'Ti guido passo passo per fare la domanda di pensione INPS',
    startStep: 'check_spid',
    steps: {
      check_spid: {
        id: 'check_spid',
        question: 'Prima di tutto, hai già lo SPID per accedere al sito INPS?',
        options: ['Sì, ce l\'ho', 'No, non ce l\'ho', 'Non so cos\'è lo SPID'],
        responses: {
          'Sì, ce l\'ho': 'Perfetto! Allora possiamo procedere. Hai già tutti i documenti necessari?',
          'No, non ce l\'ho': 'Nessun problema! Ti spiego come ottenerlo facilmente.',
          'Non so cos\'è lo SPID': 'Lo SPID è la tua identità digitale per accedere ai servizi pubblici. Te lo spiego!'
        },
        nextStep: {
          'Sì, ce l\'ho': 'check_documents',
          'No, non ce l\'ho': 'get_spid',
          'Non so cos\'è lo SPID': 'explain_spid'
        }
      },
      
      explain_spid: {
        id: 'explain_spid',
        question: 'Lo SPID è come una carta d\'identità digitale. Ti permette di accedere a INPS, Agenzia delle Entrate e altri servizi con un\'unica password sicura. Vuoi che ti spieghi come ottenerlo?',
        options: ['Sì, spiegamelo', 'Forse più tardi', 'Ho capito, procediamo'],
        responses: {
          'Sì, spiegamelo': 'Il modo più semplice è andare alle Poste con documento e tessera sanitaria.',
          'Forse più tardi': 'Va bene! Quando sei pronto, torna qui e ti aiuto.',
          'Ho capito, procediamo': 'Ottimo! Allora per ora ti mostro cosa serve per la pensione.'
        },
        nextStep: {
          'Sì, spiegamelo': 'get_spid',
          'Forse più tardi': 'end_later',
          'Ho capito, procediamo': 'check_documents'
        }
      },
      
      get_spid: {
        id: 'get_spid',
        question: 'Per ottenere SPID facilmente, vai alle Poste con documento d\'identità e tessera sanitaria. Ti fanno tutto in 10 minuti! Vuoi che ti porti alla pagina di Poste per vedere i dettagli?',
        options: ['Sì, portami alle Poste', 'Preferisco altri modi', 'Torno dopo aver fatto SPID'],
        responses: {
          'Sì, portami alle Poste': 'Ti porto alla sezione Poste dove trovi tutte le informazioni per PosteID!',
          'Preferisco altri modi': 'Puoi anche usare altri provider come Aruba, Sielte, o InfoCert. Ma Poste è il più semplice per chi non è pratico.',
          'Torno dopo aver fatto SPID': 'Perfetto! Quando hai SPID, torna qui e ti guido nella domanda di pensione.'
        },
        actions: {
          'Sì, portami alle Poste': ['navigateToPoste', 'highlightPosteid']
        },
        nextStep: {
          'Sì, portami alle Poste': 'end_poste',
          'Preferisco altri modi': 'other_spid',
          'Torno dopo aver fatto SPID': 'end_later'
        }
      },
      
      check_documents: {
        id: 'check_documents',
        question: 'Ottimo! Per la domanda di pensione ti servono: documento d\'identità, codice fiscale, e le tue certificazioni contributive. Hai tutto?',
        options: ['Sì, ho tutto', 'Non sono sicuro', 'Cosa sono le certificazioni contributive?'],
        responses: {
          'Sì, ho tutto': 'Perfetto! Ora ti porto alla pagina INPS e ti spiego esattamente cosa fare.',
          'Non sono sicuro': 'Non preoccuparti! Ti spiego cosa serve esattamente.',
          'Cosa sono le certificazioni contributive?': 'Sono i documenti che mostrano i tuoi anni di lavoro e contributi versati.'
        },
        nextStep: {
          'Sì, ho tutto': 'go_to_inps',
          'Non sono sicuro': 'explain_documents',
          'Cosa sono le certificazioni contributive?': 'explain_contributions'
        }
      },
      
      explain_documents: {
        id: 'explain_documents',
        question: 'Ti servono: 1) Documento d\'identità valido, 2) Codice fiscale, 3) Certificazioni dei contributi versati (li trovi online o li richiedi all\'INPS). Hai almeno documento e codice fiscale?',
        options: ['Sì, quelli li ho', 'Devo controllare', 'Come ottengo le certificazioni?'],
        responses: {
          'Sì, quelli li ho': 'Bene! Per le certificazioni contributive, le puoi vedere direttamente online sul sito INPS.',
          'Devo controllare': 'Va bene, controlla e torna quando hai tutto pronto.',
          'Come ottengo le certificazioni?': 'Le certificazioni le trovi nel tuo "Estratto Conto Contributivo" sul sito INPS.'
        },
        nextStep: {
          'Sì, quelli li ho': 'go_to_inps',
          'Devo controllare': 'end_later',
          'Come ottengo le certificazioni?': 'explain_contributions'
        }
      },
      
      go_to_inps: {
        id: 'go_to_inps',
        question: 'Perfetto! Ora ti porto alla sezione INPS. Una volta lì, clicca su "Domanda pensione" e segui la procedura guidata. Sei pronto?',
        options: ['Sì, andiamo!', 'Aspetta, ho altre domande', 'Preferisco farlo più tardi'],
        responses: {
          'Sì, andiamo!': 'Eccellente! Ti porto alla pagina INPS. Ricorda: usa SPID per accedere e segui passo passo le istruzioni.',
          'Aspetta, ho altre domande': 'Certo! Dimmi pure cosa vuoi sapere.',
          'Preferisco farlo più tardi': 'Va benissimo! Quando sei pronto, torna qui e ripartiamo da dove abbiamo lasciato.'
        },
        actions: {
          'Sì, andiamo!': ['navigateToINPS', 'highlightPensionButton']
        },
        nextStep: {
          'Sì, andiamo!': 'end_success',
          'Aspetta, ho altre domande': 'more_questions',
          'Preferisco farlo più tardi': 'end_later'
        }
      },
      
      end_success: {
        id: 'end_success',
        question: 'Sei nella pagina INPS! Clicca su "Domanda pensione" (che ho evidenziato) e segui le istruzioni. Se hai problemi, torna qui e chiedimi aiuto!',
        isEnd: true,
        responses: {},
        options: []
      },
      
      end_later: {
        id: 'end_later',
        question: 'Va bene! Quando sei pronto, scrivi "domanda pensione" e ricominceremo da dove abbiamo lasciato. Sono sempre qui per aiutarti!',
        isEnd: true,
        responses: {},
        options: []
      }
    }
  },

  health_booking: {
    id: 'health_booking',
    name: 'Prenotazione Visita Medica',
    description: 'Ti aiuto a prenotare una visita su Puglia Salute',
    startStep: 'check_spid_health',
    steps: {
      check_spid_health: {
        id: 'check_spid_health',
        question: 'Per prenotare su Puglia Salute serve lo SPID. Ce l\'hai?',
        options: ['Sì', 'No', 'Non so cos\'è'],
        responses: {
          'Sì': 'Perfetto! Che tipo di visita devi prenotare?',
          'No': 'Ti spiego come ottenerlo facilmente alle Poste.',
          'Non so cos\'è': 'Lo SPID è la tua identità digitale per i servizi pubblici.'
        },
        nextStep: {
          'Sì': 'visit_type',
          'No': 'get_spid_health',
          'Non so cos\'è': 'explain_spid_health'
        }
      },
      
      visit_type: {
        id: 'visit_type',
        question: 'Che tipo di visita devi prenotare?',
        options: ['Visita specialistica', 'Esami diagnostici', 'Non sono sicuro'],
        responses: {
          'Visita specialistica': 'Ottimo! Ti porto a Puglia Salute nella sezione prenotazioni.',
          'Esami diagnostici': 'Perfetto! Ti guido alla sezione esami di Puglia Salute.',
          'Non sono sicuro': 'Nessun problema! Su Puglia Salute puoi cercare per sintomo o specialista.'
        },
        actions: {
          'Visita specialistica': ['navigateToHealth', 'highlightBooking'],
          'Esami diagnostici': ['navigateToHealth', 'highlightBooking'],
          'Non sono sicuro': ['navigateToHealth', 'highlightBooking']
        },
        nextStep: {
          'Visita specialistica': 'end_health_success',
          'Esami diagnostici': 'end_health_success',
          'Non sono sicuro': 'end_health_success'
        }
      },
      
      end_health_success: {
        id: 'end_health_success',
        question: 'Sei su Puglia Salute! Accedi con SPID e cerca la prestazione che ti serve. Se hai problemi, torna qui!',
        isEnd: true,
        responses: {},
        options: []
      }
    }
  },

  spid_setup: {
    id: 'spid_setup',
    name: 'Ottenere SPID',
    description: 'Ti guido per ottenere SPID nel modo più semplice',
    startStep: 'spid_method',
    steps: {
      spid_method: {
        id: 'spid_method',
        question: 'Qual è il modo più comodo per te per ottenere SPID?',
        options: ['Andare alle Poste', 'Online da casa', 'Non so quale scegliere'],
        responses: {
          'Andare alle Poste': 'Ottima scelta! È il modo più semplice e sicuro.',
          'Online da casa': 'Perfetto! Con PosteID puoi attivare SPID online tramite videochiamata o usando l\'app PosteID. Ti serve documento d\'identità valido e tessera sanitaria. Ti porto alla pagina con tutte le modalità disponibili!',
          'Non so quale scegliere': 'Ti consiglio le Poste: è più semplice e ti aiutano loro.'
        },
        nextStep: {
          'Andare alle Poste': 'poste_process',
          'Online da casa': 'online_process',
          'Non so quale scegliere': 'poste_process'
        }
      },
      
      poste_process: {
        id: 'poste_process',
        question: 'Alle Poste è semplicissimo: porti documento d\'identità e tessera sanitaria, loro fanno tutto in 10 minuti. Ti porto alla pagina con tutti i dettagli?',
        options: ['Sì, portami lì', 'Quali documenti servono esattamente?', 'Quanto costa?'],
        responses: {
          'Sì, portami lì': 'Ti porto alla sezione PosteID di Poste Italiane!',
          'Quali documenti servono esattamente?': 'Serve documento d\'identità valido e tessera sanitaria. Tutto qui!',
          'Quanto costa?': 'PosteID è gratuito! Non paghi nulla.'
        },
        actions: {
          'Sì, portami lì': ['navigateToPoste', 'highlightPosteid']
        },
        nextStep: {
          'Sì, portami lì': 'end_poste_success',
          'Quali documenti servono esattamente?': 'poste_documents',
          'Quanto costa?': 'poste_cost'
        }
      },
      
      online_process: {
        id: 'online_process',
        question: 'Per attivare SPID online con PosteID hai 3 opzioni: 1) Videochiamata con operatore, 2) App PosteID con riconoscimento automatico, 3) Upload documenti online. Tutte richiedono documento d\'identità e tessera sanitaria. Ti porto alla pagina PosteID?',
        options: ['Sì, portami alla pagina PosteID', 'Spiegami meglio le opzioni', 'Preferisco andare in ufficio postale'],
        responses: {
          'Sì, portami alla pagina PosteID': 'Ti porto alla sezione PosteID dove puoi scegliere la modalità online che preferisci!',
          'Spiegami meglio le opzioni': 'Videochiamata: parli con un operatore che verifica i tuoi documenti. App PosteID: fai selfie e foto documenti. Upload: carichi foto dei documenti e aspetti la verifica.',
          'Preferisco andare in ufficio postale': 'Ottima scelta! In ufficio postale è più semplice e ti aiutano direttamente.'
        },
        actions: {
          'Sì, portami alla pagina PosteID': ['navigateToPoste', 'highlightPosteid']
        },
        nextStep: {
          'Sì, portami alla pagina PosteID': 'end_online_success',
          'Spiegami meglio le opzioni': 'explain_online_options',
          'Preferisco andare in ufficio postale': 'poste_process'
        }
      },
      
      explain_online_options: {
        id: 'explain_online_options',
        question: 'Le modalità online sono: 1) Videochiamata (più facile, parli con una persona), 2) App PosteID (automatica ma serve smartphone), 3) Upload documenti (carichi foto e aspetti). Quale preferisci?',
        options: ['Videochiamata', 'App PosteID', 'Portami alla pagina e scelgo lì'],
        responses: {
          'Videochiamata': 'Ottima scelta! È come andare alle Poste ma da casa. Ti porto alla pagina per prenotare la videochiamata.',
          'App PosteID': 'Perfetto! Scarica l\'app PosteID, fai selfie e foto documenti. Ti porto alla pagina per iniziare.',
          'Portami alla pagina e scelgo lì': 'Perfetto! Nella pagina PosteID trovi tutte le opzioni spiegate nel dettaglio.'
        },
        actions: {
          'Videochiamata': ['navigateToPoste', 'highlightPosteid'],
          'App PosteID': ['navigateToPoste', 'highlightPosteid'],
          'Portami alla pagina e scelgo lì': ['navigateToPoste', 'highlightPosteid']
        },
        nextStep: {
          'Videochiamata': 'end_online_success',
          'App PosteID': 'end_online_success',
          'Portami alla pagina e scelgo lì': 'end_online_success'
        }
      },
      
      end_online_success: {
        id: 'end_online_success',
        question: 'Perfetto! Sei nella pagina PosteID. Scegli la modalità online che preferisci: videochiamata, app o upload documenti. Tutte portano allo stesso risultato: il tuo SPID!',
        isEnd: true,
        responses: {},
        options: []
      },
      
      end_poste_success: {
        id: 'end_poste_success',
        question: 'Perfetto! Qui trovi tutte le info per PosteID. Vai in un ufficio postale con documento e tessera sanitaria, e in 10 minuti hai SPID!',
        isEnd: true,
        responses: {},
        options: []
      }
    }
  }
};

export default chatbotWizards;
