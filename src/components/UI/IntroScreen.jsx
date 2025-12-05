// ============================================
// IMPORTS
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// CONSTANTS
// ============================================

const STORY_LINES = [
  "In the depths of an abandoned laboratory...",
  "Scientists played with forces beyond comprehension...",
  "They created... something unholy...",
  "Now, the specimens have awakened...",
  "And they're waiting... for YOU.",
];

// ============================================
// COMPONENT
// ============================================

/**
 * Creepy intro screen with horror story
 * 
 * @param {Object} props
 * @param {Function} props.onComplete - Callback when intro is complete
 * @returns {JSX.Element}
 */
export default function IntroScreen({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [showWarning, setShowWarning] = useState(true);

  useEffect(() => {
    console.log('IntroScreen effect:', { showWarning, currentLine, totalLines: STORY_LINES.length });
    
    if (!showWarning && currentLine < STORY_LINES.length) {
      console.log('Setting timer for next line...');
      const timer = setTimeout(() => {
        console.log('Timer fired, moving to next line');
        setCurrentLine(prev => prev + 1);
      }, 2500);
      return () => {
        console.log('Cleaning up timer');
        clearTimeout(timer);
      };
    } else if (!showWarning && currentLine >= STORY_LINES.length) {
      console.log('Story complete, calling onComplete in 1.5s');
      const timer = setTimeout(() => {
        console.log('Calling onComplete');
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentLine, showWarning, onComplete]);

  const handleEnter = () => {
    console.log('User clicked ENTER button');
    setShowWarning(false);
  };

  const handleSkip = () => {
    console.log('User clicked SKIP button');
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black"
    >
      {showWarning ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-8 max-w-2xl"
        >
          <h1 className="text-6xl font-heading text-blood-bright mb-8 glitch-text">
            ⚠️ WARNING ⚠️
          </h1>
          <div className="text-xl text-text-primary font-body mb-8 space-y-4">
            <p>This experience contains:</p>
            <ul className="list-none space-y-2">
              <li>🩸 Disturbing imagery</li>
              <li>⚡ Flashing lights</li>
              <li>👻 Jump scares</li>
              <li>🔊 Sudden sounds</li>
            </ul>
            <p className="text-text-danger mt-6">
              Viewer discretion is advised.
            </p>
          </div>
          <button
            onClick={handleEnter}
            className="horror-button text-xl px-8 py-4"
          >
            I DARE TO ENTER
          </button>
        </motion.div>
      ) : (
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLine}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center p-8"
            >
              {currentLine < STORY_LINES.length ? (
                <p className="text-3xl font-heading text-blood-bright">
                  {STORY_LINES[currentLine]}
                </p>
              ) : (
                <p className="text-3xl font-heading text-blood-bright">
                  Loading...
                </p>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Skip button */}
          <button
            onClick={handleSkip}
            className="absolute bottom-4 right-4 text-text-secondary hover:text-blood-bright transition-colors text-sm font-body"
          >
            Skip Intro →
          </button>
        </div>
      )}
    </motion.div>
  );
}
