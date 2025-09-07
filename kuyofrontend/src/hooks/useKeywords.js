// FICHIER: src/hooks/useKeywords.js
// ==============================================

import { useState, useEffect, useCallback } from 'react';
import { WeaviateService } from '../services/api';
import { APP_CONFIG } from '../config/appConfig';

/**
 * Hook pour la gestion des mots-clés Weaviate
 * @returns {object} - État et méthodes des mots-clés
 */
export const useKeywords = () => {
  const [keywords, setKeywords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Cache duration (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Chargement des mots-clés
  const fetchKeywords = useCallback(async (forceRefresh = false) => {
    // Vérification du cache
    if (!forceRefresh && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
      if (APP_CONFIG.APP.DEBUG) {
        console.log('📦 Utilisation du cache mots-clés');
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const keywordsList = await WeaviateService.fetchKeywords();
      setKeywords(keywordsList);
      setLastFetch(Date.now());
      
      if (APP_CONFIG.APP.DEBUG) {
        console.log(`🏷️ ${keywordsList.length} mots-clés chargés`);
      }
    } catch (err) {
      const errorMessage = 'Erreur chargement des mots-clés';
      setError(errorMessage);
      console.error(errorMessage, err);
    } finally {
      setIsLoading(false);
    }
  }, [lastFetch]);

  // Chargement initial
  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  // Recherche dans les mots-clés
  const searchKeywords = useCallback((query) => {
    if (!query || query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return keywords.filter(keyword => 
      keyword.includes(lowerQuery)
    ).slice(0, 10);
  }, [keywords]);

  // Suggestions basées sur les mots-clés
  const getSuggestions = useCallback((limit = 6) => {
    if (keywords.length === 0) return [];
    
    return keywords
      .sort(() => Math.random() - 0.5)
      .slice(0, limit)
      .map(keyword => `❓ ${keyword}`);
  }, [keywords]);

  return {
    // État
    keywords,
    isLoading,
    error,
    lastFetch,
    
    // Actions
    fetchKeywords,
    searchKeywords,
    getSuggestions,
    
    // Méthodes utilitaires
    refresh: () => fetchKeywords(true),
    clearError: () => setError(null)
  };
};