import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceDetail from "../components/ServiceDetail";
import ServiceOperations from "../components/ServiceOperations";
import ButtonService from "../components/ButtonService";

export type AccessMode = {
  largeText: boolean;
  highContrast: boolean;
};

interface Operation {
  label: string;
  url: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  operations: Operation[];
  icon: string; 
}

interface HomeProps {
  accessMode: AccessMode;
  isMobile: boolean;
}

const services: Service[] = [
  {
    id: "inps",
    name: "Pensioni (INPS)",
    description:
      "Accedi ai principali servizi pensionistici dell’INPS. Puoi inviare e consultare le domande relative alla pensione, richiedere l'indennità di accompagnamento e l'assistenza domiciliare per persone non autosufficienti.",
    operations: [
      {
        label: "Domanda di pensione",
        url: "https://www.inps.it/it/it/previdenza/domanda-di-pensione.html",
      },
      {
        label: "Indennità di accompagnamento agli invalidi civili",
        url: "https://www.inps.it/it/it/dettaglio-approfondimento.schede-informative.indennit-di-accompagnamento-agli-invalidi-civili.html",
      },
      {
        label: "Assistenza domiciliare per persone non autosufficienti",
        url: "https://www.inps.it/it/it/dettaglio-scheda.it.schede-servizio-strumento.schede-servizi.hcp-assistenza-domiciliare-per-persone-non-autosufficienti-home-care-premium--50014.hcp-assistenza-domiciliare-per-persone-non-autosufficienti-home-care-premium-domanda-e-gestione-benefici.html",
      },
    ],
    icon: "/inps.png",
  },
  {
    id: "fisco",
    name: "Fisco (Agenzia delle Entrate)",
    description:
      "Accedi ai servizi fiscali dell’Agenzia delle Entrate. Puoi utilizzare i servizi Cassetto fiscale, dichiarazione dei redditi precompilata e consegna documenti e istanze.",
    operations: [
      {
        label: "Cassetto fiscale",
        url: "https://www.agenziaentrate.gov.it/portale/servizi/servizitrasversali/altri/cassetto-fiscale",
      },
      {
        label: "Dichiarazione dei redditi precompilata",
        url: "https://infoprecompilata.agenziaentrate.gov.it/portale/accedi-precompilata",
      },
      {
        label: "Consegna documenti e istanze",
        url: "https://www.agenziaentrate.gov.it/portale/consegna-documenti",
      },
    ],
    icon: "/agenziaEntrate.png",
  },
  {
    id: "inail",
    name: "INAIL",
    description:
      "Consulta i servizi legati agli infortuni sul lavoro e malattie professionali.",
    operations: [
      {
        label: "Denuncia infortunio",
        url: "https://www.inail.it/denuncia-infortunio",
      },
      { label: "Consultazione pratiche", url: "https://www.inail.it/pratiche" },
      {
        label: "Prestazioni economiche",
        url: "https://www.inail.it/prestazioni",
      },
    ],
    icon: "/inail.png",
  },
  {
    id: "puglia",
    name: "Sanità (Puglia Salute)",
    description:
      "Accedi ai servizi sanitari online della Regione Puglia. Puoi gestire le prenotazioni, pagare ticket, visualizzare il referto on-line e le vaccinazioni effettuate, scegliere o revocare il medico.",
    operations: [
      {
        label: "Gestione prenotazioni",
        url: "https://www.sanita.puglia.it/disdetta-prenotazioni",
      },
      {
        label: "Pagamento ticket",
        url: "https://www.sanita.puglia.it/pagamento-ticket1",
      },
      {
        label: "Referto on-line",
        url: "https://www.sanita.puglia.it/referto-online",
      },
      {
        label: "Diario Vaccinazioni",
        url: "https://www.sanita.puglia.it/diario-vaccinazioni-con-autenticazione",
      },
      {
        label: "Scelta/Revoca Medico",
        url: "https://www.sanita.puglia.it/scelta-e-revoca-medico",
      },
    ],
    icon: "/pugliasalute.png",
  },
  {
    id: "poste",
    name: "Poste Italiane",
    description:
      "Accedi ai servizi di Poste Italiane. Puoi richiedere il cedolino della pensione, PosteID abilitato a SPID ed effettuare pagamenti online come bollettini, multe, F24 e bollo auto.",
    operations: [
      {
        label: "Richiesta cedolino pensione",
        url: "https://www.poste.it/polis-inps/cedolino-pensione/#:~:text=Come%20richiedere%20il%20Cedolino%20della,le%20ultime%20due%20cifre%20decimali).",
      },
      {
        label: "PosteID abilitato SPID",
        url: "https://posteid.poste.it/identificazione/identificazione.shtml",
      },
      { label: "Pagamenti online", url: "https://www.poste.it/paga-online/" },
    ],
    icon: "/poste.png",
  },
  {
    id: "bcc",
    name: "BCC Bari e Taranto",
    description:
      "Per eseguire operazioni online con la Banca di Credito Cooperativo (BCC) di Bari e Taranto bisogna avere un conto corrente intestato o cointestato attivabile presso una BCC del Gruppo BCC Iccrea e registrarsi al servizio online RelaxBanking con le credenziali ricevute in fase di attivazione del servizio. Esplora i principali documenti di carattere informativo previsti dalla normativa sulla trasparenza, relativi all'offerta di prodotti e servizi come i Fogli Informativi, le Guide specifiche della Banca d’Italia e le Informazioni Generali dei prodotti e dei servizi offerti disponibili in modo da poter essere consultati, salvati e stampati.",
    operations: [
      {
        label: "Trasparenza",
        url: "https://www.bancabaritaranto.it/template/default.asp?i_menuID=70784",
      },
      {
        label: "Registrazione al servizio online RelaxBanking",
        url: "https://www.relaxbanking.it/v3/relaxbanking/#/funzionalita",
      },
    ],
    icon: "/bcc.png",
  },
];

const Home: React.FC<HomeProps> = ({ accessMode, isMobile }) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [showOperations, setShowOperations] = useState(false);
  const navigate = useNavigate();

  const handleBackToList = () => {
    setSelectedService(null);
    setShowOperations(false);
  };

  return (
    <div className={`home-container ${isMobile ? "mobile" : "desktop"}`}>
      {!selectedService && (
        <div className="services-grid">
          {services.map((service) => (
            <ButtonService
              key={service.id}
              icon={service.icon}
              label={service.name}
              extraClassName={service.id}
              onClick={() => setSelectedService(service)}
            />
          ))}

          <button
            className={`open-glossary-btn ${
              accessMode.largeText ? "large-text-mode" : ""
            } ${accessMode.highContrast ? "high-contrast-mode" : ""}`}
            onClick={() => navigate("/glossario")}
          >
            Glossario informatico
          </button>
        </div>
      )}

      {selectedService && !showOperations && (
        <ServiceDetail
          service={selectedService}
          accessMode={accessMode}
          onShowOperations={() => setShowOperations(true)}
          onBack={handleBackToList}
        />
      )}

      {selectedService && showOperations && (
        <ServiceOperations
          service={selectedService}
          accessMode={accessMode}
          onBack={handleBackToList}
        />
      )}
    </div>
  );
};

export default Home;
