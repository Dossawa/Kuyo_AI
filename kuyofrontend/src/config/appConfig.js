// src/config/appConfig.js
/**
 * Configuration centralisée de l'application KUYO
 * Adaptée pour Vite (import.meta.env au lieu de process.env)
 */

// Validation des variables d'environnement requises
const requiredEnvVars = [
  'VITE_GEMINI_API_KEY',
  'VITE_WEAVIATE_URL'
];

// Vérification en mode développement
if (import.meta.env.MODE === 'development') {
  const missingVars = requiredEnvVars.filter(
    varName => !import.meta.env[varName]
  );
  
  if (missingVars.length > 0) {
    console.warn('⚠️ Variables d\'environnement manquantes:', missingVars);
    console.warn('📝 Créez un fichier .env.local avec ces variables ou utilisez les valeurs par défaut');
  }
}

// Configuration principale
export const APP_CONFIG = {
  // Informations de l'application
  APP: {
    NAME: 'KUYO',
    VERSION: import.meta.env.VITE_APP_VERSION || '2.0.0',
    DESCRIPTION: 'Assistant Citoyen IA Ivoirien',
    ENV: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development',
    DEBUG: import.meta.env.VITE_DEBUG === 'true'
  },

  // Configuration API
  API: {
    GEMINI: {
      // 🔑 NE PAS mettre de clé en dur, on lit uniquement l'env
      API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "",
      // ⚙️ Endpoint aligné sur v1beta + modèle paramétrable (fallback flash)
      BASE_URL: `https://generativelanguage.googleapis.com/v1beta/models/${
        import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'
      }:generateContent`,
      ENABLED: import.meta.env.VITE_USE_GEMINI !== 'false' // true par défaut
    },
    WEAVIATE: {
      URL: import.meta.env.VITE_WEAVIATE_URL || 'http://localhost:8080/v1/graphql',
      TIMEOUT: 10000 // 10 secondes
    }
  },

  // Seuils et limites
  THRESHOLDS: {
    RELEVANCE: parseFloat(import.meta.env.VITE_RELEVANCE_THRESHOLD) || 0.3,
    CERTAINTY: parseFloat(import.meta.env.VITE_CERTAINTY_THRESHOLD) || 0.7
  },

  LIMITS: {
    MAX_CONCEPTS: parseInt(import.meta.env.VITE_MAX_CONCEPTS) || 10,
    DEFAULT_RESULTS: parseInt(import.meta.env.VITE_DEFAULT_LIMIT) || 5,
    MAX_MESSAGE_LENGTH: 500,
    MAX_SESSIONS: 50,
    MAX_HISTORY_PER_SESSION: 100
  },

  // Configuration UI
  UI: {
    ANIMATION_DURATION: 300,
    TYPING_DELAY: 500,
    AUTO_SCROLL_DELAY: 100,
    PARTICLES_COUNT: parseInt(import.meta.env.VITE_PARTICLES_COUNT) || 50,
    SIDEBAR_WIDTH: 320
  },

  // Messages par défaut
  MESSAGES: {
    WELCOME: "🎉 Bienvenue sur KUYO ! Je suis votre assistant IA personnalisé pour les services publics ivoiriens.",
    ERROR_NETWORK: "❌ Erreur de connexion. Vérifiez votre connexion internet.",
    ERROR_API: "⚠️ Erreur technique. Veuillez réessayer dans quelques instants.",
    NO_RESULTS: "🤔 Je n'ai pas trouvé d'information spécifique. Reformulez votre question.",
    TYPING: "KUYO réfléchit...",
    NEW_SESSION: "🎯 Nouvelle session démarrée ! Comment puis-je vous aider ?"
  },

  // Mots vides français (pour l'extraction de concepts)
  STOPWORDS: new Set([
    "faire", "demande", "comment", "pour", "obtenir", "est", "le", "la", "un", "une", 
    "des", "de", "du", "et", "à", "ce", "que", "qui", "avec", "dans", "sur", "par", 
    "son", "sa", "ses", "ma", "mon", "mes", "ta", "ton", "tes", "nous", "vous", "ils",
    "elle", "elles", "ou", "où", "mais", "donc", "car", "puis", "alors", "ainsi",
    "avoir", "être", "aller", "venir", "voir", "savoir", "vouloir", "pouvoir", "devoir"
  ])
};

// Fonction utilitaire pour vérifier la configuration
export const validateConfig = () => {
  const errors = [];

  if (!APP_CONFIG.API.GEMINI.API_KEY) {
    errors.push('Clé API Gemini manquante');
  }

  if (!APP_CONFIG.API.WEAVIATE.URL) {
    errors.push('URL Weaviate manquante');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Log de la configuration en développement
if (import.meta.env.MODE === 'development') {
  console.log('📋 KUYO Config loaded:', {
    mode: APP_CONFIG.APP.ENV,
    version: APP_CONFIG.APP.VERSION,
    geminiEnabled: APP_CONFIG.API.GEMINI.ENABLED,
    weaviateUrl: APP_CONFIG.API.WEAVIATE.URL,
    particlesCount: APP_CONFIG.UI.PARTICLES_COUNT
  });
  
  const validation = validateConfig();
  if (!validation.isValid) {
    console.warn('⚠️ Configuration issues:', validation.errors);
  } else {
    console.log('✅ Configuration is valid');
  }
}

// Export par défaut
export default APP_CONFIG;
