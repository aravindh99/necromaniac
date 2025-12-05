// ============================================
// IMPORTS
// ============================================

import { motion } from 'framer-motion';

// ============================================
// CONSTANTS
// ============================================

const MODEL_STORIES = {
  'scene': {
    title: 'The Laboratory',
    story: 'This is where it all began... The experiments that should never have been conducted. The screams still echo in these walls.',
    warning: '⚠️ Do not approach the specimens'
  },
  'scary-monster': {
    title: 'Subject Alpha',
    story: 'The first successful mutation. It broke free from containment on Day 7. No one survived the encounter.',
    warning: '🩸 Extremely hostile'
  },
  'scary-guy': {
    title: 'The Infected',
    story: 'Once human, now something else. The virus took only 3 hours to complete the transformation.',
    warning: '☣️ Highly contagious'
  },
  'scary': {
    title: 'Patient Zero',
    story: 'The source of the outbreak. Found in the depths of an ancient tomb. It should have stayed buried.',
    warning: '💀 Origin of the plague'
  }
};

// ============================================
// COMPONENT
// ============================================

/**
 * Story overlay for each model
 * 
 * @param {Object} props
 * @param {string} props.modelId - Current model ID
 * @returns {JSX.Element}
 */
export default function StoryOverlay({ modelId }) {
  const story = MODEL_STORIES[modelId];

  if (!story) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="absolute top-24 left-8 z-20 max-w-md"
    >
      <div className="horror-card p-6 space-y-4">
        <h2 className="text-2xl font-heading text-blood-bright">
          {story.title}
        </h2>
        <p className="text-sm font-body text-text-primary leading-relaxed">
          {story.story}
        </p>
        <div className="text-xs font-body text-text-danger border-l-4 border-blood-bright pl-4 py-2">
          {story.warning}
        </div>
      </div>
    </motion.div>
  );
}
