// Context per gestione utente: autenticazione, statistiche accessi e cronologia ricerche con persistenza nel localStorage
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

// UserContext Types
type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};


type UserContextValue = { 
  user: User | null; 
  isAuthenticated: boolean; 
  login: (identifier: string, password: string) => Promise<boolean>; // Funzione per login
  logout: () => void;
  accessStats: Record<string, number>; // Statistiche accessi
  incrementServiceAccess: (serviceId: string) => void; // Funzione per incrementare il numero di accessi a un servizio
  searchHistory: string[]; // Cronologia ricerche
  addSearchTerm: (term: string) => void; // Funzione per aggiungere un termine alla cronologia ricerche
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Accesso allo store globale per reset
  const { resetUserStats } = useAppStore();
  
  // Recupera l'utente dal localStorage
  const [user, setUser] = useState<User | null>(() => { 
    const stored = localStorage.getItem('sf_user'); 
    return stored ? JSON.parse(stored) : null;
  });
  
  // Recupera le statistiche di accesso dal localStorage
  const [accessStats, setAccessStats] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem('sf_access_stats');
    return stored ? JSON.parse(stored) : {};
  });
  
  // Recupera la cronologia ricerche dal localStorage
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('sf_search_history');
    return stored ? JSON.parse(stored) : [];
  });

  const isAuthenticated = !!user; // Controlla se l'utente è autenticato

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Accetta qualsiasi credenziale non vuota
    if (identifier.trim() && password.trim()) {
      const newUser: User = { // Crea un nuovo utente
        firstName: 'Utente',
        lastName: 'Test',
        email: identifier,
        username: identifier.split('@')[0]
      };
      setUser(newUser); // Setta l'utente
      localStorage.setItem('sf_user', JSON.stringify(newUser));
      
      // Reset delle statistiche di accesso e cronologia ricerche al login
      setAccessStats({}); // Reset delle statistiche di accesso
      setSearchHistory([]);
      localStorage.removeItem('sf_access_stats');
      localStorage.removeItem('sf_search_history');
      
      // Reset anche dello store globale
      resetUserStats(); // Reset delle statistiche di accesso e cronologia ricerche
      
      return true;
    }
    return false;
  };


  const logout = () => {
    setUser(null); // Reset dell'utente
    localStorage.removeItem('sf_user');
  };

  const incrementServiceAccess = (serviceId: string): void => {
    setAccessStats(prev => {
      const newStats = { ...prev, [serviceId]: (prev[serviceId] || 0) + 1 }; // Incrementa il numero di accessi a un servizio
      localStorage.setItem('sf_access_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const addSearchTerm = (term: string): void => {
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10); // Aggiunge un termine alla cronologia ricerche
      localStorage.setItem('sf_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const value: UserContextValue = useMemo(() => ({
    user, // Recupera l'utente
    isAuthenticated, // Controlla se l'utente è autenticato
    login,
    logout,
    accessStats, // Recupera le statistiche di accesso
    incrementServiceAccess, // Funzione per incrementare il numero di accessi a un servizio
    searchHistory, // Recupera la cronologia ricerche   
    addSearchTerm // Funzione per aggiungere un termine alla cronologia ricerche
  }), [user, accessStats, searchHistory]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
