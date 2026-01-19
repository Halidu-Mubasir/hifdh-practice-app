import { create } from 'zustand';
import { audioService, AudioState, AudioStatus } from '../services/audioService';
import { useSettingsStore } from './useSettingsStore';

export interface AudioStoreState extends AudioState {
  // Current playback info
  currentAyahNumber: number | null;
  currentReciter: string | null;

  // Actions
  loadAndPlay: (globalAyahNumber: number, autoPlay?: boolean) => Promise<void>;
  play: () => Promise<void>;
  pause: () => Promise<void>;
  stop: () => Promise<void>;
  togglePlayPause: () => Promise<void>;
  setPlaybackRate: (rate: number) => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  preloadAudio: (globalAyahNumber: number) => Promise<void>;
}

export const useAudioStore = create<AudioStoreState>((set, get) => {
  // Set up audio service callback
  audioService.setStateCallback((audioState) => {
    set({
      status: audioState.status,
      isLoaded: audioState.isLoaded,
      isPlaying: audioState.isPlaying,
      positionMillis: audioState.positionMillis,
      durationMillis: audioState.durationMillis,
      error: audioState.error,
    });
  });

  return {
    // Initial state
    status: 'idle',
    isLoaded: false,
    isPlaying: false,
    positionMillis: 0,
    durationMillis: 0,
    error: null,
    currentAyahNumber: null,
    currentReciter: null,

    // Load and play audio
    loadAndPlay: async (globalAyahNumber, autoPlay = true) => {
      try {
        // Get reciter and autoplay preference from settings
        const { preferredReciter, autoPlayAudio } = useSettingsStore.getState();
        const shouldAutoPlay = autoPlay !== undefined ? autoPlay : autoPlayAudio;

        set({
          currentAyahNumber: globalAyahNumber,
          currentReciter: preferredReciter,
          error: null,
        });

        await audioService.loadAndPlay(
          globalAyahNumber,
          preferredReciter,
          shouldAutoPlay
        );
      } catch (error) {
        console.error('Load and play error:', error);
        set({
          error: error instanceof Error ? error.message : 'Failed to load audio',
        });
      }
    },

    // Play
    play: async () => {
      try {
        await audioService.play();
      } catch (error) {
        console.error('Play error:', error);
        set({
          error: 'Failed to play audio',
        });
      }
    },

    // Pause
    pause: async () => {
      try {
        await audioService.pause();
      } catch (error) {
        console.error('Pause error:', error);
      }
    },

    // Stop
    stop: async () => {
      try {
        await audioService.stop();
        set({
          currentAyahNumber: null,
          currentReciter: null,
        });
      } catch (error) {
        console.error('Stop error:', error);
      }
    },

    // Toggle play/pause
    togglePlayPause: async () => {
      try {
        await audioService.togglePlayPause();
      } catch (error) {
        console.error('Toggle play/pause error:', error);
      }
    },

    // Set playback rate
    setPlaybackRate: async (rate) => {
      try {
        await audioService.setPlaybackRate(rate);

        // Also update settings store
        const { setPlaybackSpeed } = useSettingsStore.getState();
        await setPlaybackSpeed(rate);
      } catch (error) {
        console.error('Set playback rate error:', error);
      }
    },

    // Seek to position
    seekTo: async (positionMillis) => {
      try {
        await audioService.seekTo(positionMillis);
      } catch (error) {
        console.error('Seek error:', error);
      }
    },

    // Preload audio
    preloadAudio: async (globalAyahNumber) => {
      try {
        const { preferredReciter } = useSettingsStore.getState();
        await audioService.preloadAudio(globalAyahNumber, preferredReciter);
      } catch (error) {
        console.error('Preload audio error:', error);
      }
    },
  };
});
