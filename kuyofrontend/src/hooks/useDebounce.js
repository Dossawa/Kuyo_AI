// FICHIER: src/hooks/useDebounce.js
// ==============================================

import { useState, useEffect } from 'react';

/**
 * Hook pour debouncer une valeur
 * @param {any} value - Valeur à debouncer
 * @param {number} delay - Délai en millisecondes
 * @returns {any} - Valeur debouncée
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};