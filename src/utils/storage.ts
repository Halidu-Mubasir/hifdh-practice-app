import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const StorageKeys = {
  THEME: 'hifdh_theme',
  SETTINGS: 'hifdh_settings',
  SESSION_HISTORY: 'hifdh_session_history',
  USER_PREFERENCES: 'hifdh_user_preferences',
  LAST_SYNC: 'hifdh_last_sync',
} as const;

export type Theme = 'light' | 'dark' | 'auto';

export interface Settings {
  showEndVerseSnippet: boolean;
  preferredReciter: string;
  audioQuality: '64' | '128' | '192';
  autoPlayAudio: boolean;
  playbackSpeed: number;
  arabicTextSize: number;
}

// Storage utility class
export class Storage {
  // Generic methods
  static async get<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  }

  static async set(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to storage:`, error);
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from storage:`, error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Theme methods
  static async getTheme(): Promise<Theme | null> {
    return this.get<Theme>(StorageKeys.THEME);
  }

  static async setTheme(theme: Theme): Promise<void> {
    await this.set(StorageKeys.THEME, theme);
  }

  // Settings methods
  static async getSettings(): Promise<Settings | null> {
    return this.get<Settings>(StorageKeys.SETTINGS);
  }

  static async setSettings(settings: Settings): Promise<void> {
    await this.set(StorageKeys.SETTINGS, settings);
  }

  static async updateSettings(partialSettings: Partial<Settings>): Promise<void> {
    const currentSettings = await this.getSettings();
    const newSettings = { ...currentSettings, ...partialSettings };
    await this.setSettings(newSettings);
  }

  // User preferences methods
  static async getUserPreferences(): Promise<any> {
    return this.get(StorageKeys.USER_PREFERENCES);
  }

  static async setUserPreferences(preferences: any): Promise<void> {
    await this.set(StorageKeys.USER_PREFERENCES, preferences);
  }

  // Last sync timestamp
  static async getLastSync(): Promise<number | null> {
    return this.get<number>(StorageKeys.LAST_SYNC);
  }

  static async setLastSync(timestamp: number): Promise<void> {
    await this.set(StorageKeys.LAST_SYNC, timestamp);
  }

  // Multi-get for efficiency
  static async multiGet(keys: string[]): Promise<Record<string, any>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      pairs.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error('Error in multiGet:', error);
      return {};
    }
  }

  // Multi-set for efficiency
  static async multiSet(keyValuePairs: Array<[string, any]>): Promise<void> {
    try {
      const pairs = keyValuePairs.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs as [string, string][]);
    } catch (error) {
      console.error('Error in multiSet:', error);
    }
  }
}

// Default settings
export const DEFAULT_SETTINGS: Settings = {
  showEndVerseSnippet: false,
  preferredReciter: 'minshawi',
  audioQuality: '128',
  autoPlayAudio: true,
  playbackSpeed: 1.0,
  arabicTextSize: 24,
};
