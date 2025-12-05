// ============================================
// IMPORTS
// ============================================

import { useState } from 'react';
import GlitchEffect from './GlitchEffect';
import BloodSplatter from './BloodSplatter';
import VignetteEffect from './VignetteEffect';
import ChromaticAberration from './ChromaticAberration';
import FilmGrain from './FilmGrain';

// ============================================
// COMPONENT
// ============================================

/**
 * Container for all horror visual effects
 * Layers effects with proper z-index and pointer-events
 * 
 * @returns {JSX.Element}
 */
export default function HorrorOverlay() {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <>
      {/* Layer 1: Film Grain (lowest) */}
      <FilmGrain />
      
      {/* Layer 2: Vignette */}
      <VignetteEffect />
      
      {/* Layer 3: Glitch Effect */}
      <GlitchEffect />
      
      {/* Layer 4: Chromatic Aberration */}
      <ChromaticAberration isActive={isHovering} />
      
      {/* Layer 5: Blood Splatter (highest, interactive) */}
      <BloodSplatter />
    </>
  );
}
