// FICHIER: src/hooks/useLocalStorage.js
// ==============================================

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook pour la gestion du localStorage avec synchronisation
 * @param {string} key - Clé localStorage
 * @param {any} defaultValue - Valeur par défaut
 * @returns {Array} - [value, setValue, removeValue]
 */
export const useLocalStorage = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(true);

  // Chargement initial
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Erreur lecture localStorage [${key}]:`, error);
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  // Mise à jour avec sauvegarde
  const setStoredValue = useCallback((newValue) => {
    try {
      setValue(newValue);
      
      if (newValue === null || newValue === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(newValue));
      }
    } catch (error) {
      console.error(`Erreur écriture localStorage [${key}]:`, error);
    }
  }, [key]);

  // Suppression
  const removeValue = useCallback(() => {
    try {
      setValue(defaultValue);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur suppression localStorage [${key}]:`, error);
    }
  }, [key, defaultValue]);

  return [value, setStoredValue, removeValue, isLoading];
};