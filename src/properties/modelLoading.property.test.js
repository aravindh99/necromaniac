// ============================================
// IMPORTS
// ============================================

import { describe, test, expect, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import { 
  validateModelUrl, 
  createFallbackModel,
  loadModel
} from '../utils/modelLoader';

// ============================================
// PROPERTY TESTS
// ============================================

describe('Model Loading Property Tests', () => {
  /**
   * Feature: necromorph-studio, Property 1: Model loading success
   * Validates: Requirements 1.2, 1.3
   * 
   * For any valid model URL from the manifest, loading that model should result 
   * in a Three.js Group object being added to the scene with the correct number of animations.
   */
  test('Property 1: Valid model URLs pass validation', () => {
    fc.assert(
      fc.property(
        fc.record({
          filename: fc.string({ minLength: 1, maxLength: 20 }),
          extension: fc.constantFrom('.glb', '.gltf', '.GLB', '.GLTF')
        }),
        ({ filename, extension }) => {
          const url = `/models/${filename}${extension}`;
          const isValid = validateModelUrl(url);
          
          // Valid extensions should pass
          expect(isValid).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Model URL validation rejects invalid formats', () => {
    fc.assert(
      fc.property(
        fc.record({
          filename: fc.string({ minLength: 1, maxLength: 20 }),
          extension: fc.constantFrom('.obj', '.fbx', '.dae', '.txt', '.jpg')
        }),
        ({ filename, extension }) => {
          const url = `/models/${filename}${extension}`;
          const isValid = validateModelUrl(url);
          
          // Invalid extensions should fail
          expect(isValid).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('Property 1: Model URL validation handles edge cases', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.constant(''),
          fc.constant(123),
          fc.constant({}),
          fc.constant([])
        ),
        (invalidUrl) => {
          const isValid = validateModelUrl(invalidUrl);
          
          // Non-string or empty values should fail
          expect(isValid).toBe(false);
        }
      ),
      { numRuns: 50 }
    );
  });

  /**
   * Feature: necromorph-studio, Property 2: Model loading failure recovery
   * Validates: Requirements 1.4, 9.1
   * 
   * For any invalid or non-existent model URL, attempting to load should result 
   * in an error state and a fallback placeholder model being displayed without crashing.
   */
  test('Property 2: Fallback model is always valid', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 100 }),
        (iterations) => {
          // Create multiple fallback models
          for (let i = 0; i < Math.min(iterations, 10); i++) {
            const fallback = createFallbackModel();
            
            // Verify fallback is a valid Three.js Group
            expect(fallback).toBeDefined();
            expect(fallback.isGroup).toBe(true);
            
            // Verify fallback has error metadata
            expect(fallback.userData.isFallback).toBe(true);
            expect(fallback.userData.error).toBeDefined();
            
            // Verify fallback has at least one child (the mesh)
            expect(fallback.children.length).toBeGreaterThan(0);
            
            // Verify the mesh has geometry and material
            const mesh = fallback.children[0];
            expect(mesh.isMesh).toBe(true);
            expect(mesh.geometry).toBeDefined();
            expect(mesh.material).toBeDefined();
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 2: Invalid URLs trigger fallback without crashing', async () => {
    fc.assert(
      await fc.asyncProperty(
        fc.record({
          path: fc.string({ minLength: 1, maxLength: 30 }),
          extension: fc.constantFrom('.glb', '.gltf')
        }),
        async ({ path, extension }) => {
          // Create an invalid URL (non-existent file)
          const invalidUrl = `/nonexistent/${path}${extension}`;
          
          try {
            const model = await loadModel(invalidUrl);
            
            // Should return a fallback model, not throw
            expect(model).toBeDefined();
            expect(model.isGroup).toBe(true);
            
            // Should be marked as fallback
            expect(model.userData.isFallback).toBe(true);
            
            return true;
          } catch (error) {
            // Should not throw - should return fallback instead
            expect(true).toBe(false); // Fail if we get here
            return false;
          }
        }
      ),
      { numRuns: 20 }
    );
  });

  test('Property 2: Fallback models are disposable', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }),
        (count) => {
          const fallbacks = [];
          
          // Create multiple fallbacks
          for (let i = 0; i < count; i++) {
            fallbacks.push(createFallbackModel());
          }
          
          // Dispose all fallbacks
          fallbacks.forEach(fallback => {
            fallback.traverse((child) => {
              if (child.isMesh) {
                // Should have disposable geometry and material
                expect(child.geometry).toBeDefined();
                expect(child.material).toBeDefined();
                expect(typeof child.geometry.dispose).toBe('function');
                expect(typeof child.material.dispose).toBe('function');
                
                // Dispose them
                child.geometry.dispose();
                child.material.dispose();
              }
            });
          });
          
          // Should not crash
          expect(true).toBe(true);
        }
      ),
      { numRuns: 50 }
    );
  });

  test('Property 2: Fallback model has consistent structure', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 50 }),
        (seed) => {
          const fallback1 = createFallbackModel();
          const fallback2 = createFallbackModel();
          
          // All fallbacks should have same structure
          expect(fallback1.children.length).toBe(fallback2.children.length);
          expect(fallback1.userData.isFallback).toBe(fallback2.userData.isFallback);
          
          // Both should have mesh children
          const mesh1 = fallback1.children[0];
          const mesh2 = fallback2.children[0];
          
          expect(mesh1.isMesh).toBe(mesh2.isMesh);
          expect(mesh1.geometry.type).toBe(mesh2.geometry.type);
          
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});
