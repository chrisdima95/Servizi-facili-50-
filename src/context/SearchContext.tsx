// src/context/SearchContext.tsx (MODIFICATO)

import React, { createContext, useContext, useMemo, useState } from "react";
import servicesData, { type Service } from "../pages/servicesData";

// **********************************************
// 1. DEFINIZIONI DI TIPO
// **********************************************

export interface SearchResult {
    id: string | number;
    title: string;
    text: string;
    path: string;
}

interface SearchContextValue {
    searchableContent: SearchResult[];
    globalQuery: string; // Stato globale per la query
    setGlobalQuery: (q: string) => void; // Funzione per aggiornare la query
    filteredGlobalResults: SearchResult[]; // Risultati globali filtrati
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

// ... (la funzione buildSearchableContent rimane la stessa)
const buildSearchableContent = (data: Service[]): SearchResult[] => {
    // ... (la logica di appiattimento rimane la stessa)
    const results: SearchResult[] = [];

    data.forEach((service) => {
        // 1. Aggiungi il Servizio Principale come risultato
        results.push({
            id: service.id,
            title: service.name,
            text: service.description,
            path: `/service/${service.id}`,
        });

        // 2. Aggiungi ogni Operazione del Servizio come risultato
        service.operations.forEach((operation, index) => {
            const operationId = `${service.id}-${index}`; 
            
            results.push({
                id: operationId,
                title: `${operation.name} (${service.name})`,
                text: operation.guide.description,
                path: `/operation/${service.id}/${index}`, 
            });
        });
    });

    return results;
};


// **********************************************
// 2. PROVIDER E HOOK
// **********************************************

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Stato per la query di ricerca globale
    const [globalQuery, setGlobalQuery] = useState(''); 
    
    // Contenuto cercabile completo (Generato una sola volta)
    const searchableContent: SearchResult[] = useMemo(() => buildSearchableContent(servicesData), []);

    // Risultati filtrati in base alla query globale
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

export function useSearch(): SearchContextValue {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch deve essere usato all'interno di un SearchProvider");
    }
    return context;
}