# Implementation Plan

- [x] 1. Set up project structure and dependencies


  - Initialize Vite + React project with TypeScript JSDoc
  - Install Three.js, React Three Fiber, @react-three/drei
  - Install Framer Motion and GSAP for animations
  - Install Tailwind CSS and configure horror theme
  - Install fast-check for property-based testing
  - Install Vitest and React Testing Library
  - Create folder structure (components, hooks, utils, shaders, constants)
  - Configure Vite for optimal Three.js bundling
  - _Requirements: All (foundation)_

- [x] 2. Implement Scene Manager and camera controls




- [x] 2.1 Create SceneManager component with React Three Fiber Canvas

  - Set up Canvas with WebGL renderer configuration
  - Configure camera (FOV 75, position [0, 2, 5])
  - Add tone mapping and color space settings
  - Implement window resize handler with debounce
  - Add WebGL context loss detection and recovery
  - _Requirements: 1.1, 9.2_

- [x] 2.2 Implement CameraController with OrbitControls


  - Add OrbitControls from @react-three/drei
  - Configure mouse controls (left drag = rotate, scroll = zoom, right drag = pan)
  - Add keyboard shortcut (R key) to reset camera
  - Implement smooth camera transitions
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 2.3 Write property test for camera input mapping


  - **Property 3: Camera input mapping**
  - **Validates: Requirements 2.1, 2.2, 2.3, 11.2, 11.3, 11.4**

- [x] 2.4 Add mobile touch controls

  - Implement one-finger touch for rotation
  - Implement pinch gesture for zoom
  - Implement two-finger drag for pan
  - _Requirements: 11.2, 11.3, 11.4_

- [x] 3. Create model loading system




- [x] 3.1 Implement modelLoader utility

  - Create GLTF loader with progress tracking
  - Add error handling with fallback model generation
  - Implement model caching to prevent re-downloads
  - Add model validation (check for required animations)
  - _Requirements: 1.2, 1.4, 9.1_

- [x] 3.2 Create model manifest with zombie model data


  - Define MODEL_MANIFEST constant with 5 zombie models
  - Include model URLs, names, thumbnails, animation lists
  - Add attribution information for each model
  - _Requirements: 1.5_

- [x] 3.3 Build ZombieModel component


  - Use useGLTF hook from @react-three/drei
  - Display loading progress indicator
  - Handle load errors with fallback cube
  - Position and scale model in scene
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 3.4 Write property test for model loading success


  - **Property 1: Model loading success**
  - **Validates: Requirements 1.2, 1.3**



- [ ] 3.5 Write property test for model loading failure recovery
  - **Property 2: Model loading failure recovery**
  - **Validates: Requirements 1.4, 9.1**

- [ ] 4. Implement animation system
- [x] 4.1 Create useZombieController hook

  - Load model and extract animations
  - Create AnimationMixer for the model
  - Implement playAnimation function with crossFade
  - Auto-play idle animation on load
  - Update mixer in render loop
  - _Requirements: 3.1, 3.2, 3.5_


- [ ] 4.2 Set animation loop property
  - Configure all AnimationClips with loop = LoopRepeat
  - Ensure seamless looping behavior
  - _Requirements: 3.3_

- [ ] 4.3 Write property test for animation auto-play
  - **Property 4: Animation auto-play**
  - **Validates: Requirements 3.1**

- [ ] 4.4 Write property test for animation transition smoothness
  - **Property 5: Animation transition smoothness**
  - **Validates: Requirements 3.2, 3.5**

- [ ] 4.5 Write property test for animation looping
  - **Property 6: Animation looping**
  - **Validates: Requirements 3.3**


- [ ] 4.6 Create AnimationControls UI component
  - Display button for each available animation
  - Highlight currently playing animation
  - Trigger animation changes on button click
  - _Requirements: 3.4_

- [ ] 4.7 Write property test for UI reflects available animations
  - **Property 7: UI reflects available animations**
  - **Validates: Requirements 3.4**

- [ ] 5. Build lighting system
- [ ] 5.1 Create lightingPresets constant
  - Define haunted preset (purple/blue lights, moderate fog)
  - Define bloody preset (red lights, heavy fog)
  - Define toxic preset (green lights, pulsing intensity)
  - _Requirements: 4.3, 4.4, 4.5_

