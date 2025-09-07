// ==============================================
// FICHIER: src/utils/textUtils.js
// ==============================================

import { APP_CONFIG } from '../config/appConfig';

/**
 * Utilitaires pour le traitement de texte
 */
export const textUtils = {
  /**
   * Extrait les mots importants d'une phrase
   * @param {string} sentence - La phrase à analyser
   * @returns {string[]} - Liste des mots importants
   */
  extractImportantWords: (sentence) => {
    if (!sentence || typeof sentence !== 'string') return [];
    
    return sentence
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => 
        word.length > 2 && 
        !APP_CONFIG.STOPWORDS.has(word)
      )
      .slice(0, APP_CONFIG.LIMITS.MAX_CONCEPTS);
  },

  /**
   * Tronque un texte à une longueur donnée
   * @param {string} text - Le texte à tronquer
   * @param {number} maxLength - Longueur maximale
   * @returns {string} - Texte tronqué
   */
  truncateText: (text, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  },

  /**
   * Nettoie et formate un texte
   * @param {string} text - Le texte à nettoyer
   * @returns {string} - Texte nettoyé
   */
  cleanText: (text) => {
    if (!text) return '';
    return text
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n');
  },

  /**
   * Génère un slug à partir d'un texte
   * @param {string} text - Le texte source
   * @returns {string} - Slug généré
   */
  generateSlug: (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}