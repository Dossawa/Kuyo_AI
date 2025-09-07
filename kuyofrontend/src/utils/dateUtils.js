// FICHIER: src/utils/dateUtils.js
// ==============================================

/**
 * Utilitaires pour la gestion des dates
 */
export const dateUtils = {
  /**
   * Formate un timestamp en chaîne lisible
   * @param {number} timestamp - Timestamp à formater
   * @param {string} locale - Locale à utiliser
   * @returns {string} - Date formatée
   */
  formatTimestamp: (timestamp, locale = 'fr-FR') => {
    if (!timestamp) return '';
    
    return new Date(timestamp).toLocaleString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Formate une date relative (il y a X minutes/heures/jours)
   * @param {number} timestamp - Timestamp de référence
   * @returns {string} - Date relative
   */
  formatRelativeTime: (timestamp) => {
    if (!timestamp) return '';
    
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes}m`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  },

  /**
   * Vérifie si une date est aujourd'hui
   * @param {number} timestamp - Timestamp à vérifier
   * @returns {boolean} - True si c'est aujourd'hui
   */
  isToday: (timestamp) => {
    if (!timestamp) return false;
    
    const today = new Date();
    const date = new Date(timestamp);
    
    return today.toDateString() === date.toDateString();
  },

  /**
   * Génère un ID unique basé sur le timestamp
   * @returns {string} - ID unique
   */
  generateId: () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}