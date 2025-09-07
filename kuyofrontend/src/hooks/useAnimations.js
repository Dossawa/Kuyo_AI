// FICHIER: src/hooks/useAnimations.js
// ==============================================

import { useState, useCallback } from 'react';

export const useAnimations = () => {
  const [isVisible, setIsVisible] = useState(false);

  const animateIn = useCallback((delay = 0) => {
    setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, []);

  const getAnimationClasses = useCallback(() => {
    return isVisible 
      ? 'translate-y-0 opacity-100' 
      : 'translate-y-8 opacity-0';
  }, [isVisible]);

  return {
    isVisible,
    animateIn,
    getAnimationClasses
  };
};