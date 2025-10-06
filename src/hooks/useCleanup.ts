// Hook per gestire il cleanup di timeout e interval
// Evita memory leaks e accumulo di callback
import { useEffect, useRef } from 'react';

export const useCleanup = () => {
  const timeoutsRef = useRef<Set<number>>(new Set());
  const intervalsRef = useRef<Set<number>>(new Set());

  // Funzione per aggiungere un timeout
  const addTimeout = (timeout: number) => {
    timeoutsRef.current.add(timeout);
  };

  // Funzione per aggiungere un interval
  const addInterval = (interval: number) => {
    intervalsRef.current.add(interval);
  };

  // Funzione per cancellare un timeout
  const clearTimeout = (timeout: number) => {
    window.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  };

  // Funzione per cancellare un interval
  const clearInterval = (interval: number) => {
    window.clearInterval(interval);
    intervalsRef.current.delete(interval);
  };

  // Funzione per cancellare tutti i timeout
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
    timeoutsRef.current.clear();
  };

  // Funzione per cancellare tutti gli interval
  const clearAllIntervals = () => {
    intervalsRef.current.forEach(interval => window.clearInterval(interval));
    intervalsRef.current.clear();
  };

  // Funzione per cancellare tutti i timeout e gli interval
  const clearAll = () => {
    clearAllTimeouts();
    clearAllIntervals();
  };

  // Cleanup automatico al dismount
  useEffect(() => {
    return () => {
      clearAll();
    };
  }, []);

  return {
    addTimeout,
    addInterval,
    clearTimeout,
    clearInterval,
    clearAllTimeouts,
    clearAllIntervals,
    clearAll
  };
};
