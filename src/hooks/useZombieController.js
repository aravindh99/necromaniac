// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// CONSTANTS
// ============================================

const CROSSFADE_DURATION = 0.3; // seconds

// ============================================
// HOOK
// ============================================

/**
 * Controls zombie model animations
 * 
 * @param {THREE.Group} model - The loaded GLTF model
 * @param {THREE.AnimationClip[]} animations - Available animations
 * @returns {Object} Animation controller
 */
export function useZombieController(model, animations) {
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const [currentAnimation, setCurrentAnimation] = useState(null);

  // ----------------------------------------
  // SETUP ANIMATION MIXER
  // ----------------------------------------

  useEffect(() => {
    if (!model || !animations || animations.length === 0) {
      return;
    }

    // Create animation mixer
    const mixer = new THREE.AnimationMixer(model);
    mixerRef.current = mixer;

    // Create actions for all animations
    const actions = {};
    animations.forEach((clip) => {
      // Set loop mode
      clip.loop = THREE.LoopRepeat;
      
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;
    });
    actionsRef.current = actions;

    // Auto-play idle animation if available
    const idleAnimation = animations.find(
      (clip) => clip.name.toLowerCase().includes('idle')
    );
    
    if (idleAnimation) {
      const idleAction = actions[idleAnimation.name];
      if (idleAction) {
        idleAction.play();
        setCurrentAnimation(idleAnimation.name);
      }
    } else if (animations.length > 0) {
      // Fallback to first animation
      const firstAction = actions[animations[0].name];
      if (firstAction) {
        firstAction.play();
        setCurrentAnimation(animations[0].name);
      }
    }

    // Cleanup
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
      actionsRef.current = {};
    };
  }, [model, animations]);

  // ----------------------------------------
  // UPDATE MIXER
  // ----------------------------------------

  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  // ----------------------------------------
  // PLAY ANIMATION
  // ----------------------------------------

  const playAnimation = (animationName) => {
    if (!actionsRef.current[animationName]) {
      console.warn(`Animation "${animationName}" not found`);
      return;
    }

    const newAction = actionsRef.current[animationName];
    const currentAction = currentAnimation ? actionsRef.current[currentAnimation] : null;

    if (currentAction && currentAction !== newAction) {
      // Crossfade from current to new
      newAction.reset();
      newAction.play();
      currentAction.crossFadeTo(newAction, CROSSFADE_DURATION, true);
    } else if (!currentAction) {
      // No current animation, just play
      newAction.reset();
      newAction.play();
    }

    setCurrentAnimation(animationName);
  };

  // ----------------------------------------
  // RETURN API
  // ----------------------------------------

  return {
    currentAnimation,
    playAnimation,
    availableAnimations: animations ? animations.map((clip) => clip.name) : [],
  };
}
