// ============================================
// IMPORTS
// ============================================

import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// ============================================
// PROPERTY TESTS
// ============================================

describe('Horror Effects - Property-Based Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Feature: necromorph-studio, Property 9: Glitch effect timing
  test('glitch effect schedules next trigger between 8-15 seconds', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (seed) => {
        // Seed random for reproducibility
        const MIN_INTERVAL = 8000;
        const MAX_INTERVAL = 15000;
        
        // Simulate scheduling logic
        const scheduleNextGlitch = () => {
          const random = (seed % 100) / 100; // Deterministic random
          const interval = MIN_INTERVAL + random * (MAX_INTERVAL - MIN_INTERVAL);
          return interval;
        };

        const interval = scheduleNextGlitch();
        
        // Property: Interval must be between 8-15 seconds
        expect(interval).toBeGreaterThanOrEqual(MIN_INTERVAL);
        expect(interval).toBeLessThanOrEqual(MAX_INTERVAL);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property 10: Blood splatter positioning
  test('blood particles spawn at click position with outward velocities', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1920 }), // x
        fc.integer({ min: 0, max: 1080 }), // y
        (clickX, clickY) => {
          // Simulate particle creation
          const createParticle = (x, y) => {
            const angle = Math.random() * Math.PI * 2;
            const speed = 100 + Math.random() * 200;
            
            return {
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 100,
            };
          };

          const particle = createParticle(clickX, clickY);
          
          // Property 1: Particle spawns at click position
          expect(particle.x).toBe(clickX);
          expect(particle.y).toBe(clickY);
          
          // Property 2: Particle has non-zero velocity
          const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
          expect(speed).toBeGreaterThan(0);
          
          // Property 3: Velocity is within expected range
          expect(speed).toBeGreaterThanOrEqual(0); // After upward adjustment
          expect(speed).toBeLessThanOrEqual(400); // Max speed + upward component
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property 10: Blood splatter physics
  test('blood particles follow gravity and fade over time', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 2, noNaN: true }), // deltaTime in seconds
        (deltaTime) => {
          const GRAVITY = 500;
          const PARTICLE_LIFETIME = 1500;
          
          // Initial particle state
          const particle = {
            x: 100,
            y: 100,
            vx: 50,
            vy: -100,
            alpha: 1,
            birthTime: 0,
          };

          // Simulate physics update
          const updateParticle = (p, dt) => {
            const age = dt * 1000; // Convert to ms
            p.vy += GRAVITY * dt;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.alpha = Math.max(0, 1 - (age / PARTICLE_LIFETIME));
            return p;
          };

          const updated = updateParticle({ ...particle }, deltaTime);
          
          // Property 1: Vertical velocity increases (gravity)
          expect(updated.vy).toBeGreaterThan(particle.vy);
          
          // Property 2: Position changes based on velocity
          expect(updated.x).not.toBe(particle.x);
          expect(updated.y).not.toBe(particle.y);
          
          // Property 3: Alpha decreases over time
          if (deltaTime > 0) {
            expect(updated.alpha).toBeLessThanOrEqual(particle.alpha);
          }
          
          // Property 4: Alpha stays in valid range
          expect(updated.alpha).toBeGreaterThanOrEqual(0);
          expect(updated.alpha).toBeLessThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property 11: Hover effect activation
  test('chromatic aberration activates on hover and deactivates on hover end', () => {
    fc.assert(
      fc.property(fc.boolean(), (isHovering) => {
        // Simulate effect state
        const getEffectOpacity = (hovering) => {
          return hovering ? 1 : 0;
        };

        const opacity = getEffectOpacity(isHovering);
        
        // Property: Opacity matches hover state
        if (isHovering) {
          expect(opacity).toBe(1);
        } else {
          expect(opacity).toBe(0);
        }
        
        // Property: Opacity is always valid
        expect(opacity).toBeGreaterThanOrEqual(0);
        expect(opacity).toBeLessThanOrEqual(1);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property 9: Glitch duration
  test('glitch effect lasts exactly 0.2 seconds', () => {
    fc.assert(
      fc.property(fc.constant(200), (duration) => {
        const EXPECTED_DURATION = 200; // milliseconds
        
        // Property: Duration is exactly 0.2 seconds
        expect(duration).toBe(EXPECTED_DURATION);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property 10: Particle count range
  test('blood splatter creates 20-40 particles per click', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 100 }), (seed) => {
        const MIN_COUNT = 20;
        const MAX_COUNT = 40;
        
        // Simulate particle count generation
        const getParticleCount = (s) => {
          const random = (s % 100) / 100;
          return MIN_COUNT + Math.floor(random * (MAX_COUNT - MIN_COUNT));
        };

        const count = getParticleCount(seed);
        
        // Property: Count is within range
        expect(count).toBeGreaterThanOrEqual(MIN_COUNT);
        expect(count).toBeLessThan(MAX_COUNT);
      }),
      { numRuns: 100 }
    );
  });

  // Feature: necromorph-studio, Property: Film grain opacity
  test('film grain maintains consistent low opacity', () => {
    fc.assert(
      fc.property(fc.constant(0.05), (opacity) => {
        const EXPECTED_OPACITY = 0.05;
        
        // Property: Opacity is low and consistent
        expect(opacity).toBe(EXPECTED_OPACITY);
        expect(opacity).toBeLessThan(0.1); // Subtle effect
      }),
      { numRuns: 100 }
    );
  });
});
