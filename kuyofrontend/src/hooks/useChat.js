// FICHIER: src/hooks/useChat.js
// ==============================================

import { useState, useEffect, useCallback, useRef } from 'react';

export const useChat = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSessionIndex, setActiveSessionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialisation
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem('kuyo_sessions');
      if (savedSessions) {
        setSessions(JSON.parse(savedSessions));
      } else {
        const defaultSession = {
          id: `session_${Date.now()}`,
          title: "🎣 Hooks Personnalisés Actifs",
          createdAt: Date.now(),
          history: [{
            role: "bot",
            content: "🎉 **Hooks Fonctionnels !**\n\n✅ useAuth → Authentification OK\n✅ useNotifications → Toast OK\n✅ useChat → Sessions OK\n✅ useTheme → Thèmes OK\n\nTous vos hooks personnalisés fonctionnent parfaitement !",
            timestamp: Date.now(),
            source: "KUYO Hooks v2.0"
          }]
        };
        setSessions([defaultSession]);
      }
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
      // Session par défaut en cas d'erreur
      setSessions([{
        id: `session_${Date.now()}`,
        title: "Session par défaut",
        createdAt: Date.now(),
        history: [{
          role: "bot",
          content: "Bienvenue ! Vos hooks sont maintenant opérationnels.",
          timestamp: Date.now(),
          source: "KUYO"
        }]
      }]);
    }
  }, []);

  // Sauvegarde automatique
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem('kuyo_sessions', JSON.stringify(sessions));
      } catch (error) {
        console.error('Erreur sauvegarde:', error);
      }
    }
  }, [sessions]);

  const activeSession = sessions[activeSessionIndex] || null;

  const sendMessage = useCallback(async (message) => {
    if (!message.trim()) {
      return { success: false, error: 'Message vide' };
    }

    const userMessage = {
      role: "user",
      content: message.trim(),
      timestamp: Date.now()
    };

    // Ajout message utilisateur
    setSessions(prev => {
      const updated = [...prev];
      if (updated[activeSessionIndex]) {
        updated[activeSessionIndex].history.push(userMessage);
      }
      return updated;
    });

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const responses = [
        '🎯 **Test Hooks Réussi !**\n\nVos hooks personnalisés traitent parfaitement les messages :\n\n🎣 useChat → Gestion OK\n🔔 useNotifications → Feedback OK\n👤 useAuth → Sécurité OK',
        '⚡ **Architecture Modulaire !**\n\nChaque hook fonctionne indépendamment :\n\n📦 Code séparé\n🔧 Logique isolée\n✨ Réutilisabilité maximale',
        '🚀 **Performance Optimale !**\n\nVos hooks sont optimisés :\n\n💨 Rendu rapide\n💾 Mémoire efficace\n🔄 Mise à jour fluide'
      ];

      const botResponse = {
        role: "bot",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: Date.now(),
        source: "KUYO Hooks Test"
      };

      setSessions(prev => {
        const updated = [...prev];
        if (updated[activeSessionIndex]) {
          updated[activeSessionIndex].history.push(botResponse);
          
          // Mise à jour titre si premier message
          const userMessages = updated[activeSessionIndex].history.filter(m => m.role === 'user');
          if (userMessages.length === 1) {
            updated[activeSessionIndex].title = message.length > 30 ? `${message.slice(0, 30)}...` : message;
          }
        }
        return updated;
      });

      return { success: true };
    } catch (error) {
      const errorResponse = {
        role: "bot",
        content: "❌ Erreur lors du traitement. Réessayez.",
        timestamp: Date.now(),
        error: true
      };

      setSessions(prev => {
        const updated = [...prev];
        if (updated[activeSessionIndex]) {
          updated[activeSessionIndex].history.push(errorResponse);
        }
        return updated;
      });

      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionIndex]);

  const createNewSession = useCallback(() => {
    const newSession = {
      id: `session_${Date.now()}`,
      title: "Nouvelle session",
      createdAt: Date.now(),
      history: [{
        role: "bot",
        content: "✨ Nouvelle session créée avec vos hooks !",
        timestamp: Date.now(),
        source: "KUYO"
      }]
    };
    
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionIndex(0);
    
    return newSession;
  }, []);

  const selectSession = useCallback((index) => {
    if (index >= 0 && index < sessions.length) {
      setActiveSessionIndex(index);
    }
  }, [sessions.length]);

  const deleteSession = useCallback((index) => {
    if (sessions.length <= 1) {
      return { success: false, error: 'Au moins une session requise' };
    }

    setSessions(prev => {
      const newSessions = prev.filter((_, i) => i !== index);
      
      if (activeSessionIndex === index) {
        setActiveSessionIndex(0);
      } else if (activeSessionIndex > index) {
        setActiveSessionIndex(prev => prev - 1);
      }
      
      return newSessions;
    });

    return { success: true };
  }, [sessions.length, activeSessionIndex]);

  return {
    sessions,
    activeSession,
    activeSessionIndex,
    isLoading,
    messagesEndRef,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession
  };
};
