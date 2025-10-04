// src/types/search.tsx

export interface SearchResult {
  id: string | number;
  title: string;
  text: string;
  path: string;
  type: 'service' | 'operation' | 'glossary';
}
