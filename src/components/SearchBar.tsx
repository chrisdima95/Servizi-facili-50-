import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash'; // Importa useNavigate
// Importiamo i tipi e l'hook (usando 'type' per l'interfaccia)
import { useSearch } from '../contexts/SearchContext';
import type { SearchResult } from '../types/search'; 
import '../styles/SearchBar.css'; 

// **********************************************
// 1. COMPONENTE MODALE
// **********************************************

interface SearchModalProps {
    filteredResults: SearchResult[];
    onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = React.memo(({ 
    filteredResults, 
    onClose
}) => {
    const { globalQuery, setGlobalQuery } = useSearch();
    const navigate = useNavigate(); // Hook di navigazione

    const isListVisible = globalQuery.length >= 1 && filteredResults.length > 0;
    const noResults = globalQuery.length >= 1 && filteredResults.length === 0;

    const handleLinkClick = (path: string, e: React.MouseEvent) => {
        e.preventDefault();
        
        setGlobalQuery(''); // Resetta la query globale
        onClose(); // Chiude il modale
        navigate(path); // Naviga al percorso (con ?q= se è glossario)
    };

    return (
        // Questo div gestirà il posizionamento a schermo intero (vedi CSS)
        <div className="search-modal-overlay"> 
            <div className="search-modal" role="dialog" aria-modal="true" aria-label="Finestra di ricerca globale">
                <div className="modal-scrollable-content">
                    <div className="modal-header">
                    
                    {/* Barra di ricerca all'interno del modale */}
                    <div className="search-input-wrapper-modal">
                        
                        <svg className="search-icon-modal" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                        
                        <input
                            type="text"
                            placeholder="Cerca nel sito..."
                            value={globalQuery} 
                            onChange={(e) => setGlobalQuery(e.target.value)} 
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
                                        <a href={item.path} onClick={(e) => handleLinkClick(item.path, e)}>
                                            <span style={{ fontSize: '0.75em', color: '#999', marginRight: '6px' }}>
                                                {item.type === 'glossary' ? '[GLOSSARIO]' : item.type === 'service' ? '[SERVIZIO]' : '[GUIDA]'}
                                            </span>
                                    <strong>{item.title}</strong>
                                    <p>{item.text.substring(0, 80)}...</p>
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
    </div>
        </div>
    );
});


// **********************************************
// 2. COMPONENTE PRINCIPALE (SearchBar - Trigger)
// **********************************************

interface SearchBarProps {
    // Qui puoi aggiungere le props che il tuo componente parent (App/Layout) gli passa
    isMobile?: boolean; 
    highContrast?: boolean;
    largeText?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = React.memo(({ isMobile = false }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const { globalQuery, setGlobalQuery, filteredGlobalResults } = useSearch();

    // Debounced search ottimizzato per migliorare le performance
    const debouncedSetQuery = useMemo(
        () => debounce((query: string) => {
            setGlobalQuery(query);
        }, 150), // Ridotto da 300ms a 150ms per migliore responsività
        [setGlobalQuery]
    );

    // Logica di apertura/chiusura
    const openModal = () => setIsModalOpen(true);
    
    const closeModal = () => {
        setIsModalOpen(false);
        setGlobalQuery('');
    };

    // Svuota la query se il modale è chiuso, e viceversa
    useEffect(() => {
        if (isModalOpen) {
            // Se apri il modale con il tasto, non svuotare la query
        } else {
            // Quando il modale si chiude, pulisci la query globale
            if (globalQuery !== '') {
                setGlobalQuery('');
            }
        }
    }, [isModalOpen, globalQuery, setGlobalQuery]);
    
    // Il testo mostrato nel trigger
    const triggerText = globalQuery || "Cerca nel sito...";

    return (
        <>
            {/* 1. TRIGGER: Icona interna e testo sincronizzato */}
            <div className={`search-trigger ${isMobile ? 'mobile-icon-only' : ''}`} onClick={openModal} role="button" aria-label="Apri ricerca nel sito">
                
                {/* Placeholder con icona interna */}
                <div className="search-trigger-placeholder">
                    {/* Icona interna */}
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    
                    {/* Testo della query O il placeholder - nascosto su mobile */}
                    {!isMobile && triggerText}
                </div>
            </div>

            {/* 2. MODALE (Mostrato solo quando isModalOpen è true) */}
            {isModalOpen && (
                <SearchModal 
                    filteredResults={filteredGlobalResults} 
                    onClose={closeModal} 
                />
            )}
        </>
    );
});

export default SearchBar;