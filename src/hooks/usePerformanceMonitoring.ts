// Hook per monitorare le performance: mount, unmount, render e Web Vitals
import { useEffect, useCallback } from 'react';

export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = performance.now();

  useEffect(() => {
    const mountTime = performance.now() - startTime;
    
    // Log delle metriche di performance in development
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    }

    // Web Vitals monitoring
    if ('web-vitals' in window) {
      // Qui si può aggiungere il monitoring dei Web Vitals
    }

    return () => {
      const unmountTime = performance.now();
      if (import.meta.env.DEV) {
        console.log(`[Performance] ${componentName} unmounted after ${unmountTime.toFixed(2)}ms`);
      }
    };
  }, [componentName, startTime]);

  // Funzione per misurare il tempo di render
  const measureRender = useCallback((callback: () => void) => {
    const renderStart = performance.now();
    callback();
    const renderEnd = performance.now();
    
    if (import.meta.env.DEV) {
      console.log(`[Performance] ${componentName} render took ${(renderEnd - renderStart).toFixed(2)}ms`);
    }
  }, [componentName]);

  return { measureRender };
};
