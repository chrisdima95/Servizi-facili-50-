// src/store/useAppStore.ts
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
  accessStats: Record<string, number>;
  searchHistory: string[];
  
  // UI state
  accessMode: AccessMode;
  focusMode: boolean;
  isMobile: boolean;
  
  // Search state
  globalQuery: string;
  searchableContent: SearchResult[];
  
  // Actions
  setUser: (user: User | null) => void;
  incrementServiceAccess: (serviceId: string) => void;
  addSearchTerm: (term: string) => void;
  resetUserStats: () => void;
  setAccessMode: (mode: AccessMode) => void;
  toggleAccessMode: (key: keyof AccessMode) => void;
  toggleFocusMode: () => void;
  setIsMobile: (isMobile: boolean) => void;
  setGlobalQuery: (query: string) => void;
  setSearchableContent: (content: SearchResult[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
