// Store per gestire lo stato dell'applicazione
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AccessMode } from '../types/accessibility';
import type { SearchResult } from '../types/search';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
}

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  accessStats: Record<string, number>; // Statistiche di accesso ai servizi
  searchHistory: string[]; // Cronologia ricerche
  
  // UI state
  accessMode: AccessMode;
  focusMode: boolean; 
  isMobile: boolean;
  
  // Search state
  globalQuery: string; // Query di ricerca globale
  searchableContent: SearchResult[]; // Contenuto ricercabile
  
  // Actions
  setUser: (user: User | null) => void; // Funzione per impostare l'utente  
  incrementServiceAccess: (serviceId: string) => void; // Funzione per incrementare il numero di accessi a un servizio
  addSearchTerm: (term: string) => void; // Funzione per aggiungere un termine alla cronologia ricerche
  resetUserStats: () => void; // Funzione per resettare le statistiche dell'utente
  setAccessMode: (mode: AccessMode) => void; // Funzione per impostare il modo di accesso
  toggleAccessMode: (key: keyof AccessMode) => void; // Funzione per attivare o disattivare il modo di accesso  
  toggleFocusMode: () => void; // Funzione per attivare o disattivare il focus mode
  setIsMobile: (isMobile: boolean) => void; // Funzione per impostare il dispositivo mobile
  setGlobalQuery: (query: string) => void; // Funzione per impostare la query globale
  setSearchableContent: (content: SearchResult[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({ // Funzione per impostare lo stato iniziale
      // Initial state
      user: null,
      isAuthenticated: false,
      accessStats: {},
      searchHistory: [],
      accessMode: {
        largeText: false,
        highContrast: false
      },
      focusMode: false,
      isMobile: false,
      globalQuery: '',
      searchableContent: [],
      
      // Actions
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      
      incrementServiceAccess: (serviceId) => set((state) => ({
        accessStats: {
          ...state.accessStats,
          [serviceId]: (state.accessStats[serviceId] || 0) + 1
        }
      })),
      
      addSearchTerm: (term) => set((state) => ({
        searchHistory: [term, ...state.searchHistory.filter(t => t !== term)].slice(0, 10)
      })),
      
      resetUserStats: () => set({ 
        accessStats: {}, 
        searchHistory: [] 
      }),
      
      setAccessMode: (accessMode) => set({ accessMode }),
      
      toggleAccessMode: (key) => set((state) => ({
        accessMode: {
          ...state.accessMode,
          [key]: !state.accessMode[key]
        }
      })),
      
      toggleFocusMode: () => set((state) => ({ 
        focusMode: !state.focusMode 
      })),
      
      setIsMobile: (isMobile) => set({ isMobile }),
      
      setGlobalQuery: (globalQuery) => set({ globalQuery }),
      
      setSearchableContent: (searchableContent) => set({ searchableContent }) 
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({
        user: state.user,
        accessStats: state.accessStats,
        searchHistory: state.searchHistory,
        accessMode: state.accessMode
      })
    }
  )
);
