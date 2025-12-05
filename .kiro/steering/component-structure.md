# Component Structure Standards

## File Template

Every component should follow this exact structure:
```javascript
// ============================================
// IMPORTS
// ============================================

// 1. React imports (grouped)
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';

// 2. Third-party libraries (alphabetical)
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3. Local imports
import { useZombieController } from '../hooks/useZombieController';
import { THEME } from '../constants/theme';

// 4. Styles (last)
import styles from './ZombieModel.module.css';


// ============================================
// CONSTANTS
// ============================================

const DEFAULT_SCALE = 1.0;
const ANIMATION_SPEED = 1.0;


// ============================================
// TYPES (JSDoc)
// ============================================

/**
 * @typedef {Object} ZombieModelProps
 * @property {string} modelUrl - Path to model file
 * @property {[number, number, number]} position - XYZ coordinates
 * @property {number} [scale] - Scale multiplier
 * @property {Function} [onLoad] - Load callback
 */


// ============================================
// COMPONENT
// ============================================

/**
 * Renders an animated zombie 3D model
 * 
 * @param {ZombieModelProps} props
 * @returns {JSX.Element}
 */
export default function ZombieModel({ 
  modelUrl, 
  position = [0, 0, 0],
  scale = DEFAULT_SCALE,
  onLoad 
}) {
  // ----------------------------------------
  // STATE & REFS
  // ----------------------------------------
  const meshRef = useRef();
  const [isLoaded, setIsLoaded] = useState(false);
  
  
  // ----------------------------------------
  // CUSTOM HOOKS
  // ----------------------------------------
  const { playAnimation, stopAnimation } = useZombieController(meshRef);
  
  
  // ----------------------------------------
  // DERIVED STATE (useMemo)
  // ----------------------------------------
  const scaledPosition = useMemo(() => {
    return position.map(p => p * scale);
  }, [position, scale]);
  
  
  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------
  useEffect(() => {
    // Setup
    loadModel(modelUrl);
    
    // Cleanup
    return () => {
      if (meshRef.current) {
        meshRef.current.geometry.dispose();
        meshRef.current.material.dispose();
      }
    };
  }, [modelUrl]);
  
  
  // ----------------------------------------
  // EVENT HANDLERS (useCallback)
  // ----------------------------------------
  const handleClick = useCallback(() => {
    playAnimation('attack');
  }, [playAnimation]);
  
  
  // ----------------------------------------
  // ANIMATION LOOP (useFrame for R3F)
  // ----------------------------------------
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });
  
  
  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  if (!isLoaded) {
    return ;
  }
  
  return (
    
      
    
  );
}


// ============================================
// HELPER COMPONENTS (Optional)
// ============================================

function LoadingPlaceholder() {
  return (
    
      
      
    
  );
}
```

## Section Order (MANDATORY)

1. **Imports** - React first, then libraries, then local
2. **Constants** - Module-level constants in SCREAMING_SNAKE_CASE
3. **Types** - JSDoc type definitions
4. **Component** - Main component function
   - State & Refs
   - Custom Hooks
   - Derived State (useMemo)
   - Effects (useEffect)
   - Event Handlers (useCallback)
   - Animation Loops (useFrame)
   - Render
5. **Helper Components** - Small sub-components (if needed)

## Rules

- ✅ Default export at the end of the file
- ✅ Named exports for sub-components (if any)
- ✅ One main component per file
- ✅ Helper components only if they're used once
- ❌ No inline component definitions in render
- ❌ No class components

## Hook Order

Hooks must appear in this exact order:
```javascript
// 1. useState
const [count, setCount] = useState(0);
const [isOpen, setIsOpen] = useState(false);

// 2. useReducer (if needed)
const [state, dispatch] = useReducer(reducer, initialState);

// 3. useRef
const meshRef = useRef();
const inputRef = useRef();

// 4. useContext (if needed)
const theme = useContext(ThemeContext);

// 5. Custom hooks
const { data, loading } = useCustomHook();

// 6. useMemo
const computed = useMemo(() => calculate(data), [data]);

// 7. useCallback  
const handler = useCallback(() => {}, []);

// 8. useEffect
useEffect(() => {}, []);

// 9. useLayoutEffect (rare)
useLayoutEffect(() => {}, []);
```

## Examples

### ✅ CORRECT
```javascript
import { useState } from 'react';

const MAX_ZOMBIES = 10;

export default function ZombieCounter() {
  const [count, setCount] = useState(0);
  
  return {count} zombies;
}
```

### ❌ WRONG
```javascript
// Wrong: Inline export
export default function ZombieCounter() {
  return zombies;
}

// Wrong: Constant inside component
function ZombieCounter() {
  const MAX_ZOMBIES = 10; // Should be outside!
  return zombies;
}
```