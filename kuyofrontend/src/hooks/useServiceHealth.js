/ FICHIER: src/hooks/useServiceHealth.js
// ==============================================

import { useState } from 'react';

export const useServiceHealth = () => {
  const [healthStatus, setHealthStatus] = useState({
    weaviate: false,
    gemini: false,
    overall: false
  });

  const checkHealth = async () => {
    // Simulation check
    setHealthStatus({
      weaviate: true,
      gemini: true,
      overall: true
    });
  };

  return {
    healthStatus,
    checkHealth
  };
};