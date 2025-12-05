// ============================================
// COMPONENT
// ============================================

/**
 * Display model information overlay
 * 
 * @param {Object} props
 * @param {Object} props.model - Current model data
 * @param {Object} props.modelInfo - Loaded model info
 * @param {number} props.currentIndex - Current model index
 * @param {number} props.total - Total models
 * @returns {JSX.Element}
 */
export default function ModelInfo({ model, modelInfo, currentIndex, total }) {
  return (
    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-20 text-center pointer-events-none">
      <h1 className="text-5xl font-heading text-blood-bright glitch-text drop-shadow-lg">
        🧟 NECROMANIAC
      </h1>
      <p className="text-text-secondary font-body mt-2">
        Where Your 3D Nightmares Come to Life
      </p>
      <div className="mt-4 bg-bg-secondary bg-opacity-80 px-6 py-3 rounded-lg border border-blood-dark">
        <p className="text-toxic-green font-body text-sm">
          {model.name} ({currentIndex + 1}/{total})
        </p>
        {modelInfo && modelInfo.hasAnimations && (
          <p className="text-text-secondary font-body text-xs mt-1">
            🎬 Animations: {modelInfo.animations.join(', ')}
          </p>
        )}
        {modelInfo && !modelInfo.hasAnimations && (
          <p className="text-text-secondary font-body text-xs mt-1">
            📦 Static Model (No Animations)
          </p>
        )}
      </div>
    </div>
  );
}
