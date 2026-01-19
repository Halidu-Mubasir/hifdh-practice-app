import { create } from 'zustand';
import { Storage, Settings, DEFAULT_SETTINGS, Theme } from '../utils/storage';
import { syncService } from '../services/syncService';
import { Appearance } from 'react-native';

export interface SettingsState extends Settings {
  // Theme
  theme: Theme;
  systemColorScheme: 'light' | 'dark' | null;
  effectiveTheme: 'light' | 'dark';

  // Loading state
  isLoading: boolean;

  // Actions
  initialize: () => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setShowEndVerseSnippet: (show: boolean) => Promise<void>;
  setPreferredReciter: (reciter: string) => Promise<void>;
  setAudioQuality: (quality: '64' | '128' | '192') => Promise<void>;
  setAutoPlayAudio: (autoPlay: boolean) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
  setArabicTextSize: (size: number) => Promise<void>;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  syncSettings: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state (defaults)
  ...DEFAULT_SETTINGS,
  theme: 'auto',
  systemColorScheme: null,
  effectiveTheme: 'light',
  isLoading: true,

  // Initialize settings from storage
  initialize: async () => {
    try {
      set({ isLoading: true });

      // Load theme
      const savedTheme = await Storage.getTheme();
      const theme = savedTheme || 'auto';

      // Load settings
      const savedSettings = await Storage.getSettings();
      const settings = savedSettings || DEFAULT_SETTINGS;

      // Determine effective theme
      const systemColorScheme = Appearance.getColorScheme();
      const effectiveTheme = theme === 'auto'
        ? (systemColorScheme || 'light')
        : theme;

      set({
        ...settings,
        theme,
        systemColorScheme,
        effectiveTheme,
        isLoading: false,
      });
    } catch (error) {
      console.error('Settings initialization error:', error);
      set({
        ...DEFAULT_SETTINGS,
        isLoading: false,
      });
    }
  },

  // Set theme
  setTheme: async (theme) => {
    try {
      await Storage.setTheme(theme);

      const systemColorScheme = Appearance.getColorScheme();
      const effectiveTheme = theme === 'auto'
        ? (systemColorScheme || 'light')
        : theme;

      set({
        theme,
        effectiveTheme,
      });
    } catch (error) {
      console.error('Set theme error:', error);
    }
  },

  // Set show end verse snippet
  setShowEndVerseSnippet: async (show) => {
    await get().updateSettings({ showEndVerseSnippet: show });
  },

  // Set preferred reciter
  setPreferredReciter: async (reciter) => {
    await get().updateSettings({ preferredReciter: reciter });
  },

  // Set audio quality
  setAudioQuality: async (quality) => {
    await get().updateSettings({ audioQuality: quality });
  },

  // Set auto play audio
  setAutoPlayAudio: async (autoPlay) => {
    await get().updateSettings({ autoPlayAudio: autoPlay });
  },

  // Set playback speed
  setPlaybackSpeed: async (speed) => {
    if (speed < 0.5 || speed > 2.0) {
      console.warn('Playback speed must be between 0.5 and 2.0');
      return;
    }
    await get().updateSettings({ playbackSpeed: speed });
  },

  // Set Arabic text size
  setArabicTextSize: async (size) => {
    if (size < 12 || size > 48) {
      console.warn('Arabic text size must be between 12 and 48');
      return;
    }
    await get().updateSettings({ arabicTextSize: size });
  },

  // Update multiple settings at once
  updateSettings: async (updates) => {
    try {
      const currentSettings = {
        showEndVerseSnippet: get().showEndVerseSnippet,
        preferredReciter: get().preferredReciter,
        audioQuality: get().audioQuality,
        autoPlayAudio: get().autoPlayAudio,
        playbackSpeed: get().playbackSpeed,
        arabicTextSize: get().arabicTextSize,
      };

      const newSettings = { ...currentSettings, ...updates };

      await Storage.setSettings(newSettings);

      set(newSettings);

      // Sync to Supabase if authenticated
      await get().syncSettings();
    } catch (error) {
      console.error('Update settings error:', error);
    }
  },

  // Reset to defaults
  resetToDefaults: async () => {
    try {
      await Storage.setSettings(DEFAULT_SETTINGS);
      await Storage.setTheme('auto');

      const systemColorScheme = Appearance.getColorScheme();
      const effectiveTheme = systemColorScheme || 'light';

      set({
        ...DEFAULT_SETTINGS,
        theme: 'auto',
        effectiveTheme,
      });

      // Sync to Supabase if authenticated
      await get().syncSettings();
    } catch (error) {
      console.error('Reset settings error:', error);
    }
  },

  // Sync settings to Supabase
  syncSettings: async () => {
    try {
      if (await syncService.isAuthenticated()) {
        // Sync will happen automatically through the sync service
        await syncService.performFullSync();
      }
    } catch (error) {
      console.error('Sync settings error:', error);
    }
  },
}));
