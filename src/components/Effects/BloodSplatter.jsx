// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef, useState } from 'react';

// ============================================
// CONSTANTS
// ============================================

const PARTICLE_COUNT_MIN = 20;
const PARTICLE_COUNT_MAX = 40;
const PARTICLE_LIFETIME = 1500; // 1.5 seconds
const GRAVITY = 500; // pixels per second squared

// ============================================
// COMPONENT
// ============================================

/**
 * Blood splatter particle system
 * Spawns particles on user clicks
 * 
 * @returns {JSX.Element}
 */
export default function BloodSplatter() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationFrameRef = useRef(null);
  const lastTimeRef = useRef(Date.now());

  // ----------------------------------------
  // PARTICLE SYSTEM
  // ----------------------------------------

  const createParticles = (x, y) => {
    const count = PARTICLE_COUNT_MIN + Math.floor(Math.random() * (PARTICLE_COUNT_MAX - PARTICLE_COUNT_MIN));
    const newParticles = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 200;
      
      newParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100, // Initial upward velocity
        size: 3 + Math.random() * 5,
        alpha: 1,
        birthTime: Date.now(),
      });
    }

    particlesRef.current.push(...newParticles);
  };

  const updateParticles = (deltaTime) => {
    const now = Date.now();
    const dt = deltaTime / 1000; // Convert to seconds

    particlesRef.current = particlesRef.current.filter((particle) => {
      const age = now - particle.birthTime;
      
      // Remove dead particles
      if (age > PARTICLE_LIFETIME) {
        return false;
      }

      // Update physics
      particle.vy += GRAVITY * dt;
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;

      // Fade out
      particle.alpha = 1 - (age / PARTICLE_LIFETIME);

      return true;
    });
  };

  const renderParticles = (ctx) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    particlesRef.current.forEach((particle) => {
      ctx.save();
      ctx.globalAlpha = particle.alpha;
      
      // Create gradient from dark red to darker red
      const gradient = ctx.createRadialGradient(
        particle.x, particle.y, 0,
        particle.x, particle.y, particle.size
      );
      gradient.addColorStop(0, '#8b0000');
      gradient.addColorStop(1, '#4a0000');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  };

  // ----------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------

  const animate = () => {
    const now = Date.now();
    const deltaTime = now - lastTimeRef.current;
    lastTimeRef.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    updateParticles(deltaTime);
    renderParticles(ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Click handler
    const handleClick = (e) => {
      createParticles(e.clientX, e.clientY);
    };
    document.addEventListener('click', handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 40 }}
    />
  );
}
