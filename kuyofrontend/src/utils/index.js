// FICHIER: src/utils/index.js (Export centralisé)
// ==============================================

export { textUtils } from './textUtils';
export { dateUtils } from './dateUtils';
export { validationUtils } from './validationUtils';

// Export par défaut avec tous les utilitaires
export default {
  text: textUtils,
  date: dateUtils,
  validation: validationUtils
}