- [ ] 5.2 Implement LightingRig component
  - Add ambient light with configurable color and intensity
  - Add spotlights based on preset configuration
  - Add fog with configurable color and density
  - Implement preset switching with GSAP transitions (1.5s duration)
  - Default to haunted preset on load
  - _Requirements: 4.1, 4.2_

- [ ] 5.3 Write property test for lighting preset transitions
  - **Property 8: Lighting preset transitions**
  - **Validates: Requirements 4.2**

- [ ] 5.4 Create LightingPresets UI component
  - Display buttons for each preset (haunted, bloody, toxic)
  - Highlight active preset
  - Trigger preset changes on button click
  - _Requirements: 4.2_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 7. Implement horror effects system
- [ ] 7.1 Create HorrorOverlay container component
  - Set up fixed-position overlay div
  - Layer all effects with proper z-index
  - Ensure pointer-events: none except for interactive effects

  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 7.2 Build GlitchEffect component
  - Create SVG filter with feDisplacementMap
  - Implement random trigger between 8-15 seconds
  - Animate glitch for 0.2 seconds
  - Add RGB split effect during glitch
  - _Requirements: 5.1_

- [ ] 7.3 Write property test for glitch effect timing
  - **Property 9: Glitch effect timing**
  - **Validates: Requirements 5.1**


- [ ] 7.4 Build BloodSplatter component
  - Create canvas-based particle system
  - Listen for click events on document
  - Spawn 20-40 particles at click position
  - Implement physics (gravity, velocity, fade)
  - Use particle pooling for performance
  - _Requirements: 5.2_

- [ ] 7.5 Write property test for blood splatter positioning
  - **Property 10: Blood splatter positioning**
  - **Validates: Requirements 5.2**

- [ ] 7.6 Build VignetteEffect component
  - Create radial gradient overlay
  - Implement heartbeat pulse animation (2s cycle)
  - Use CSS animations for performance
  - _Requirements: 5.3_


- [ ] 7.7 Build ChromaticAberration component
  - Create custom fragment shader with RGB offset
  - Detect mouse hover over zombie models
  - Apply aberration effect on hover (strength > 0)
  - Remove effect when hover ends
  - _Requirements: 5.4_

- [ ] 7.8 Write property test for hover effect activation
  - **Property 11: Hover effect activation**
  - **Validates: Requirements 5.4**


- [x] 7.9 Build FilmGrain component

  - Generate noise texture on canvas
  - Overlay at low opacity (0.1)
  - Regenerate noise each frame for animated grain
  - Optimize with requestAnimationFrame throttling
  - _Requirements: 5.5_

- [ ] 8. Create particle system
- [ ] 8.1 Implement ParticleSystem component
  - Create InstancedMesh for GPU acceleration
  - Support fog, embers, and dust particle types
  - Implement particle update loop with velocity
  - Add boundary wrapping for infinite effect
  - Implement frustum culling for off-screen particles
  - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [ ] 8.2 Add particle type configurations
  - Configure fog particles (2000 count, slow drift)
  - Configure ember particles (500 count, upward float, orange glow)
  - Configure dust particles (1000 count, green tint, random motion)
  - Link particle types to lighting presets
  - _Requirements: 6.2, 6.3_

- [ ] 8.3 Write property test for particle instancing threshold
  - **Property 12: Particle instancing threshold**
  - **Validates: Requirements 6.4**

- [ ] 9. Implement spatial audio system
- [ ] 9.1 Create audioManager utility
  - Initialize Web Audio API context
  - Load audio files with error handling
  - Create audio buffer cache
  - Handle browser autoplay policy (require user interaction)
  - _Requirements: 7.5, 9.5_

- [ ] 9.2 Create audio manifest with sound files
  - Define AUDIO_MANIFEST with zombie groans, ambient sounds
  - Include file paths and loop settings
  - Add attribution for CC0 sounds
  - _Requirements: 7.1_

