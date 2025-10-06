// Context per accessibilità: gestisce stato di modalità testo grande, alto contrasto e focus mode
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AccessMode } from '../types/accessibility';

interface AccessibilityContextValue {
  accessMode: AccessMode;
  toggleAccessMode: (key: keyof AccessMode) => void;
  focusMode: boolean;
  toggleFocusMode: () => void;
}

// Crea il context
const AccessibilityContext = createContext<AccessibilityContextValue | undefined>(undefined); // Crea il context

export const useAccessibility = () => { // Recupera il context
  const context = useContext(AccessibilityContext); 
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessMode, setAccessMode] = useState<AccessMode>({
    largeText: false,
    highContrast: false
  });
  
  const [focusMode, setFocusMode] = useState(false);

  const toggleAccessMode = useCallback((key: keyof AccessMode) => {
    setAccessMode(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleFocusMode = useCallback(() => {
    setFocusMode(prev => !prev);
  }, []);

  const value: AccessibilityContextValue = {
    accessMode,
    toggleAccessMode,
    focusMode,
    toggleFocusMode
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
