// FICHIER: src/hooks/useKeyboardShortcuts.js
// ==============================================

import { useEffect, useCallback } from 'react';

/**
 * Hook pour la gestion des raccourcis clavier
 * @param {object} shortcuts - Map des raccourcis
 */
export const useKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = useCallback((event) => {
    const key = event.key.toLowerCase();
    const combo = [
      event.ctrlKey && 'ctrl',
      event.metaKey && 'cmd',
      event.altKey && 'alt',
      event.shiftKey && 'shift',
      key
    ].filter(Boolean).join('+');

    if (shortcuts[combo]) {
      event.preventDefault();
      shortcuts[combo]();
    }
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};