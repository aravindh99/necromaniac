# Necromorph Studio - Code Style Guide

## Purpose
This document defines coding standards for the Necromorph Studio project to ensure consistency across all AI-generated and human-written code.

---

## React Component Standards

### Component Structure
```javascript
// ✅ CORRECT ORDER:
// 1. Imports (React first, then libraries, then local)
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useZombieController } from '../hooks/useZombieController';// 2. Constants (outside component, UPPERCASE)
const DEFAULT_ANIMATION_SPEED = 1.0;
const MAX_ZOMBIES = 5;// 3. Component function
export default function ZombieModel({ modelUrl, position = [0, 0, 0] }) {
// 4. Hooks (at the very top)
const meshRef = useRef();
const [isLoaded, setIsLoaded] = useState(false);
const { playAnimation } = useZombieController();// 5. Effects
useEffect(() => {
// Setup
return () => {
// Cleanup
};
}, []);// 6. Event handlers
const handleClick = () => {
// Handler logic
};// 7. Render
return (
<mesh ref={meshRef} onClick={handleClick}>
{/* JSX */}
</mesh>
);
}// ❌ WRONG - Don't export inline
// export default function Component() { }

### Component Rules
- **ALWAYS** use functional components (NO class components)
- **ALWAYS** destructure props in function signature
- **ALWAYS** provide default values for optional props
- **ONE** component per file
- **DEFAULT** export at the bottom of file
- **NEVER** use anonymous functions as default exports

### Naming Conventions
- Components: `PascalCase` (e.g., `ZombieModel.jsx`)
- Hooks: `camelCase` with `use` prefix (e.g., `useHorrorEffects.js`)
- Utils: `camelCase` (e.g., `modelLoader.js`)
- Constants: `SCREAMING_SNAKE_CASE`
- Props: `camelCase`

---

## Three.js & React Three Fiber Rules

### Critical Memory Management
```javascript// ✅ CORRECT - Always dispose Three.js objects
useEffect(() => {
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial();
const mesh = new THREE.Mesh(geometry, material);return () => {
// CRITICAL: Dispose in reverse order
mesh.geometry.dispose();
mesh.material.dispose();
if (mesh.material.map) mesh.material.map.dispose();
};
}, []);// ❌ WRONG - Memory leak!
useEffect(() => {
const mesh = new THREE.Mesh(
new THREE.BoxGeometry(),
new THREE.MeshStandardMaterial()
);
// Missing cleanup!
}, []);

### State Management for Three.js
- **NEVER** store Three.js objects in `useState`
- **ALWAYS** use `useRef` for Three.js objects
- **REASON**: Three.js objects are mutable, React state is immutable
```javascript// ✅ CORRECT
const meshRef = useRef();
const animationMixerRef = useRef();// ❌ WRONG
const [mesh, setMesh] = useState(null); // DON'T DO THIS!

### React Three Fiber Preferences
- **PREFER** declarative R3F components over imperative Three.js
- **USE** `<primitive object={threeObject} />` for loaded models
- **USE** `useFrame` for animation loops (not `requestAnimationFrame`)
- **USE** `useLoader` for loading assets
```javascript// ✅ CORRECT - Declarative
<mesh>
<boxGeometry args={[1, 1, 1]} />
<meshStandardMaterial color="#8b0000" />
</mesh>// ⚠️ OK but less preferred - Imperative
useEffect(() => {
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);return () => {
geometry.dispose();
material.dispose();
scene.remove(mesh);
};
}, []);

---

## Performance Standards

### Code Splitting & Lazy Loading
```javascript// ✅ CORRECT - Lazy load heavy components
import { lazy, Suspense } from 'react';const ZombieModel = lazy(() => import('./components/ZombieModel'));function App() {
return (
<Suspense fallback={<LoadingScreen />}>
<ZombieModel />
</Suspense>
);
}

### Performance Limits
- **MAX** 50,000 polygons per model
- **MAX** 5,000 particles on screen
- **TARGET** 60 FPS on mid-range devices
- **DEBOUNCE** window resize events (300ms minimum)
- **THROTTLE** mouse move events (16ms = 60fps)

### Optimization Patterns
```javascript// ✅ CORRECT - Memoize expensive computations
import { useMemo } from 'react';const processedData = useMemo(() => {
return expensiveCalculation(data);
}, [data]);// ✅ CORRECT - Use useCallback for event handlers
import { useCallback } from 'react';const handleClick = useCallback(() => {
doSomething();
}, [dependency]);

