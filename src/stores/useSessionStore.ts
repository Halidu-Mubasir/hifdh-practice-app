import { create } from 'zustand';
import { CategoryInfo, Trial, TrialRecord } from '../types';
import { db } from '../services/database';
import { generateTrial } from '../services/trialManager';
import { surahData } from '../services/quranData';

export interface SessionState {
  // Session configuration
  selectedCategory: CategoryInfo | null;
  numberOfTrials: number;
  currentAttempt: number; // 1-indexed
  sessionId: string | null;
  sessionStartTime: number | null;

  // Current trial
  currentTrial: Trial | null;
  isGeneratingTrial: boolean;
  trialError: string | null;

  // Trial response (temporary until committed)
  currentScore: number | null;
  currentNotes: string;

  // Session records (committed trials)
  sessionRecords: Array<TrialRecord | null>;

  // Session status
  isSessionActive: boolean;
  isSessionComplete: boolean;

  // Actions
  setCategory: (category: CategoryInfo) => void;
  setNumberOfTrials: (count: number) => void;
  startSession: () => Promise<void>;
  generateCurrentTrial: () => Promise<void>;
  regenerateTrial: () => Promise<void>;
  setScore: (score: number | null) => void;
  setNotes: (notes: string) => void;
  nextTrial: () => Promise<void>;
  completeSession: () => Promise<void>;
  resetSession: () => void;
  changeCategory: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  // Initial state
  selectedCategory: null,
  numberOfTrials: 5,
  currentAttempt: 0,
  sessionId: null,
  sessionStartTime: null,

  currentTrial: null,
  isGeneratingTrial: false,
  trialError: null,

  currentScore: null,
  currentNotes: '',

  sessionRecords: [],

  isSessionActive: false,
  isSessionComplete: false,

  // Actions
  setCategory: (category) => {
    set({ selectedCategory: category });
  },

  setNumberOfTrials: (count) => {
    set({ numberOfTrials: count });
  },

  startSession: async () => {
    const { selectedCategory, numberOfTrials } = get();

    if (!selectedCategory) {
      console.error('No category selected');
      return;
    }

    try {
      // Initialize session
      const sessionStartTime = Date.now();

      // Save session to database
      const sessionId = await db.saveSession({
        userId: null, // Will be set after auth implementation
        categoryId: selectedCategory.id,
        trialsCount: numberOfTrials,
        startedAt: sessionStartTime,
        completedAt: null,
      });

      // Initialize session records array
      const records: Array<TrialRecord | null> = new Array(numberOfTrials).fill(null);

      set({
        sessionId,
        sessionStartTime,
        currentAttempt: 1,
        sessionRecords: records,
        isSessionActive: true,
        isSessionComplete: false,
        currentScore: null,
        currentNotes: '',
      });

      // Generate first trial
      await get().generateCurrentTrial();
    } catch (error) {
      console.error('Error starting session:', error);
      set({
        trialError: 'Failed to start session. Please try again.',
      });
    }
  },

  generateCurrentTrial: async () => {
    const { selectedCategory, currentAttempt, numberOfTrials } = get();

    if (!selectedCategory) {
      console.error('No category selected');
      return;
    }

    set({ isGeneratingTrial: true, trialError: null });

    try {
      const trial = await generateTrial(
        selectedCategory,
        currentAttempt,
        surahData,
        numberOfTrials
      );

      if (!trial) {
        throw new Error('Failed to generate trial');
      }

      set({
        currentTrial: trial,
        isGeneratingTrial: false,
      });
    } catch (error) {
      console.error('Error generating trial:', error);
      set({
        isGeneratingTrial: false,
        trialError: 'Failed to generate trial. Please try again.',
      });
    }
  },

  regenerateTrial: async () => {
    // Reset current trial data
    set({
      currentScore: null,
      currentNotes: '',
    });

    // Generate new trial for same attempt
    await get().generateCurrentTrial();
  },

  setScore: (score) => {
    set({ currentScore: score });
  },

  setNotes: (notes) => {
    set({ currentNotes: notes });
  },

  nextTrial: async () => {
    const {
      currentTrial,
      currentScore,
      currentNotes,
      currentAttempt,
      numberOfTrials,
      sessionRecords,
      sessionId,
    } = get();

    if (!currentTrial) {
      console.error('No current trial');
      return;
    }

    try {
      // Create trial record
      const trialRecord: TrialRecord = {
        trial: currentTrial,
        score: currentScore,
        notes: currentNotes,
      };

      // Update session records
      const newRecords = [...sessionRecords];
      newRecords[currentAttempt - 1] = trialRecord;

      // Save trial to database
      if (sessionId) {
        await db.saveTrial({
          sessionId,
          trialNumber: currentAttempt,
          surahId: currentTrial.surahId,
          surahName: currentTrial.surahName,
          surahEnglishName: currentTrial.surahEnglishName,
          startAyah: currentTrial.startAyah,
          startGlobalAyahNumber: currentTrial.startGlobalAyahNumber,
          endSurahId: currentTrial.endSurahId,
          endSurahName: currentTrial.endSurahName,
          endSurahEnglishName: currentTrial.endSurahEnglishName,
          endAyah: currentTrial.endAyah,
          arabicSnippet: currentTrial.arabicSnippet,
          arabicEndSnippet: currentTrial.arabicEndSnippet || null,
          score: currentScore,
          notes: currentNotes,
        });
      }

      // Check if session is complete
      if (currentAttempt >= numberOfTrials) {
        set({
          sessionRecords: newRecords,
          isSessionActive: false,
          isSessionComplete: true,
        });
        await get().completeSession();
      } else {
        // Move to next trial
        set({
          sessionRecords: newRecords,
          currentAttempt: currentAttempt + 1,
          currentScore: null,
          currentNotes: '',
          currentTrial: null,
        });

        // Generate next trial
        await get().generateCurrentTrial();
      }
    } catch (error) {
      console.error('Error moving to next trial:', error);
      set({
        trialError: 'Failed to save trial. Please try again.',
      });
    }
  },

  completeSession: async () => {
    const { sessionId } = get();

    if (!sessionId) return;

    try {
      // Update session completion time in database
      await db.updateSession(sessionId, {
        completedAt: Date.now(),
      });

      set({
        isSessionActive: false,
        isSessionComplete: true,
      });
    } catch (error) {
      console.error('Error completing session:', error);
    }
  },

  resetSession: () => {
    set({
      selectedCategory: null,
      numberOfTrials: 5,
      currentAttempt: 0,
      sessionId: null,
      sessionStartTime: null,
      currentTrial: null,
      isGeneratingTrial: false,
      trialError: null,
      currentScore: null,
      currentNotes: '',
      sessionRecords: [],
      isSessionActive: false,
      isSessionComplete: false,
    });
  },

  changeCategory: () => {
    // Reset session but keep completed records for potential restart
    set({
      selectedCategory: null,
      currentAttempt: 0,
      sessionId: null,
      sessionStartTime: null,
      currentTrial: null,
      isGeneratingTrial: false,
      trialError: null,
      currentScore: null,
      currentNotes: '',
      isSessionActive: false,
      isSessionComplete: false,
    });
  },
}));
