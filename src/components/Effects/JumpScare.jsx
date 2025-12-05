// ============================================
// IMPORTS
// ============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// CONSTANTS
// ============================================

const JUMP_SCARE_IMAGES = [
  '💀', '👻', '🧟', '👹', '😱'
];

const MIN_INTERVAL = 30000; // 30 seconds
const MAX_INTERVAL = 60000; // 60 seconds

// ============================================
// COMPONENT
// ============================================

/**
 * Random jump scare system
 * 
 * @returns {JSX.Element}
 */
export default function JumpScare() {
  const [isActive, setIsActive] = useState(false);
  const [scareImage, setScareImage] = useState('');

  useEffect(() => {
    const scheduleJumpScare = () => {
      const interval = MIN_INTERVAL + Math.random() * (MAX_INTERVAL - MIN_INTERVAL);
      
      return setTimeout(() => {
        // Pick random scary emoji
        const randomImage = JUMP_SCARE_IMAGES[
          Math.floor(Math.random() * JUMP_SCARE_IMAGES.length)
        ];
        setScareImage(randomImage);
        setIsActive(true);

        // Hide after 0.5 seconds
        setTimeout(() => {
          setIsActive(false);
          // Schedule next jump scare
          scheduleJumpScare();
        }, 500);
      }, interval);
    };

    const timeoutId = scheduleJumpScare();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 1.2], 
            opacity: [0, 1, 1],
            rotate: [0, -10, 10, -5, 0]
          }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(139,0,0,0.8) 0%, rgba(0,0,0,0.9) 100%)'
          }}
        >
          <div className="text-[20rem] animate-pulse">
            {scareImage}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
