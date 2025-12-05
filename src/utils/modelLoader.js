// ============================================
// IMPORTS
// ============================================

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// ============================================
// CONSTANTS
// ============================================

const LOADER_CACHE = new Map();
const MODEL_CACHE = new Map();

// ============================================
// LOADER INSTANCE
// ============================================

const gltfLoader = new GLTFLoader();

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Create a fallback model when loading fails
 * 
 * @returns {THREE.Group} Fallback model group
 */
export function createFallbackModel() {
  const group = new THREE.Group();
  
  // Create a red wireframe cube
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    wireframe: true,
    emissive: 0x8b0000,
    emissiveIntensity: 0.5
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  group.add(mesh);
  group.userData.isFallback = true;
  group.userData.error = 'Failed to load model';
  
  return group;
}

/**
 * Validate model URL
 * 
 * @param {string} url - Model URL to validate
 * @returns {boolean} True if valid
 */
export function validateModelUrl(url) {
  if (!url || typeof url !== 'string') {
    console.error('Model URL is required and must be a string');
    return false;
  }
  
  const validExtensions = ['.glb', '.gltf'];
  const hasValidExtension = validExtensions.some(ext => 
    url.toLowerCase().endsWith(ext)
  );
  
  if (!hasValidExtension) {
    console.error('Invalid model format. Use .glb or .gltf files');
    return false;
  }
  
  return true;
}

/**
 * Validate loaded model
 * 
 * @param {Object} gltf - Loaded GLTF object
 * @returns {boolean} True if valid
 */
export function validateModel(gltf) {
  if (!gltf || !gltf.scene) {
    console.error('Invalid GLTF structure');
    return false;
  }
  
  // Check if model has meshes
  let hasMeshes = false;
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      hasMeshes = true;
    }
  });
  
  if (!hasMeshes) {
    console.warn('Model has no meshes');
  }
  
  return true;
}

/**
 * Load a GLTF/GLB model with progress tracking and caching
 * 
 * @param {string} url - Path to model file
 * @param {Function} onProgress - Progress callback (loaded, total)
 * @returns {Promise<THREE.Group>} Loaded model group
 */
export async function loadModel(url, onProgress = null) {
  // Validate URL
  if (!validateModelUrl(url)) {
    console.error(`Invalid model URL: ${url}`);
    return createFallbackModel();
  }
  
  // Check cache
  if (MODEL_CACHE.has(url)) {
    console.log(`Loading model from cache: ${url}`);
    const cached = MODEL_CACHE.get(url);
    return cached.scene.clone();
  }
  
  try {
    console.log(`Loading model: ${url}`);
    
    // Load model with progress tracking
    const gltf = await new Promise((resolve, reject) => {
      gltfLoader.load(
        url,
        (gltf) => resolve(gltf),
        (progress) => {
          if (onProgress) {
            const percentComplete = progress.total > 0 
              ? (progress.loaded / progress.total) * 100 
              : 0;
            onProgress(progress.loaded, progress.total, percentComplete);
          }
        },
        (error) => reject(error)
      );
    });
    
    // Validate loaded model
    if (!validateModel(gltf)) {
      throw new Error('Model validation failed');
    }
    
    // Process model
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Ensure materials are properly configured
        if (child.material) {
          child.material.needsUpdate = true;
        }
      }
    });
    
    // Cache the model
    MODEL_CACHE.set(url, gltf);
    
    console.log(`Model loaded successfully: ${url}`);
    console.log(`Animations: ${gltf.animations.length}`);
    
    return gltf.scene;
    
  } catch (error) {
    console.error(`Failed to load model: ${url}`, error);
    
    // Return fallback model
    const fallback = createFallbackModel();
    fallback.userData.originalUrl = url;
    fallback.userData.error = error.message;
    
    return fallback;
  }
}

/**
 * Load model with animations
 * 
 * @param {string} url - Path to model file
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<{scene: THREE.Group, animations: THREE.AnimationClip[]}>}
 */
export async function loadModelWithAnimations(url, onProgress = null) {
  // Validate URL
  if (!validateModelUrl(url)) {
    return {
      scene: createFallbackModel(),
      animations: []
    };
  }
  
  // Check cache
  if (MODEL_CACHE.has(url)) {
    const cached = MODEL_CACHE.get(url);
    return {
      scene: cached.scene.clone(),
      animations: cached.animations
    };
  }
  
  try {
    const gltf = await new Promise((resolve, reject) => {
      gltfLoader.load(
        url,
        (gltf) => resolve(gltf),
        (progress) => {
          if (onProgress) {
            const percentComplete = progress.total > 0 
              ? (progress.loaded / progress.total) * 100 
              : 0;
            onProgress(progress.loaded, progress.total, percentComplete);
          }
        },
        (error) => reject(error)
      );
    });
    
    if (!validateModel(gltf)) {
      throw new Error('Model validation failed');
    }
    
    // Process model
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    
    // Cache the model
    MODEL_CACHE.set(url, gltf);
    
    return {
      scene: gltf.scene,
      animations: gltf.animations || []
    };
    
  } catch (error) {
    console.error(`Failed to load model with animations: ${url}`, error);
    
    return {
      scene: createFallbackModel(),
      animations: []
    };
  }
}

/**
 * Preload multiple models
 * 
 * @param {string[]} urls - Array of model URLs
 * @param {Function} onProgress - Progress callback (current, total)
 * @returns {Promise<void>}
 */
export async function preloadModels(urls, onProgress = null) {
  const total = urls.length;
  let loaded = 0;
  
  const promises = urls.map(async (url) => {
    try {
      await loadModel(url);
      loaded++;
      if (onProgress) {
        onProgress(loaded, total);
      }
    } catch (error) {
      console.error(`Failed to preload model: ${url}`, error);
      loaded++;
      if (onProgress) {
        onProgress(loaded, total);
      }
    }
  });
  
  await Promise.all(promises);
}

/**
 * Clear model cache
 */
export function clearModelCache() {
  MODEL_CACHE.clear();
  console.log('Model cache cleared');
}

/**
 * Get cache statistics
 * 
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  return {
    cachedModels: MODEL_CACHE.size,
    urls: Array.from(MODEL_CACHE.keys())
  };
}
