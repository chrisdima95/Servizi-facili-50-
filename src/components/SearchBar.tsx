import React, { useState, useMemo } from 'react';
import { useSearch } from '../context/SearchContext';
import '../styles/SearchBar.css'; 

// **********************************************
// 1. DEFINIZIONI DI TIPO 
// **********************************************

interface SearchResult {
    id: string | number;
    title: string;
    text: string;
    path: string;
}

interface SearchModalProps {
    query: string;
    setQuery: (q: string) => void;
    filteredResults: SearchResult[];
    onClose: () => void;
    // Nuova prop: Passata dal componente App
    isMobile: boolean; 
}

// **********************************************
// 2. COMPONENTE MODALE (SearchModal)
// **********************************************

const SearchModal: React.FC<SearchModalProps> = ({ 
    query, 
    setQuery, 
    filteredResults, 
    onClose,
    isMobile // Ricevuta la prop isMobile
}) => {
    
    // La ricerca e la visibilità iniziano dalla prima lettera (length >= 1)
    const isListVisible = query.length >= 1 && filteredResults.length > 0;
    const noResults = query.length >= 1 && filteredResults.length === 0;

    const handleLinkClick = () => {
        setQuery('');
        onClose(); 
    }

    return (
        <div className="search-modal">
            <div className="modal-header">
                
                {/* Barra di ricerca all'interno del modale */}
                <div className="search-input-wrapper-modal">
                    
                    {/* Lente a sinistra nel modale */}
                    <svg className="search-icon-modal" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    
                    <input
                        type="text"
                        placeholder="Cerca nel sito..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        // L'attributo "rows" non è necessario per un input type="text"
                        // ma gli stili CSS in SearchBar.css forzeranno l'altezza su mobile.
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
                    <div className="no-results">Nessun risultato trovato per "{query}".</div>
                )}
            </div>
        </div>
    );
}

// **********************************************
// 3. COMPONENTE PRINCIPALE (SearchBar - Trigger)
// **********************************************

interface SearchBarProps {
    isMobile: boolean; // Ricevuta da App.tsx
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile }) => {
    const [query, setQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { searchableContent } = useSearch(); 

    const filteredResults = useMemo(() => {
        // CHIAVE: Inizia il filtro quando la query è lunga 1 o più
        if (query.length < 1) return []; 

        const lowerCaseQuery = query.toLowerCase();

        return searchableContent.filter(item => 
            item.title.toLowerCase().includes(lowerCaseQuery) || 
            item.text.toLowerCase().includes(lowerCaseQuery)
        );
    }, [query, searchableContent]); 

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            {/* 1. TRIGGER: Lente a DESTRA e testo sincronizzato */}
            <div className="search-trigger" onClick={openModal} role="button" aria-label="Apri ricerca nel sito">
                
                {/* 1. Placeholder / Testo SINCRONIZZATO (Andrà a sinistra) */}
                <div className="search-trigger-placeholder">
                    {/* Mostra il testo della query O il placeholder */}
                    {query || "Cerca nel sito..."} 
                </div>
                
                {/* 2. Lente (Andrà a destra) */}
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </div>

            {/* 2. MODALE (Mostrato solo quando isModalOpen è true) */}
            {isModalOpen && (
                <SearchModal 
                    query={query} 
                    setQuery={setQuery} 
                    filteredResults={filteredResults}
                    onClose={closeModal} 
                    isMobile={isMobile} // Passiamo la prop isMobile
                />
            )}
        </>
    );
};

export default SearchBar;