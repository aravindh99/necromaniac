import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API
global.AudioContext = class AudioContext {
  createGain() {
    return {
      connect: () => {},
      gain: { value: 1 }
    };
  }
  createPanner() {
    return {
      connect: () => {},
      positionX: { value: 0 },
      positionY: { value: 0 },
      positionZ: { value: 0 }
    };
  }
  get destination() {
    return {};
  }
  get listener() {
    return {
      positionX: { value: 0 },
      positionY: { value: 0 },
      positionZ: { value: 0 },
      forwardX: { value: 0 },
      forwardY: { value: 0 },
      forwardZ: { value: -1 }
    };
  }
};

// Mock WebGL
HTMLCanvasElement.prototype.getContext = function(contextType) {
  if (contextType === 'webgl' || contextType === 'webgl2') {
    return {
      getExtension: () => null,
      getParameter: () => null,
      createShader: () => ({}),
      shaderSource: () => {},
      compileShader: () => {},
      createProgram: () => ({}),
      attachShader: () => {},
      linkProgram: () => {},
      useProgram: () => {},
      getShaderParameter: () => true,
      getProgramParameter: () => true
    };
  }
  return null;
};
