import { useState } from 'react';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    const notification = { id, message, type };
    setNotifications(prev => [...prev, notification]);
    
    // Suppression automatique après 3 secondes
    setTimeout(() => {
      removeNotification(id);
    }, 3000);
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const notifySuccess = (message) => addNotification(message, 'success');
  const notifyError = (message) => addNotification(message, 'error');
  const notifyInfo = (message) => addNotification(message, 'info');

  return { 
    notifications, 
    notifySuccess, 
    notifyError, 
    notifyInfo, 
    removeNotification 
  };
};