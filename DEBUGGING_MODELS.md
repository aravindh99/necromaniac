# 🔍 Debugging Model Display Issue

## Problem
You're seeing a red wireframe cube instead of your 3D models.

## Quick Diagnosis

### Step 1: Check Browser Console
1. Open your browser (Chrome/Firefox/Edge)
2. Press `F12` to open Developer Tools
3. Click the "Console" tab
4. Look for these messages:

**Good Signs:**
```
✅ "Loading model: /models/scary_monster.glb"
✅ "Model loaded successfully!"
✅ "Real model loaded successfully!"
✅ "Animations found: [...]"
```

**Bad Signs:**
```
❌ "Failed to load model"
❌ "Fallback model loaded"
❌ "404 Not Found"
❌ "CORS error"
```

### Step 2: Check Network Tab
1. In Developer Tools, click "Network" tab
2. Refresh the page
3. Look for `scary_monster.glb` in the list
4. Check the Status column:
   - ✅ `200` = Success
   - ❌ `404` = File not found
   - ❌ `Failed` = Loading error

### Step 3: Try Camera Controls
The model might be there but you can't see it:
- **Scroll out** (zoom out) - Model might be too close
- **Press R** - Reset camera to default position
- **Drag with left mouse** - Rotate around to find the model

## Common Issues & Fixes

### Issue 1: Model Too Small
**Symptom**: Console says "loaded successfully" but you see nothing

**Fix**: Increase scale in `src/App.jsx`:
```javascript
<ZombieModel
  scale={5}  // Try 5, 10, or even 20
  position={[0, -1, 0]}
  ...
/>
```

### Issue 2: Model Too Large
**Symptom**: You see a small part of something red/textured

**Fix**: Decrease scale:
```javascript
<ZombieModel
  scale={0.1}  // Try 0.1, 0.5, or 1
  position={[0, -1, 0]}
  ...
/>
```

### Issue 3: Model Outside Camera View
**Symptom**: Console says loaded but nothing visible

**Fix**: Adjust position:
```javascript
<ZombieModel
  scale={2}
  position={[0, 0, 0]}  // Try [0, 0, 0] or [0, -2, 0]
  ...
/>
```

### Issue 4: Model Files Not Found
**Symptom**: 404 errors in console/network tab

**Fix**: Check file paths in `src/constants/modelManifest.js`:
```javascript
export const MODEL_MANIFEST = [
  {
    id: 'scary-monster',
    name: 'Scary Monster',
    url: '/models/scary_monster.glb',  // Must match actual filename
    ...
  }
];
```

Verify files exist:
```bash
dir public\models
# Should show: scary.glb, scary_guy.glb, scary_monster.glb
```

### Issue 5: CORS Error
**Symptom**: "CORS policy" error in console

**Fix**: Make sure you're running the dev server:
```bash
npm run dev
```
Don't open `index.html` directly in browser!

## Testing Different Scales

Try these scale values one at a time:

```javascript
// In src/App.jsx, line ~150

// Very small models:
scale={0.01}

// Small models:
scale={0.1}

// Medium models (default):
scale={1}

// Large models:
scale={2}

// Very large models:
scale={5}

// Huge models:
scale={10}
```

## Advanced Debugging

### Add Bounding Box Helper
In `src/components/Scene/ZombieModel.jsx`, add this after model loads:

```javascript
// After: setModel(result.scene);
// Add:
if (result.scene) {
  const box = new THREE.BoxHelper(result.scene, 0x00ff00);
  groupRef.current.add(box);
  
  // Log bounding box size
  const bbox = new THREE.Box3().setFromObject(result.scene);
  const size = bbox.getSize(new THREE.Vector3());
  console.log('Model size:', size);
}
```

This will show a green wireframe box around your model so you can see where it is.

### Check Model Bounds
Add this logging in `src/utils/modelLoader.js`:

```javascript
// After: gltf.scene.traverse((child) => {
console.log('Model children:', gltf.scene.children.length);

gltf.scene.traverse((child) => {
  if (child.isMesh) {
    console.log('Mesh found:', child.name, child.geometry.attributes.position.count, 'vertices');
  }
});
```

## Quick Test: Force Visible Model

Replace the ZombieModel in App.jsx temporarily with a test cube:

```javascript
{/* Test cube - should always be visible */}
<mesh position={[0, 0, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="#00ff00" />
</mesh>
```

If you see a green cube, your scene is working and it's just a model loading/scaling issue.

## Expected Behavior

When working correctly, you should see:
1. Loading indicator with progress bar
2. Progress goes from 0% to 100%
3. Model appears in center of screen
4. Animation controls appear in top-right
5. Can rotate camera around model
6. Blood splatters appear on click

## Still Not Working?

### Share This Info:
1. What you see in console (copy/paste errors)
2. What you see in Network tab (status codes)
3. What you see on screen (describe or screenshot)
4. Model file sizes (from `dir public\models`)

### Nuclear Option: Test with Simple Model
Download a tiny test model:
1. Go to https://github.com/KhronosGroup/glTF-Sample-Models
2. Download `Box.glb` (tiny 1KB test file)
3. Put it in `public/models/test.glb`
4. Update manifest to use it
5. If this works, your models might be corrupted

## Success Checklist

- [ ] Dev server running (`npm run dev`)
- [ ] Browser console open (F12)
- [ ] No 404 errors in Network tab
- [ ] "Model loaded successfully!" in console
- [ ] Tried zooming out (scroll wheel)
- [ ] Tried pressing R to reset camera
- [ ] Tried different scale values (0.1, 1, 5, 10)
- [ ] Tried different position values

---

**Most Common Fix**: Just change `scale={2}` to `scale={0.5}` or `scale={5}` in App.jsx!
