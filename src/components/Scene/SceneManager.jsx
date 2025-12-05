// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// CONSTANTS
// ============================================

const CAMERA_CONFIG = {
  position: [0, 2, 5],
  fov: 75,
  near: 0.1,
  far: 1000
};

const RENDERER_CONFIG = {
  antialias: true,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.2,
  outputColorSpace: THREE.SRGBColorSpace
};

// ============================================
// TYPES (JSDoc)
// ============================================

/**
 * @typedef {Object} SceneManagerProps
 * @property {Function} [onSceneReady] - Callback when scene is ready
 * @property {'high' | 'medium' | 'low'} [performanceMode] - Performance mode
 * @property {React.ReactNode} children - Child components
 */

// ============================================
// COMPONENT
// ============================================

/**
 * Main scene manager component that wraps React Three Fiber Canvas
 * Handles WebGL initialization, context loss recovery, and window resize
 * 
 * @param {SceneManagerProps} props
 * @returns {JSX.Element}
 */
export default function SceneManager({ 
  onSceneReady, 
  performanceMode = 'high',
  children 
}) {
  // ----------------------------------------
  // STATE & REFS
  // ----------------------------------------
  const canvasRef = useRef();
  const [contextLost, setContextLost] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const resizeTimeoutRef = useRef(null);

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------
  
  // Handle WebGL context loss and restoration
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleContextLost = (event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting recovery...');
      setContextLost(true);
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored');
      setContextLost(false);
      // Reload the page to reinitialize everything
      window.location.reload();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, []);

  // Handle window resize with debounce
  useEffect(() => {
    const handleResize = () => {
      // Clear existing timeout
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      // Debounce resize event (300ms)
      resizeTimeoutRef.current = setTimeout(() => {
        // Canvas will auto-resize via R3F
        console.log('Window resized');
      }, 300);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  // Check WebGL support
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    
    if (!gl) {
      console.error('WebGL not supported');
      setContextLost(true);
    } else {
      setIsReady(true);
    }
  }, []);

  // ----------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------
  
  const handleCreated = ({ gl, scene, camera }) => {
    // Configure renderer
    gl.toneMapping = RENDERER_CONFIG.toneMapping;
    gl.toneMappingExposure = RENDERER_CONFIG.toneMappingExposure;
    gl.outputColorSpace = RENDERER_CONFIG.outputColorSpace;
    
    // Enable shadows based on performance mode
    if (performanceMode === 'high') {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    // Callback with scene references
    if (onSceneReady) {
      onSceneReady(scene, camera, gl);
    }

    console.log('Scene initialized successfully');
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  
  // Show error if WebGL not supported
  if (contextLost || !isReady) {
    return (
      <div className="flex items-center justify-center h-full flex-col gap-4 bg-bg-primary text-text-primary">
        <h2 className="text-3xl font-heading text-blood-bright">
          ⚠️ WebGL Error
        </h2>
        <p className="text-text-secondary font-body text-center max-w-md">
          {contextLost 
            ? 'Graphics context was lost. Please refresh the page.' 
            : 'Your browser doesn\'t support WebGL 2.0. Please update to the latest version of Chrome, Firefox, or Edge.'}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="horror-button mt-4"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <Canvas
      ref={canvasRef}
      camera={{
        position: CAMERA_CONFIG.position,
        fov: CAMERA_CONFIG.fov,
        near: CAMERA_CONFIG.near,
        far: CAMERA_CONFIG.far
      }}
      gl={{
        antialias: RENDERER_CONFIG.antialias,
        alpha: false,
        powerPreference: performanceMode === 'low' ? 'low-power' : 'high-performance'
      }}
      shadows={performanceMode === 'high'}
      dpr={performanceMode === 'low' ? [1, 1] : [1, 2]}
      onCreated={handleCreated}
      className="w-full h-full"
    >
      {children}
    </Canvas>
  );
}
