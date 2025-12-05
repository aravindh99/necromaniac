# Design Document

## Overview

Necromaniac is a React-based 3D horror experience built on Three.js and React Three Fiber. The architecture follows a component-based design with clear separation between the 3D rendering layer, UI layer, and effects layer. The system uses declarative React patterns where possible, falling back to imperative Three.js code only when necessary for performance or fine-grained control.

The application consists of five major subsystems:
1. **Scene Management** - Three.js scene, camera, renderer, and render loop
2. **Model System** - GLTF loading, animation control, and LOD management
3. **Effects Pipeline** - Visual overlays, post-processing, and particle systems
4. **Audio Engine** - Spatial audio with 3D positioning
5. **UI Layer** - Horror-themed React components for user interaction

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         React App                            │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │ Effects Layer│  │  Audio Layer │      │
│  │  (Controls)  │  │  (Overlays)  │  │  (Spatial)   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
│  ┌─────────────────────────▼──────────────────────────────┐ │
│  │         React Three Fiber Canvas                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │ │
│  │  │Scene Manager │  │Model System  │  │  Lighting   │ │ │
│  │  │              │  │              │  │     Rig     │ │ │
│  │  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘ │ │
│  │         │                  │                  │        │ │
│  │         └──────────────────▼──────────────────┘        │ │
│  │                      Three.js Scene                    │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **3D Rendering**: Three.js r158 via React Three Fiber 8.15
- **3D Utilities**: @react-three/drei for helpers (OrbitControls, useGLTF, etc.)
- **Animation**: Framer Motion for UI animations, GSAP for complex sequences
- **Styling**: Tailwind CSS 3 with custom horror theme
- **Build Tool**: Vite 5 for fast development and optimized production builds
- **Model Format**: GLTF/GLB with embedded animations
- **Audio**: Web Audio API with PositionalAudio nodes

### File Structure

```
src/
├── components/
│   ├── Scene/
│   │   ├── SceneManager.jsx          # Main R3F Canvas wrapper
│   │   ├── ZombieModel.jsx           # Individual model component
│   │   ├── LightingRig.jsx           # Lighting system
│   │   ├── ParticleSystem.jsx        # Fog/embers/dust particles
│   │   └── CameraController.jsx      # Camera setup and controls
│   ├── UI/
│   │   ├── ControlPanel.jsx          # Main UI container
│   │   ├── ModelSelector.jsx         # Model gallery
│   │   ├── AnimationControls.jsx     # Animation buttons
│   │   ├── LightingPresets.jsx       # Lighting switcher
│   │   └── LoadingScreen.jsx         # Model loading indicator
│   └── Effects/
│       ├── HorrorOverlay.jsx         # Container for all effects
│       ├── GlitchEffect.jsx          # Screen glitch
│       ├── BloodSplatter.jsx         # Click-based blood particles
│       ├── VignetteEffect.jsx        # Edge darkening
│       ├── ChromaticAberration.jsx   # RGB split shader
│       └── FilmGrain.jsx             # Noise overlay
├── hooks/
│   ├── useZombieController.js        # Model loading and animation
│   ├── useHorrorEffects.js           # Effect triggering logic
│   ├── useSpatialAudio.js            # 3D audio positioning
│   └── usePerformanceMonitor.js      # FPS tracking and optimization
├── utils/
│   ├── modelLoader.js                # GLTF loading utilities
│   ├── audioManager.js               # Audio file management
│   ├── performanceOptimizer.js       # GPU detection and LOD
│   └── resourceDisposer.js           # Memory cleanup utilities
├── shaders/
│   ├── glitch.frag                   # Glitch effect fragment shader
│   ├── chromatic.frag                # Chromatic aberration shader
│   └── filmGrain.frag                # Film grain shader
├── constants/
│   ├── lightingPresets.js            # Preset configurations
│   ├── modelManifest.js              # Available models list
│   └── audioManifest.js              # Audio files list
└── App.jsx                           # Root component
```

## Components and Interfaces

### Scene Manager

**Purpose**: Orchestrates the Three.js scene, camera, renderer, and render loop.

