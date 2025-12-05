// ============================================
// IMPORTS
// ============================================

import { useEffect, useState } from 'react';

// ============================================
// CONSTANTS
// ============================================

const MIN_INTERVAL = 8000;  // 8 seconds
const MAX_INTERVAL = 15000; // 15 seconds
const GLITCH_DURATION = 200; // 0.2 seconds

// ============================================
// COMPONENT
// ============================================

/**
 * Screen glitch effect with RGB split
 * Triggers randomly every 8-15 seconds
 * 
 * @returns {JSX.Element}
 */
export default function GlitchEffect() {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const scheduleNextGlitch = () => {
      // Random interval between 8-15 seconds
      const interval = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      
      return setTimeout(() => {
        // Trigger glitch
        setIsGlitching(true);
        
        // Stop glitch after duration
        setTimeout(() => {
          setIsGlitching(false);
          // Schedule next glitch
          scheduleNextGlitch();
        }, GLITCH_DURATION);
      }, interval);
    };

    const timeoutId = scheduleNextGlitch();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {/* SVG Filter Definition */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="glitch-filter">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05"
              numOctaves="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isGlitching ? 20 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Glitch Overlay */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 30,
          filter: isGlitching ? 'url(#glitch-filter)' : 'none',
          transition: 'filter 0.05s',
        }}
      >
        {/* RGB Split Effect */}
        {isGlitching && (
          <>
            <div
              className="absolute inset-0 bg-red-500 mix-blend-screen opacity-20"
              style={{
                transform: 'translate(-2px, 2px)',
              }}
            />
            <div
              className="absolute inset-0 bg-cyan-500 mix-blend-screen opacity-20"
              style={{
                transform: 'translate(2px, -2px)',
              }}
            />
          </>
        )}
      </div>
    </>
  );
}
