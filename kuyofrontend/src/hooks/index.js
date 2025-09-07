// FICHIER: src/hooks/index.js (Export centralisé mis à jour)
// ==============================================

export { useAuth } from './useAuth';
export { useChat } from './useChat';
export { useTheme } from './useTheme';
export { useLocalStorage } from './useLocalStorage';
export { useKeywords } from './useKeywords';
export { useServiceHealth } from './useServiceHealth';
export { useAnimations } from './useAnimations';
export { usePerformance } from './usePerformance';
export { useDebounce } from './useDebounce';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useKeyboardShortcuts } from './useKeyboardShortcuts';
export { useSpeechRecognition } from './useSpeechRecognition';
export { useMediaQuery } from './useMediaQuery';
export { useResponsive } from './useResponsive';

// Export par défaut avec tous les hooks organisés
export default {
  // Core hooks
  auth: useAuth,
  chat: useChat,
  theme: useTheme,
  
  // Data hooks
  localStorage: useLocalStorage,
  keywords: useKeywords,
  serviceHealth: useServiceHealth,
  
  // UI hooks
  animations: useAnimations,
  particles: useParticles,
  responsive: useResponsive,
  mediaQuery: useMediaQuery,
  
  // Performance hooks
  performance: usePerformance,
  debounce: useDebounce,
  intersectionObserver: useIntersectionObserver,
  
  // Feature hooks
  keyboardShortcuts: useKeyboardShortcuts,
  speechRecognition: useSpeechRecognition,
  notifications: useNotifications
};