**Implementation**: React Three Fiber `<Canvas>` component with custom configuration.

**Props**:
```javascript
{
  onSceneReady: (scene, camera, renderer) => void,
  performanceMode: 'high' | 'medium' | 'low',
  children: ReactNode
}
```

**Key Responsibilities**:
- Initialize WebGL renderer with appropriate settings
- Set up camera with FOV 75, near 0.1, far 1000
- Configure tone mapping (ACESFilmic) and color space (sRGB)
- Handle window resize events
- Manage render loop at 60fps target
- Dispose resources on unmount

**Configuration**:
```javascript
<Canvas
  camera={{ position: [0, 2, 5], fov: 75 }}
  gl={{
    antialias: true,
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.2,
    outputColorSpace: THREE.SRGBColorSpace
  }}
  shadows
  dpr={[1, 2]} // Adaptive pixel ratio
>
```

### Model Controller

**Purpose**: Load, display, and animate GLTF zombie models.

**Implementation**: Custom hook `useZombieController` + `ZombieModel` component.

**Hook Interface**:
```javascript
const {
  model,           // THREE.Group | null
  animations,      // AnimationClip[]
  currentAnim,     // string
  isLoading,       // boolean
  loadProgress,    // number (0-100)
  error,           // Error | null
  playAnimation,   // (name: string) => void
  dispose          // () => void
} = useZombieController(modelUrl);
```

**Component Props**:
```javascript
{
  modelUrl: string,
  position: [number, number, number],
  scale: number,
  onLoad: (model) => void,
  onError: (error) => void
}
```

**Animation State Machine**:
```
     ┌─────┐
     │Idle │◄────────────┐
     └──┬──┘             │
        │                │
   ┌────▼────┐      ┌────┴────┐
   │  Walk   │      │ Attack  │
   └────┬────┘      └────┬────┘
        │                │
        └────────►┌──────▼──┐
                  │  Death  │
                  └─────────┘
```

Transitions use `fadeIn`/`fadeOut` over 0.3 seconds for smooth blending.

### Lighting Rig

**Purpose**: Provide atmospheric lighting with preset configurations.

**Implementation**: React component with Three.js lights.

**Props**:
```javascript
{
  preset: 'haunted' | 'bloody' | 'toxic',
  transitionDuration: number // seconds
}
```

**Preset Configurations**:
```javascript
const PRESETS = {
  haunted: {
    ambient: { color: 0x1a0a1a, intensity: 0.3 },
    spotlights: [
      { color: 0x6600ff, intensity: 2, position: [-5, 5, 5], angle: Math.PI / 6 },
      { color: 0x0066ff, intensity: 1.5, position: [5, 5, -5], angle: Math.PI / 6 }
    ],
    fog: { color: 0x0a0a0a, near: 5, far: 20 }
  },
  bloody: {
    ambient: { color: 0x1a0000, intensity: 0.2 },
    spotlights: [
      { color: 0xff0000, intensity: 3, position: [0, 8, 0], angle: Math.PI / 4 }
    ],
    fog: { color: 0x0a0000, near: 3, far: 15 }
  },
  toxic: {
    ambient: { color: 0x001a00, intensity: 0.25 },
    spotlights: [
      { color: 0x00ff00, intensity: 2.5, position: [0, 5, 5], angle: Math.PI / 5 }
    ],
    fog: { color: 0x001100, near: 4, far: 18 }
  }
};
```

**Transition Logic**: Use GSAP to tween light colors and intensities over `transitionDuration`.

### Horror Effects System

**Purpose**: Overlay visual effects for cinematic horror atmosphere.

**Implementation**: Multiple React components with CSS/SVG filters and canvas-based effects.

#### Glitch Effect

**Trigger**: Random interval between 8-15 seconds.

**Implementation**: SVG `<feDisplacementMap>` filter with animated displacement.

**Effect Duration**: 0.2 seconds.

```javascript
<svg style={{ position: 'absolute', width: 0, height: 0 }}>
  <filter id="glitch">
    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" />
    <feDisplacementMap in="SourceGraphic" scale={isGlitching ? 20 : 0} />
    <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
  </filter>
</svg>
```

