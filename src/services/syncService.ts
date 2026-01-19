import { supabase } from '../lib/supabase';
import { db, LocalSession, LocalTrialResult } from './database';
import { Storage } from '../utils/storage';

export type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

export interface SyncResult {
  status: SyncStatus;
  uploadedSessions: number;
  uploadedTrials: number;
  errors: string[];
  lastSyncTime: number;
}

class SyncService {
  private isSyncing: boolean = false;
  private lastSyncTime: number = 0;

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return data.session !== null;
  }

  // Get current user ID
  async getUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id || null;
  }

  // Perform full sync
  async performFullSync(): Promise<SyncResult> {
    if (this.isSyncing) {
      console.warn('Sync already in progress');
      return {
        status: 'error',
        uploadedSessions: 0,
        uploadedTrials: 0,
        errors: ['Sync already in progress'],
        lastSyncTime: this.lastSyncTime,
      };
    }

    this.isSyncing = true;

    const result: SyncResult = {
      status: 'syncing',
      uploadedSessions: 0,
      uploadedTrials: 0,
      errors: [],
      lastSyncTime: Date.now(),
    };

    try {
      // Check authentication
      if (!(await this.isAuthenticated())) {
        throw new Error('User not authenticated');
      }

      // Sync sessions
      const sessionsResult = await this.syncSessions();
      result.uploadedSessions = sessionsResult.count;
      result.errors.push(...sessionsResult.errors);

      // Sync preferences
      await this.syncPreferences();

      // Update last sync time
      this.lastSyncTime = result.lastSyncTime;
      await Storage.setLastSync(this.lastSyncTime);

      result.status = result.errors.length > 0 ? 'error' : 'success';
    } catch (error) {
      console.error('Full sync error:', error);
      result.status = 'error';
      result.errors.push(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      this.isSyncing = false;
    }

    return result;
  }

  // Sync sessions to Supabase
  private async syncSessions(): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      const userId = await this.getUserId();
      if (!userId) throw new Error('No user ID');

      // Get unsynced sessions
      const unsyncedSessions = await db.getUnsyncedSessions();

      for (const session of unsyncedSessions) {
        try {
          // Upload session to Supabase
          const { data: uploadedSession, error: sessionError } = await supabase
            .from('sessions')
            .insert({
              user_id: userId,
              category_id: session.categoryId,
              trials_count: session.trialsCount,
              started_at: new Date(session.startedAt).toISOString(),
              completed_at: session.completedAt
                ? new Date(session.completedAt).toISOString()
                : null,
            })
            .select()
            .single();

          if (sessionError) {
            errors.push(`Session upload error: ${sessionError.message}`);
            continue;
          }

          if (uploadedSession) {
            // Mark session as synced locally
            await db.markSessionSynced(session.id, uploadedSession.id);

            // Sync trial results for this session
            const trialsResult = await this.syncTrialResults(session.id, uploadedSession.id);
            result.uploadedTrials += trialsResult.count;
            errors.push(...trialsResult.errors);

            count++;
          }
        } catch (error) {
          console.error(`Error syncing session ${session.id}:`, error);
          errors.push(`Session ${session.id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Sync sessions error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return { count, errors };
  }

  // Sync trial results for a session
  private async syncTrialResults(
    localSessionId: string,
    remoteSessionId: string
  ): Promise<{ count: number; errors: string[] }> {
    const errors: string[] = [];
    let count = 0;

    try {
      // Get unsynced trials for this session
      const unsyncedTrials = await db.getUnsyncedTrials(localSessionId);

      if (unsyncedTrials.length === 0) {
        return { count, errors };
      }

      // Prepare trials for upload
      const trialsToUpload = unsyncedTrials.map((trial) => ({
        session_id: remoteSessionId,
        trial_number: trial.trialNumber,
        surah_id: trial.surahId,
        surah_name: trial.surahName,
        surah_english_name: trial.surahEnglishName,
        start_ayah: trial.startAyah,
        start_global_ayah_number: trial.startGlobalAyahNumber,
        end_surah_id: trial.endSurahId,
        end_surah_name: trial.endSurahName,
        end_surah_english_name: trial.endSurahEnglishName,
        end_ayah: trial.endAyah,
        arabic_snippet: trial.arabicSnippet,
        arabic_end_snippet: trial.arabicEndSnippet,
        score: trial.score,
        notes: trial.notes,
      }));

      // Upload trials in batch
      const { error: trialsError } = await supabase
        .from('trial_results')
        .insert(trialsToUpload);

      if (trialsError) {
        errors.push(`Trial results upload error: ${trialsError.message}`);
      } else {
        // Mark trials as synced
        await db.markTrialsSynced(localSessionId);
        count = trialsToUpload.length;
      }
    } catch (error) {
      console.error('Sync trial results error:', error);
      errors.push(error instanceof Error ? error.message : 'Unknown error');
    }

    return { count, errors };
  }

  // Sync user preferences
  private async syncPreferences(): Promise<void> {
    try {
      const userId = await this.getUserId();
      if (!userId) return;

      const settings = await Storage.getSettings();
      if (!settings) return;

      // Check if preferences exist
      const { data: existing } = await supabase
        .from('user_preferences')
        .select('user_id')
        .eq('user_id', userId)
        .single();

      if (existing) {
        // Update existing preferences
        await supabase
          .from('user_preferences')
          .update({
            show_end_verse_snippet: settings.showEndVerseSnippet,
            preferred_reciter: settings.preferredReciter,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId);
      } else {
        // Insert new preferences (shouldn't happen due to trigger, but just in case)
        await supabase
          .from('user_preferences')
          .insert({
            user_id: userId,
            show_end_verse_snippet: settings.showEndVerseSnippet,
            preferred_reciter: settings.preferredReciter,
          });
      }
    } catch (error) {
      console.error('Sync preferences error:', error);
    }
  }

  // Download preferences from Supabase
  async downloadPreferences(): Promise<void> {
    try {
      const userId = await this.getUserId();
      if (!userId) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Download preferences error:', error);
        return;
      }

      if (data) {
        // Update local settings
        await Storage.updateSettings({
          showEndVerseSnippet: data.show_end_verse_snippet,
          preferredReciter: data.preferred_reciter,
        });
      }
    } catch (error) {
      console.error('Download preferences error:', error);
    }
  }

  // Update user statistics
  async updateStatistics(
    categoryId: string,
    juzNumber: number | null,
    score: number
  ): Promise<void> {
    try {
      const userId = await this.getUserId();
      if (!userId) return;

      // Get current statistics
      const { data: existing } = await supabase
        .from('user_statistics')
        .select('*')
        .eq('user_id', userId)
        .eq('category_id', categoryId)
        .eq('juz_number', juzNumber)
        .single();

      if (existing) {
        // Update existing statistics
        const newTotalTrials = existing.total_trials + 1;
        const newAverageScore =
          ((existing.average_score * existing.total_trials) + score) / newTotalTrials;

        await supabase
          .from('user_statistics')
          .update({
            total_trials: newTotalTrials,
            average_score: newAverageScore,
            last_practiced_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userId)
          .eq('category_id', categoryId)
          .eq('juz_number', juzNumber);
      } else {
        // Insert new statistics
        await supabase
          .from('user_statistics')
          .insert({
            user_id: userId,
            category_id: categoryId,
            juz_number: juzNumber,
            total_trials: 1,
            average_score: score,
            last_practiced_at: new Date().toISOString(),
          });
      }
    } catch (error) {
      console.error('Update statistics error:', error);
    }
  }

  // Subscribe to real-time changes (optional)
  subscribeToSessions(
    callback: (payload: any) => void
  ): (() => void) | null {
    const userId = this.getUserId();
    if (!userId) return null;

    const channel = supabase
      .channel('sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${userId}`,
        },
        callback
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Get last sync time
  getLastSyncTime(): number {
    return this.lastSyncTime;
  }

  // Check if sync is needed (based on time or pending changes)
  async needsSync(): Promise<boolean> {
    try {
      const unsyncedSessions = await db.getUnsyncedSessions();
      return unsyncedSessions.length > 0;
    } catch (error) {
      console.error('Check needs sync error:', error);
      return false;
    }
  }

  // Auto-sync if needed (call periodically or on app resume)
  async autoSync(): Promise<void> {
    if (!(await this.isAuthenticated())) {
      return;
    }

    if (await this.needsSync()) {
      await this.performFullSync();
    }
  }
}

// Export singleton instance
export const syncService = new SyncService();
