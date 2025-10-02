import React, { createContext, useContext, useMemo, useState } from "react";
import servicesData, { type Service } from "../pages/servicesData";
// *** IMPORTAZIONE FONDAMENTALE ***
import { termini } from '../pages/DizionarioSlang';

// **********************************************
// 1. DEFINIZIONI DI TIPO
// **********************************************

// Esportiamo il tipo SearchResult e reintroduciamo il campo 'type'
export interface SearchResult {
    id: string | number;
    title: string;
    text: string;
    path: string;
    type: 'service' | 'operation' | 'glossary'; // Campo 'type' ripristinato
}

interface SearchContextValue {
    searchableContent: SearchResult[];
    globalQuery: string;
    setGlobalQuery: (q: string) => void;
    filteredGlobalResults: SearchResult[];
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

// **********************************************
// 2. LOGICA DI INDECIZZAZIONE (RI-INCLUSIONE GLOSSARIO)
// **********************************************

// Accetta l'array 'terms' del glossario come secondo argomento
const buildSearchableContent = (data: Service[], terms: typeof termini): SearchResult[] => {
    const results: SearchResult[] = [];

    // 1. Indicizzazione Servizi e Operazioni
    data.forEach((service) => {
        // Servizio Principale
        results.push({
            id: `svc-${service.id}`,
            title: service.name,
            text: service.description,
            path: `/service/${service.id}`,
            type: 'service',
        });

        // Operazioni del Servizio
        service.operations.forEach((operation, index) => {
            const operationId = `${service.id}-${index}`;

            results.push({
                id: `op-${operationId}`,
                title: `${operation.name} (${service.name})`,
                text: operation.guide.description,
                path: `/operation/${service.id}/${index}`,
                type: 'operation',
            });
        });
    });

    // 2. Indicizzazione Glossario (RIPRISTINATO)
    terms.forEach((term, index) => {
        results.push({
            id: `gls-${term.slang.replace(/\s/g, '-')}-${index}`,
            title: term.slang,
            text: term.description,
            // Path che include il parametro di query per il filtraggio automatico
            path: `/glossario?q=${encodeURIComponent(term.slang)}`,
            type: 'glossary',
        });
    });

    return results;
};


// **********************************************
// 3. PROVIDER E HOOK
// **********************************************

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [globalQuery, setGlobalQuery] = useState('');

    // Passiamo servicesData E termini alla funzione di indicizzazione
    const searchableContent: SearchResult[] = useMemo(() => buildSearchableContent(servicesData, termini), []);

    // Logica di filtraggio dei risultati
    const filteredGlobalResults = useMemo(() => {
        if (globalQuery.length < 1) return [];

        const lowerCaseQuery = globalQuery.toLowerCase();

        return searchableContent.filter(item =>
            item.title.toLowerCase().includes(lowerCaseQuery) ||
            item.text.toLowerCase().includes(lowerCaseQuery)
        );
    }, [globalQuery, searchableContent]);

    const value: SearchContextValue = useMemo(
        () => ({
            searchableContent,
            globalQuery,
            setGlobalQuery,
            filteredGlobalResults,
        }),
        [searchableContent, globalQuery, filteredGlobalResults]
    );

    return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};

// Hook per l'uso del contesto (esportato correttamente)
export function useSearch(): SearchContextValue {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch deve essere usato all'interno di un SearchProvider");
    }
    return context;
}