#### Blood Splatter

**Trigger**: User click event.

**Implementation**: Canvas-based particle system with physics.

**Particle Properties**:
- Count: 20-40 particles per click
- Velocity: Random direction with gravity
- Lifetime: 1.5 seconds with alpha fade
- Texture: Circular gradient (dark red to transparent)

**Physics**:
```javascript
particle.velocity.y += gravity * deltaTime; // gravity = -9.8
particle.position.x += particle.velocity.x * deltaTime;
particle.position.y += particle.velocity.y * deltaTime;
particle.alpha = 1 - (particle.age / particle.lifetime);
```

#### Vignette Effect

**Trigger**: Continuous with heartbeat pulse.

**Implementation**: Radial gradient overlay with animated opacity.

```css
.vignette {
  background: radial-gradient(
    ellipse at center,
    transparent 0%,
    transparent 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.8; }
}
```

#### Chromatic Aberration

**Trigger**: Mouse hover over model.

**Implementation**: Custom fragment shader with RGB channel offset.

```glsl
uniform float aberrationStrength;
uniform vec2 direction;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float r = texture2D(tDiffuse, uv + direction * aberrationStrength).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - direction * aberrationStrength).b;
  gl_FragColor = vec4(r, g, b, 1.0);
}
```

#### Film Grain

**Trigger**: Continuous.

**Implementation**: Canvas with random noise, overlaid at low opacity.

```javascript
function generateGrain(ctx, width, height) {
  const imageData = ctx.createImageData(width, height);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const value = Math.random() * 255;
    imageData.data[i] = value;     // R
    imageData.data[i + 1] = value; // G
    imageData.data[i + 2] = value; // B
    imageData.data[i + 3] = 30;    // A (low opacity)
  }
  ctx.putImageData(imageData, 0, 0);
}
```

### Particle System

**Purpose**: Render atmospheric particles (fog, embers, dust).

**Implementation**: Three.js `InstancedMesh` for GPU-accelerated rendering.

**Props**:
```javascript
{
  type: 'fog' | 'embers' | 'dust',
  count: number,
  bounds: { x: number, y: number, z: number }
}
```

**Particle Configurations**:
```javascript
const PARTICLE_CONFIGS = {
  fog: {
    geometry: new THREE.PlaneGeometry(0.5, 0.5),
    material: new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    }),
    velocity: { x: 0.01, y: 0.02, z: 0.01 },
    count: 2000
  },
  embers: {
    geometry: new THREE.SphereGeometry(0.05, 8, 8),
    material: new THREE.MeshBasicMaterial({
      color: 0xff6600,
      emissive: 0xff3300,
      emissiveIntensity: 2
    }),
    velocity: { x: 0, y: 0.05, z: 0 },
    count: 500
  },
  dust: {
    geometry: new THREE.PlaneGeometry(0.1, 0.1),
    material: new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.4
    }),
    velocity: { x: 0.02, y: -0.01, z: 0.02 },
    count: 1000
  }
};
```

**Update Loop**:
```javascript
function updateParticles(deltaTime) {
  for (let i = 0; i < count; i++) {
    // Update position
    positions[i].x += velocity.x * deltaTime;
    positions[i].y += velocity.y * deltaTime;
    positions[i].z += velocity.z * deltaTime;
    
    // Wrap around bounds
    if (positions[i].y > bounds.y) positions[i].y = -bounds.y;
    if (positions[i].x > bounds.x) positions[i].x = -bounds.x;
    
    // Update instance matrix
    dummy.position.copy(positions[i]);
    dummy.updateMatrix();
    instancedMesh.setMatrixAt(i, dummy.matrix);
  }
  instancedMesh.instanceMatrix.needsUpdate = true;
}
```

### Spatial Audio System

**Purpose**: Play 3D-positioned audio that responds to camera movement.

**Implementation**: Web Audio API with `PannerNode` for spatialization.

**Hook Interface**:
```javascript
const {
  playSound,       // (soundId: string, position: Vector3) => AudioSource
  stopSound,       // (sourceId: string) => void
  setMasterVolume, // (volume: number) => void
  mute,            // () => void
  unmute,          // () => void
  isMuted          // boolean
} = useSpatialAudio(cameraRef);
```

