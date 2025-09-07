// FICHIER: src/hooks/useParticles.js
// ==============================================

import { useEffect, useRef, useCallback } from 'react';
import { APP_CONFIG } from '../config/appConfig';

/**
 * Hook pour le système de particules animées
 * @param {boolean} isActive - Si les particules doivent être actives
 * @returns {object} - Référence canvas et méthodes
 */
export const useParticles = (isActive = true) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  // Création des particules
  const createParticles = useCallback((canvas) => {
    const particles = [];
    const particleCount = Math.min(APP_CONFIG.UI.PARTICLES_COUNT, 60);
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#f97316' : '#22c55e',
        life: Math.random() * 100 + 50
      });
    }
    
    return particles;
  }, []);

  // Animation des particules
  const animate = useCallback((canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particlesRef.current.forEach((particle, index) => {
      // Mouvement
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      
      // Rebonds sur les bords
      if (particle.x < 0 || particle.x > canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > canvas.height) {
        particle.vy *= -1;
      }
      
      // Régénération des particules mortes
      if (particle.life <= 0) {
        particlesRef.current[index] = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: Math.random() * 3 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          color: Math.random() > 0.5 ? '#f97316' : '#22c55e',
          life: Math.random() * 100 + 50
        };
        return;
      }
      
      // Dessin de la particule
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particle.color;
      ctx.globalAlpha = particle.opacity * (isActive ? 1 : 0.3);
      ctx.fill();
      
      // Connexions entre particules proches
      particlesRef.current.forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.strokeStyle = particle.color;
          ctx.globalAlpha = (1 - distance / 100) * 0.2 * (isActive ? 1 : 0.1);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    });
    
    animationRef.current = requestAnimationFrame(() => animate(canvas, ctx));
  }, [isActive]);

  // Initialisation du canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      particlesRef.current = createParticles(canvas);
    };

    resize();
    window.addEventListener('resize', resize);
    
    // Démarrage de l'animation
    animate(canvas, ctx);

    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles, animate]);

  // Explosion de particules (effet spécial)
  const explode = useCallback((x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Création de particules temporaires pour l'explosion
    const explosionParticles = [];
    for (let i = 0; i < 20; i++) {
      explosionParticles.push({
        x: x || canvas.width / 2,
        y: y || canvas.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 4 + 2,
        opacity: 1,
        color: ['#f97316', '#22c55e', '#3b82f6', '#ec4899'][Math.floor(Math.random() * 4)],
        life: 30
      });
    }

    particlesRef.current = [...particlesRef.current, ...explosionParticles];
  }, []);

  return {
    canvasRef,
    explode
  };
};