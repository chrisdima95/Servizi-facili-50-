// src/hooks/useSearchOptimized.ts
import { useState, useMemo, useCallback } from 'react';
import { debounce } from 'lodash';
import type { SearchResult } from '../types/search';

export const useSearchOptimized = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  const debouncedSearch = useMemo(
    () => debounce((searchQuery: string, searchableContent: SearchResult[]) => {
      if (!searchQuery || searchQuery.length < 1) {
        setResults([]);
        return;
      }
      
      const query = searchQuery.toLowerCase();
      const filtered = searchableContent.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.text.toLowerCase().includes(query)
      );
      
      setResults(filtered.slice(0, 10)); // Limita a 10 risultati
    }, 200), // Ridotto da 300ms a 200ms
    []
  );
  
  const clearResults = useCallback(() => {
    setResults([]);
    setQuery('');
  }, []);
  
  return { 
    query, 
    setQuery, 
    results, 
    debouncedSearch, 
    clearResults 
  };
};
