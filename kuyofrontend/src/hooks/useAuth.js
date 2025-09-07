// FICHIER: src/hooks/useAuth.js
// ==============================================

import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Récupération utilisateur au démarrage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('kuyo_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!email || !email.includes('@')) {
        throw new Error('Email invalide');
      }
      
      const newUser = { 
        email, 
        name: email.split('@')[0],
        connectedAt: Date.now()
      };
      
      setUser(newUser);
      localStorage.setItem('kuyo_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kuyo_user');
    localStorage.removeItem('kuyo_sessions');
  };

  return { 
    user, 
    isLoading, 
    isAuthenticated: !!user,
    login, 
    logout 
  };
};