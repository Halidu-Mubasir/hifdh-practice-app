import * as FileSystem from 'expo-file-system/legacy';
import { CategoryInfo } from '../types';

export interface CachedAyahText {
  text: string;
  globalAyahNum: number;
  timestamp: number;
}

export interface DownloadProgress {
  categoryId: string;
  totalFiles: number;
  downloadedFiles: number;
  currentFile: string;
  status: 'downloading' | 'completed' | 'error' | 'paused';
  error?: string;
}

class CacheService {
  private initialized: boolean = false;
  private downloadProgressCallbacks: Map<string, (progress: DownloadProgress) => void> = new Map();

  private get CACHE_DIR() {
    return `${FileSystem.documentDirectory}quran_cache/`;
  }

  private get TEXT_CACHE_DIR() {
    return `${this.CACHE_DIR}text/`;
  }

  private get AUDIO_CACHE_DIR() {
    return `${this.CACHE_DIR}audio/`;
  }

  // Initialize cache directories
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create main cache directory
      const mainDirInfo = await FileSystem.getInfoAsync(this.CACHE_DIR);
      if (!mainDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.CACHE_DIR, { intermediates: true });
      }

      // Create text cache directory
      const textDirInfo = await FileSystem.getInfoAsync(this.TEXT_CACHE_DIR);
      if (!textDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.TEXT_CACHE_DIR, { intermediates: true });
      }

      // Create audio cache directory
      const audioDirInfo = await FileSystem.getInfoAsync(this.AUDIO_CACHE_DIR);
      if (!audioDirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.AUDIO_CACHE_DIR, { intermediates: true });
      }

      this.initialized = true;
      console.log('Cache service initialized');
    } catch (error) {
      console.error('Cache initialization error:', error);
      throw error;
    }
  }

  // Text caching methods
  async cacheAyahText(
    surahId: number,
    ayahNum: number,
    text: string,
    globalAyahNum: number
  ): Promise<void> {
    try {
      const filename = `${this.TEXT_CACHE_DIR}ayah_${surahId}_${ayahNum}.json`;
      const data: CachedAyahText = {
        text,
        globalAyahNum,
        timestamp: Date.now(),
      };

      await FileSystem.writeAsStringAsync(filename, JSON.stringify(data));
    } catch (error) {
      console.error(`Error caching ayah ${surahId}:${ayahNum}:`, error);
    }
  }

  async getCachedAyahText(
    surahId: number,
    ayahNum: number
  ): Promise<CachedAyahText | null> {
    try {
      const filename = `${this.TEXT_CACHE_DIR}ayah_${surahId}_${ayahNum}.json`;
      const fileInfo = await FileSystem.getInfoAsync(filename);

      if (!fileInfo.exists) {
        return null;
      }

      const content = await FileSystem.readAsStringAsync(filename);
      return JSON.parse(content) as CachedAyahText;
    } catch (error) {
      console.error(`Error reading cached ayah ${surahId}:${ayahNum}:`, error);
      return null;
    }
  }

  // Audio caching methods
  async downloadAudioForAyah(
    globalAyahNumber: number,
    reciter: string = 'ar.minshawi'
  ): Promise<string> {
    try {
      const filename = `${this.AUDIO_CACHE_DIR}${reciter}_${globalAyahNumber}.mp3`;
      const fileInfo = await FileSystem.getInfoAsync(filename);

      // Return cached file if exists
      if (fileInfo.exists) {
        return filename;
      }

      // Download audio file
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/${reciter}/${globalAyahNumber}.mp3`;

      const downloadResult = await FileSystem.downloadAsync(audioUrl, filename);

      if (downloadResult.status === 200) {
        return downloadResult.uri;
      } else {
        throw new Error(`Download failed with status ${downloadResult.status}`);
      }
    } catch (error) {
      console.error(`Error downloading audio for ayah ${globalAyahNumber}:`, error);
      throw error;
    }
  }

  async getCachedAudioPath(
    globalAyahNumber: number,
    reciter: string = 'ar.minshawi'
  ): Promise<string | null> {
    try {
      const filename = `${this.AUDIO_CACHE_DIR}${reciter}_${globalAyahNumber}.mp3`;
      const fileInfo = await FileSystem.getInfoAsync(filename);

      return fileInfo.exists ? filename : null;
    } catch (error) {
      console.error(`Error checking cached audio ${globalAyahNumber}:`, error);
      return null;
    }
  }

  async isAudioCached(
    globalAyahNumber: number,
    reciter: string = 'ar.minshawi'
  ): Promise<boolean> {
    const cachedPath = await this.getCachedAudioPath(globalAyahNumber, reciter);
    return cachedPath !== null;
  }

  // Bulk download methods
  async prefetchCategory(
    category: CategoryInfo,
    reciter: string = 'ar.minshawi',
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      const categoryId = category.id;

      // Calculate approximate number of ayahs to download
      // This is a simplified calculation - actual implementation would need
      // to iterate through all ayahs in the category range
      const totalAyahs = this.estimateAyahsInCategory(category);

      const progress: DownloadProgress = {
        categoryId,
        totalFiles: totalAyahs,
        downloadedFiles: 0,
        currentFile: '',
        status: 'downloading',
      };

      // Store callback
      if (onProgress) {
        this.downloadProgressCallbacks.set(categoryId, onProgress);
      }

      // Download ayahs (simplified - actual implementation would iterate properly)
      for (let i = 0; i < totalAyahs; i++) {
        const globalAyahNum = this.calculateGlobalAyahNumber(category, i);

        try {
          progress.currentFile = `Ayah ${globalAyahNum}`;
          onProgress?.(progress);

          await this.downloadAudioForAyah(globalAyahNum, reciter);

          progress.downloadedFiles++;
          onProgress?.(progress);
        } catch (error) {
          console.error(`Error downloading ayah ${globalAyahNum}:`, error);
          // Continue with next ayah
        }
      }

      progress.status = 'completed';
      onProgress?.(progress);

      this.downloadProgressCallbacks.delete(categoryId);
    } catch (error) {
      console.error('Prefetch category error:', error);

      if (onProgress) {
        onProgress({
          categoryId: category.id,
          totalFiles: 0,
          downloadedFiles: 0,
          currentFile: '',
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }

      throw error;
    }
  }

  // Helper methods
  private estimateAyahsInCategory(category: CategoryInfo): number {
    // Simplified estimation - actual implementation would calculate precisely
    const juzCount = category.endJuz - category.startJuz + 1;
    return juzCount * 20; // Approximate ayahs per Juz (varies)
  }

  private calculateGlobalAyahNumber(category: CategoryInfo, index: number): number {
    // Simplified calculation - actual implementation would use proper Juz data
    return category.range.startSurahId * 10 + index;
  }

  // Cache management methods
  async getCacheSize(): Promise<number> {
    try {
      let totalSize = 0;

      // Get text cache size
      const textFiles = await FileSystem.readDirectoryAsync(this.TEXT_CACHE_DIR);
      for (const file of textFiles) {
        const info = await FileSystem.getInfoAsync(`${this.TEXT_CACHE_DIR}${file}`);
        if (info.exists && !info.isDirectory) {
          totalSize += info.size || 0;
        }
      }

      // Get audio cache size
      const audioFiles = await FileSystem.readDirectoryAsync(this.AUDIO_CACHE_DIR);
      for (const file of audioFiles) {
        const info = await FileSystem.getInfoAsync(`${this.AUDIO_CACHE_DIR}${file}`);
        if (info.exists && !info.isDirectory) {
          totalSize += info.size || 0;
        }
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating cache size:', error);
      return 0;
    }
  }

  async getCategoryCacheInfo(categoryId: string): Promise<{
    textFileCount: number;
    audioFileCount: number;
    totalSize: number;
  }> {
    // Placeholder - actual implementation would filter by category
    return {
      textFileCount: 0,
      audioFileCount: 0,
      totalSize: 0,
    };
  }

  async clearCache(): Promise<void> {
    try {
      // Delete text cache
      await FileSystem.deleteAsync(this.TEXT_CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.TEXT_CACHE_DIR, { intermediates: true });

      // Delete audio cache
      await FileSystem.deleteAsync(this.AUDIO_CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.AUDIO_CACHE_DIR, { intermediates: true });

      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
      throw error;
    }
  }

  async clearTextCache(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.TEXT_CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.TEXT_CACHE_DIR, { intermediates: true });
      console.log('Text cache cleared');
    } catch (error) {
      console.error('Error clearing text cache:', error);
    }
  }

  async clearAudioCache(): Promise<void> {
    try {
      await FileSystem.deleteAsync(this.AUDIO_CACHE_DIR, { idempotent: true });
      await FileSystem.makeDirectoryAsync(this.AUDIO_CACHE_DIR, { intermediates: true });
      console.log('Audio cache cleared');
    } catch (error) {
      console.error('Error clearing audio cache:', error);
    }
  }

  async deleteOldCache(daysOld: number = 30): Promise<void> {
    try {
      const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

      // Check text cache
      const textFiles = await FileSystem.readDirectoryAsync(this.TEXT_CACHE_DIR);
      for (const file of textFiles) {
        const filePath = `${TEXT_CACHE_DIR}${file}`;
        const content = await FileSystem.readAsStringAsync(filePath);
        const data = JSON.parse(content) as CachedAyahText;

        if (data.timestamp < cutoffTime) {
          await FileSystem.deleteAsync(filePath);
        }
      }

      console.log(`Deleted cache older than ${daysOld} days`);
    } catch (error) {
      console.error('Error deleting old cache:', error);
    }
  }

  // Format bytes to human-readable string
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

// Export singleton instance
export const cacheService = new CacheService();
