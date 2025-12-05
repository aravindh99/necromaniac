// ============================================
// IMPORTS
// ============================================

// ============================================
// COMPONENT
// ============================================

/**
 * Animation control buttons
 * Displays buttons for each available animation
 * 
 * @param {Object} props
 * @param {string[]} props.animations - Available animation names
 * @param {string} props.currentAnimation - Currently playing animation
 * @param {Function} props.onAnimationChange - Callback when animation is selected
 * @returns {JSX.Element}
 */
export default function AnimationControls({
  animations = [],
  currentAnimation = null,
  onAnimationChange,
}) {
  if (animations.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-8 right-8 z-20 bg-bg-secondary border-2 border-blood-dark p-4 rounded">
      <h3 className="text-sm font-heading text-blood-bright mb-3">
        🎬 Animations
      </h3>
      
      <div className="flex flex-col gap-2">
        {animations.map((animName) => {
          const isActive = animName === currentAnimation;
          
          return (
            <button
              key={animName}
              onClick={() => onAnimationChange(animName)}
              className={`
                px-4 py-2 text-sm font-body rounded transition-all duration-300
                ${isActive
                  ? 'bg-blood-bright text-white border-2 border-blood-bright'
                  : 'bg-bg-primary text-text-primary border-2 border-blood-dark hover:border-blood-bright hover:shadow-blood-glow'
                }
              `}
            >
              {isActive && '▶ '}
              {animName}
            </button>
          );
        })}
      </div>
    </div>
  );
}
