// FICHIER: src/services/api/index.js
// ==============================================

export { BaseService } from './baseService';
export { WeaviateService } from './weaviateService';
export { GeminiService } from './geminiService';
export { AuthService } from './authService';

// Export par défaut avec tous les services
export default {
  Base: BaseService,
  Weaviate: WeaviateService,
  Gemini: GeminiService,
  Auth: AuthService
};