// ============================================
// COMPONENT
// ============================================

/**
 * Loading indicator with horror theme
 * 
 * @param {Object} props
 * @param {number} props.progress - Loading progress (0-100)
 * @param {string} props.message - Loading message
 * @returns {JSX.Element}
 */
export default function LoadingIndicator({ progress = 0, message = 'Loading...' }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 bg-bg-primary bg-opacity-90 pointer-events-none">
      <div className="text-center">
        <div className="loading-spinner mx-auto mb-4"></div>
        <p className="text-blood-bright font-heading text-2xl mb-2">
          {message}
        </p>
        {progress > 0 && progress < 100 && (
          <div className="w-64 h-2 bg-bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-blood-bright transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <p className="text-text-secondary font-body text-sm mt-2">
          {progress > 0 ? `${Math.round(progress)}%` : 'Awakening the dead...'}
        </p>
      </div>
    </div>
  );
}