---

## Horror Theme Standards

### Color Palette (STRICT)
```javascriptconst THEME = {
// Backgrounds
primary_bg: '#0a0a0a',      // Pure black with slight tint
secondary_bg: '#1a1a1a',    // Slightly lighter black// Accent Colors
blood_red: '#8b0000',       // Dark blood red
toxic_green: '#00ff00',     // Bright toxic green
ghost_purple: '#6600ff',    // Deep purple// Text
text_primary: '#e0e0e0',    // Light gray
text_secondary: '#888888',  // Medium gray
text_danger: '#ff0000',     // Bright red (errors)// Effects
glow_red: 'rgba(139, 0, 0, 0.8)',
glow_green: 'rgba(0, 255, 0, 0.6)',
};// ✅ CORRECT - Use theme constants
<div style={{ backgroundColor: THEME.primary_bg }}>// ❌ WRONG - Hardcoded colors
<div style={{ backgroundColor: '#000000' }}>
````
Typography
const FONTS = {
heading: "'Creepster', cursive",      // For titles
body: "'Roboto Mono', monospace",     // For UI text
code: "'Fira Code', monospace",       // For code snippets
};// Import in index.html or CSS
@import url('https://fonts.googleapis.com/css2?family=Creepster&family=Roboto+Mono&display=swap');

### Animation Standards
```javascript// ✅ CORRECT - Consistent timing
const ANIMATION_DEFAULTS = {
duration: 0.3,        // seconds
easing: 'ease-out',   // Always ease-out for natural feel
delay: 0,
};// Use with Framer Motion
<motion.div
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
transition={{ duration: 0.3, ease: 'easeOut' }}
/>// Use with CSS
.element {
transition: all 0.3s ease-out;
}

### Horror Effect Guidelines
- **Glitch effects**: Trigger every 8-15 seconds (random)
- **Blood splatters**: Only on user clicks (never automatic)
- **Screen shake**: Max 5px amplitude, 0.2s duration
- **Flashing lights**: Always include seizure warning
- **Audio**: NEVER auto-play, require user interaction first

---

## Error Handling

### Always Validate
```javascript// ✅ CORRECT - Defensive programming
function loadModel(url) {
if (!url) {
console.error('Model URL is required');
return null;
}if (!url.endsWith('.glb') && !url.endsWith('.gltf')) {
console.error('Invalid model format. Use .glb or .gltf');
return null;
}try {
// Load model
} catch (error) {
console.error('Failed to load model:', error);
return null;
}
}

### User-Friendly Error Messages
```javascript// ✅ CORRECT - Show helpful error to user
<ErrorBoundary
fallback={
<div className="error-container">
<h2>👻 Something Spooky Happened!</h2>
<p>Failed to load the zombie model. Please refresh the page.</p>
<button onClick={() => window.location.reload()}>
Resurrect Page
</button>
</div>
}


  <ZombieModel />
</ErrorBoundary>// ❌ WRONG - Cryptic error
<p>Error: undefined is not a function</p>
````

File Organization
Import Order
// 1. React imports
import { useEffect, useState } from 'react';// 2. Third-party libraries (alphabetical)
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';// 3. Local components
import ZombieModel from './components/ZombieModel';
import HorrorOverlay from './components/HorrorOverlay';// 4. Hooks
import { useZombieController } from './hooks/useZombieController';// 5. Utils
import { loadModel } from './utils/modelLoader';// 6. Constants/Config
import { THEME, ANIMATIONS } from './constants';// 7. Styles (last)
import './App.css';

