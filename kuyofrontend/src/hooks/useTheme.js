// FICHIER: src/hooks/useTheme.js
// ==============================================

import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('kuyo_theme');
      if (savedTheme) {
        setIsDarkMode(savedTheme === 'dark');
      } else {
        // Détection du thème système
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
      }
    } catch (error) {
      console.error('Erreur chargement thème:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kuyo_theme', isDarkMode ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', isDarkMode);
    } catch (error) {
      console.error('Erreur sauvegarde thème:', error);
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const themeClasses = {
    background: isDarkMode 
      ? "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white"
      : "bg-gradient-to-br from-orange-50 via-amber-50 to-green-50 text-gray-900",
    card: isDarkMode ? "bg-gray-800/90 border-gray-600" : "bg-white/90 border-white/50",
    sidebar: isDarkMode ? "bg-gray-800/95 border-gray-700" : "bg-white/95 border-gray-200"
  };

  return {
    isDarkMode,
    theme: isDarkMode ? 'dark' : 'light',
    themeClasses,
    toggleTheme
  };
};