// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

// UserContext Types
type User = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
};

type RegistrationInput = {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
};

type UserContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<boolean>;
  register: (input: RegistrationInput) => Promise<boolean>;
  logout: () => void;
  accessStats: Record<string, number>;
  incrementServiceAccess: (serviceId: string) => void;
  searchHistory: string[];
  addSearchTerm: (term: string) => void;
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
  
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('sf_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [accessStats, setAccessStats] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem('sf_access_stats');
    return stored ? JSON.parse(stored) : {};
  });
  
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const stored = localStorage.getItem('sf_search_history');
    return stored ? JSON.parse(stored) : [];
  });

  const isAuthenticated = !!user;

  const login = async (identifier: string, password: string): Promise<boolean> => {
    // Accetta qualsiasi credenziale non vuota
    if (identifier.trim() && password.trim()) {
      const newUser: User = {
        firstName: 'Utente',
        lastName: 'Test',
        email: identifier,
        username: identifier.split('@')[0]
      };
      setUser(newUser);
      localStorage.setItem('sf_user', JSON.stringify(newUser));
      
      // Reset delle statistiche di accesso e cronologia ricerche al login
      setAccessStats({});
      setSearchHistory([]);
      localStorage.removeItem('sf_access_stats');
      localStorage.removeItem('sf_search_history');
      
      // Reset anche dello store globale
      resetUserStats();
      
      return true;
    }
    return false;
  };

  const register = async (input: RegistrationInput): Promise<boolean> => {
    // Simulazione registrazione
    const newUser: User = {
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      username: input.username
    };
    setUser(newUser);
    localStorage.setItem('sf_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sf_user');
  };

  const incrementServiceAccess = (serviceId: string): void => {
    setAccessStats(prev => {
      const newStats = { ...prev, [serviceId]: (prev[serviceId] || 0) + 1 };
      localStorage.setItem('sf_access_stats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const addSearchTerm = (term: string): void => {
    setSearchHistory(prev => {
      const newHistory = [term, ...prev.filter(t => t !== term)].slice(0, 10);
      localStorage.setItem('sf_search_history', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  const value: UserContextValue = useMemo(() => ({
    user,
    isAuthenticated,
    login,
    register,
    logout,
    accessStats,
    incrementServiceAccess,
    searchHistory,
    addSearchTerm
  }), [user, accessStats, searchHistory]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
