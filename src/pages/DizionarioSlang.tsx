// src/pages/DizionarioSlang.tsx

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { termini } from "../data/glossaryData";
import { useUser } from "../contexts/UserContext";
import "../styles/DizionarioSlang.css";


interface DizionarioSlangProps {
  highContrast?: boolean;
  largeText?: boolean;
}

const DizionarioSlang: React.FC<DizionarioSlangProps> = React.memo(({ highContrast = false, largeText = false }) => {
  const [searchParams] = useSearchParams();
  const urlQuery = searchParams.get('q') || '';

  // Usa la query locale per l'input di ricerca, ma impostala con quella dell'URL se esiste
  const [localQuery, setLocalQuery] = useState(urlQuery);
  const [index, setIndex] = useState(0);
  const [hasUserInteracted, setHasUserInteracted] = useState(false); // Track se l'utente ha interagito
  const [showDefinition, setShowDefinition] = useState(false); // Track se mostrare la definizione
  const navigate = useNavigate();
  const { isAuthenticated, addSearchTerm } = useUser();

  const normalized = (value: string) => value.toLowerCase();

  // Funzione per trovare il miglior match per la query
  const findBestMatch = (query: string, terms: typeof termini) => {
    if (!terms || terms.length === 0) return 0;
    
    const q = normalized(query);
    
    // 1. Cerca match esatti (case insensitive)
    let exactMatch = terms.findIndex(term => normalized(term.slang) === q);
    if (exactMatch !== -1) return exactMatch;
    
    // 2. Cerca termini che iniziano con la query
    let startsWithMatch = terms.findIndex(term => normalized(term.slang).startsWith(q));
    if (startsWithMatch !== -1) return startsWithMatch;
    
    // 3. Cerca termini che contengono la query
    let containsMatch = terms.findIndex(term => normalized(term.slang).includes(q));
    if (containsMatch !== -1) return containsMatch;
    
    // 4. Cerca nelle descrizioni solo se la query è abbastanza lunga
    if (q.length >= 3) {
      let descriptionMatch = terms.findIndex(term => normalized(term.description).includes(q));
      if (descriptionMatch !== -1) return descriptionMatch;
    }
    
    // 5. Se non trova nulla, restituisci 0
    return 0;
  };

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
    
    // Se non c'è query, mostra tutti i termini
    if (!q) return termini;

    // Se c'è una query, filtra i termini con logica migliorata
    const results = termini.filter((t) => {
      const slangLower = normalized(t.slang);
      const descLower = normalized(t.description);
      
      // Priorità 1: Match esatto nel termine
      if (slangLower === q) return true;
      
      // Priorità 2: Il termine inizia con la query
      if (slangLower.startsWith(q)) return true;
      
      // Priorità 3: Il termine contiene la query (ma non nella descrizione)
      if (slangLower.includes(q)) return true;
      
      // Priorità 4: Solo se la query è abbastanza lunga (almeno 3 caratteri), cerca anche nella descrizione
      if (q.length >= 3 && descLower.includes(q)) return true;
      
      return false;
    });
    
    // Ordina i risultati per priorità
    return results.sort((a, b) => {
      const aSlang = normalized(a.slang);
      const bSlang = normalized(b.slang);
      
      // Match esatti prima
      if (aSlang === q && bSlang !== q) return -1;
      if (bSlang === q && aSlang !== q) return 1;
      
      // Match che iniziano con la query prima
      if (aSlang.startsWith(q) && !bSlang.startsWith(q)) return -1;
      if (bSlang.startsWith(q) && !aSlang.startsWith(q)) return 1;
      
      // Match nel termine prima di quelli nella descrizione
      const aInSlang = aSlang.includes(q);
      const bInSlang = bSlang.includes(q);
      if (aInSlang && !bInSlang) return -1;
      if (bInSlang && !aInSlang) return 1;
      
      return 0;
    });
  }, [currentQuery]);


  // 4. Traccia i termini solo quando l'utente clicca "Vedi Significato" o fa una ricerca
  const [lastTrackedTerm, setLastTrackedTerm] = useState<string>('');

  // Funzione migliorata per gestire la ricerca
  const handleSearchChange = (value: string) => {
    setLocalQuery(value);
    setHasUserInteracted(true);
    
    if (value.trim()) {
      // Usa la stessa logica del useMemo per coerenza
      const q = normalized(value).trim();
      const currentFilteredTerms = termini.filter((t) => {
        const slangLower = normalized(t.slang);
        const descLower = normalized(t.description);
        
        // Priorità 1: Match esatto nel termine
        if (slangLower === q) return true;
        
        // Priorità 2: Il termine inizia con la query
        if (slangLower.startsWith(q)) return true;
        
        // Priorità 3: Il termine contiene la query (ma non nella descrizione)
        if (slangLower.includes(q)) return true;
        
        // Priorità 4: Solo se la query è abbastanza lunga (almeno 3 caratteri), cerca anche nella descrizione
        if (q.length >= 3 && descLower.includes(q)) return true;
        
        return false;
      });
      
      if (currentFilteredTerms.length > 0) {
        // Trova il miglior match
        const bestMatchIndex = findBestMatch(value, currentFilteredTerms);
        const validIndex = Math.max(0, Math.min(bestMatchIndex, currentFilteredTerms.length - 1));
        setIndex(validIndex);
        
        // Traccia automaticamente quando l'utente fa una ricerca
        if (isAuthenticated && currentFilteredTerms[validIndex]) {
          const searchTerm = currentFilteredTerms[validIndex].slang;
          if (searchTerm !== lastTrackedTerm) {
            addSearchTerm(searchTerm);
            setLastTrackedTerm(searchTerm);
          }
        }
      } else {
        // Nessun risultato trovato, mantieni l'indice a 0
        setIndex(0);
      }
    } else {
      // Se non c'è query, torna alla navigazione normale
      setIndex(0);
    }
  };

  // Rimuoviamo questo useEffect per evitare conflitti
  // La definizione verrà resettata direttamente nei pulsanti di navigazione
  
  // Funzione per visualizzare la definizione e tracciare il termine
  const viewDefinition = () => {
    const currentTerms = currentQuery ? filteredTerms : termini;
    const validIndex = Math.max(0, Math.min(index, currentTerms.length - 1));
    
    if (currentTerms.length > 0 && currentTerms[validIndex] && currentTerms[validIndex].slang) {
      setShowDefinition(true);
      
      // Traccia il termine solo se l'utente è autenticato e è un termine diverso
      if (isAuthenticated && currentTerms[validIndex].slang !== lastTrackedTerm) {
        addSearchTerm(currentTerms[validIndex].slang);
        setLastTrackedTerm(currentTerms[validIndex].slang);
      }
    }
  };

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

        {currentQuery && (
          <p style={{ textAlign: 'center', color: '#6c757d', fontStyle: 'italic' }}>
            {filteredTerms.length > 0 
              ? `Risultati per la ricerca: **"${currentQuery}"** (${filteredTerms.length} termini trovati)`
              : `Nessun risultato trovato per **"${currentQuery}"**`
            }
          </p>
        )}

        {(() => {
          // Se l'utente non ha ancora interagito e non c'è query, mostra il messaggio di benvenuto
          if (!hasUserInteracted && !currentQuery) {
            return (
              <div className="term-description welcome-message" aria-live="polite">
                <p>Benvenuto nel glossario informatico!</p>
                <p>Clicca sulle frecce per esplorare i termini o usa la barra di ricerca per trovare un termine specifico.</p>
              </div>
            );
          }
          
          // Determina i termini correnti e assicurati che l'indice sia valido
          const currentTerms = currentQuery ? filteredTerms : termini;
          const validIndex = Math.max(0, Math.min(index, currentTerms.length - 1));
          
          // Se ci sono termini e l'indice è valido, mostra sempre la schermata
          if (currentTerms.length > 0 && currentTerms[validIndex]) {
            return (
              <div className="term-section">
                <div className="term-name">
                  <strong>Termine: {currentTerms[validIndex].slang}</strong>
                </div>
                {showDefinition ? (
                  <div className="term-description">
                    <strong>{currentTerms[validIndex].slang}:</strong> {currentTerms[validIndex].description}
                  </div>
                ) : (
                  <div className="term-actions">
                    <button onClick={viewDefinition} className="view-definition-btn" type="button">
                      Vedi Significato
                    </button>
                  </div>
                )}
              </div>
            );
          }
          
          // Se non ci sono termini (ricerca senza risultati), mostra un messaggio
          if (currentQuery && filteredTerms.length === 0) {
            return (
              <div className="term-description welcome-message" aria-live="polite">
                <p>🔍 Nessun termine trovato per "{currentQuery}"</p>
                <p>Prova con un termine diverso o usa le frecce per esplorare tutti i termini.</p>
              </div>
            );
          }
          
          return null;
        })()}

        <div className="navigation">
          <button onClick={() => {
            setHasUserInteracted(true);
            setShowDefinition(false); // Reset definizione quando navighiamo manualmente
            setIndex((p) => {
              const currentFilteredTerms = currentQuery ? filteredTerms : termini;
              if (currentFilteredTerms.length === 0) return 0;
              
              // Se è la prima interazione, mostra l'ultimo termine
              if (!hasUserInteracted && !currentQuery) return termini.length - 1;
              
              // Naviga normalmente con wraparound
              return p === 0 ? currentFilteredTerms.length - 1 : p - 1;
            });
          }} aria-label="Termine precedente" type="button" disabled={false}>←</button>
          <span aria-live="polite">
            {!hasUserInteracted && !currentQuery ? 'Clicca le frecce per iniziare' : `${(currentQuery ? filteredTerms : termini).length === 0 ? 0 : index + 1} / ${(currentQuery ? filteredTerms : termini).length}`}
          </span>
          <button onClick={() => {
            setHasUserInteracted(true);
            setShowDefinition(false); // Reset definizione quando navighiamo manualmente
            setIndex((p) => {
              const currentFilteredTerms = currentQuery ? filteredTerms : termini;
              if (currentFilteredTerms.length === 0) return 0;
              
              // Se è la prima interazione, mostra il primo termine
              if (!hasUserInteracted && !currentQuery) return 0;
              
              // Naviga normalmente con wraparound
              return p === currentFilteredTerms.length - 1 ? 0 : p + 1;
            });
          }} aria-label="Termine successivo" type="button" disabled={false}>→</button>
        </div>

        <div className="search-container">
          <label htmlFor="glossary-search" className="visually-hidden">Cerca nel glossario</label>
          <input
            id="glossary-search"
            type="search"
            className="glossary-search-input"
            placeholder="Cerca termine o descrizione..."
            value={localQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Cerca termine del glossario"
          />
        </div>

        <button onClick={() => navigate("/")} aria-label="Chiudi glossario" className="close-btn" type="button">Chiudi</button>
      </section>
    </main>
    );
});

export default DizionarioSlang;