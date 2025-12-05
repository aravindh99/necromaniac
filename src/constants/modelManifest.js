// ============================================
// MODEL MANIFEST
// ============================================

/**
 * Manifest of available zombie models
 * 
 * Note: For the hackathon, you'll need to download actual models from:
 * - Sketchfab.com (search "zombie animated", filter: downloadable)
 * - Mixamo.com (free rigged characters)
 * 
 * Place downloaded .glb files in /public/models/
 */

export const MODEL_MANIFEST = [
  {
    id: 'scene',
    name: 'Horror Scene',
    url: '/models/scene/scene.gltf',
    thumbnail: null,
    description: 'Complete horror scene with textures',
    animations: [], // Will be detected on load
    polyCount: 0, // Unknown
    attribution: {
      author: 'Custom Scene',
      license: 'Custom',
      source: 'Local'
    },
    tags: ['scene', 'environment', 'horror']
  },
  {
    id: 'scary-monster',
    name: 'Scary Monster',
    url: '/models/scary_monster.glb',
    thumbnail: null,
    description: 'Terrifying monster creature',
    animations: [], // Will be detected on load
    polyCount: 0, // Unknown
    attribution: {
      author: 'Downloaded from Sketchfab',
      license: 'Check model source',
      source: 'Sketchfab'
    },
    tags: ['monster', 'scary', 'horror']
  },
  {
    id: 'scary-guy',
    name: 'Scary Guy',
    url: '/models/scary_guy.glb',
    thumbnail: null,
    description: 'Frightening humanoid figure',
    animations: [], // Will be detected on load
    polyCount: 0, // Unknown
    attribution: {
      author: 'Downloaded from Sketchfab',
      license: 'Check model source',
      source: 'Sketchfab'
    },
    tags: ['humanoid', 'scary', 'horror']
  },
  {
    id: 'scary',
    name: 'Scary',
    url: '/models/scary.glb',
    thumbnail: null,
    description: 'Horror creature',
    animations: [], // Will be detected on load
    polyCount: 0, // Unknown
    attribution: {
      author: 'Downloaded from Sketchfab',
      license: 'Check model source',
      source: 'Sketchfab'
    },
    tags: ['creature', 'scary', 'horror']
  }
];

/**
 * Get model by ID
 * 
 * @param {string} id - Model ID
 * @returns {Object|null} Model data or null
 */
export function getModelById(id) {
  return MODEL_MANIFEST.find(model => model.id === id) || null;
}

/**
 * Get all model IDs
 * 
 * @returns {string[]} Array of model IDs
 */
export function getAllModelIds() {
  return MODEL_MANIFEST.map(model => model.id);
}

/**
 * Get models by tag
 * 
 * @param {string} tag - Tag to filter by
 * @returns {Object[]} Array of matching models
 */
export function getModelsByTag(tag) {
  return MODEL_MANIFEST.filter(model => 
    model.tags.includes(tag.toLowerCase())
  );
}

/**
 * Get total polygon count for all models
 * 
 * @returns {number} Total polygons
 */
export function getTotalPolyCount() {
  return MODEL_MANIFEST.reduce((sum, model) => sum + model.polyCount, 0);
}

/**
 * Placeholder model for development
 * This is used when actual models aren't available yet
 */
export const PLACEHOLDER_MODEL = {
  id: 'placeholder',
  name: 'Placeholder Zombie',
  url: null, // Will use fallback cube
  thumbnail: null,
  description: 'Placeholder for development',
  animations: ['idle'],
  polyCount: 12,
  attribution: {
    author: 'System',
    license: 'N/A',
    source: 'Generated'
  },
  tags: ['placeholder']
};
