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
          'Sì, ce l\'ho': 'Perfetto! Ora vediamo i documenti che ti servono.',
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
        question: 'Per la domanda di pensione ti servono questi documenti:\n\n📄 **Documento d\'identità** (carta d\'identità o patente)\n🏷️ **Codice fiscale** (tessera sanitaria va bene)\n📋 **Certificazioni contributive** (estratto conto INPS)\n\nHai già tutti questi documenti?',
        options: ['Sì, ho tutto', 'Non sono sicuro', 'Cosa sono le certificazioni contributive?'],
        responses: {
          'Sì, ho tutto': 'Ottimo! Procediamo con la domanda.',
          'Non sono sicuro': 'Non preoccuparti! Ti spiego nel dettaglio cosa serve.',
          'Cosa sono le certificazioni contributive?': 'Sono i documenti che mostrano tutti gli anni che hai lavorato e i contributi che hai versato. Li trovi online sul sito INPS.'
        },
        nextStep: {
          'Sì, ho tutto': 'go_to_inps',
          'Non sono sicuro': 'explain_documents',
          'Cosa sono le certificazioni contributive?': 'explain_contributions'
        }
      },
      
      explain_documents: {
        id: 'explain_documents',
        question: 'Ti spiego nel dettaglio:\n\n📄 **Documento d\'identità**: carta d\'identità, patente o passaporto (deve essere valido)\n🏷️ **Codice fiscale**: la tessera sanitaria va benissimo\n📋 **Certificazioni contributive**: sono i documenti che mostrano i tuoi anni di lavoro\n\nHai almeno documento d\'identità e codice fiscale?',
        options: ['Sì, quelli li ho', 'Devo controllare', 'Come ottengo le certificazioni?'],
        responses: {
          'Sì, quelli li ho': 'Bene! Procediamo con la domanda.',
          'Devo controllare': 'Va bene, controlla con calma e torna quando hai tutto pronto.',
          'Come ottengo le certificazioni?': 'Te lo spiego subito!'
        },
        nextStep: {
          'Sì, quelli li ho': 'go_to_inps',
          'Devo controllare': 'end_later',
          'Come ottengo le certificazioni?': 'explain_contributions'
        }
      },
      
      go_to_inps: {
        id: 'go_to_inps',
        question: 'Perfetto! Ti guido passo passo nella domanda di pensione INPS:',
        options: ['Iniziamo!', 'Ho altre domande', 'Fallo più tardi'],
        responses: {
          'Iniziamo!': 'Ottimo! Prima ti porto alla sezione Profilo per accedere all\'app.',
          'Ho altre domande': 'Certo! Dimmi pure cosa vuoi sapere.',
          'Fallo più tardi': 'Va bene! Torna quando sei pronto.'
        },
        actions: {
          'Iniziamo!': ['navigateToProfile']
        },
        nextStep: {
          'Iniziamo!': 'login_step',
          'Ho altre domande': 'more_questions',
          'Fallo più tardi': 'end_later'
        }
      },
      
      login_step: {
        id: 'login_step',
        question: 'Ora sei nella sezione Profilo! Effettua l\'accesso alla web app con le tue credenziali.\n\nHai completato l\'accesso?',
        options: ['Sì, ho fatto l\'accesso', 'Ho problemi con l\'accesso', 'Non ricordo le credenziali'],
        responses: {
          'Sì, ho fatto l\'accesso': 'Ottimo! Prima ti porto alla sezione Servizi della nostra app.',
          'Ho problemi con l\'accesso': 'Nessun problema! Ti aiuto con l\'accesso.',
          'Non ricordo le credenziali': 'Ti aiuto a recuperare le credenziali.'
        },
        actions: {
          'Sì, ho fatto l\'accesso': ['navigateToServices']
        },
        nextStep: {
          'Sì, ho fatto l\'accesso': 'navigate_to_pension',
          'Ho problemi con l\'accesso': 'help_login',
          'Non ricordo le credenziali': 'recover_credentials'
        }
      },
      
      navigate_to_pension: {
        id: 'navigate_to_pension',
        question: 'Ora sei nella pagina Servizi! Segui questi passaggi:\n\n1️⃣ **Clicca su "Pensioni (INPS)"** per aprire il servizio\n2️⃣ **Clicca su "Domanda pensione"** nell\'elenco delle operazioni\n3️⃣ **Clicca su "Vai al sito ufficiale"** per aprire il sito INPS\n\nHai completato questi passaggi?',
        options: ['Sì, sono sul sito INPS', 'Non trovo "Pensioni (INPS)"', 'Ho bisogno di aiuto'],
        responses: {
          'Sì, sono sul sito INPS': 'Ottimo! Procediamo con la domanda.',
          'Non trovo "Pensioni (INPS)"': 'Nessun problema! Guarda nella pagina Servizi, dovrebbe essere la prima card con l\'icona INPS.',
          'Ho bisogno di aiuto': 'Ti aiuto io! Segui i passaggi uno alla volta.'
        },
        actions: {
          'Sì, sono sul sito INPS': ['navigateToINPS']
        },
        nextStep: {
          'Sì, sono sul sito INPS': 'inps_detailed_guide',
          'Non trovo "Pensioni (INPS)"': 'help_find_inps',
          'Ho bisogno di aiuto': 'help_navigation'
        }
      },
      
      help_find_inps: {
        id: 'help_find_inps',
        question: 'Ti aiuto a trovare il servizio INPS:\n\n🔍 Nella pagina Servizi, cerca una card con:\n• **Titolo**: "Pensioni (INPS)"\n• **Icona**: Logo INPS\n• **Descrizione**: parla di pensioni e domande\n\nL\'hai trovata?',
        options: ['Sì, l\'ho trovata', 'No, non la vedo', 'Portami direttamente lì'],
        responses: {
          'Sì, l\'ho trovata': 'Ottimo! Ora clicca su "Apri servizio" per continuare.',
          'No, non la vedo': 'Ti porto direttamente alla sezione INPS.',
          'Portami direttamente lì': 'Ti porto subito alla sezione INPS!'
        },
        actions: {
          'No, non la vedo': ['navigateToINPS'],
          'Portami direttamente lì': ['navigateToINPS']
        },
        nextStep: {
          'Sì, l\'ho trovata': 'navigate_to_pension',
          'No, non la vedo': 'select_pension_operation',
          'Portami direttamente lì': 'select_pension_operation'
        }
      },
      
      select_pension_operation: {
        id: 'select_pension_operation',
        question: 'Perfetto! Ora sei nella sezione INPS. Segui questi passaggi:\n\n1️⃣ **Clicca su "Domanda pensione"** nell\'elenco delle operazioni\n2️⃣ **Clicca su "Vai al sito ufficiale"** per aprire il sito INPS\n\nHai completato questi passaggi?',
        options: ['Sì, sono sul sito INPS', 'Non trovo "Domanda pensione"', 'Portami direttamente alla guida'],
        responses: {
          'Sì, sono sul sito INPS': 'Ottimo! Procediamo con la domanda.',
          'Non trovo "Domanda pensione"': 'Dovrebbe essere la prima operazione nell\'elenco. Ti porto direttamente lì.',
          'Portami direttamente alla guida': 'Ti porto subito alla guida per la domanda di pensione!'
        },
        actions: {
          'Non trovo "Domanda pensione"': ['navigateToPensionApplication'],
          'Portami direttamente alla guida': ['navigateToPensionApplication']
        },
        nextStep: {
          'Sì, sono sul sito INPS': 'inps_detailed_guide',
          'Non trovo "Domanda pensione"': 'final_inps_guide',
          'Portami direttamente alla guida': 'final_inps_guide'
        }
      },
      
      final_inps_guide: {
        id: 'final_inps_guide',
        question: 'Perfetto! Ora sei nella guida per la domanda di pensione. Leggi attentamente le istruzioni e i consigli utili, poi clicca su "Vai al sito ufficiale" per aprire il sito INPS.\n\nSei pronto per procedere sul sito INPS?',
        options: ['Sì, sono pronto', 'Voglio rileggere la guida', 'Ho altre domande'],
        responses: {
          'Sì, sono pronto': 'Ottimo! Ora ti spiego cosa fare sul sito INPS.',
          'Voglio rileggere la guida': 'Perfetto! Prenditi tutto il tempo che ti serve per leggere la guida.',
          'Ho altre domande': 'Certo! Dimmi pure cosa vuoi sapere.'
        },
        nextStep: {
          'Sì, sono pronto': 'inps_detailed_guide',
          'Voglio rileggere la guida': 'final_inps_guide',
          'Ho altre domande': 'more_questions'
        }
      },
      
      inps_detailed_guide: {
        id: 'inps_detailed_guide',
        question: 'Ecco la procedura completa per la domanda di pensione:\n\n1️⃣ Clicca "Accedi con SPID" sul sito INPS\n2️⃣ Inserisci le tue credenziali SPID\n3️⃣ Cerca "Domanda di pensione" nel menu\n4️⃣ Clicca "Nuova domanda"\n5️⃣ Compila i dati anagrafici (già precompilati)\n\nSei riuscito ad accedere con SPID?',
        options: ['Sì, sono dentro', 'Non riesco ad accedere', 'Non trovo "Domanda pensione"'],
        responses: {
          'Sì, sono dentro': 'Perfetto! Ora ti guido nella compilazione della domanda.',
          'Non riesco ad accedere': 'Nessun problema! Ti aiuto con l\'accesso SPID.',
          'Non trovo "Domanda pensione"': 'Te lo mostro! Guarda nella sezione "Prestazioni e Servizi" o usa la ricerca.'
        },
        nextStep: {
          'Sì, sono dentro': 'pension_form_guide',
          'Non riesco ad accedere': 'spid_access_help',
          'Non trovo "Domanda pensione"': 'find_pension_section'
        }
      },
      
      pension_form_guide: {
        id: 'pension_form_guide',
        question: 'Ora compila la domanda:\n\n6️⃣ Controlla i dati anagrafici (nome, cognome, CF)\n7️⃣ Inserisci i dati contributivi (anni di lavoro)\n8️⃣ Seleziona il tipo di pensione (vecchiaia/anticipata)\n9️⃣ Allega documenti se richiesti (PDF)\n🔟 Controlla tutto e invia\n\nA che punto sei?',
        options: ['Sto compilando', 'Non capisco i dati contributivi', 'Come allego documenti?'],
        responses: {
          'Sto compilando': 'Ottimo! Prenditi il tempo necessario. Se hai dubbi, torna qui.',
          'Non capisco i dati contributivi': 'I dati contributivi sono gli anni che hai lavorato e versato contributi. Li trovi nell\'estratto conto.',
          'Come allego documenti?': 'Clicca "Allega file", seleziona il PDF dal computer e caricalo. Massimo 5MB per file.'
        },
        nextStep: {
          'Sto compilando': 'final_submission',
          'Non capisco i dati contributivi': 'contributory_data_help',
          'Come allego documenti?': 'document_upload_help'
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
      },
      
      help_login: {
        id: 'help_login',
        question: 'Ti aiuto con l\'accesso! Ecco cosa fare:\n\n1️⃣ Inserisci email e password\n2️⃣ Se non funziona, controlla di aver scritto bene\n3️⃣ Se hai dimenticato la password, clicca "Password dimenticata"\n\nRiesci ad accedere ora?',
        options: ['Sì, ora funziona', 'No, ancora problemi', 'Ho dimenticato la password'],
        responses: {
          'Sì, ora funziona': 'Ottimo! Prima ti porto alla sezione Servizi della nostra app.',
          'No, ancora problemi': 'Nessun problema! Proviamo un altro modo.',
          'Ho dimenticato la password': 'Ti aiuto a recuperarla!'
        },
        actions: {
          'Sì, ora funziona': ['navigateToServices']
        },
        nextStep: {
          'Sì, ora funziona': 'navigate_to_pension',
          'No, ancora problemi': 'login_troubleshoot',
          'Ho dimenticato la password': 'recover_credentials'
        }
      },
      
      recover_credentials: {
        id: 'recover_credentials',
        question: 'Per recuperare la password:\n\n1️⃣ Clicca "Password dimenticata" nella pagina di login\n2️⃣ Inserisci la tua email\n3️⃣ Controlla la posta (anche spam)\n4️⃣ Clicca il link nell\'email\n5️⃣ Crea una nuova password\n\nHai ricevuto l\'email?',
        options: ['Sì, ho recuperato la password', 'Non arriva l\'email', 'Non ricordo l\'email'],
        responses: {
          'Sì, ho recuperato la password': 'Perfetto! Ora prova ad accedere.',
          'Non arriva l\'email': 'Controlla nella cartella spam. A volte finisce lì.',
          'Non ricordo l\'email': 'Prova con le email che usi di solito: Gmail, Libero, ecc.'
        },
        nextStep: {
          'Sì, ho recuperato la password': 'login_step',
          'Non arriva l\'email': 'email_troubleshoot',
          'Non ricordo l\'email': 'email_help'
        }
      },
      
      login_troubleshoot: {
        id: 'login_troubleshoot',
        question: 'Proviamo così:\n\n✅ Controlla che Caps Lock sia spento\n✅ Prova a copiare e incollare la password\n✅ Usa un browser diverso (Chrome, Firefox)\n✅ Cancella cache e cookie\n\nSe ancora non funziona, potresti aver bisogno di aiuto tecnico. Vuoi che ti dia il numero di supporto?',
        options: ['Ora funziona!', 'Dammi il supporto tecnico', 'Riprovo più tardi'],
        responses: {
          'Ora funziona!': 'Ottimo! Prima ti porto alla sezione Servizi della nostra app.',
          'Dammi il supporto tecnico': 'Chiama il numero verde: 800-XXX-XXX (lun-ven 9-18). Sono molto gentili!',
          'Riprovo più tardi': 'Va bene! Torna quando vuoi, sono sempre qui.'
        },
        actions: {
          'Ora funziona!': ['navigateToServices']
        },
        nextStep: {
          'Ora funziona!': 'navigate_to_pension',
          'Dammi il supporto tecnico': 'end_support',
          'Riprovo più tardi': 'end_later'
        }
      },
      
      end_support: {
        id: 'end_support',
        question: 'Chiama il supporto tecnico e ti aiuteranno subito! Quando hai risolto, torna qui e ricominceremo.',
        isEnd: true,
        responses: {},
        options: []
      }
    }
  }
};

export default chatbotWizards;
