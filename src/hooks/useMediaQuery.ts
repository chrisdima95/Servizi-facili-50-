// Hook per gestire le query media: mobile, tablet o desktop
import { useState, useEffect } from 'react';

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => { // Effetto per controllare la query media
    const media = window.matchMedia(query);
    
    // Imposta il valore iniziale
    setMatches(media.matches);
    
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    
    return () => media.removeEventListener('change', listener);
  }, [query]); // Rimuovo 'matches' dalle dipendenze per evitare loop infiniti

  return matches;
};
