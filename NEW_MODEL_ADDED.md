# 🎬 New Model Added: Horror Scene

## What Was Done

### ✅ Model Files Moved
**From**: `src/components/Scene/` (incorrect location)  
**To**: `public/models/scene/` (correct location)

**Files Moved**:
- `scene.gltf` - Main GLTF model file
- `scene.bin` - Binary data for the model
- `textures/` folder with 3 texture files:
  - `Material.001_baseColor.png` - Base color/diffuse map
  - `Material.001_metallicRoughness.png` - PBR metallic/roughness map
  - `Material.001_normal.png` - Normal map for surface details

### ✅ Model Manifest Updated
Added new model as **first entry** in the manifest:

```javascript
{
  id: 'scene',
  name: 'Horror Scene',
  url: '/models/scene/scene.gltf',
  description: 'Complete horror scene with textures',
  tags: ['scene', 'environment', 'horror']
}
```

### ✅ Source Files Cleaned
Removed model files from `src/components/Scene/` to avoid confusion.

## Model Details

### File Structure
```
public/models/scene/
├── scene.gltf          # Main model file (references textures)
├── scene.bin           # Binary geometry/animation data
└── textures/
    ├── Material.001_baseColor.png
    ├── Material.001_metallicRoughness.png
    └── Material.001_normal.png
```

### Why GLTF Instead of GLB?
- **GLTF** = Separate files (easier to edit textures)
- **GLB** = Single binary file (more compact)

Your scene uses GLTF format with external textures, which is perfect for:
- Swapping textures easily
- Debugging texture issues
- Modifying materials

## How to Use

### In the App
1. Run dev server: `npm run dev`
2. Click "Next" button to cycle through models
3. "Horror Scene" will be the **first model** shown

### Model Order
1. **Horror Scene** ← NEW!
2. Scary Monster
3. Scary Guy
4. Scary

### Testing the New Model

**Check Console For**:
```
✅ "Loading model: /models/scene/scene.gltf"
✅ "Model loaded successfully!"
✅ "Animations found: [...]"
```

**If You See Red Cube**:
The scene might be very large or very small. Try adjusting scale in `src/App.jsx`:

```javascript
<ZombieModel
  scale={0.1}  // Try: 0.01, 0.1, 1, 5, 10
  position={[0, -1, 0]}
  ...
/>
```

## Texture Loading

### How It Works
1. GLTF file references textures by relative path
2. Browser loads textures from `/models/scene/textures/`
3. Three.js applies textures to materials automatically

### If Textures Don't Load
Check browser Network tab for:
- ✅ `Material.001_baseColor.png` - Status 200
- ✅ `Material.001_metallicRoughness.png` - Status 200
- ✅ `Material.001_normal.png` - Status 200

If you see 404 errors, the paths in scene.gltf might be wrong.

## Model Comparison

| Model | Format | Size | Textures | Animations |
|-------|--------|------|----------|------------|
| **Horror Scene** | GLTF | ? | ✅ 3 maps | ? |
| Scary Monster | GLB | 9.3 MB | Embedded | ? |
| Scary Guy | GLB | 23.4 MB | Embedded | ? |
| Scary | GLB | 9.3 MB | Embedded | ? |

## PBR Materials

Your scene uses **PBR (Physically Based Rendering)** materials:

- **Base Color**: Main color/texture
- **Metallic/Roughness**: How shiny/rough the surface is
- **Normal Map**: Adds surface detail without geometry

This will look great with the purple/blue spotlights! 🎨

## Troubleshooting

### Issue: Model Too Large
**Symptom**: Can only see a small part of something

**Fix**: Decrease scale
```javascript
scale={0.01}  // Very small
```

### Issue: Model Too Small
**Symptom**: Nothing visible, but console says loaded

**Fix**: Increase scale
```javascript
scale={10}  // Very large
```

### Issue: Model Upside Down
**Symptom**: Model is flipped

**Fix**: Rotate in Blender before export, or add rotation:
```javascript
<group rotation={[Math.PI, 0, 0]}>
  <ZombieModel ... />
</group>
```

### Issue: Textures Look Wrong
**Symptom**: Model is white/gray or textures are missing

**Possible Causes**:
1. Texture paths in GLTF are incorrect
2. Textures didn't copy correctly
3. CORS issue (shouldn't happen with dev server)

**Fix**: Check browser console and Network tab

## Next Steps

1. **Test the model**: Run `npm run dev` and check if it loads
2. **Adjust scale**: If you can't see it, try different scale values
3. **Check animations**: See if the model has any animations
4. **Adjust lighting**: The purple/blue lights might need tweaking for this scene

## Build Status

✅ Build successful with new model  
✅ No errors or warnings  
✅ Bundle size: ~1MB (gzipped: ~280KB)  
✅ All 4 models in manifest

---

**The Horror Scene model is now ready to use!** 🎬

It will appear as the first model when you start the app. Use the Previous/Next buttons to cycle through all 4 models.
