// FICHIER: src/hooks/useMediaQuery.js
// ==============================================

import { useState, useEffect } from 'react';

/**
 * Hook pour détecter les media queries
 * @param {string} query - Media query CSS
 * @returns {boolean} - True si la query correspond
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);

    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};