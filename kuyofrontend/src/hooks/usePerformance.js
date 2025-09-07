// FICHIER: src/hooks/usePerformance.js
// ==============================================

import { useState } from 'react';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    apiResponseTime: 0
  });

  const startApiTimer = () => {
    // Simulation
  };

  const endApiTimer = () => {
    // Simulation
  };

  const optimizePerformance = () => {
    // Simulation
  };

  return {
    metrics,
    startApiTimer,
    endApiTimer,
    optimizePerformance
  };
};