/**
 * Audio Notifications System
 * Handles sound notifications for reminders, updates, and alerts
 */

export class AudioNotifications {
  constructor() {
    this.audioContext = null;
    this.enabled = localStorage.getItem('audioNotificationsEnabled') !== 'false';
    this.volume = parseFloat(localStorage.getItem('audioVolume') || '0.5');
    this.selectedSound = localStorage.getItem('selectedNotificationSound') || 'chime';
    this.soundLibrary = this.initializeSoundLibrary();
    this.currentAudio = null;
  }

  /**
   * Initialize sound library with various notification sounds
   */
  initializeSoundLibrary() {
    return {
      chime: {
        name: '🎵 Chime',
        frequencies: [440, 554, 659],
        duration: 0.3,
        gap: 0.1
      },
      bell: {
        name: '🔔 Bell',
        frequencies: [523],
        duration: 0.4,
        gap: 0.2
      },
      alert: {
        name: '⚠️ Alert',
        frequencies: [800, 600, 800],
        duration: 0.2,
        gap: 0.1
      },
      notification: {
        name: '📢 Notification',
        frequencies: [600, 700],
        duration: 0.3,
        gap: 0.15
      },
      success: {
        name: '✅ Success',
        frequencies: [523, 659, 784],
        duration: 0.25,
        gap: 0.1
      },
      reminder: {
        name: '⏰ Reminder',
        frequencies: [400, 500, 600],
        duration: 0.3,
        gap: 0.2
      },
      update: {
        name: '📡 Update',
        frequencies: [440, 550],
        duration: 0.4,
        gap: 0.15
      },
      double_chime: {
        name: '🎶 Double Chime',
        frequencies: [659, 784],
        duration: 0.2,
        gap: 0.25
      }
    };
  }

  /**
   * Play notification sound
   */
  async playSound(soundType = 'chime', priority = 'medium') {
    if (!this.enabled) return;

    try {
      // Initialize audio context if needed
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }

      // Resume audio context if suspended (required by browsers)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const sound = this.soundLibrary[soundType] || this.soundLibrary.chime;
      
      // Stop current audio if playing
      if (this.currentAudio) {
        this.currentAudio.stop();
      }

      // Create oscillators for each frequency
      const oscillators = [];
      const gains = [];
      const startTime = this.audioContext.currentTime;

      for (let i = 0; i < sound.frequencies.length; i++) {
        const frequency = sound.frequencies[i];
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = frequency;
        
        // Set volume based on priority
        const volumeMultiplier = priority === 'high' ? 1.2 : priority === 'low' ? 0.6 : 1;
        gain.gain.value = 0;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.volume * volumeMultiplier, startTime + 0.05);
        gain.gain.linearRampToValueAtTime(this.volume * volumeMultiplier, startTime + sound.duration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + sound.duration);

        // Connect nodes
        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        // Schedule frequency changes
        osc.start(startTime + i * (sound.duration + sound.gap));
        osc.stop(startTime + i * (sound.duration + sound.gap) + sound.duration);

        oscillators.push(osc);
        gains.push(gain);
      }

      this.currentAudio = { oscillators, gains };
    } catch (error) {
      console.error('Audio notification error:', error);
    }
  }

  /**
   * Play reminder sound (longer, more attention-grabbing)
   */
  async playReminderSound() {
    return this.playSound('reminder', 'high');
  }

  /**
   * Play update notification sound
   */
  async playUpdateSound() {
    return this.playSound('update', 'medium');
  }

  /**
   * Play success sound
   */
  async playSuccessSound() {
    return this.playSound('success', 'medium');
  }

  /**
   * Play alert sound
   */
  async playAlertSound() {
    return this.playSound('alert', 'high');
  }

  /**
   * Play custom sound
   */
  async playCustomSound(soundType = 'chime') {
    if (!this.soundLibrary[soundType]) {
      console.warn(`Sound type '${soundType}' not found, using chime`);
      soundType = 'chime';
    }
    return this.playSound(soundType, 'medium');
  }

  /**
   * Enable audio notifications
   */
  enableAudio() {
    this.enabled = true;
    localStorage.setItem('audioNotificationsEnabled', 'true');
  }

  /**
   * Disable audio notifications
   */
  disableAudio() {
    this.enabled = false;
    localStorage.setItem('audioNotificationsEnabled', 'false');
  }

  /**
   * Set volume (0 to 1)
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('audioVolume', this.volume.toString());
  }

  /**
   * Get current volume
   */
  getVolume() {
    return this.volume;
  }

  /**
   * Set notification sound
   */
  setNotificationSound(soundType) {
    if (this.soundLibrary[soundType]) {
      this.selectedSound = soundType;
      localStorage.setItem('selectedNotificationSound', soundType);
    }
  }

  /**
   * Get all available sounds
   */
  getAvailableSounds() {
    return Object.entries(this.soundLibrary).map(([key, sound]) => ({
      id: key,
      name: sound.name
    }));
  }

  /**
   * Test current sound
   */
  async testSound() {
    return this.playCustomSound(this.selectedSound);
  }

  /**
   * Get audio status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      volume: this.volume,
      selectedSound: this.selectedSound,
      soundName: this.soundLibrary[this.selectedSound]?.name || 'Unknown'
    };
  }

  /**
   * Stop any currently playing audio
   */
  stopAudio() {
    if (this.currentAudio) {
      this.currentAudio.oscillators.forEach(osc => {
        try {
          osc.stop();
        } catch (e) {
          // Already stopped
        }
      });
      this.currentAudio = null;
    }
  }
}

export default AudioNotifications;
