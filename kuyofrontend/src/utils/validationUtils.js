// FICHIER: src/utils/validationUtils.js
// ==============================================

/**
 * Utilitaires de validation
 */
export const validationUtils = {
  /**
   * Valide une adresse email
   * @param {string} email - Email à valider
   * @returns {boolean} - True si valide
   */
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Valide un mot de passe
   * @param {string} password - Mot de passe à valider
   * @returns {object} - Résultat de validation
   */
  validatePassword: (password) => {
    const errors = [];
    
    if (!password) {
      errors.push('Mot de passe requis');
    } else {
      if (password.length < 6) {
        errors.push('Au moins 6 caractères');
      }
      if (!/[A-Z]/.test(password)) {
        errors.push('Au moins une majuscule');
      }
      if (!/[0-9]/.test(password)) {
        errors.push('Au moins un chiffre');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Valide un message avant envoi
   * @param {string} message - Message à valider
   * @returns {object} - Résultat de validation
   */
  validateMessage: (message) => {
    const errors = [];
    
    if (!message || !message.trim()) {
      errors.push('Message vide');
    } else {
      if (message.length > APP_CONFIG.LIMITS.MAX_MESSAGE_LENGTH) {
        errors.push(`Message trop long (max ${APP_CONFIG.LIMITS.MAX_MESSAGE_LENGTH} caractères)`);
      }
      if (message.trim().length < 2) {
        errors.push('Message trop court');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      cleanMessage: message?.trim() || ''
    };
  },

  /**
   * Vérifie si une URL est valide
   * @param {string} url - URL à valider
   * @returns {boolean} - True si valide
   */
  isValidUrl: (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}