**Audio Graph**:
```
[AudioBuffer] → [AudioBufferSourceNode] → [PannerNode] → [GainNode] → [AudioContext.destination]
                                              ↑
                                         [Camera Position]
```

**Panner Configuration**:
```javascript
const panner = audioContext.createPanner();
panner.panningModel = 'HRTF';
panner.distanceModel = 'inverse';
panner.refDistance = 1;
panner.maxDistance = 20;
panner.rolloffFactor = 1;
panner.coneInnerAngle = 360;
panner.coneOuterAngle = 0;
panner.coneOuterGain = 0;
```

**Update Loop** (called each frame):
```javascript
function updateAudioPositions(cameraPosition, cameraRotation) {
  audioContext.listener.positionX.value = cameraPosition.x;
  audioContext.listener.positionY.value = cameraPosition.y;
  audioContext.listener.positionZ.value = cameraPosition.z;
  
  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cameraRotation);
  audioContext.listener.forwardX.value = forward.x;
  audioContext.listener.forwardY.value = forward.y;
  audioContext.listener.forwardZ.value = forward.z;
}
```

## Data Models

### Model Manifest

```javascript
const MODEL_MANIFEST = [
  {
    id: 'zombie-walker',
    name: 'Walker Zombie',
    url: '/models/zombie-walker.glb',
    thumbnail: '/thumbnails/zombie-walker.jpg',
    animations: ['idle', 'walk', 'attack', 'death'],
    polyCount: 18000,
    attribution: {
      author: 'Artist Name',
      license: 'CC0',
      source: 'https://sketchfab.com/...'
    }
  },
  // ... 4 more models
];
```

### Lighting Preset

```javascript
interface LightingPreset {
  name: string;
  ambient: {
    color: number;      // Hex color
    intensity: number;  // 0-1
  };
  spotlights: Array<{
    color: number;
    intensity: number;
    position: [number, number, number];
    angle: number;      // Radians
    penumbra: number;   // 0-1
    decay: number;      // Light falloff
  }>;
  fog: {
    color: number;
    near: number;
    far: number;
  };
}
```

### Audio Source

```javascript
interface AudioSource {
  id: string;
  buffer: AudioBuffer;
  source: AudioBufferSourceNode;
  panner: PannerNode;
  gain: GainNode;
  position: { x: number, y: number, z: number };
  isPlaying: boolean;
  loop: boolean;
}
```

### Performance Profile

