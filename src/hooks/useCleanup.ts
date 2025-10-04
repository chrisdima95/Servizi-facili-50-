// src/hooks/useCleanup.ts
import { useEffect, useRef } from 'react';

/**
 * Hook per gestire il cleanup di timeout e interval
 * Evita memory leaks e accumulo di callback
 */
export const useCleanup = () => {
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());
  const intervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const addTimeout = (timeout: NodeJS.Timeout) => {
    timeoutsRef.current.add(timeout);
  };

  const addInterval = (interval: NodeJS.Timeout) => {
    intervalsRef.current.add(interval);
  };

  const clearTimeout = (timeout: NodeJS.Timeout) => {
    global.clearTimeout(timeout);
    timeoutsRef.current.delete(timeout);
  };

  const clearInterval = (interval: NodeJS.Timeout) => {
    global.clearInterval(interval);
    intervalsRef.current.delete(interval);
  };

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeout => global.clearTimeout(timeout));
    timeoutsRef.current.clear();
  };

  const clearAllIntervals = () => {
    intervalsRef.current.forEach(interval => global.clearInterval(interval));
    intervalsRef.current.clear();
  };

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
