# 💡 Lighting & Visibility Fix

## Problem
Everything was black - couldn't see any models!

## Root Causes
1. **Background color** = `#0a0a0a` (pure black)
2. **Ground plane** = `#0a0a0a` (pure black)
3. **Ambient light** = Too dim (0.3 intensity)
4. **Spotlight** = Purple color, low intensity
5. **Models** = Possibly dark colored against black background

## Fixes Applied

### ✅ Increased Lighting
```javascript
// Before: Dark purple ambient
<ambientLight intensity={0.3} color="#1a0a1a" />

// After: Bright white ambient
<ambientLight intensity={0.8} color="#ffffff" />
```

### ✅ Brighter Spotlight
```javascript
// Before: Purple, intensity 2
<spotLight intensity={2} color="#6600ff" />

// After: White, intensity 5
<spotLight intensity={5} color="#ffffff" />
```

### ✅ Added Front Light
```javascript
// NEW: Directional light from front
<directionalLight
  position={[0, 5, 5]}
  intensity={3}
  color="#ffffff"
/>
```

### ✅ Lighter Ground Plane
```javascript
// Before: Pure black
<meshStandardMaterial color="#0a0a0a" />

// After: Dark gray (visible contrast)
<meshStandardMaterial color="#2a2a2a" />
```

### ✅ Adjusted Model Position
```javascript
// Before: Below ground
position={[0, -1, 0]}

// After: At ground level
position={[0, 0, 0]}
```

### ✅ Reset Scale
```javascript
// Before: 2x scale
scale={2}

// After: Normal scale
scale={1}
```

### ✅ Added Test Cube
```javascript
// Green cube to verify scene is working
<mesh position={[3, 0, 0]}>
  <boxGeometry args={[0.5, 0.5, 0.5]} />
  <meshStandardMaterial color="#00ff00" />
</mesh>
```

### ✅ Reduced Fog
```javascript
// Before: Heavy fog (near=5, far=20)
<fog args={['#0a0a0a', 5, 20]} />

// After: Light fog (near=10, far=30)
<fog args={['#0a0a0a', 10, 30]} />
```

## What You Should See Now

1. **Green test cube** on the right side (confirms scene works)
2. **Gray ground plane** (not pure black)
3. **Bright lighting** illuminating the models
4. **Models visible** with proper lighting

## If Models Still Not Visible

### Try Different Scales
Edit `src/App.jsx` line ~175:

```javascript
// Very small models
scale={0.01}

// Small models
scale={0.1}

// Normal (current)
scale={1}

// Large models
scale={5}

// Very large models
scale={10}
```

### Check Console
Open browser console (F12) and look for:
- "Model loaded successfully!" = Model is loading
- "Real model loaded successfully!" = Not a fallback
- Any error messages

### Camera Controls
- **Scroll out** - Zoom out to see larger models
- **Press R** - Reset camera to default position
- **Drag** - Rotate around to find the model

## Restoring Horror Theme Later

Once models are visible, you can restore the dark horror atmosphere:

```javascript
// Dim the lights back down
<ambientLight intensity={0.3} color="#1a0a1a" />

// Use colored lights
<spotLight intensity={2} color="#6600ff" />

// Darker ground
<meshStandardMaterial color="#0a0a0a" />

// Remove test cube
// <mesh position={[3, 0, 0]}>...</mesh>
```

## Current Lighting Setup

```
Scene Lighting:
├── Ambient Light (white, 0.8 intensity) - Overall illumination
├── Spotlight (white, 5 intensity) - From left side
└── Directional Light (white, 3 intensity) - From front

Ground: Dark gray (#2a2a2a)
Background: Black (#0a0a0a)
Fog: Light (10-30 units)
```

## Next Steps

1. **Run dev server**: `npm run dev`
2. **Look for green cube** - If you see it, scene is working
3. **Check if models appear** - Should be visible now
4. **Adjust scale** if needed - Try 0.1, 1, 5, or 10
5. **Once visible** - Can restore horror lighting

---

**The scene should now be bright enough to see your models!** 💡

If you still see nothing, check the browser console for errors and try different scale values.
