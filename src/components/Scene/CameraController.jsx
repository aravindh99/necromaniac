// ============================================
// IMPORTS
// ============================================

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// ============================================
// CONSTANTS
// ============================================

const DEFAULT_POSITION = [0, 2, 5];
const DEFAULT_TARGET = [0, 0, 0];

const CONTROLS_CONFIG = {
  enableDamping: true,
  dampingFactor: 0.05,
  minDistance: 2,
  maxDistance: 20,
  maxPolarAngle: Math.PI / 1.5, // Prevent camera from going below ground
  minPolarAngle: 0,
  enablePan: true,
  panSpeed: 0.5,
  rotateSpeed: 0.5,
  zoomSpeed: 0.8
};

// ============================================
// TYPES (JSDoc)
// ============================================

/**
 * @typedef {Object} CameraControllerProps
 * @property {Function} [onCameraMove] - Callback when camera moves
 * @property {boolean} [enableKeyboard] - Enable keyboard controls
 */

// ============================================
// COMPONENT
// ============================================

/**
 * Camera controller with OrbitControls
 * Handles mouse/touch controls and keyboard shortcuts
 * 
 * @param {CameraControllerProps} props
 * @returns {JSX.Element}
 */
export default function CameraController({ 
  onCameraMove,
  enableKeyboard = true 
}) {
  // ----------------------------------------
  // STATE & REFS
  // ----------------------------------------
  const controlsRef = useRef();
  const { camera } = useThree();
  const initialPositionRef = useRef([...DEFAULT_POSITION]);
  const initialTargetRef = useRef([...DEFAULT_TARGET]);

  // ----------------------------------------
  // EFFECTS
  // ----------------------------------------
  
  // Store initial camera position
  useEffect(() => {
    initialPositionRef.current = [
      camera.position.x,
      camera.position.y,
      camera.position.z
    ];
  }, [camera]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!enableKeyboard) return;

    const handleKeyPress = (event) => {
      // R key - Reset camera
      if (event.key === 'r' || event.key === 'R') {
        resetCamera();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [enableKeyboard]);

  // Notify parent when camera moves
  useEffect(() => {
    if (!controlsRef.current || !onCameraMove) return;

    const controls = controlsRef.current;

    const handleChange = () => {
      onCameraMove({
        position: camera.position.clone(),
        target: controls.target.clone()
      });
    };

    controls.addEventListener('change', handleChange);

    return () => {
      controls.removeEventListener('change', handleChange);
    };
  }, [camera, onCameraMove]);

  // ----------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------
  
  const resetCamera = () => {
    if (!controlsRef.current) return;

    // Animate camera back to initial position
    camera.position.set(...initialPositionRef.current);
    controlsRef.current.target.set(...initialTargetRef.current);
    controlsRef.current.update();

    console.log('Camera reset to default position');
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  
  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera]}
      enableDamping={CONTROLS_CONFIG.enableDamping}
      dampingFactor={CONTROLS_CONFIG.dampingFactor}
      minDistance={CONTROLS_CONFIG.minDistance}
      maxDistance={CONTROLS_CONFIG.maxDistance}
      maxPolarAngle={CONTROLS_CONFIG.maxPolarAngle}
      minPolarAngle={CONTROLS_CONFIG.minPolarAngle}
      enablePan={CONTROLS_CONFIG.enablePan}
      panSpeed={CONTROLS_CONFIG.panSpeed}
      rotateSpeed={CONTROLS_CONFIG.rotateSpeed}
      zoomSpeed={CONTROLS_CONFIG.zoomSpeed}
      mouseButtons={{
        LEFT: 0,   // Rotate
        MIDDLE: 1, // Zoom
        RIGHT: 2   // Pan
      }}
      touches={{
        ONE: 0,    // Rotate (one finger)
        TWO: 2     // Pan/Zoom (two fingers)
      }}
    />
  );
}
