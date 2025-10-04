// src/hooks/usePerformanceMonitoring.ts
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: number;
}

export const usePerformanceMonitoring = (componentName: string) => {
  const startTime = performance.now();

  useEffect(() => {
    const mountTime = performance.now() - startTime;
    
    // Log delle metriche di performance in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} mounted in ${mountTime.toFixed(2)}ms`);
    }

    // Web Vitals monitoring
    if ('web-vitals' in window) {
      // Qui si può aggiungere il monitoring dei Web Vitals
    }

    return () => {
      const unmountTime = performance.now();
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Performance] ${componentName} unmounted after ${unmountTime.toFixed(2)}ms`);
      }
    };
  }, [componentName, startTime]);

  const measureRender = useCallback((callback: () => void) => {
    const renderStart = performance.now();
    callback();
    const renderEnd = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName} render took ${(renderEnd - renderStart).toFixed(2)}ms`);
    }
  }, [componentName]);

  return { measureRender };
};
