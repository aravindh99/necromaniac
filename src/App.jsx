// ============================================
// IMPORTS
// ============================================

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SceneManager from './components/Scene/SceneManager';
import CameraController from './components/Scene/CameraController';
import ZombieModel from './components/Scene/ZombieModel';
import HorrorOverlay from './components/Effects/HorrorOverlay';
import AnimatedBackground from './components/Effects/AnimatedBackground';
import JumpScare from './components/Effects/JumpScare';
import ModelInfo from './components/UI/ModelInfo';
import LoadingIndicator from './components/UI/LoadingIndicator';
import AnimationControls from './components/UI/AnimationControls';
import IntroScreen from './components/UI/IntroScreen';
import StoryOverlay from './components/UI/StoryOverlay';
import { MODEL_MANIFEST } from './constants/modelManifest';

// ============================================
// COMPONENT
// ============================================

/**
 * Main application component for Necromaniac
 * 
 * @returns {JSX.Element}
 */
export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [currentModelIndex, setCurrentModelIndex] = useState(0);
  const [modelInfo, setModelInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [availableAnimations, setAvailableAnimations] = useState([]);
  const [currentAnimation, setCurrentAnimation] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const [enableJumpScares, setEnableJumpScares] = useState(false);

  // ----------------------------------------
  // EVENT HANDLERS
  // ----------------------------------------
  
  const handleSceneReady = (scene, camera, renderer) => {
    console.log('Scene is ready!', { scene, camera, renderer });
    setSceneReady(true);
  };

  const handleCameraMove = ({ position, target }) => {
    // Camera movement callback (for spatial audio later)
  };

  const handleModelLoad = (model, animations, animationController) => {
    console.log('Model loaded successfully!');
    console.log('Animations found:', animations.map(a => a.name));
    setAvailableAnimations(animations.map(a => a.name));
    setCurrentAnimation(animationController.currentAnimation);
    setModelInfo({
      animations: animations.map(a => a.name),
      hasAnimations: animations.length > 0
    });
    setIsLoading(false);
    setLoadProgress(100);
  };

  const handleModelProgress = (loaded, total, percent) => {
    setLoadProgress(percent);
  };

  const handleNextModel = () => {
    setCurrentModelIndex((prev) => (prev + 1) % MODEL_MANIFEST.length);
    setModelInfo(null);
    setAvailableAnimations([]);
    setCurrentAnimation(null);
    setIsLoading(true);
    setLoadProgress(0);
  };

  const handlePrevModel = () => {
    setCurrentModelIndex((prev) => 
      prev === 0 ? MODEL_MANIFEST.length - 1 : prev - 1
    );
    setModelInfo(null);
    setAvailableAnimations([]);
    setCurrentAnimation(null);
    setIsLoading(true);
    setLoadProgress(0);
  };

  const currentModel = MODEL_MANIFEST[currentModelIndex];

  const handleIntroComplete = () => {
    setShowIntro(false);
    setEnableJumpScares(true);
  };

  // ----------------------------------------
  // RENDER
  // ----------------------------------------
  
  return (
    <div className="w-full h-full bg-bg-primary text-text-primary relative">
      {/* Intro Screen */}
      <AnimatePresence>
        {showIntro && <IntroScreen onComplete={handleIntroComplete} />}
      </AnimatePresence>

      {/* Animated Background */}
      {!showIntro && <AnimatedBackground />}

      {/* Jump Scares */}
      {enableJumpScares && <JumpScare />}

      {/* Story Overlay */}
      {!showIntro && !isLoading && (
        <StoryOverlay modelId={currentModel.id} />
      )}

      {/* Model Info Overlay */}
      <ModelInfo
        model={currentModel}
        modelInfo={modelInfo}
        currentIndex={currentModelIndex}
        total={MODEL_MANIFEST.length}
      />

      {/* Animation Controls */}
      {!isLoading && availableAnimations.length > 0 && (
        <AnimationControls
          animations={availableAnimations}
          currentAnimation={currentAnimation}
          onAnimationChange={(animName) => {
            // Animation change will be handled by ZombieModel
            setCurrentAnimation(animName);
          }}
        />
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <LoadingIndicator
          progress={loadProgress}
          message={`Loading ${currentModel.name}...`}
        />
      )}

      {/* Instructions */}
      {!showIntro && (
        <div className="absolute bottom-8 left-8 z-20 text-sm text-text-secondary font-body pointer-events-none">
          <div className="horror-card p-4 space-y-1">
            <p className="text-blood-bright font-bold mb-2">🎮 CONTROLS</p>
            <p>🖱️ Left Drag: Rotate</p>
            <p>🖱️ Right Drag: Pan</p>
            <p>🖱️ Scroll: Zoom</p>
            <p>⌨️ R: Reset Camera</p>
            <p>🖱️ Click: Blood Splatter</p>
            {availableAnimations.length > 0 && (
              <p className="text-toxic-green mt-2">
                ▶️ Use animation panel →
              </p>
            )}
          </div>
        </div>
      )}

      {/* Model Switcher */}
      <div className="absolute bottom-8 right-8 z-20 flex gap-4">
        <button
          onClick={handlePrevModel}
          className="horror-button text-sm px-4 py-2"
        >
          ← Previous
        </button>
        <button
          onClick={handleNextModel}
          className="horror-button text-sm px-4 py-2"
        >
          Next →
        </button>
      </div>

      {/* 3D Scene */}
      <SceneManager 
        onSceneReady={handleSceneReady}
        performanceMode="high"
      >
        <CameraController 
          onCameraMove={handleCameraMove}
          enableKeyboard={true}
        />
        
        {/* Ambient light - increased for visibility */}
        <ambientLight intensity={0.8} color="#ffffff" />
        
        {/* Spotlight */}
        <spotLight
          position={[-5, 5, 5]}
          intensity={5}
          angle={Math.PI / 4}
          penumbra={0.5}
          color="#ffffff"
          castShadow
        />
        
        {/* Additional front light for visibility */}
        <directionalLight
          position={[0, 5, 5]}
          intensity={3}
          color="#ffffff"
        />
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
        
        {/* Zombie Model - Real models! */}
        <ZombieModel
          key={currentModel.id}
          modelUrl={currentModel.url}
          position={
            currentModel.id === 'scene' ? [0, -2, 0] :  // Model 1: Lower position
            [0, 0, 0]  // Other models: Normal position
          }
          scale={
            currentModel.id === 'scene' ? 0.2 :  // Model 1: Much smaller
            currentModel.id === 'scary' ? 0.5 :   // Model 4: Smaller
            1  // Models 2 & 3: Normal size
          }
          onLoad={handleModelLoad}
          onProgress={handleModelProgress}
          onError={(error) => {
            console.error('Model load error:', error);
            setIsLoading(false);
          }}
        />
        
        {/* Fog - reduced for better visibility */}
        <fog attach="fog" args={['#0a0a0a', 10, 30]} />
      </SceneManager>

      {/* Horror Effects Overlay */}
      <HorrorOverlay />
    </div>
  );
}