```javascript
interface PerformanceProfile {
  gpu: 'high' | 'medium' | 'low';
  settings: {
    shadows: boolean;
    postProcessing: boolean;
    particleCount: number;
    maxLights: number;
    antialias: boolean;
    pixelRatio: number;
  };
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several redundancies were identified:

- **Camera control properties (2.1, 2.2, 2.3)** can be combined into a single property about input-to-camera-state mapping
- **Lighting preset examples (4.3, 4.4, 4.5)** are specific configurations that don't need separate properties—they're validated by the preset data structure itself
- **Particle preset examples (6.2, 6.3)** are similar to lighting presets—configuration validation rather than behavioral properties
- **UI styling examples (8.2, 8.3)** are static CSS validation, not runtime behavior
- **Performance requirements (2.5, 6.5)** cannot be reliably tested in unit tests

The following properties represent the unique, testable behaviors after removing redundancies:

### Core Properties

**Property 1: Model loading success**
*For any* valid model URL from the manifest, loading that model should result in a Three.js Group object being added to the scene with the correct number of animations.
**Validates: Requirements 1.2, 1.3**

**Property 2: Model loading failure recovery**
*For any* invalid or non-existent model URL, attempting to load should result in an error state and a fallback placeholder model being displayed without crashing.
**Validates: Requirements 1.4, 9.1**

**Property 3: Camera input mapping**
*For any* camera control input (drag, scroll, or pan gesture), the camera position or rotation should change in the expected direction, and the change magnitude should be proportional to input magnitude.
**Validates: Requirements 2.1, 2.2, 2.3, 11.2, 11.3, 11.4**

**Property 4: Animation auto-play**
*For any* loaded model that contains an "idle" animation, the animation mixer should automatically play that animation immediately after load completes.
**Validates: Requirements 3.1**

**Property 5: Animation transition smoothness**
*For any* pair of animations on a model, switching from one to the other should trigger a crossFade with duration >= 0.3 seconds, ensuring no instant pose changes.
**Validates: Requirements 3.2, 3.5**

**Property 6: Animation looping**
*For any* animation clip, the loop property should be set to true, ensuring animations restart seamlessly after completion.
**Validates: Requirements 3.3**

**Property 7: UI reflects available animations**
*For any* model with N animations, the control panel should render exactly N animation control buttons with labels matching animation names.
**Validates: Requirements 3.4**

**Property 8: Lighting preset transitions**
*For any* change from one lighting preset to another, all light properties (color, intensity, position) should transition smoothly over 1.5 seconds using interpolation.
**Validates: Requirements 4.2**

**Property 9: Glitch effect timing**
*For any* glitch effect trigger, the next glitch should be scheduled between 8 and 15 seconds in the future, ensuring random but bounded intervals.
**Validates: Requirements 5.1**

**Property 10: Blood splatter positioning**
*For any* click event at screen coordinates (x, y), blood particles should spawn at the corresponding 3D world position, with initial velocities radiating outward from that point.
**Validates: Requirements 5.2**

**Property 11: Hover effect activation**
*For any* zombie model, when the mouse hovers over its bounding box, the chromatic aberration effect should activate with strength > 0, and deactivate when hover ends.
**Validates: Requirements 5.4**

**Property 12: Particle instancing threshold**
*For any* particle system configuration, if the particle count exceeds 5000, the system should use InstancedMesh instead of individual meshes.
**Validates: Requirements 6.4**

**Property 13: Spatial audio positioning**
*For any* zombie model at 3D position P, the audio source should have a PannerNode with position matching P, ensuring sound appears to come from the model's location.
**Validates: Requirements 7.1**

**Property 14: Distance-based volume**
*For any* audio source, as the camera distance from the source increases, the effective gain should decrease according to the inverse distance model.
**Validates: Requirements 7.2**

**Property 15: Audio panner updates**
*For any* camera rotation, the audio listener's forward vector should update to match the camera's look direction, ensuring correct stereo panning.
**Validates: Requirements 7.3**

**Property 16: Button hover transitions**
*For any* interactive button, hovering should trigger a CSS transition with duration 0.3s and timing function ease-out.
**Validates: Requirements 8.4**

**Property 17: GPU memory error recovery**
*For any* GPU memory error event, the system should reduce particle count by 50% and disable post-processing effects without crashing.
**Validates: Requirements 9.3**

**Property 18: Animation error fallback**
*For any* corrupted or invalid animation data, the animation mixer should fall back to a static T-pose and log a warning without throwing an exception.
**Validates: Requirements 9.4**

**Property 19: Audio error resilience**
*For any* audio file that fails to load, the audio system should continue operating with remaining sounds, logging the error but not crashing.
**Validates: Requirements 9.5**

**Property 20: Adaptive performance - GPU detection**
*For any* detected GPU tier (high/medium/low), the system should apply the corresponding performance profile, adjusting shadow quality, particle count, and effects accordingly.
**Validates: Requirements 10.1**

**Property 21: Adaptive performance - FPS monitoring**
*For any* sustained frame rate below 45fps (measured over 3 seconds), the system should disable post-processing effects and reduce particle count.
**Validates: Requirements 10.2**

**Property 22: Responsive resize handling**
*For any* window resize event, the renderer size and camera aspect ratio should update to match the new dimensions within one render frame.
**Validates: Requirements 10.3**

**Property 23: LOD distance switching**
*For any* model with LOD levels, when camera distance exceeds 20 units, the system should switch to a lower detail mesh, and switch back when distance decreases below 18 units (with hysteresis).
**Validates: Requirements 10.4**

**Property 24: Visibility-based render pause**
*For any* page visibility change to hidden, the render loop should pause (stop calling requestAnimationFrame), and resume when visibility returns.
**Validates: Requirements 10.5**

**Property 25: Resource disposal on removal**
*For any* model removed from the scene, all associated geometries, materials, textures, and animation clips should have their dispose() methods called.
**Validates: Requirements 12.1**

**Property 26: Model switch disposal order**
*For any* model switch operation, the previous model's resources should be fully disposed before the new model begins loading, preventing memory accumulation.
**Validates: Requirements 12.3**

**Property 27: Animation cleanup**
*For any* animation mixer being disposed, all active animation actions should be stopped and all animation clips should be disposed.
**Validates: Requirements 12.4**

## Error Handling

### Error Categories

1. **Asset Loading Errors**
   - Model files not found (404)
   - Corrupted GLTF data
   - Missing textures or animations
   - Audio files unavailable

2. **Runtime Errors**
   - WebGL context loss
   - GPU memory exhaustion
   - Browser compatibility issues
   - Performance degradation

3. **User Input Errors**
   - Invalid camera positions
   - Rapid interaction causing state conflicts
   - Touch gesture ambiguity

### Error Handling Strategies

#### Asset Loading Errors

**Strategy**: Graceful degradation with fallbacks.

```javascript
async function loadModel(url) {
  try {
    const gltf = await gltfLoader.loadAsync(url);
    return gltf.scene;
  } catch (error) {
    console.error(`Failed to load model: ${url}`, error);
    
    // Log to error tracking service
    errorTracker.log('model_load_failed', { url, error: error.message });
    
    // Return fallback model
    return createFallbackModel();
  }
}