- [ ] 9.3 Build useSpatialAudio hook
  - Create AudioListener attached to camera
  - Implement playSound function with PannerNode
  - Configure panner (HRTF model, inverse distance)
  - Update listener position/orientation each frame
  - Implement mute/unmute functionality (M key)
  - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 9.4 Write property test for spatial audio positioning
  - **Property 13: Spatial audio positioning**
  - **Validates: Requirements 7.1**

- [ ] 9.5 Write property test for distance-based volume
  - **Property 14: Distance-based volume**
  - **Validates: Requirements 7.2**

- [ ] 9.6 Write property test for audio panner updates
  - **Property 15: Audio panner updates**
  - **Validates: Requirements 7.3**

- [ ] 9.7 Write property test for audio error resilience
  - **Property 19: Audio error resilience**
  - **Validates: Requirements 9.5**

- [ ] 9.8 Connect audio to zombie models
  - Play ambient groaning sound when model loads
  - Position audio source at model's 3D location
  - Update audio position if model moves
  - Stop audio when model is removed
  - _Requirements: 7.1_

- [ ] 10. Build UI components
- [ ] 10.1 Create ControlPanel container
  - Design horror-themed panel with dark background
  - Add blood drip animation on mount
  - Use Creepster font for headings
  - Use Roboto Mono for controls
  - Position panel at bottom of screen
  - _Requirements: 8.1, 8.2_

- [ ] 10.2 Create ModelSelector component
  - Display thumbnail gallery of available models
  - Show model names and poly counts
  - Highlight currently selected model
  - Load model on thumbnail click
  - _Requirements: 1.5_

