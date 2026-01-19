import { Audio, AVPlaybackStatus } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';
import { cacheService } from './cacheService';

export type AudioStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export interface AudioState {
  status: AudioStatus;
  isLoaded: boolean;
  isPlaying: boolean;
  positionMillis: number;
  durationMillis: number;
  error: string | null;
}

export type AudioStateCallback = (state: AudioState) => void;

class AudioService {
  private sound: Sound | null = null;
  private currentGlobalAyahNumber: number | null = null;
  private currentReciter: string = 'ar.minshawi';
  private playbackRate: number = 1.0;
  private stateCallback: AudioStateCallback | null = null;
  private audioState: AudioState = {
    status: 'idle',
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    error: null,
  };

  private initialized: boolean = false;

  constructor() {
    // Audio will be configured on first initialize() call
  }

  // Initialize audio service
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      this.initialized = true;
      console.log('Audio service initialized successfully');
    } catch (error) {
      console.error('Audio initialization error:', error);
      throw error;
    }
  }

  // Set callback for state updates
  setStateCallback(callback: AudioStateCallback): void {
    this.stateCallback = callback;
  }

  // Update and notify state
  private updateState(updates: Partial<AudioState>): void {
    this.audioState = { ...this.audioState, ...updates };
    if (this.stateCallback) {
      this.stateCallback(this.audioState);
    }
  }

  // Handle playback status updates
  private onPlaybackStatusUpdate = (status: AVPlaybackStatus): void => {
    if (status.isLoaded) {
      this.updateState({
        isLoaded: true,
        isPlaying: status.isPlaying,
        positionMillis: status.positionMillis,
        durationMillis: status.durationMillis || 0,
        status: status.isPlaying ? 'playing' : 'paused',
      });

      if (status.didJustFinish) {
        this.handlePlaybackFinished();
      }
    } else {
      // Handle errors
      if (status.error) {
        console.error('Playback error:', status.error);
        this.updateState({
          status: 'error',
          error: this.getErrorMessage(status.error),
        });
      }
    }
  };

  // Get user-friendly error message
  private getErrorMessage(error: string): string {
    if (error.includes('network')) {
      return 'Network error. Please check your internet connection.';
    } else if (error.includes('not found') || error.includes('404')) {
      return 'Audio file not found.';
    } else if (error.includes('format')) {
      return 'Unsupported audio format.';
    }
    return 'An error occurred while playing audio.';
  }

  // Handle playback finished
  private handlePlaybackFinished(): void {
    this.updateState({
      status: 'idle',
      isPlaying: false,
      positionMillis: 0,
    });
  }

  // Load and play audio
  async loadAndPlay(
    globalAyahNumber: number,
    reciter: string = 'ar.minshawi',
    autoPlay: boolean = true
  ): Promise<void> {
    try {
      // Cleanup previous sound
      await this.cleanup();

      this.currentGlobalAyahNumber = globalAyahNumber;
      this.currentReciter = reciter;

      this.updateState({
        status: 'loading',
        error: null,
      });

      // Check if audio is cached
      const cachedPath = await cacheService.getCachedAudioPath(globalAyahNumber, reciter);

      let audioSource: { uri: string };

      if (cachedPath) {
        // Use cached file
        audioSource = { uri: cachedPath };
      } else {
        // Stream from network
        // Format: https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3
        const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;
        console.log('Audio URL:', audioUrl);
        audioSource = { uri: audioUrl };
      }

      // Create and load sound
      const { sound } = await Audio.Sound.createAsync(
        audioSource,
        {
          shouldPlay: autoPlay,
          rate: this.playbackRate,
        },
        this.onPlaybackStatusUpdate
      );

      this.sound = sound;

      this.updateState({
        status: autoPlay ? 'playing' : 'paused',
        isLoaded: true,
      });
    } catch (error) {
      console.error('Load and play error:', error);
      this.updateState({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to load audio',
      });
      throw error;
    }
  }

  // Play/Resume
  async play(): Promise<void> {
    if (!this.sound) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.sound.playAsync();
      this.updateState({ status: 'playing', isPlaying: true });
    } catch (error) {
      console.error('Play error:', error);
      this.updateState({
        status: 'error',
        error: 'Failed to play audio',
      });
    }
  }

  // Pause
  async pause(): Promise<void> {
    if (!this.sound) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.sound.pauseAsync();
      this.updateState({ status: 'paused', isPlaying: false });
    } catch (error) {
      console.error('Pause error:', error);
    }
  }

  // Stop and unload
  async stop(): Promise<void> {
    await this.cleanup();
    this.updateState({
      status: 'idle',
      isLoaded: false,
      isPlaying: false,
      positionMillis: 0,
      durationMillis: 0,
    });
  }

  // Toggle play/pause
  async togglePlayPause(): Promise<void> {
    if (this.audioState.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  // Set playback rate (speed)
  async setPlaybackRate(rate: number): Promise<void> {
    if (rate < 0.5 || rate > 2.0) {
      console.warn('Playback rate must be between 0.5 and 2.0');
      return;
    }

    this.playbackRate = rate;

    if (this.sound) {
      try {
        await this.sound.setRateAsync(rate, true);
      } catch (error) {
        console.error('Set playback rate error:', error);
      }
    }
  }

  // Seek to position
  async seekTo(positionMillis: number): Promise<void> {
    if (!this.sound) {
      console.warn('No sound loaded');
      return;
    }

    try {
      await this.sound.setPositionAsync(positionMillis);
    } catch (error) {
      console.error('Seek error:', error);
    }
  }

  // Get current status
  async getStatus(): Promise<AVPlaybackStatus | null> {
    if (!this.sound) return null;

    try {
      return await this.sound.getStatusAsync();
    } catch (error) {
      console.error('Get status error:', error);
      return null;
    }
  }

  // Cleanup
  async cleanup(): Promise<void> {
    if (this.sound) {
      try {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
      } catch (error) {
        console.error('Cleanup error:', error);
      }
    }

    this.currentGlobalAyahNumber = null;
  }

  // Get current state
  getState(): AudioState {
    return { ...this.audioState };
  }

  // Get current ayah number
  getCurrentAyahNumber(): number | null {
    return this.currentGlobalAyahNumber;
  }

  // Get current reciter
  getCurrentReciter(): string {
    return this.currentReciter;
  }

  // Preload audio (for faster playback)
  async preloadAudio(globalAyahNumber: number, reciter: string = 'ar.minshawi'): Promise<void> {
    try {
      // Check if already cached
      const isCached = await cacheService.isAudioCached(globalAyahNumber, reciter);

      if (!isCached) {
        // Download and cache
        await cacheService.downloadAudioForAyah(globalAyahNumber, reciter);
      }
    } catch (error) {
      console.error('Preload audio error:', error);
    }
  }

  // Dispose service
  async dispose(): Promise<void> {
    await this.cleanup();
    this.stateCallback = null;
  }
}

// Export singleton instance
export const audioService = new AudioService();
