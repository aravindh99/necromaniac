// ============================================
// COMPONENT
// ============================================

/**
 * Vignette effect with pulsing animation
 * Creates dark edges that pulse like a heartbeat
 * 
 * @returns {JSX.Element}
 */
export default function VignetteEffect() {
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-10"
      style={{
        background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.8) 100%)',
        animation: 'pulse 4s ease-in-out infinite'
      }}
    />
  );
}
