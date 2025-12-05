// ============================================
// IMPORTS
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { audioManager } from '../../utils/audioManager';

// ============================================
// CONSTANTS
// ============================================

const STORY_LINES = [
  "In the depths of an abandoned laboratory...",
  "They created... something unholy...",
  "Now, the specimens have awakened...",
  "And they're waiting for YOU.",
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
  const [storyStarted, setStoryStarted] = useState(false);

  // Load audio files on mount
  useEffect(() => {
    const loadAudio = async () => {
      await audioManager.load('scary-sound', '/audio/scary_sound.mp3', 'ambient');
      await audioManager.load('scary-laugh', '/audio/scary_laugh.mp3', 'jumpscares');
    };
    loadAudio();
  }, []);

  // Effect for story progression - FIXED
  useEffect(() => {
    if (!storyStarted) return;
    
    console.log(`Story line ${currentLine} of ${STORY_LINES.length}`);
    
    // Wait 2 seconds then move to next line or complete
    const timer = setTimeout(() => {
      if (currentLine < STORY_LINES.length - 1) {
        console.log(`Moving to line ${currentLine + 1}`);
        setCurrentLine(prev => prev + 1);
      } else {
        console.log('Story complete!');
        audioManager.stop('scary-sound');
        onComplete();
      }
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentLine, storyStarted]); // Removed onComplete from dependencies

  const handleEnter = () => {
    console.log('User clicked ENTER - starting story');
    audioManager.enable();
    audioManager.play('scary-sound', true);
    setShowWarning(false);
    setStoryStarted(true);
  };

  const handleSkip = () => {
    console.log('User clicked SKIP');
    audioManager.stop('scary-sound');
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
              <li>🩸 Horror 3D Models</li>
              <li>👻 Jump Scares</li>
              <li>🔊 Scary Sounds</li>
              <li>🎃 Spooky Atmosphere</li>
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
        <div className="relative w-full h-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentLine >= 0 && currentLine < STORY_LINES.length && (
              <motion.div
                key={currentLine}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center p-8"
              >
                <p className="text-3xl font-heading text-blood-bright drop-shadow-[0_0_10px_rgba(139,0,0,0.8)]">
                  {STORY_LINES[currentLine]}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Skip button - scary styled */}
          <motion.button
            onClick={handleSkip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-16 right-8 px-6 py-3 bg-bg-secondary border-2 border-blood-dark text-blood-bright font-heading text-lg hover:bg-blood-dark hover:text-text-primary hover:scale-110 transition-all duration-300 shadow-[0_0_20px_rgba(139,0,0,0.5)] hover:shadow-[0_0_30px_rgba(139,0,0,0.8)]"
            style={{
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)'
            }}
          >
            SKIP →
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}