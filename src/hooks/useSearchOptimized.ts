// Hook per gestire la ricerca ottimizzata
import { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import type { SearchResult } from '../types/search';

export const useSearchOptimized = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Funzione per la ricerca debounced
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string, searchableContent: SearchResult[]) => {
      if (!searchQuery || searchQuery.length < 1) {
        setResults([]);
        return;
      }
      
      // Filtra i risultati
      const query = searchQuery.toLowerCase();
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
      );
      
      setResults(filtered.slice(0, 10)); // Limita a 10 risultati
    }, 200), // Ridotto da 300ms a 200ms
    []
  );
  
  // Funzione per cancellare i risultati
  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
  }, []);
  
  return {  // Funzione per ottenere i risultati
    query, 
    setQuery, 
    results, 
    debouncedSearch, 
    clearResults 
  };
};
