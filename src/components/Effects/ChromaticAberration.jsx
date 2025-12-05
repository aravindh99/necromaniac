// ============================================
// IMPORTS
// ============================================

// ============================================
// CONSTANTS
// ============================================

const ABERRATION_STRENGTH = 3; // pixels

// ============================================
// COMPONENT
// ============================================

/**
 * Chromatic aberration effect (RGB split)
 * Activates on hover over 3D models
 * 
 * @param {Object} props
 * @param {boolean} props.isActive - Whether effect is active
 * @returns {JSX.Element}
 */
export default function ChromaticAberration({ isActive = false }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none transition-opacity duration-300"
      style={{
        zIndex: 35,
        opacity: isActive ? 1 : 0,
      }}
    >
      {/* Red channel offset */}
      <div
        className="absolute inset-0 bg-red-500 mix-blend-screen"
        style={{
          opacity: 0.3,
          transform: `translate(-${ABERRATION_STRENGTH}px, 0)`,
        }}
      />
      
      {/* Cyan channel offset */}
      <div
        className="absolute inset-0 bg-cyan-500 mix-blend-screen"
        style={{
          opacity: 0.3,
          transform: `translate(${ABERRATION_STRENGTH}px, 0)`,
        }}
      />
    </div>
  );
}
