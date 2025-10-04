// src/hooks/useAccessibility.ts
import { useState, useCallback } from 'react';
import type { AccessMode } from '../types/accessibility';

export const useAccessibility = () => {
  const [accessMode, setAccessMode] = useState<AccessMode>({
    largeText: false,
    highContrast: false
  });
  
  const toggleAccessMode = useCallback((key: keyof AccessMode) => {
    setAccessMode(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);
  
  return { accessMode, toggleAccessMode };
};
