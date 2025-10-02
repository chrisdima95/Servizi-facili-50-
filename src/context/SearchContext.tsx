import { createContext, useState, useContext, useCallback } from 'react';
import type { ReactNode, FC } from 'react';

// Tipizzazione del singolo elemento ricercabile
interface SearchableItem {
  id: string; 
  title: string; 
  text: string; 
  path: string; 
}

// 1. DEFINIZIONE DEL CONTRATTO DEL CONTEXT (SearchContextType)
interface SearchContextType {
  // L'array di tutti i contenuti registrati
  searchableContent: SearchableItem[];
  
  // La funzione per aggiungere nuovi contenuti
  registerContent: (item: Omit<SearchableItem, 'id'>, id?: string) => void;
}

// 2. Crea il Context (usando il tipo appena definito)
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// 3. Hook per usare il Context (useSearch)
export const useSearch = () => {
  // ... (il resto dell'hook useSearch rimane invariato)
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve essere usato all\'interno di un SearchProvider');
  }
  return context;
};

// Tipo di supporto per le Props del Provider
interface SearchProviderProps {
    children: ReactNode;
}

// 4. Provider (Gestore dello Stato Globale)
export const SearchProvider: FC<SearchProviderProps> = ({ children }) => {
  const [contentList, setContentList] = useState<SearchableItem[]>([]);
  
  // Tipo di supporto per l'argomento 'item' della funzione (correzione errore 7006)
  type ContentToRegister = Omit<SearchableItem, 'id'>;

  // Funzione per aggiungere un nuovo contenuto
  const registerContent = useCallback((item: ContentToRegister, id?: string) => { 
    const uniqueId = id || item.path + item.title.replace(/\s/g, '-');

    // Ottimizzato: usa la forma funzionale del setter e non ha dipendenze
    setContentList(prev => {
        // Se l'ID esiste già, lo aggiorna (utile per contenuti dinamici)
        if (prev.some(c => c.id === uniqueId)) {
            return prev.map(c => c.id === uniqueId ? { ...item, id: uniqueId } : c);
        }
        // Altrimenti, aggiunge il nuovo contenuto
        return [...prev, { ...item, id: uniqueId }];
    });
  }, []); // Dipendenza vuota: la funzione è stabile!


  return (
    <SearchContext.Provider value={{ searchableContent: contentList, registerContent }}>
      {children}
    </SearchContext.Provider>
  );
};