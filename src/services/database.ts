import * as SQLite from 'expo-sqlite';
import { Trial, TrialRecord } from '../types';

// Database types
export interface LocalSession {
  id: string;
  userId: string | null;
  categoryId: string;
  trialsCount: number;
  startedAt: number;
  completedAt: number | null;
  synced: number; // 0 = not synced, 1 = synced
  remoteId: string | null; // UUID from Supabase after sync
}

export interface LocalTrialResult {
  id: string;
  sessionId: string;
  trialNumber: number;
  surahId: number;
  surahName: string;
  surahEnglishName: string;
  startAyah: number;
  startGlobalAyahNumber: number;
  endSurahId: number;
  endSurahName: string;
  endSurahEnglishName: string;
  endAyah: number;
  arabicSnippet: string;
  arabicEndSnippet: string | null;
  score: number | null;
  notes: string;
  synced: number;
}

export interface SyncQueueItem {
  id: string;
  operation: 'insert' | 'update' | 'delete';
  tableName: string;
  recordId: string;
  payload: string; // JSON stringified data
  createdAt: number;
  attempts: number;
}

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;
  private initialized: boolean = false;

  // Initialize database
  async init(): Promise<void> {
    if (this.initialized) return;

    try {
      this.db = await SQLite.openDatabaseAsync('hifdh.db');
      await this.createTables();
      this.initialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  // Create all tables
  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Sessions table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        category_id TEXT NOT NULL,
        trials_count INTEGER NOT NULL,
        started_at INTEGER NOT NULL,
        completed_at INTEGER,
        synced INTEGER DEFAULT 0,
        remote_id TEXT
      );
    `);

    // Trial results table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS trial_results (
        id TEXT PRIMARY KEY,
        session_id TEXT NOT NULL,
        trial_number INTEGER NOT NULL,
        surah_id INTEGER NOT NULL,
        surah_name TEXT NOT NULL,
        surah_english_name TEXT NOT NULL,
        start_ayah INTEGER NOT NULL,
        start_global_ayah_number INTEGER NOT NULL,
        end_surah_id INTEGER NOT NULL,
        end_surah_name TEXT NOT NULL,
        end_surah_english_name TEXT NOT NULL,
        end_ayah INTEGER NOT NULL,
        arabic_snippet TEXT,
        arabic_end_snippet TEXT,
        score INTEGER,
        notes TEXT,
        synced INTEGER DEFAULT 0,
        FOREIGN KEY(session_id) REFERENCES sessions(id)
      );
    `);

    // Sync queue table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        operation TEXT NOT NULL,
        table_name TEXT NOT NULL,
        record_id TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        attempts INTEGER DEFAULT 0
      );
    `);

    // Create indexes for better performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_synced ON sessions(synced);
      CREATE INDEX IF NOT EXISTS idx_trial_results_session_id ON trial_results(session_id);
      CREATE INDEX IF NOT EXISTS idx_trial_results_synced ON trial_results(synced);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_created_at ON sync_queue(created_at);
    `);
  }

  // Generate unique ID
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Session methods
  async saveSession(session: Omit<LocalSession, 'id' | 'synced' | 'remoteId'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      `INSERT INTO sessions (id, user_id, category_id, trials_count, started_at, completed_at, synced, remote_id)
       VALUES (?, ?, ?, ?, ?, ?, 0, NULL)`,
      [id, session.userId || null, session.categoryId, session.trialsCount, session.startedAt, session.completedAt || null]
    );

    // Add to sync queue
    await this.addToSyncQueue('insert', 'sessions', id, session);

    return id;
  }

  async updateSession(id: string, updates: Partial<LocalSession>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    if (updates.completedAt !== undefined) {
      fields.push('completed_at = ?');
      values.push(updates.completedAt);
    }

    if (updates.synced !== undefined) {
      fields.push('synced = ?');
      values.push(updates.synced);
    }

    if (updates.remoteId !== undefined) {
      fields.push('remote_id = ?');
      values.push(updates.remoteId);
    }

    if (fields.length === 0) return;

    values.push(id);

    await this.db.runAsync(
      `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    // Add to sync queue if not a sync operation
    if (updates.synced !== 1) {
      await this.addToSyncQueue('update', 'sessions', id, updates);
    }
  }

  async getSession(id: string): Promise<LocalSession | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<LocalSession>(
      'SELECT * FROM sessions WHERE id = ?',
      [id]
    );

    return result || null;
  }

  async getSessionHistory(limit: number = 20, offset: number = 0): Promise<LocalSession[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<LocalSession>(
      'SELECT * FROM sessions ORDER BY started_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );

    return results;
  }

  async getUnsyncedSessions(): Promise<LocalSession[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<LocalSession>(
      'SELECT * FROM sessions WHERE synced = 0'
    );

    return results;
  }

  // Trial result methods
  async saveTrial(trial: Omit<LocalTrialResult, 'id' | 'synced'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      `INSERT INTO trial_results (
        id, session_id, trial_number, surah_id, surah_name, surah_english_name,
        start_ayah, start_global_ayah_number, end_surah_id, end_surah_name,
        end_surah_english_name, end_ayah, arabic_snippet, arabic_end_snippet,
        score, notes, synced
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
      [
        id, trial.sessionId, trial.trialNumber, trial.surahId, trial.surahName,
        trial.surahEnglishName, trial.startAyah, trial.startGlobalAyahNumber,
        trial.endSurahId, trial.endSurahName, trial.endSurahEnglishName,
        trial.endAyah, trial.arabicSnippet, trial.arabicEndSnippet || null,
        trial.score || null, trial.notes
      ]
    );

    // Add to sync queue
    await this.addToSyncQueue('insert', 'trial_results', id, trial);

    return id;
  }

  async getTrialsForSession(sessionId: string): Promise<LocalTrialResult[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<LocalTrialResult>(
      'SELECT * FROM trial_results WHERE session_id = ? ORDER BY trial_number ASC',
      [sessionId]
    );

    return results;
  }

  async getUnsyncedTrials(sessionId?: string): Promise<LocalTrialResult[]> {
    if (!this.db) throw new Error('Database not initialized');

    let query = 'SELECT * FROM trial_results WHERE synced = 0';
    const params: any[] = [];

    if (sessionId) {
      query += ' AND session_id = ?';
      params.push(sessionId);
    }

    const results = await this.db.getAllAsync<LocalTrialResult>(query, params);
    return results;
  }

  async markTrialsSynced(sessionId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE trial_results SET synced = 1 WHERE session_id = ?',
      [sessionId]
    );
  }

  async markSessionSynced(localId: string, remoteId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE sessions SET synced = 1, remote_id = ? WHERE id = ?',
      [remoteId, localId]
    );
  }

  // Sync queue methods
  private async addToSyncQueue(
    operation: 'insert' | 'update' | 'delete',
    tableName: string,
    recordId: string,
    payload: any
  ): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const id = this.generateId();

    await this.db.runAsync(
      `INSERT INTO sync_queue (id, operation, table_name, record_id, payload, created_at, attempts)
       VALUES (?, ?, ?, ?, ?, ?, 0)`,
      [id, operation, tableName, recordId, JSON.stringify(payload), Date.now()]
    );
  }

  async getSyncQueue(limit: number = 50): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const results = await this.db.getAllAsync<SyncQueueItem>(
      'SELECT * FROM sync_queue ORDER BY created_at ASC LIMIT ?',
      [limit]
    );

    return results;
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync('DELETE FROM sync_queue WHERE id = ?', [id]);
  }

  async incrementSyncAttempts(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE sync_queue SET attempts = attempts + 1 WHERE id = ?',
      [id]
    );
  }

  // Statistics methods
  async getSessionCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sessions WHERE completed_at IS NOT NULL'
    );

    return result?.count || 0;
  }

  async getAverageScore(categoryId?: string): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    let query = `
      SELECT AVG(score) as avg_score
      FROM trial_results
      WHERE score IS NOT NULL
    `;

    const params: any[] = [];

    if (categoryId) {
      query += ` AND session_id IN (SELECT id FROM sessions WHERE category_id = ?)`;
      params.push(categoryId);
    }

    const result = await this.db.getFirstAsync<{ avg_score: number }>(query, params);

    return result?.avg_score || 0;
  }

  // Cleanup methods
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execAsync(`
      DELETE FROM trial_results;
      DELETE FROM sessions;
      DELETE FROM sync_queue;
    `);
  }

  async deleteOldSessions(daysOld: number = 90): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);

    await this.db.runAsync(
      'DELETE FROM sessions WHERE started_at < ?',
      [cutoffTime]
    );
  }
}

// Export singleton instance
export const db = new DatabaseService();
