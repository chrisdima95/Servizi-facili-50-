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
        question: 'Perfetto! Ti guido passo passo nella domanda di pensione INPS:',
        options: ['Iniziamo!', 'Ho altre domande', 'Fallo più tardi'],
        responses: {
          'Iniziamo!': 'Ottimo! Ti spiego esattamente cosa fare su INPS.',
          'Ho altre domande': 'Certo! Dimmi pure cosa vuoi sapere.',
          'Fallo più tardi': 'Va bene! Torna quando sei pronto.'
        },
        actions: {
          'Iniziamo!': ['navigateToINPS', 'highlightPensionButton']
        },
        nextStep: {
          'Iniziamo!': 'inps_detailed_guide',
          'Ho altre domande': 'more_questions',
          'Fallo più tardi': 'end_later'
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
          'Visita specialistica': 'Perfetto! Ti guido passo passo per prenotare una visita specialistica su Puglia Salute.',
          'Esami diagnostici': 'Ottimo! Ti spiego esattamente come prenotare esami diagnostici su Puglia Salute.',
          'Non sono sicuro': 'Nessun problema! Ti mostro come cercare quello che ti serve su Puglia Salute.'
        },
        nextStep: {
          'Visita specialistica': 'specialist_visit_guide',
          'Esami diagnostici': 'diagnostic_exams_guide',
          'Non sono sicuro': 'general_search_guide'
        }
      },
      
      specialist_visit_guide: {
        id: 'specialist_visit_guide',
        question: 'Ecco come prenotare una visita specialistica:\n\n1️⃣ Vai su Puglia Salute\n2️⃣ Clicca "Accedi con SPID"\n3️⃣ Inserisci le tue credenziali SPID\n4️⃣ Cerca "Prenotazioni"\n5️⃣ Seleziona "Nuova prenotazione"\n\nHai già l\'impegnativa del medico?',
        options: ['Sì, ce l\'ho', 'No, non ce l\'ho', 'Non so cos\'è'],
        responses: {
          'Sì, ce l\'ho': 'Perfetto! L\'impegnativa è fondamentale. Ora ti spiego i prossimi passi.',
          'No, non ce l\'ho': 'Ti serve l\'impegnativa del medico di base. Ti spiego come ottenerla.',
          'Non so cos\'è': 'L\'impegnativa è il "foglio rosa" che ti dà il medico per prescrivere la visita.'
        },
        actions: {
          'Sì, ce l\'ho': ['navigateToHealth', 'highlightBooking']
        },
        nextStep: {
          'Sì, ce l\'ho': 'booking_with_prescription',
          'No, non ce l\'ho': 'get_prescription',
          'Non so cos\'è': 'explain_prescription'
        }
      },
      
      booking_with_prescription: {
        id: 'booking_with_prescription',
        question: 'Ottimo! Ora segui questi passi:\n\n6️⃣ Inserisci il codice dell\'impegnativa (numero lungo)\n7️⃣ Seleziona la prestazione dall\'elenco\n8️⃣ Scegli la struttura sanitaria più vicina\n9️⃣ Seleziona data e orario disponibili\n🔟 Conferma la prenotazione\n\nRiceverai SMS con i dettagli. Tutto chiaro?',
        options: ['Sì, procedo', 'Ho bisogno di aiuto', 'Dove trovo il codice impegnativa?'],
        responses: {
          'Sì, procedo': 'Perfetto! Sei nella pagina giusta. Se hai problemi durante la prenotazione, torna qui.',
          'Ho bisogno di aiuto': 'Nessun problema! Posso spiegarti ogni singolo passaggio nel dettaglio.',
          'Dove trovo il codice impegnativa?': 'Il codice è sul foglio rosa del medico, di solito in alto a destra. È un numero lungo tipo "123456789".'
        },
        nextStep: {
          'Sì, procedo': 'end_booking_success',
          'Ho bisogno di aiuto': 'detailed_booking_help',
          'Dove trovo il codice impegnativa?': 'prescription_code_help'
        }
      },
      
      diagnostic_exams_guide: {
        id: 'diagnostic_exams_guide',
        question: 'Ti guido per prenotare esami diagnostici:\n\n1️⃣ Accedi a Puglia Salute con SPID\n2️⃣ Vai su "Prenotazioni" → "Esami diagnostici"\n3️⃣ Inserisci il codice dell\'impegnativa\n4️⃣ Seleziona il tipo di esame (es. analisi sangue, ecografia, TAC)\n\nChe tipo di esame devi prenotare?',
        options: ['Analisi del sangue', 'Ecografia', 'Radiografia', 'Altro esame'],
        responses: {
          'Analisi del sangue': 'Per le analisi del sangue: seleziona "Laboratorio" e poi il tipo specifico di analisi.',
          'Ecografia': 'Per l\'ecografia: scegli "Diagnostica per immagini" e poi la parte del corpo da esaminare.',
          'Radiografia': 'Per la radiografia: vai su "Radiologia" e seleziona la zona da radiografare.',
          'Altro esame': 'Nessun problema! Cerca il nome dell\'esame nell\'elenco o usa la barra di ricerca.'
        },
        nextStep: {
          'Analisi del sangue': 'blood_test_booking',
          'Ecografia': 'ultrasound_booking',
          'Radiografia': 'xray_booking',
          'Altro esame': 'other_exam_booking'
        }
      },
      
      blood_test_booking: {
        id: 'blood_test_booking',
        question: 'Per le analisi del sangue:\n\n5️⃣ Seleziona "Laboratorio Analisi"\n6️⃣ Scegli il laboratorio più vicino\n7️⃣ Controlla gli orari (di solito mattina a digiuno)\n8️⃣ Prenota il primo slot disponibile\n9️⃣ Conferma e salva il promemoria\n\n💡 Ricorda: digiuno da 8-12 ore prima del prelievo!',
        options: ['Ho prenotato', 'Non trovo slot liberi', 'Devo essere a digiuno?'],
        responses: {
          'Ho prenotato': 'Perfetto! Riceverai SMS di conferma. Ricorda di essere a digiuno e portare documento + tessera sanitaria.',
          'Non trovo slot liberi': 'Prova a guardare in laboratori un po\' più lontani o nei giorni successivi. Spesso si liberano posti.',
          'Devo essere a digiuno?': 'Sì, per la maggior parte delle analisi serve digiuno di 8-12 ore. Solo acqua è permessa.'
        },
        nextStep: {
          'Ho prenotato': 'end_booking_success',
          'Non trovo slot liberi': 'no_slots_help',
          'Devo essere a digiuno?': 'fasting_info'
        }
      },
      
      get_prescription: {
        id: 'get_prescription',
        question: 'Per ottenere l\'impegnativa:\n\n1️⃣ Prenota visita dal tuo medico di base\n2️⃣ Spiega che sintomi hai o che visita ti serve\n3️⃣ Il medico ti darà l\'impegnativa (foglio rosa)\n4️⃣ Torna qui quando ce l\'hai!\n\nAlternativamente puoi chiamare il medico e spiegare la situazione.',
        options: ['Come prenoto dal medico?', 'Posso chiamarlo?', 'Ho capito, torno dopo'],
        responses: {
          'Come prenoto dal medico?': 'Chiama il numero del tuo medico di base o vai direttamente nello studio negli orari di ricevimento.',
          'Posso chiamarlo?': 'Sì! Molti medici danno impegnative anche per telefono se ti conoscono e la richiesta è semplice.',
          'Ho capito, torno dopo': 'Perfetto! Quando hai l\'impegnativa, torna qui e ti guido nella prenotazione.'
        },
        nextStep: {
          'Come prenoto dal medico?': 'doctor_booking_help',
          'Posso chiamarlo?': 'phone_prescription_help',
          'Ho capito, torno dopo': 'end_later'
        }
      },
      
      end_booking_success: {
        id: 'end_booking_success',
        question: '🎉 Perfetto! Hai completato la prenotazione su Puglia Salute.\n\n📱 Riceverai SMS di conferma\n📋 Porta documento + tessera sanitaria\n⏰ Arriva 10 minuti prima\n💰 Ricorda di pagare il ticket se dovuto\n\nSe hai problemi, torna qui e chiedimi aiuto!',
        isEnd: true,
        responses: {},
        options: []
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
  },

  tax_declaration: {
    id: 'tax_declaration',
    name: 'Dichiarazione 730',
    description: 'Ti guido passo passo per fare il 730 precompilato',
    startStep: 'tax_start',
    steps: {
      tax_start: {
        id: 'tax_start',
        question: 'Ti aiuto con la dichiarazione dei redditi 730. Prima di tutto, hai già lo SPID per accedere all\'Agenzia delle Entrate?',
        options: ['Sì, ce l\'ho', 'No, non ce l\'ho', 'Cos\'è il 730?'],
        responses: {
          'Sì, ce l\'ho': 'Perfetto! Ora ti guido passo passo nel 730 precompilato.',
          'No, non ce l\'ho': 'Ti serve lo SPID per accedere. Ti spiego come ottenerlo.',
          'Cos\'è il 730?': 'Il 730 è la dichiarazione dei redditi semplificata. Ti permette di avere rimborsi o pagare tasse dovute.'
        },
        nextStep: {
          'Sì, ce l\'ho': 'tax_guide_start',
          'No, non ce l\'ho': 'get_spid_tax',
          'Cos\'è il 730?': 'explain_730'
        }
      },
      
      tax_guide_start: {
        id: 'tax_guide_start',
        question: 'Ecco come fare il 730 precompilato:\n\n1️⃣ Vai sul sito Agenzia delle Entrate\n2️⃣ Clicca "Accedi con SPID"\n3️⃣ Cerca "730 precompilato"\n4️⃣ Clicca "Accetta" per visualizzare la dichiarazione\n5️⃣ Controlla i dati precompilati\n\nHai mai fatto il 730 prima?',
        options: ['Sì, altre volte', 'No, è la prima volta', 'Cosa devo controllare?'],
        responses: {
          'Sì, altre volte': 'Ottimo! Allora sai già cosa aspettarti. Ti guido nei controlli principali.',
          'No, è la prima volta': 'Nessun problema! Ti spiego tutto passo passo, è più semplice di quanto pensi.',
          'Cosa devo controllare?': 'Devi verificare stipendi, spese mediche, mutuo casa, e altre detrazioni. Te lo spiego nel dettaglio.'
        },
        actions: {
          'Sì, altre volte': ['navigateToTaxes'],
          'No, è la prima volta': ['navigateToTaxes'],
          'Cosa devo controllare?': ['navigateToTaxes']
        },
        nextStep: {
          'Sì, altre volte': 'tax_experienced_guide',
          'No, è la prima volta': 'tax_beginner_guide',
          'Cosa devo controllare?': 'tax_check_guide'
        }
      },
      
      tax_beginner_guide: {
        id: 'tax_beginner_guide',
        question: 'Prima volta con il 730? Ti guido passo passo:\n\n6️⃣ Controlla i tuoi dati anagrafici\n7️⃣ Verifica lo stipendio (Quadro C)\n8️⃣ Aggiungi spese mediche se ne hai\n9️⃣ Inserisci spese per la casa (mutuo/affitto)\n🔟 Controlla il risultato (rimborso o debito)\n\nCosa vuoi controllare per primo?',
        options: ['Dati anagrafici', 'Stipendio', 'Spese mediche', 'Spese casa'],
        responses: {
          'Dati anagrafici': 'Controlla nome, cognome, codice fiscale, indirizzo. Se sono sbagliati, correggili.',
          'Stipendio': 'Nel Quadro C trovi lo stipendio dell\'anno scorso. Controlla che corrisponda alle tue buste paga.',
          'Spese mediche': 'Puoi detrarre visite mediche, farmaci, dentista. Inserisci l\'importo totale speso.',
          'Spese casa': 'Se hai mutuo o affitto, puoi avere detrazioni. Inserisci gli importi pagati.'
        },
        nextStep: {
          'Dati anagrafici': 'check_personal_data',
          'Stipendio': 'check_salary',
          'Spese mediche': 'add_medical_expenses',
          'Spese casa': 'add_house_expenses'
        }
      },
      
      add_medical_expenses: {
        id: 'add_medical_expenses',
        question: 'Per aggiungere spese mediche:\n\n📋 Raccogli tutte le ricevute mediche dell\'anno\n💊 Includi: visite, farmaci, dentista, oculista\n💰 Somma tutti gli importi\n📝 Inserisci il totale nel campo "Spese sanitarie"\n\n💡 Ricorda: si detraggono solo spese sopra i 129,11€',
        options: ['Ho inserito le spese', 'Non ho ricevute', 'Quanto posso detrarre?'],
        responses: {
          'Ho inserito le spese': 'Perfetto! Il sistema calcolerà automaticamente la detrazione del 19%.',
          'Non ho ricevute': 'Senza ricevute non puoi detrarre. Per il futuro, conserva sempre gli scontrini medici.',
          'Quanto posso detrarre?': 'Detrai il 19% delle spese sopra 129,11€. Es: 1000€ di spese = 19% di 870,89€ = 165€ di detrazione.'
        },
        nextStep: {
          'Ho inserito le spese': 'final_tax_check',
          'Non ho ricevute': 'no_receipts_advice',
          'Quanto posso detrarre?': 'deduction_calculation'
        }
      },
      
      final_tax_check: {
        id: 'final_tax_check',
        question: 'Controllo finale del 730:\n\n✅ Dati anagrafici corretti\n✅ Stipendio verificato\n✅ Spese inserite\n\nOra guarda il risultato:\n🟢 Se è positivo = RIMBORSO\n🔴 Se è negativo = DEVI PAGARE\n\nSei soddisfatto del risultato?',
        options: ['Sì, invio la dichiarazione', 'Voglio controllare ancora', 'Non capisco il risultato'],
        responses: {
          'Sì, invio la dichiarazione': 'Perfetto! Clicca "Invia dichiarazione" e riceverai la ricevuta. Il rimborso arriva in 2-3 mesi.',
          'Voglio controllare ancora': 'Saggia decisione! Ricontrolla tutto con calma. Puoi sempre tornare qui.',
          'Non capisco il risultato': 'Te lo spiego! Il numero finale indica se ricevi soldi (positivo) o devi pagarli (negativo).'
        },
        nextStep: {
          'Sì, invio la dichiarazione': 'tax_submission_success',
          'Voglio controllare ancora': 'recheck_tax',
          'Non capisco il risultato': 'explain_tax_result'
        }
      },
      
      tax_submission_success: {
        id: 'tax_submission_success',
        question: '🎉 Complimenti! Hai inviato il 730 con successo!\n\n📧 Riceverai email di conferma\n📋 Salva la ricevuta di invio\n💰 Se hai rimborso, arriva in 2-3 mesi\n💳 Se devi pagare, hai tempo fino a novembre\n\nBravo! Hai completato la dichiarazione dei redditi!',
        isEnd: true,
        responses: {},
        options: []
      }
    }
  }
};

export default chatbotWizards;
