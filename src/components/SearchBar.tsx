// src/components/searchbar.tsx (MODIFICATO)

import React, { useState, useMemo, useEffect } from 'react';
// Importiamo i nuovi campi
import { useSearch, type SearchResult } from '../context/SearchContext'; 
import '../styles/SearchBar.css'; 

// ... (SearchModalProps e SearchModal rimangono invariati, MA SearchModal deve accettare/aggiornare la query globale)

interface SearchModalProps {
    // Rimosso query e setQuery come props, ora prendiamo da useSearch
    filteredResults: SearchResult[];
    onClose: () => void;
    isMobile: boolean; 
}

const SearchModal: React.FC<SearchModalProps> = ({ 
    filteredResults, 
    onClose,
    isMobile 
}) => {
    // Usiamo il contesto per la query
    const { globalQuery, setGlobalQuery } = useSearch();

    // La ricerca e la visibilità iniziano dalla prima lettera (length >= 1)
    const isListVisible = globalQuery.length >= 1 && filteredResults.length > 0;
    const noResults = globalQuery.length >= 1 && filteredResults.length === 0;

    const handleLinkClick = () => {
        setGlobalQuery(''); // Resetta la query alla navigazione
        onClose(); 
    }

    return (
        <div className="search-modal">
            <div className="modal-header">
                
                {/* Barra di ricerca all'interno del modale */}
                <div className="search-input-wrapper-modal">
                    
                    <svg className="search-icon-modal" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    
                    <input
                        type="text"
                        placeholder="Cerca nel sito..."
                        value={globalQuery} // Usa la query globale
                        onChange={(e) => setGlobalQuery(e.target.value)} // Aggiorna la query globale
                        autoFocus 
                    />
                </div>

                {/* Pulsante di chiusura del Modale (X) */}
                <button className="close-modal-btn" onClick={onClose} aria-label="Chiudi ricerca">
                    &times;
                </button>
            </div>
            
            {/* 2. Risultati sotto la barra di ricerca */}
            <div className="modal-results-area">
                {isListVisible && (
                    <div className="results-container">
                        <ul className="results-list-modal">
                            {filteredResults.map((item) => (
                                <li key={item.id}>
                                    <a href={item.path} onClick={handleLinkClick}>
                                        <strong>{item.title}</strong>
                                        <p>{item.text.substring(0, 120)}...</p>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {noResults && (
                    <div className="no-results">Nessun risultato trovato per "{globalQuery}".</div>
                )}
            </div>
        </div>
    );
}


// **********************************************
// 3. COMPONENTE PRINCIPALE (SearchBar - Trigger)
// **********************************************

interface SearchBarProps {
    isMobile: boolean; 
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Usiamo il contesto
    const { globalQuery, setGlobalQuery, filteredGlobalResults } = useSearch(); 

    // Al click sul trigger, apriamo il modale E svuotiamo la query se era chiusa
    const openModal = () => setIsModalOpen(true);
    
    // Alla chiusura del modale, svuotiamo la query
    const closeModal = () => {
        setIsModalOpen(false);
        setGlobalQuery('');
    };
    
    // Il testo mostrato nel trigger
    const triggerText = globalQuery || "Cerca nel sito...";

    return (
        <>
            {/* 1. TRIGGER: Lente a SINISTRA e testo sincronizzato */}
            <div className="search-trigger" onClick={openModal} role="button" aria-label="Apri ricerca nel sito">
                
                {/* 1. Lente (Andrà a sinistra) */}
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
                
                {/* 2. Placeholder / Testo SINCRONIZZATO (Andrà a destra) */}
                <div className="search-trigger-placeholder">
                    {/* Mostra il testo della query O il placeholder */}
                    {triggerText} 
                </div>
            </div>

            {/* 2. MODALE (Mostrato solo quando isModalOpen è true) */}
            {isModalOpen && (
                <SearchModal 
                    // query={query} 
                    // setQuery={setQuery} 
                    filteredResults={filteredGlobalResults} // Passiamo i risultati globali
                    onClose={closeModal} 
                    isMobile={isMobile} 
                />
            )}
        </>
    );
};

export default SearchBar;