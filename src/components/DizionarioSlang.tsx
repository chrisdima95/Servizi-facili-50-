import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DizionarioSlang.css";

interface Term {
  slang: string;
  description: string;
}

const termini: Term[] = [
  { slang: "Antivirus", description: "Software che rileva e rimuove virus e minacce dal computer." },
  { slang: "Backup", description: "Copia di sicurezza dei dati per proteggerli da perdita o danni." },
  { slang: "Browser", description: "Programma per navigare su internet (es. Chrome, Firefox)." },
  { slang: "CAPTCHA", description: "Test per distinguere umani da robot." },
  { slang: "Cookie", description: "Piccolo file usato per ricordare informazioni su un sito." },
  { slang: "Download", description: "Scaricare un file da internet al computer." },
  { slang: "Email", description: "Messaggio elettronico inviato tramite internet." },
  { slang: "Firewall", description: "Barriera di sicurezza che protegge il computer da accessi non autorizzati." },
  { slang: "Frode phishing", description: "Tentativo di ingannare una persona per ottenere dati personali tramite email o siti falsi." },
  { slang: "Hardware", description: "Componenti fisici del computer (es. tastiera, mouse, disco fisso)." },
  { slang: "Help desk", description: "Servizio di assistenza tecnica per problemi informatici." },
  { slang: "Home banking", description: "Sistema per gestire il conto bancario tramite internet." },
  { slang: "Identity theft (furto d’identità)", description: "Uso illegale dei dati personali per truffe o furti." },
  { slang: "Login", description: "Accesso a un sito con nome utente e password." },
  { slang: "Malware", description: "Programma dannoso che può infettare il computer." },
  { slang: "Phishing", description: "Truffa via email o siti web falsi per rubare informazioni personali." },
  { slang: "Password", description: "Parola segreta usata per proteggere l'accesso a un account o dispositivo." },
  { slang: "Popup", description: "Finestra che si apre automaticamente durante la navigazione, a volte pubblicitaria o pericolosa." },
  { slang: "Router", description: "Dispositivo che connette la rete internet a casa o ufficio." },
  { slang: "Spam", description: "Email indesiderate o pubblicitarie inviate in massa." },
  { slang: "Trojan (Cavallo di Troia)", description: "Programma dannoso che si nasconde in software apparentemente innocui." },
  { slang: "Upload", description: "Caricare un file dal computer a internet." },
  { slang: "URL", description: "Indirizzo dei siti web (esempio: www.google.it)." },
  { slang: "Virus", description: "Programma che può causare danni al computer e ai dati." },
  { slang: "VPN (Virtual Private Network)", description: "Rete privata che protegge la connessione internet e la privacy." },
  { slang: "Wi-Fi", description: "Connessione internet senza fili." },
  { slang: "Worm (verme)", description: "Tipo di virus informatico che si propaga da solo attraverso la rete." },
];

interface DizionarioSlangProps {
  highContrast?: boolean;
  largeText?: boolean;
}

const DizionarioSlang: React.FC<DizionarioSlangProps> = ({
  highContrast = false,
  largeText = false,
}) => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const prevTerm = () => setIndex((prev) => (prev === 0 ? termini.length - 1 : prev - 1));
  const nextTerm = () => setIndex((prev) => (prev === termini.length - 1 ? 0 : prev + 1));

  // Aggiungo/rimuovo classe al body per centrare glossario
  useEffect(() => {
    document.body.classList.add("glossary-open");
    return () => {
      document.body.classList.remove("glossary-open");
    };
  }, []);

  return (
    <aside
      id="glossary-dialog"
      role="dialog"
      aria-modal="true"
      aria-label="Glossario informatico"
      tabIndex={-1}
      className={`${highContrast ? "high-contrast-mode" : ""} ${
        largeText ? "large-text-mode" : ""
      }`}
    >
      <h2>Glossario informatico</h2>
      <div className="term-description">
        <strong>{termini[index].slang}:</strong> {termini[index].description}
      </div>
      <div className="navigation">
        <button onClick={prevTerm} aria-label="Termine precedente" type="button">
          ←
        </button>
        <span aria-live="polite">{index + 1} / {termini.length}</span>
        <button onClick={nextTerm} aria-label="Termine successivo" type="button">
          →
        </button>
      </div>
      <button
        onClick={() => navigate("/")}
        aria-label="Chiudi glossario"
        className="close-btn"
        type="button"
      >
        Chiudi
      </button>
    </aside>
  );
};

export default DizionarioSlang;
