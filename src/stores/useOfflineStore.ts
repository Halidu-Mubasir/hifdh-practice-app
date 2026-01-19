import { create } from 'zustand';
import { cacheService, DownloadProgress } from '../services/cacheService';
import { CategoryInfo } from '../types';
import { useSettingsStore } from './useSettingsStore';

export interface OfflineCategoryStatus {
  categoryId: string;
  isDownloaded: boolean;
  isDownloading: boolean;
  progress: DownloadProgress | null;
  lastDownloadDate: number | null;
  cacheSize: number;
}

export interface OfflineState {
  // Cache status
  totalCacheSize: number;
  isInitialized: boolean;

  // Category downloads
  categoryStatuses: Map<string, OfflineCategoryStatus>;
  activeDownloads: Set<string>;

  // Actions
  initialize: () => Promise<void>;
  downloadCategory: (category: CategoryInfo) => Promise<void>;
  pauseDownload: (categoryId: string) => void;
  resumeDownload: (category: CategoryInfo) => Promise<void>;
  cancelDownload: (categoryId: string) => void;
  deleteCategory: (categoryId: string) => Promise<void>;
  getCategoryStatus: (categoryId: string) => OfflineCategoryStatus | null;
  refreshCacheSize: () => Promise<void>;
  clearAllCache: () => Promise<void>;
}

export const useOfflineStore = create<OfflineState>((set, get) => ({
  // Initial state
  totalCacheSize: 0,
  isInitialized: false,
  categoryStatuses: new Map(),
  activeDownloads: new Set(),

  // Initialize offline store
  initialize: async () => {
    try {
      await cacheService.initialize();

      // Get initial cache size
      const cacheSize = await cacheService.getCacheSize();

      set({
        totalCacheSize: cacheSize,
        isInitialized: true,
      });
    } catch (error) {
      console.error('Offline store initialization error:', error);
    }
  },

  // Download category for offline use
  downloadCategory: async (category) => {
    const { activeDownloads, categoryStatuses } = get();

    // Check if already downloading
    if (activeDownloads.has(category.id)) {
      console.warn(`Category ${category.id} is already being downloaded`);
      return;
    }

    try {
      // Mark as downloading
      const newActiveDownloads = new Set(activeDownloads);
      newActiveDownloads.add(category.id);

      const newStatuses = new Map(categoryStatuses);
      newStatuses.set(category.id, {
        categoryId: category.id,
        isDownloaded: false,
        isDownloading: true,
        progress: {
          categoryId: category.id,
          totalFiles: 0,
          downloadedFiles: 0,
          currentFile: '',
          status: 'downloading',
        },
        lastDownloadDate: null,
        cacheSize: 0,
      });

      set({
        activeDownloads: newActiveDownloads,
        categoryStatuses: newStatuses,
      });

      // Get preferred reciter
      const { preferredReciter } = useSettingsStore.getState();

      // Start download with progress callback
      await cacheService.prefetchCategory(
        category,
        preferredReciter,
        (progress) => {
          const { categoryStatuses } = get();
          const currentStatus = categoryStatuses.get(category.id);

          if (currentStatus) {
            const newStatuses = new Map(categoryStatuses);
            newStatuses.set(category.id, {
              ...currentStatus,
              progress,
            });

            set({ categoryStatuses: newStatuses });
          }
        }
      );

      // Download complete
      const { activeDownloads: currentDownloads, categoryStatuses: currentStatuses } = get();

      const completedActiveDownloads = new Set(currentDownloads);
      completedActiveDownloads.delete(category.id);

      const finalStatuses = new Map(currentStatuses);
      finalStatuses.set(category.id, {
        categoryId: category.id,
        isDownloaded: true,
        isDownloading: false,
        progress: null,
        lastDownloadDate: Date.now(),
        cacheSize: 0, // Will be updated on next refresh
      });

      set({
        activeDownloads: completedActiveDownloads,
        categoryStatuses: finalStatuses,
      });

      // Refresh cache size
      await get().refreshCacheSize();
    } catch (error) {
      console.error('Download category error:', error);

      // Mark as failed
      const { activeDownloads: errorActiveDownloads, categoryStatuses: errorCategoryStatuses } = get();

      const errorActiveDownloadsSet = new Set(errorActiveDownloads);
      errorActiveDownloadsSet.delete(category.id);

      const errorStatuses = new Map(errorCategoryStatuses);
      const currentStatus = errorStatuses.get(category.id);

      if (currentStatus && currentStatus.progress) {
        errorStatuses.set(category.id, {
          ...currentStatus,
          isDownloading: false,
          progress: {
            ...currentStatus.progress,
            status: 'error',
            error: error instanceof Error ? error.message : 'Download failed',
          },
        });
      }

      set({
        activeDownloads: errorActiveDownloadsSet,
        categoryStatuses: errorStatuses,
      });
    }
  },

  // Pause download (not fully implemented in cache service yet)
  pauseDownload: (categoryId) => {
    const { activeDownloads, categoryStatuses } = get();

    const newActiveDownloads = new Set(activeDownloads);
    newActiveDownloads.delete(categoryId);

    const newStatuses = new Map(categoryStatuses);
    const currentStatus = newStatuses.get(categoryId);

    if (currentStatus && currentStatus.progress) {
      newStatuses.set(categoryId, {
        ...currentStatus,
        isDownloading: false,
        progress: {
          ...currentStatus.progress,
          status: 'paused',
        },
      });
    }

    set({
      activeDownloads: newActiveDownloads,
      categoryStatuses: newStatuses,
    });
  },

  // Resume download
  resumeDownload: async (category) => {
    await get().downloadCategory(category);
  },

  // Cancel download
  cancelDownload: (categoryId) => {
    const { activeDownloads, categoryStatuses } = get();

    const newActiveDownloads = new Set(activeDownloads);
    newActiveDownloads.delete(categoryId);

    const newStatuses = new Map(categoryStatuses);
    newStatuses.delete(categoryId);

    set({
      activeDownloads: newActiveDownloads,
      categoryStatuses: newStatuses,
    });
  },

  // Delete category cache
  deleteCategory: async (categoryId) => {
    try {
      // For now, we'll just remove the status
      // In a full implementation, we'd delete specific files
      const { categoryStatuses } = get();

      const newStatuses = new Map(categoryStatuses);
      newStatuses.delete(categoryId);

      set({ categoryStatuses: newStatuses });

      // Refresh cache size
      await get().refreshCacheSize();
    } catch (error) {
      console.error('Delete category error:', error);
    }
  },

  // Get category status
  getCategoryStatus: (categoryId) => {
    const { categoryStatuses } = get();
    return categoryStatuses.get(categoryId) || null;
  },

  // Refresh total cache size
  refreshCacheSize: async () => {
    try {
      const cacheSize = await cacheService.getCacheSize();
      set({ totalCacheSize: cacheSize });
    } catch (error) {
      console.error('Refresh cache size error:', error);
    }
  },

  // Clear all cache
  clearAllCache: async () => {
    try {
      await cacheService.clearCache();

      set({
        totalCacheSize: 0,
        categoryStatuses: new Map(),
        activeDownloads: new Set(),
      });
    } catch (error) {
      console.error('Clear all cache error:', error);
    }
  },
}));
