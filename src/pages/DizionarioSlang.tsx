// src/pages/DizionarioSlang.tsx (MODIFICATO)

import React, { useState, useEffect, useMemo } from "react";
// Importa useSearchParams e useLocation per leggere i parametri URL
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/DizionarioSlang.css";

interface Term {
  slang: string;
  description: string;
}

// *** 1. ESPORTIAMO L'ARRAY PER IL CONTESTO GLOBALE ***
export const termini: Term[] = [
  { slang: "Antivirus", description: "Software che rileva e rimuove virus e minacce dal computer." },
  { slang: "Backup", description: "Copia di sicurezza dei dati per proteggerli da perdita o danni." },
  // ... (tutti gli altri termini)
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

const DizionarioSlang: React.FC<DizionarioSlangProps> = ({ highContrast = false, largeText = false }) => {
  // 2. Legge la query dai parametri URL (per la ricerca globale)
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // Usa la query locale per l'input di ricerca, ma impostala con quella dell'URL se esiste
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const normalized = (value: string) => value.toLowerCase();

  // Sincronizza lo stato interno con la query URL se cambia esternamente
  useEffect(() => {
    if (urlQuery && urlQuery !== localQuery) {
      setLocalQuery(urlQuery);
    }
  }, [urlQuery]);

  // 3. Logica di filtraggio unificata (usa la query locale sincronizzata)
  const currentQuery = localQuery; // usa lo stato locale che è sincronizzato

  const filteredTerms = useMemo(() => {
    const q = normalized(currentQuery).trim();
    if (!q) return termini;

    return termini.filter((t) =>
      normalized(t.slang).includes(q) || normalized(t.description).includes(q)
    );
  }, [currentQuery]);

  // 4. Imposta l'indice a 0 ogni volta che la query cambia
  useEffect(() => setIndex(0), [currentQuery]);

  // Cleanup: se l'utente digita nell'input locale, rimuovi il parametro 'q' dall'URL.
  // Questo è un dettaglio avanzato per mantenere pulito l'URL, ma è facoltativo.
  useEffect(() => {
    if (searchParams.get('q')) {
      // Rimuove il parametro 'q' dall'URL ma MANTIENE il filtro interno
      navigate('/glossario', { replace: true });
    }
  }, [navigate]);

  return (
    <main className={`glossary-page ${highContrast ? "high-contrast-mode" : ""} ${largeText ? "large-text-mode" : ""}`}>
      <section className="glossary-card" aria-label="Glossario informatico">
        <h2>Glossario informatico</h2>

        {currentQuery && filteredTerms.length > 0 && (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            Risultati per la ricerca: **"{currentQuery}"**
          </p>
        )}

        {filteredTerms.length > 0 ? (
          <div className="term-description">
            <strong>{filteredTerms[index].slang}:</strong> {filteredTerms[index].description}
          </div>
        ) : (
          <div className="term-description" aria-live="polite">
            Nessun risultato trovato per **"{currentQuery}"**.
          </div>
        )}

        <div className="navigation">
          <button onClick={() => setIndex((p) => (filteredTerms.length === 0 ? 0 : p === 0 ? filteredTerms.length - 1 : p - 1))} aria-label="Termine precedente" type="button" disabled={filteredTerms.length === 0}>←</button>
          <span aria-live="polite">{filteredTerms.length === 0 ? 0 : index + 1} / {filteredTerms.length}</span>
          <button onClick={() => setIndex((p) => (filteredTerms.length === 0 ? 0 : p === filteredTerms.length - 1 ? 0 : p + 1))} aria-label="Termine successivo" type="button" disabled={filteredTerms.length === 0}>→</button>
        </div>

        <div className="search-container">
          <label htmlFor="glossary-search" className="visually-hidden">Cerca nel glossario</label>
          <input
            id="glossary-search"
            type="search"
            className="glossary-search-input"
            placeholder="Cerca termine o descrizione..."
            value={localQuery} // Usa la query LOCALE sincronizzata
            onChange={(e) => setLocalQuery(e.target.value)} // Aggiorna la query LOCALE
            aria-label="Cerca termine del glossario"
          />
        </div>

        <button onClick={() => navigate("/")} aria-label="Chiudi glossario" className="close-btn" type="button">Chiudi</button>
      </section>
    </main>
  );
};

export default DizionarioSlang;