// src/contexts/SearchContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import servicesData from '../data/servicesData';
import { termini } from '../data/glossaryData';
import type { SearchResult } from '../types/search';

interface SearchContextValue {
  searchableContent: SearchResult[];
  globalQuery: string;
  setGlobalQuery: (q: string) => void;
  filteredGlobalResults: SearchResult[];
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

// Funzione per costruire il contenuto ricercabile
const buildSearchableContent = (data: typeof servicesData, terms: typeof termini): SearchResult[] => {
  const results: SearchResult[] = [];
  
  // Aggiungi servizi
  data.forEach(service => {
    results.push({
      id: service.id,
      title: service.name,
      text: service.description,
      path: `/service/${service.id}`,
      type: 'service'
    });
    
    // Aggiungi operazioni
    service.operations.forEach((operation, index) => {
      results.push({
        id: `${service.id}-${index}`,
        title: operation.name,
        text: operation.guide.description,
        path: `/operation/${service.id}/${index}`,
        type: 'operation'
      });
    });
  });
  
  // Aggiungi termini del glossario
  terms.forEach(term => {
    results.push({
      id: term.slang,
      title: term.slang,
      text: term.description,
      path: `/glossario?q=${encodeURIComponent(term.slang)}`,
      type: 'glossary'
    });
  });
  
  return results;
};

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalQuery, setGlobalQuery] = useState('');

  const searchableContent: SearchResult[] = useMemo(() => 
    buildSearchableContent(servicesData, termini), 
    []
  );

  const filteredGlobalResults = useMemo(() => {
    if (globalQuery.length < 1) return [];
    
    const query = globalQuery.toLowerCase();
    return searchableContent.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.text.toLowerCase().includes(query)
    ).slice(0, 10);
  }, [globalQuery, searchableContent]);

  const value: SearchContextValue = useMemo(() => ({
    searchableContent,
    globalQuery,
    setGlobalQuery,
    filteredGlobalResults
  }), [searchableContent, globalQuery, filteredGlobalResults]);

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};
