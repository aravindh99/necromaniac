// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef } from 'react';

// ============================================
// CONSTANTS
// ============================================

const GRAIN_OPACITY = 0.05;
const GRAIN_SIZE = 2; // Size of each grain pixel
const FPS_THROTTLE = 30; // Update grain at 30fps for performance

// ============================================
// COMPONENT
// ============================================

/**
 * Film grain noise overlay
 * Generates animated noise texture
 * 
 * @returns {JSX.Element}
 */
export default function FilmGrain() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(0);

  // ----------------------------------------
  // GRAIN GENERATION
  // ----------------------------------------

  const generateGrain = (ctx, width, height) => {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const value = Math.random() * 255;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255 * GRAIN_OPACITY; // A
    }

    ctx.putImageData(imageData, 0, 0);
  };

  // ----------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------

  const animate = (timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Throttle to target FPS
    const elapsed = timestamp - lastUpdateRef.current;
    const targetInterval = 1000 / FPS_THROTTLE;

    if (elapsed >= targetInterval) {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        generateGrain(ctx, canvas.width, canvas.height);
      }
      lastUpdateRef.current = timestamp;
    }

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size (reduced for performance)
    const resizeCanvas = () => {
      canvas.width = Math.floor(window.innerWidth / GRAIN_SIZE);
      canvas.height = Math.floor(window.innerHeight / GRAIN_SIZE);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
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
      style={{
        zIndex: 20,
        width: '100%',
        height: '100%',
        imageRendering: 'pixelated',
      }}
    />
  );
}
