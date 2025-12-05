// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { loadModelWithAnimations, createFallbackModel } from '../../utils/modelLoader';
import { useZombieController } from '../../hooks/useZombieController';

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_SCALE = 1.0;

// ============================================
// TYPES (JSDoc)
// ============================================

/**
 * @typedef {Object} ZombieModelProps
 * @property {string} modelUrl - Path to GLTF/GLB model file
 * @property {[number, number, number]} [position] - XYZ position
 * @property {number} [scale] - Uniform scale multiplier
 * @property {Function} [onLoad] - Callback when model loads (model, animations)
 * @property {Function} [onError] - Callback when model fails to load (error)
 * @property {Function} [onProgress] - Progress callback (loaded, total, percent)
 */

// ============================================
// COMPONENT
// ============================================

/**
 * Renders an animated zombie 3D model
 * Handles loading, error states, and progress tracking
 * 
 * @param {ZombieModelProps} props
 * @param {React.Ref} ref
 * @returns {JSX.Element}
 */
function ZombieModel({
  modelUrl,
  position = [0, 0, 0],
  scale = DEFAULT_SCALE,
  onLoad,
  onError,
  onProgress
}, ref) {
  // ----------------------------------------
  // STATE & REFS
  // ----------------------------------------
  const groupRef = useRef();
  const [model, setModel] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [error, setError] = useState(null);

  // Animation controller (must be inside Canvas)
  const animationController = useZombieController(model, animations);

  // Expose animation controller to parent
  useImperativeHandle(ref, () => ({
    playAnimation: animationController.playAnimation,
    currentAnimation: animationController.currentAnimation,
    availableAnimations: animationController.availableAnimations
  }));

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------

  // Load model
  useEffect(() => {
    let cancelled = false;

    const loadModel = async () => {
      setIsLoading(true);
      setError(null);
      setLoadProgress(0);

      try {
        const handleProgress = (loaded, total, percent) => {
          if (!cancelled) {
            setLoadProgress(percent);
            if (onProgress) {
              onProgress(loaded, total, percent);
            }
          }
        };

        const result = await loadModelWithAnimations(modelUrl, handleProgress);

        if (cancelled) return;

        console.log('Model load result:', {
          hasScene: !!result.scene,
          animationCount: result.animations.length,
          isFallback: result.scene?.userData?.isFallback
        });

        setModel(result.scene);
        setAnimations(result.animations);
        setIsLoading(false);
        setLoadProgress(100);

        // Check if it's a fallback model
        if (result.scene.userData.isFallback) {
          const errorMsg = result.scene.userData.error || 'Failed to load model';
          console.error('Fallback model loaded:', errorMsg);
          setError(errorMsg);
          if (onError) {
            onError(new Error(errorMsg));
          }
        } else {
          console.log('Real model loaded successfully!');
          if (onLoad) {
            // Pass animation controller to parent
            setTimeout(() => {
              onLoad(result.scene, result.animations, animationController);
            }, 100);
          }
        }
      } catch (err) {
        if (cancelled) return;

        console.error('Error loading model:', err);
        setError(err.message);
        setIsLoading(false);

        // Create fallback model
        const fallback = createFallbackModel();
        setModel(fallback);

        if (onError) {
          onError(err);
        }
      }
    };

    if (modelUrl) {
      loadModel();
    }

    return () => {
      cancelled = true;
    };
  }, [modelUrl, onLoad, onError, onProgress]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (model) {
        model.traverse((child) => {
          if (child.isMesh) {
            if (child.geometry) {
              child.geometry.dispose();
            }
            if (child.material) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.dispose());
              } else {
                child.material.dispose();
              }
            }
          }
        });
      }
    };
  }, [model]);

  // ----------------------------------------
  // ANIMATION LOOP
  // ----------------------------------------

  useFrame((state, delta) => {
    // Subtle idle rotation for fallback models
    if (model && model.userData.isFallback && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // ----------------------------------------
  // RENDER
  // ----------------------------------------

  // Loading state
  if (isLoading && !model) {
    return (
      <group ref={groupRef} position={position}>
        {/* Loading placeholder */}
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial 
            color="#8b0000" 
            wireframe 
            opacity={0.5}
            transparent
          />
        </mesh>
      </group>
    );
  }

  // Error state (with fallback model)
  if (error && model) {
    return (
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={model} />
      </group>
    );
  }

  // Loaded state
  if (model) {
    return (
      <group ref={groupRef} position={position} scale={scale}>
        <primitive object={model} />
      </group>
    );
  }

  return null;
}

export default forwardRef(ZombieModel);
