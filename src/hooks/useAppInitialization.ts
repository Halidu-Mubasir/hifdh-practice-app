import { useEffect, useState } from 'react';
import { db } from '../services/database';
import { cacheService } from '../services/cacheService';
import { audioService } from '../services/audioService';
import { useAuthStore } from '../stores/useAuthStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import { useOfflineStore } from '../stores/useOfflineStore';
import { syncService } from '../services/syncService';

export interface AppInitializationState {
  isInitialized: boolean;
  isInitializing: boolean;
  error: string | null;
}

/**
 * Custom hook to initialize all app services and stores on app startup
 *
 * This hook handles the complete app initialization sequence:
 * 1. Initialize local database (SQLite)
 * 2. Initialize cache service (FileSystem)
 * 3. Initialize audio service (expo-av)
 * 4. Initialize auth store (check session)
 * 5. Initialize settings store (load preferences)
 * 6. Initialize offline store (calculate cache size)
 * 7. Perform initial sync if authenticated
 *
 * @returns AppInitializationState with initialization status
 */
export const useAppInitialization = (): AppInitializationState => {
  const [state, setState] = useState<AppInitializationState>({
    isInitialized: false,
    isInitializing: false,
    error: null,
  });

  const initializeAuth = useAuthStore((state) => state.initialize);
  const initializeSettings = useSettingsStore((state) => state.initialize);
  const initializeOffline = useOfflineStore((state) => state.initialize);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setState({
          isInitialized: false,
          isInitializing: true,
          error: null,
        });

        console.log('[App Init] Starting app initialization...');

        // Step 1: Initialize database
        console.log('[App Init] Initializing database...');
        await db.init();
        console.log('[App Init] Database initialized successfully');

        // Step 2: Initialize cache service
        console.log('[App Init] Initializing cache service...');
        await cacheService.initialize();
        console.log('[App Init] Cache service initialized successfully');

        // Step 3: Initialize audio service
        console.log('[App Init] Initializing audio service...');
        await audioService.initialize();
        console.log('[App Init] Audio service initialized successfully');

        // Step 4: Initialize auth store (check for existing session)
        console.log('[App Init] Initializing auth store...');
        await initializeAuth();
        console.log('[App Init] Auth store initialized successfully');

        // Step 5: Initialize settings store (load preferences)
        console.log('[App Init] Initializing settings store...');
        await initializeSettings();
        console.log('[App Init] Settings store initialized successfully');

        // Step 6: Initialize offline store (calculate cache size)
        console.log('[App Init] Initializing offline store...');
        await initializeOffline();
        console.log('[App Init] Offline store initialized successfully');

        // Step 7: Perform initial sync if authenticated
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        if (isAuthenticated) {
          console.log('[App Init] User authenticated, performing initial sync...');
          try {
            await syncService.performFullSync();
            console.log('[App Init] Initial sync completed successfully');
          } catch (syncError) {
            console.warn('[App Init] Initial sync failed, will retry later:', syncError);
            // Don't block app initialization if sync fails
          }
        } else {
          console.log('[App Init] User not authenticated, skipping sync');
        }

        console.log('[App Init] App initialization completed successfully');

        setState({
          isInitialized: true,
          isInitializing: false,
          error: null,
        });
      } catch (error) {
        console.error('[App Init] App initialization failed:', error);

        setState({
          isInitialized: false,
          isInitializing: false,
          error: error instanceof Error ? error.message : 'Failed to initialize app',
        });
      }
    };

    initializeApp();
  }, []); // Run only once on app mount

  return state;
};

/**
 * Component-based wrapper for app initialization
 * Use this in your root _layout.tsx to show loading screen while initializing
 *
 * @example
 * ```tsx
 * import { AppInitializer } from '@/hooks/useAppInitialization';
 *
 * export default function RootLayout() {
 *   return (
 *     <AppInitializer
 *       loading={<LoadingScreen />}
 *       error={(error) => <ErrorScreen message={error} />}
 *     >
 *       <Stack />
 *     </AppInitializer>
 *   );
 * }
 * ```
 */
export const AppInitializer: React.FC<{
  children: React.ReactNode;
  loading?: React.ReactNode;
  error?: (error: string) => React.ReactNode;
}> = ({ children, loading, error: errorRenderer }) => {
  const { isInitialized, isInitializing, error } = useAppInitialization();

  if (error && errorRenderer) {
    return errorRenderer(error) as React.ReactElement;
  }

  if (isInitializing || !isInitialized) {
    return (loading || null) as React.ReactElement;
  }

  return children as React.ReactElement;
};
