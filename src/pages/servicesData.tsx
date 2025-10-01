// src/pages/servicesData.ts
export interface Operation {
  name: string;
  label: string; 
  url: string;
  guide: {
    description: string; 
    tips: string[];
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon?: string;
  operations: Operation[];
}

const servicesData: Service[] = [
  {
    id: "inps",
    name: "Pensioni (INPS)",
    description:
      "Accedi ai principali servizi pensionistici dell’INPS: presentare domande di pensione, richiedere indennità e informazioni su assistenza domiciliare.",
    icon: "/inps.png",
    operations: [
      {
        name: "Domanda pensione",
        label: "Domanda pensione",
        url: "https://www.inps.it/it/it/previdenza/domanda-di-pensione.html",
        guide: {
          description:
            "Per presentare la domanda di pensione accedi al sito INPS con SPID, CIE o CNS. Nella sezione 'Domanda di pensione' compila i campi richiesti con i tuoi dati anagrafici e contributivi. Se richiesto, allega documenti in formato digitale (PDF). Al termine invia la domanda e conserva la ricevuta di inoltro come prova.",
          tips: [
            "Se non hai SPID, puoi richiederlo attraverso PosteID o un altro identity provider; per molte persone la modalità in ufficio postale è la più semplice.",
            "Puoi svolgere tutta la procedura da casa se sai usare lo SPID; altrimenti chiedi aiuto a un familiare o al CAF per la prima volta.",
            "Tieni a portata di mano documento d'identità, codice fiscale e certificazioni utili."
          ]
        }
      },
      {
        name: "Indennità di accompagnamento agli invalidi civili",
        label: "Indennità di accompagnamento agli invalidi civili",
        url: "https://www.inps.it/it/it/dettaglio-approfondimento.schede-informative.indennit-di-accompagnamento-agli-invalidi-civili.html",
        guide: {
          description:
            "Per richiedere l’indennità di accompagnamento accedi al portale INPS e cerca la sezione dedicata alle prestazioni per invalidità civile. Compila la domanda online e allega la documentazione medica richiesta. Dopo l'invio, conserva il numero di protocollo.",
          tips: [
            "Questa pratica è più semplice se ti fai assistere da un patronato o CAF perché richiede documenti medici specifici.",
            "Prepara in anticipo tutte le certificazioni richieste dal medico o dalla ASL."
          ]
        }
      },
      {
        name: "Assistenza domiciliare per non autosufficienti",
        label: "Assistenza domiciliare per non autosufficienti",
        url: "#",
        guide: {
          description:
            "La richiesta di assistenza domiciliare (es. Home Care) prevede l'accesso al portale INPS e la compilazione della domanda dedicata, allegando la documentazione sanitaria. Alcune fasi richiedono l'intervento dell'ASL locale per le valutazioni mediche.",
          tips: [
            "Contatta preventivamente il medico di base per raccogliere la documentazione necessaria.",
            "Spesso è utile farsi affiancare da un patronato per la presentazione completa della pratica."
          ]
        }
      }
    ]
  },

  {
    id: "inail",
    name: "INAIL",
    description: "Servizi relativi a infortuni sul lavoro e prestazioni economiche.",
    icon: "/inail.png",
    operations: [
      {
        name: "Denuncia infortunio",
        label: "Denuncia infortunio",
        url: "https://www.inail.it/portale/assicurazione/it/Datore-di-Lavoro/Impresa-Settore-Navigazione/denunce-infortuni-e-malattie-professionali-impresa-settore-navigazione/denuncia-comunicazione-di-infortunio-sul-lavoro-impresa-settore-navigazione.html",
        guide: {
          description:
            "La denuncia di infortunio va effettuata tramite il portale INAIL: accedi con le credenziali richieste e compila il modulo con i dati dell'infortunio e della persona coinvolta, allegando i certificati medici se disponibili. Il datore di lavoro solitamente ha l'obbligo di inviare la denuncia, ma il cittadino può verificare lo stato della pratica online.",
          tips: [
            "Se sei lavoratore, informa subito il datore di lavoro; spesso è il datore che procede con la denuncia.",
            "Per dubbi tecnici, rivolgiti a un patronato per assistenza nella compilazione."
          ]
        }
      },
      {
        name: "Consultazione pratiche",
        label: "Consultazione pratiche",
        url: "https://www.inail.it/portale/assicurazione/it/lassicurazione-inail/quali-sono-le-prestazioni-di-inail/prestazioni-economiche.html",
        guide: {
          description:
            "Dal portale INAIL è possibile consultare lo stato delle pratiche e le prestazioni economiche. Accedi al tuo profilo, cerca la sezione dedicata alle pratiche e verifica eventuali aggiornamenti o documenti disponibili.",
          tips: [
            "La consultazione è rapida e può essere fatta da casa.",
            "Conserva numeri di pratica o codice identificativo per ricerche veloci."
          ]
        }
      }
    ]
  },

  {
    id: "poste",
    name: "Poste Italiane",
    description: "Servizi postali e digitali, inclusi cedolini e identificazione PosteID.",
    icon: "/poste.png",
    operations: [
      {
        name: "Richiesta cedolino pensione",
        label: "Richiesta cedolino pensione",
        url: "https://www.poste.it/polis-inps/cedolino-pensione/",
        guide: {
          description:
            "Per vedere il cedolino della pensione accedi al sito di Poste (sezione Polis/INPS) e autenticati con PosteID o SPID. Nella sezione dedicata potrai visualizzare e scaricare il tuo cedolino in PDF.",
          tips: [
            "Puoi fare questa operazione comodamente da casa.",
            "Se non hai SPID, attiva PosteID in ufficio postale per una procedura assistita."
          ]
        }
      },
      {
        name: "PosteID (attivazione SPID tramite Poste)",
        label: "PosteID (attivazione SPID tramite Poste)",
        url: "https://posteid.poste.it/identificazione/identificazione.shtml",
        guide: {
          description:
            "Per attivare lo SPID tramite Poste puoi utilizzare PosteID: scegli la modalità di riconoscimento (online con documento, videochiamata o recandoti in ufficio postale) e segui la procedura guidata. Dopo il riconoscimento potrai utilizzare SPID per accedere ai servizi della PA.",
          tips: [
            "Il riconoscimento in ufficio postale è la modalità più semplice per chi non usa lo smartphone.",
            "La procedura richiede documento di identità e tessera sanitaria."
          ]
        }
      },
      {
        name: "Pagamenti online",
        label: "Pagamenti online",
        url: "https://www.poste.it/paga-online/",
        guide: {
          description:
            "Con Poste puoi effettuare vari pagamenti online (bollettini, F24, multe). Accedi con PosteID o SPID, seleziona la tipologia di pagamento, inserisci i dati richiesti e conferma con il codice OTP ricevuto sul cellulare.",
          tips: [
            "Tieni a portata di mano i dati del bollettino o della tassa.",
            "Se non sei pratico con pagamenti online, chiedi a un familiare o vai allo sportello per una prima spiegazione."
          ]
        }
      }
    ]
  },

  {
    id: "fisco",
    name: "Agenzia delle Entrate",
    description: "Servizi fiscali: cassetto fiscale, dichiarazione precompilata, invio documenti.",
    icon: "/agenziaEntrate.png",
    operations: [
      {
        name: "Cassetto fiscale",
        label: "Cassetto fiscale",
        url: "https://www.agenziaentrate.gov.it/portale/servizi/servizitrasversali/altri/cassetto-fiscale",
        guide: {
          description:
            "Il Cassetto fiscale è l'area riservata dove puoi consultare dati fiscali, dichiarazioni e documenti. Accedi con SPID, CIE o CNS e naviga tra le sezioni per scaricare o stampare quanto necessario.",
          tips: ["La consultazione è semplice da casa; porta con te eventuali documenti se devi integrare informazioni."]
        }
      },
      {
        name: "Dichiarazione precompilata",
        label: "Dichiarazione precompilata",
        url: "https://www.agenziaentrate.gov.it/portale/schede/dichiarazioni/dichiarazione-precompilata/accedi-alla-tua-precompilata",
        guide: {
          description:
            "Accedi alla dichiarazione dei redditi precompilata con SPID per visualizzare i dati a disposizione e, se necessario, integrare o correggere prima dell'invio. Segui le istruzioni a schermo per confermare o inviare la dichiarazione.",
          tips: [
            "Se hai dubbi o la dichiarazione è complessa, rivolgiti a un CAF o a un professionista.",
            "Controlla con attenzione i dati precompilati prima dell'invio."
          ]
        }
      },
      {
        name: "Consegna documenti e istanze",
        label: "Consegna documenti e istanze",
        url: "https://www.agenziaentrate.gov.it/portale/consegna-documenti",
        guide: {
          description:
            "Il servizio consente di inviare digitalmente documenti e istanze all'Agenzia. Dopo l'accesso carica i file richiesti (meglio in PDF) e invia la pratica seguendo le istruzioni a schermo.",
          tips: ["Prepara i documenti in PDF prima di iniziare la procedura."]
        }
      }
    ]
  },

  {
    id: "sanita",
    name: "Sanità (Puglia Salute)",
    description: "Servizi sanitari digitali della Regione Puglia: prenotazioni, referti, vaccini.",
    icon: "/pugliasalute.png",
    operations: [
      {
        name: "Gestione prenotazioni",
        label: "Gestione prenotazioni",
        url: "https://www.sanita.puglia.it/disdetta-prenotazioni",
        guide: {
          description:
            "Attraverso Puglia Salute puoi gestire o disdire prenotazioni di visite o esami. Accedi con SPID e cerca la sezione dedicata per inserire il codice della prenotazione o cercare l'appuntamento da modificare.",
          tips: ["Servizio semplice da usare da casa. Tieni a portata di mano il codice CUP o la data della prenotazione."]
        }
      },
      {
        name: "Pagamento ticket",
        label: "Pagamento ticket",
        url: "https://www.sanita.puglia.it/pagamento-ticket1",
        guide: {
          description:
            "Il pagamento del ticket può essere effettuato online dal portale. Dopo l'autenticazione inserisci i dati richiesti e completa il pagamento tramite i metodi disponibili.",
          tips: ["Puoi pagare da casa senza recarti allo sportello."]
        }
      },
      {
        name: "Referto on-line",
        label: "Referto on-line",
        url: "https://www.sanita.puglia.it/referto-online",
        guide: {
          description:
            "Accedi con SPID per visualizzare e scaricare i referti delle prestazioni sanitarie.",
          tips: ["Comodo per evitare spostamenti in ospedale."]
        }
      },
      {
        name: "Diario Vaccinazioni",
        label: "Diario Vaccinazioni",
        url: "https://www.sanita.puglia.it/diario-vaccinazioni-con-autenticazione",
        guide: {
          description:
            "Il diario vaccinale mostra lo storico delle vaccinazioni effettuate e permette di scaricare certificati, previa autenticazione.",
          tips: ["Operazione fattibile da casa se hai SPID."]
        }
      },
      {
        name: "Scelta/Revoca Medico",
        label: "Scelta/Revoca Medico",
        url: "https://www.sanita.puglia.it/scelta-e-revoca-medico",
        guide: {
          description:
            "Dal portale puoi scegliere o revocare il medico di base: accedi e segui la procedura guidata nella sezione dedicata.",
          tips: ["In alcuni casi è possibile anche recarsi direttamente alla ASL per assistenza."]
        }
      }
    ]
  },

  {
    id: "bcc",
    name: "BCC Bari e Taranto",
    description: "Servizi bancari e home banking della BCC Bari e Taranto.",
    icon: "/bcc.png",
    operations: [
      {
        name: "Trasparenza",
        label: "Trasparenza",
        url: "https://www.bancabaritaranto.it/template/default.asp?i_menuID=70784",
        guide: {
          description:
            "Nella sezione Trasparenza puoi consultare documenti informativi, fogli informativi e contratti relativi ai prodotti bancari. È prevalentemente consultazione di documenti pubblici.",
          tips: ["Non richiede autenticazione per la maggior parte dei documenti. Puoi consultare e stampare a piacere."]
        }
      },
      {
        name: "Registrazione RelaxBanking",
        label: "Registrazione RelaxBanking",
        url: "https://www.relaxbanking.it/v3/relaxbanking/#/funzionalita",
        guide: {
          description:
            "Per usare RelaxBanking devi avere un conto presso la BCC: segui la procedura di registrazione indicata sul sito o fatti assistere in filiale per l'attivazione dell'homebanking.",
          tips: ["Se non sei pratico, attiva il servizio direttamente in filiale con la guida di un impiegato bancario."]
        }
      }
    ]
  }
];

export default servicesData;
