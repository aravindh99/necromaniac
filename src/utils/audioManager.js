// ============================================
// AUDIO MANAGER
// ============================================

/**
 * Audio manager for horror sound effects
 * Handles loading, playing, and managing audio files
 */

class AudioManager {
  constructor() {
    this.sounds = new Map();
    this.enabled = false;
    this.volume = {
      ambient: 0.3,
      effects: 0.6,
      jumpscares: 0.8,
    };
  }

  /**
   * Enable audio (must be called after user interaction)
   */
  enable() {
    this.enabled = true;
    console.log('Audio enabled');
  }

  /**
   * Disable audio
   */
  disable() {
    this.enabled = false;
    this.stopAll();
    console.log('Audio disabled');
  }

  /**
   * Load an audio file
   * 
   * @param {string} id - Unique identifier for the sound
   * @param {string} url - Path to audio file
   * @param {string} type - Type of sound (ambient, effects, jumpscares)
   * @returns {Promise<void>}
   */
  async load(id, url, type = 'effects') {
    try {
      const audio = new Audio(url);
      audio.volume = this.volume[type] || 0.5;
      audio.preload = 'auto';
      
      // Wait for audio to be ready
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
      });

      this.sounds.set(id, { audio, type });
      console.log(`Audio loaded: ${id}`);
    } catch (error) {
      console.error(`Failed to load audio: ${id}`, error);
    }
  }

  /**
   * Play a sound
   * 
   * @param {string} id - Sound identifier
   * @param {boolean} loop - Whether to loop the sound
   * @returns {boolean} Success status
   */
  play(id, loop = false) {
    if (!this.enabled) {
      console.warn('Audio not enabled. Call enable() first after user interaction.');
      return false;
    }

    const sound = this.sounds.get(id);
    if (!sound) {
      console.warn(`Sound not found: ${id}`);
      return false;
    }

    try {
      sound.audio.loop = loop;
      sound.audio.currentTime = 0;
      sound.audio.play();
      console.log(`Playing: ${id}`);
      return true;
    } catch (error) {
      console.error(`Failed to play sound: ${id}`, error);
      return false;
    }
  }

  /**
   * Stop a sound
   * 
   * @param {string} id - Sound identifier
   */
  stop(id) {
    const sound = this.sounds.get(id);
    if (sound) {
      sound.audio.pause();
      sound.audio.currentTime = 0;
    }
  }

  /**
   * Stop all sounds
   */
  stopAll() {
    this.sounds.forEach((sound) => {
      sound.audio.pause();
      sound.audio.currentTime = 0;
    });
  }

  /**
   * Set volume for a type of sound
   * 
   * @param {string} type - Sound type (ambient, effects, jumpscares)
   * @param {number} volume - Volume level (0-1)
   */
  setVolume(type, volume) {
    this.volume[type] = Math.max(0, Math.min(1, volume));
    
    // Update all sounds of this type
    this.sounds.forEach((sound) => {
      if (sound.type === type) {
        sound.audio.volume = this.volume[type];
      }
    });
  }

  /**
   * Check if a sound is playing
   * 
   * @param {string} id - Sound identifier
   * @returns {boolean}
   */
  isPlaying(id) {
    const sound = this.sounds.get(id);
    return sound ? !sound.audio.paused : false;
  }
}

// Export singleton instance
export const audioManager = new AudioManager();

// Export class for testing
export default AudioManager;