### Folder Structuresrc/
├── components/
│   ├── Scene/          # 3D scene components
│   ├── UI/             # Interface components
│   └── Effects/        # Visual effects
├── hooks/              # Custom React hooks
├── utils/              # Helper functions
├── constants/          # Configuration
├── assets/             # Static files
└── styles/             # CSS modules

---

## Comments & Documentation

### JSDoc for Components
```javascript/**

Renders an animated zombie model with configurable animations

@param {Object} props - Component props
@param {string} props.modelUrl - Path to GLTF/GLB model file
@param {[number, number, number]} props.position - XYZ position in 3D space
@param {number} props.scale - Uniform scale multiplier (default: 1)
@param {Function} props.onLoad - Callback when model finishes loading
@param {Function} props.onError - Callback when model fails to load

@returns {JSX.Element} Zombie model component

@example
<ZombieModel
modelUrl="/models/zombie.glb"
position={[0, 0, 0]}
scale={1.5}
onLoad={() => console.log('Loaded!')}
/>
*/
export default function ZombieModel({
modelUrl,
position = [0, 0, 0],
scale = 1,
onLoad,
onError
}) {
// Implementation
}


### Inline Comments
```javascript// ✅ CORRECT - Explain WHY, not WHAT
// Delay animation start to prevent lag during initial render
setTimeout(() => playAnimation('idle'), 100);// ❌ WRONG - Obvious comment
// Set the variable to true
setIsLoaded(true);

---

## Testing Considerations

### Test File NamingComponentName.jsx       → ComponentName.test.jsx
useCustomHook.js        → useCustomHook.test.js
helperFunction.js       → helperFunction.test.js

### Critical Tests Required
- ✅ Model loading (success + failure cases)
- ✅ Animation state transitions
- ✅ Memory cleanup (no leaks)
- ✅ User interactions (clicks, hovers)
- ✅ Performance (FPS monitoring)

---

## Audio Standards

### Never Auto-Play
```javascript// ✅ CORRECT - User interaction required
<button onClick={() => audioManager.play('zombie_groan')}>
Enable Audio
</button>// ❌ WRONG - Violates browser policies
useEffect(() => {
audioManager.play('ambient_music'); // Will be blocked!
}, []);

### Volume Levels
```javascriptconst AUDIO_LEVELS = {
ambient: 0.3,      // Background music
effects: 0.6,      // Sound effects
jumpscares: 0.8,   // Jump scare sounds
};

---

## Accessibility

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Provide focus indicators (outline on :focus)
- Support Tab navigation

### Screen Reader Support
```javascript// ✅ CORRECT - Accessible
<button aria-label="Play zombie attack animation">
▶️ Attack
</button>// ❌ WRONG - Not accessible
<div onClick={handleClick}>Attack</div>
````
Seizure Warning
// Required for flashing effects
<WarningModal>
⚠️ This experience contains flashing lights and rapid movements.
Continue at your own discretion.
</WarningModal>

---

## Git Commit Messages
```bash✅ CORRECT Format:
feat: Add blood splatter particle system
fix: Resolve memory leak in model disposal
perf: Optimize particle count for mobile
docs: Update README with Kiro usage examples
style: Apply horror theme colors consistently
refactor: Extract animation logic to custom hook❌ WRONG:
git commit -m "fixed stuff"
git commit -m "updates"
git commit -m "asdfasdf"

---

## Questions to Ask Kiro

When you want Kiro to follow these rules, phrase prompts like:

✅ "Following the steering docs, create a ZombieModel component..."
✅ "According to code-style.md, implement the scene manager..."
✅ "Using our horror theme standards, style this button..."

---

## Summary Checklist

Before committing any code, verify:

- [ ] Functional components only
- [ ] Three.js objects in useRef (not useState)
- [ ] Disposal cleanup in useEffect
- [ ] Horror theme colors used consistently
- [ ] No auto-playing audio
- [ ] Lazy loading for heavy components
- [ ] JSDoc comments for public APIs
- [ ] Accessibility attributes
- [ ] Performance limits respected
- [ ] Error handling implemented

---

**Last Updated**: 2024-12-04  
**Version**: 1.0.0  
**Maintained by**: Your Name