- [ ] 10.3 Style interactive elements
  - Apply dark red (#8b0000) to primary buttons
  - Apply toxic green (#00ff00) to accent elements
  - Add glowing hover effect with 0.3s ease-out transition
  - _Requirements: 8.3, 8.4_

- [ ] 10.4 Write property test for button hover transitions
  - **Property 16: Button hover transitions**
  - **Validates: Requirements 8.4**

- [ ] 10.5 Add ghost cursor trail effect
  - Track mouse position
  - Render fading trail elements
  - Use CSS transforms for performance
  - Limit trail length to 10 elements
  - _Requirements: 8.5_

- [ ] 10.6 Create LoadingScreen component
  - Display during initial app load
  - Show progress bar for asset loading
  - Add horror-themed loading animation
  - Fade out when all assets ready
  - _Requirements: 1.3_

- [ ] 10.7 Implement mobile responsive layout
  - Detect mobile viewport with media query
  - Switch to bottom-sheet layout on mobile
  - Adjust button sizes for touch targets
  - _Requirements: 11.1_

- [ ] 11. Implement error handling and recovery
- [ ] 11.1 Add GPU memory error handling
  - Listen for WebGL out-of-memory errors
  - Reduce particle count by 50% on error
  - Disable post-processing effects
  - Show user notification
  - _Requirements: 9.3_

- [ ] 11.2 Write property test for GPU memory error recovery
  - **Property 17: GPU memory error recovery**
  - **Validates: Requirements 9.3**

- [ ] 11.3 Add animation error fallback
  - Detect corrupted animation data
  - Fall back to T-pose on error
  - Log warning to console
  - Continue operation without crashing
  - _Requirements: 9.4_

- [ ] 11.4 Write property test for animation error fallback
  - **Property 18: Animation error fallback**
  - **Validates: Requirements 9.4**

- [ ] 12. Implement performance optimization
- [ ] 12.1 Create usePerformanceMonitor hook
  - Track frame times over 3-second window
  - Calculate average FPS
  - Detect sustained low FPS (< 45fps)
  - Trigger quality reduction when needed
  - _Requirements: 10.2_

- [ ] 12.2 Implement GPU detection
  - Use WebGL renderer info to detect GPU tier
  - Classify as high/medium/low performance
  - Apply appropriate performance profile
  - Adjust shadows, particles, and effects
  - _Requirements: 10.1_

- [ ] 12.3 Write property test for adaptive performance - GPU detection
  - **Property 20: Adaptive performance - GPU detection**
  - **Validates: Requirements 10.1**

- [ ] 12.4 Write property test for adaptive performance - FPS monitoring
  - **Property 21: Adaptive performance - FPS monitoring**
  - **Validates: Requirements 10.2**

- [ ] 12.5 Add responsive resize handling
  - Debounce resize events (300ms)
  - Update renderer size on resize
  - Update camera aspect ratio
  - Trigger re-render
  - _Requirements: 10.3_

- [ ] 12.6 Write property test for responsive resize handling
  - **Property 22: Responsive resize handling**
  - **Validates: Requirements 10.3**

- [ ] 12.7 Implement LOD system
  - Create high/medium/low detail versions of models
  - Switch LOD based on camera distance (< 10, < 20, > 20 units)
  - Add hysteresis to prevent flickering (2 unit buffer)
  - _Requirements: 10.4_

- [ ] 12.8 Write property test for LOD distance switching
  - **Property 23: LOD distance switching**
  - **Validates: Requirements 10.4**

- [ ] 12.9 Add visibility-based render pause
  - Listen for page visibility change events
  - Pause render loop when tab is hidden
  - Resume render loop when tab becomes visible
  - _Requirements: 10.5_

- [ ] 12.10 Write property test for visibility-based render pause
  - **Property 24: Visibility-based render pause**
  - **Validates: Requirements 10.5**

- [ ] 12.11 Implement mobile performance optimizations
  - Detect mobile devices
  - Disable expensive effects (chromatic aberration, film grain)
  - Reduce particle counts
  - Lower shadow quality
  - _Requirements: 11.5_

- [ ] 13. Implement resource disposal
- [ ] 13.1 Create resourceDisposer utility
  - Implement disposeModel function (geometries, materials, textures)
  - Implement disposeAnimation function (stop actions, dispose clips)
  - Implement disposeScene function (renderer, scene, all objects)
  - Add disposal logging for debugging
  - _Requirements: 12.1, 12.2, 12.4_

- [ ] 13.2 Add disposal to ZombieModel component
  - Call dispose on geometries, materials, textures in useEffect cleanup
  - Ensure disposal happens before new model loads
  - _Requirements: 12.1, 12.3_

- [ ] 13.3 Write property test for resource disposal on removal
  - **Property 25: Resource disposal on removal**
  - **Validates: Requirements 12.1**

- [ ] 13.4 Write property test for model switch disposal order
  - **Property 26: Model switch disposal order**
  - **Validates: Requirements 12.3**

- [ ] 13.5 Add disposal to animation system
  - Stop all animation actions before disposal
  - Dispose animation clips
  - Clear animation mixer
  - _Requirements: 12.4_

- [ ] 13.6 Write property test for animation cleanup
  - **Property 27: Animation cleanup**
  - **Validates: Requirements 12.4**

- [ ] 13.7 Add disposal to SceneManager
  - Dispose renderer on unmount
  - Cancel animation frame request
  - Clear all scene objects
  - _Requirements: 12.2, 12.5_

- [ ] 14. Final integration and polish
- [ ] 14.1 Integrate all systems in App.jsx
  - Compose SceneManager with all child components
  - Wire up UI controls to scene state
  - Connect audio system to models
  - Add error boundaries for graceful failures
  - _Requirements: All_

- [ ] 14.2 Add accessibility features
  - Ensure keyboard navigation works (Tab key)
  - Add visible focus indicators
  - Add alt text to model thumbnails
  - Respect prefers-reduced-motion media query
  - Add screen reader announcements for loading states
  - _Requirements: Design - Accessibility_

- [ ] 14.3 Optimize asset loading
  - Implement lazy loading for models
  - Add Suspense boundaries with fallbacks
  - Preload critical assets (first model, UI fonts)
  - Show loading progress for all assets
  - _Requirements: 1.3, 10.4_

- [ ] 14.4 Add production build optimizations
  - Configure Vite for code splitting
  - Set up manual chunks (three, react-three, animations)
  - Enable terser minification with console removal
  - Compress GLTF models with gltf-pipeline
  - _Requirements: Design - Deployment_

- [ ] 14.5 Run all property-based tests
  - Execute full property test suite (100 iterations each)
  - Verify all 27 properties pass
  - Check for any shrinking failures
  - Document any edge cases found

- [ ] 15. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
