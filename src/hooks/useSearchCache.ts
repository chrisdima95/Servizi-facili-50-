// src/hooks/useSearchCache.ts
import { useState, useCallback, useMemo } from 'react';
import type { SearchResult } from '../types/search';

interface SearchCache {
  [query: string]: SearchResult[];
}

export const useSearchCache = () => {
  const [cache, setCache] = useState<SearchCache>({});
  const [maxCacheSize] = useState(50);

  const getCachedResults = useCallback((query: string): SearchResult[] | null => {
    return cache[query] || null;
  }, [cache]);

  const setCachedResults = useCallback((query: string, results: SearchResult[]) => {
    setCache(prev => {
      const newCache = { ...prev, [query]: results };
      
      // Mantieni solo gli ultimi maxCacheSize risultati
      const keys = Object.keys(newCache);
      if (keys.length > maxCacheSize) {
        const oldestKey = keys[0];
        delete newCache[oldestKey];
      }
      
      return newCache;
    });
  }, [maxCacheSize]);

  const clearCache = useCallback(() => {
    setCache({});
  }, []);

  const cacheStats = useMemo(() => ({
    size: Object.keys(cache).length,
    maxSize: maxCacheSize
  }), [cache, maxCacheSize]);

  return {
    getCachedResults,
    setCachedResults,
    clearCache,
    cacheStats
  };
};