function createFallbackModel() {
  const geometry = new THREE.BoxGeometry(1, 2, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    wireframe: true
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData.isFallback = true;
  return mesh;
}
```

#### WebGL Context Loss

**Strategy**: Detect and attempt recovery.

```javascript
renderer.domElement.addEventListener('webglcontextlost', (event) => {
  event.preventDefault();
  console.warn('WebGL context lost. Attempting recovery...');
  
  // Stop render loop
  cancelAnimationFrame(renderLoopId);
  
  // Show user message
  showNotification('Graphics context lost. Reloading...', 'warning');
  
  // Attempt recovery after delay
  setTimeout(() => {
    renderer.forceContextRestore();
  }, 1000);
});

renderer.domElement.addEventListener('webglcontextrestored', () => {
  console.log('WebGL context restored');
  
  // Reload all assets
  reloadAllModels();
  
  // Restart render loop
  startRenderLoop();
  
  showNotification('Graphics restored', 'success');
});
```

#### GPU Memory Exhaustion

**Strategy**: Progressive quality reduction.

```javascript
function handleGPUMemoryError(error) {
  console.error('GPU memory error:', error);
  
  // Level 1: Reduce particles
  if (particleCount > 1000) {
    particleCount = Math.floor(particleCount * 0.5);
    recreateParticleSystem();
    return;
  }
  
  // Level 2: Disable post-processing
  if (postProcessingEnabled) {
    postProcessingEnabled = false;
    disablePostProcessing();
    return;
  }
  
  // Level 3: Disable shadows
  if (shadowsEnabled) {
    shadowsEnabled = false;
    renderer.shadowMap.enabled = false;
    return;
  }
  
  // Level 4: Show error message
  showNotification(
    'Your device is running low on graphics memory. Some features have been disabled.',
    'error'
  );
}
```

#### Performance Degradation

**Strategy**: Adaptive quality based on FPS monitoring.

```javascript
class PerformanceMonitor {
  constructor() {
    this.frameTimes = [];
    this.maxSamples = 180; // 3 seconds at 60fps
  }
  
  recordFrame(deltaTime) {
    this.frameTimes.push(deltaTime);
    if (this.frameTimes.length > this.maxSamples) {
      this.frameTimes.shift();
    }
    
    // Check if we need to reduce quality
    if (this.frameTimes.length === this.maxSamples) {
      const avgFPS = 1000 / (this.frameTimes.reduce((a, b) => a + b) / this.frameTimes.length);
      
      if (avgFPS < 45) {
        this.reduceQuality();
      } else if (avgFPS > 55 && this.qualityLevel < 3) {
        this.increaseQuality();
      }
    }
  }
  
  reduceQuality() {
    if (this.qualityLevel > 0) {
      this.qualityLevel--;
      applyQualitySettings(this.qualityLevel);
      console.log(`Reduced quality to level ${this.qualityLevel}`);
    }
  }
  
  increaseQuality() {
    if (this.qualityLevel < 3) {
      this.qualityLevel++;
      applyQualitySettings(this.qualityLevel);
      console.log(`Increased quality to level ${this.qualityLevel}`);
    }
  }
}
```

## Testing Strategy

### Dual Testing Approach

This project uses both unit testing and property-based testing to ensure comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide complete coverage: unit tests catch concrete bugs, property tests verify general correctness

### Property-Based Testing

**Library**: fast-check (JavaScript property-based testing library)

**Configuration**: Each property test runs a minimum of 100 iterations with randomly generated inputs.

**Tagging Convention**: Each property-based test must include a comment explicitly referencing the correctness property from this design document:

```javascript
// Feature: necromorph-studio, Property 1: Model loading success
test('model loading creates scene object with animations', () => {
  fc.assert(
    fc.asyncProperty(fc.constantFrom(...MODEL_URLS), async (url) => {
      const model = await loadModel(url);
      expect(model).toBeInstanceOf(THREE.Group);
      expect(model.animations.length).toBeGreaterThan(0);
    }),
    { numRuns: 100 }
  );
});
```

**Property Test Coverage**:
- Property 1-27: Each implemented as a single property-based test
- Generators for: model URLs, camera inputs, animation names, lighting presets, click positions, audio positions
- Shrinking enabled to find minimal failing cases

### Unit Testing

**Framework**: Vitest with React Testing Library

**Coverage Areas**:
- Component rendering and UI interactions
- Hook state management
- Utility function correctness
- Error boundary behavior
- Integration between components

**Example Unit Tests**:

```javascript
describe('ZombieModel Component', () => {
  test('displays loading indicator while model loads', () => {
    render(<ZombieModel modelUrl="/models/zombie.glb" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  test('displays error message on load failure', async () => {
    render(<ZombieModel modelUrl="/invalid.glb" />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument();
    });
  });
  
  test('calls onLoad callback when model loads successfully', async () => {
    const onLoad = vi.fn();
    render(<ZombieModel modelUrl="/models/zombie.glb" onLoad={onLoad} />);
    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledWith(expect.any(THREE.Group));
    });
  });
});
```

### Integration Testing

**Approach**: Test interactions between major subsystems.

**Key Integration Tests**:
1. Model loading → Animation playback → Audio positioning
2. Lighting preset change → Particle system update → Visual effects
3. Camera movement → Audio panning → Performance monitoring
4. Error occurrence → Quality reduction → User notification

### Test Organization

```
src/
├── components/
│   ├── Scene/
│   │   ├── SceneManager.test.jsx
│   │   ├── ZombieModel.test.jsx
│   │   └── LightingRig.test.jsx
│   └── Effects/
│       ├── GlitchEffect.test.jsx
│       └── BloodSplatter.test.jsx
├── hooks/
│   ├── useZombieController.test.js
│   └── useSpatialAudio.test.js
└── properties/
    ├── modelLoading.property.test.js      # Properties 1-2
    ├── cameraControls.property.test.js    # Property 3
    ├── animations.property.test.js        # Properties 4-7
    ├── lighting.property.test.js          # Properties 8
    ├── effects.property.test.js           # Properties 9-11
    ├── particles.property.test.js         # Property 12
    ├── audio.property.test.js             # Properties 13-15, 19
    ├── ui.property.test.js                # Property 16
    ├── errorHandling.property.test.js     # Properties 2, 17-19
    ├── performance.property.test.js       # Properties 20-24
    └── resourceManagement.property.test.js # Properties 25-27
```

### Test Execution

```bash
# Run all tests
npm test

# Run unit tests only
npm test -- --grep "^(?!.*property)"

# Run property tests only
npm test -- --grep "property"

# Run with coverage
npm test -- --coverage

# Run in watch mode during development
npm test -- --watch
```

### Continuous Integration

Tests run automatically on:
- Every commit (via pre-commit hook)
- Every pull request
- Before production deployment

**CI Pipeline**:
1. Lint code (ESLint)
2. Type check (TypeScript JSDoc)
3. Run unit tests
4. Run property tests
5. Check coverage (minimum 80%)
6. Build production bundle
7. Run bundle size check (< 5MB)

## Performance Considerations

### Optimization Strategies

1. **GPU Instancing**: Use `InstancedMesh` for particles when count > 1000
2. **Frustum Culling**: Automatically handled by Three.js, but verify with `object.frustumCulled = true`
3. **LOD System**: Implement 3 detail levels (high < 10 units, medium < 20 units, low > 20 units)
4. **Texture Compression**: Use KTX2 compressed textures for production
5. **Lazy Loading**: Load models on-demand, not all at startup
6. **Render Loop Optimization**: Skip rendering when tab is inactive
7. **Debounced Resize**: Handle window resize with 300ms debounce
8. **Object Pooling**: Reuse blood splatter particles instead of creating new ones

### Performance Budgets

- **Initial Load**: < 3 seconds on 3G connection
- **Model Load**: < 2 seconds per model
- **Frame Rate**: 60fps on desktop, 30fps minimum on mobile
- **Memory**: < 500MB total, < 200MB for models
- **Bundle Size**: < 5MB gzipped

### Monitoring

```javascript
// Performance monitoring utility
class PerformanceStats {
  constructor() {
    this.stats = {
      fps: 0,
      frameTime: 0,
      memory: 0,
      drawCalls: 0,
      triangles: 0
    };
  }
  
  update(renderer) {
    this.stats.fps = 1000 / this.stats.frameTime;
    this.stats.memory = performance.memory?.usedJSHeapSize || 0;
    this.stats.drawCalls = renderer.info.render.calls;
    this.stats.triangles = renderer.info.render.triangles;
  }
  
  getReport() {
    return {
      ...this.stats,
      memoryMB: (this.stats.memory / 1024 / 1024).toFixed(2),
      isPerformant: this.stats.fps >= 55
    };
  }
}
```

## Deployment

### Build Configuration

```javascript
// vite.config.js
export default {
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'three': ['three'],
          'react-three': ['@react-three/fiber', '@react-three/drei'],
          'animations': ['framer-motion', 'gsap']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei']
  }
};
```

### Asset Optimization

**Models**:
- Compress with gltf-pipeline: `gltf-pipeline -i model.gltf -o model.glb -d`
- Target: < 1MB per model
- Remove unused animations and materials

**Textures**:
- Resize to power-of-2 dimensions (512x512, 1024x1024)
- Compress to KTX2 format for production
- Use mipmaps for better performance

**Audio**:
- Convert to MP3 (128kbps) for compatibility
- Keep files under 100KB each
- Use audio sprites for multiple short sounds

### Hosting

**Platform**: Vercel

**Configuration**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "headers": [
    {
      "source": "/models/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Browser Compatibility

**Minimum Requirements**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features**:
- WebGL 2.0
- ES2020 JavaScript
- Web Audio API
- ResizeObserver
- IntersectionObserver

**Fallback Strategy**:
If WebGL 2.0 is unavailable, display message:
```
"Your browser doesn't support WebGL 2.0. 
Please update to the latest version of Chrome, Firefox, or Edge."
```

## Accessibility

While this is a visual 3D experience, basic accessibility is maintained:

- **Keyboard Navigation**: All controls accessible via Tab key
- **Focus Indicators**: Visible focus rings on interactive elements
- **Alt Text**: Descriptive labels for model thumbnails
- **Reduced Motion**: Respect `prefers-reduced-motion` media query
- **Screen Reader**: Announce model loading states and errors

```javascript
// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  // Disable camera animations
  // Reduce particle effects
  // Disable screen glitch
}
```
