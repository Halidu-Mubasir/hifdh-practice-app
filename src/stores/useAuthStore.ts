import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { syncService } from '../services/syncService';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  // Initial state
  user: null,
  session: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  // Initialize auth state
  initialize: async () => {
    try {
      set({ isLoading: true, error: null });

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        throw sessionError;
      }

      if (session) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        set({
          user: session.user,
          session,
          profile: profileData ? {
            id: profileData.id,
            email: profileData.email,
            displayName: profileData.display_name,
            createdAt: profileData.created_at,
            updatedAt: profileData.updated_at,
          } : null,
          isAuthenticated: true,
          isLoading: false,
        });

        // Download preferences
        await syncService.downloadPreferences();
      } else {
        set({
          user: null,
          session: null,
          profile: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Set up auth state listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (session) {
          // Fetch profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            user: session.user,
            session,
            profile: profileData ? {
              id: profileData.id,
              email: profileData.email,
              displayName: profileData.display_name,
              createdAt: profileData.created_at,
              updatedAt: profileData.updated_at,
            } : null,
            isAuthenticated: true,
          });
        } else {
          set({
            user: null,
            session: null,
            profile: null,
            isAuthenticated: false,
          });
        }
      });
    } catch (error) {
      console.error('Auth initialization error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize auth',
      });
    }
  },

  // Sign in
  signIn: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.session) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.session.user.id)
          .single();

        set({
          user: data.session.user,
          session: data.session,
          profile: profileData ? {
            id: profileData.id,
            email: profileData.email,
            displayName: profileData.display_name,
            createdAt: profileData.created_at,
            updatedAt: profileData.updated_at,
          } : null,
          isAuthenticated: true,
          isLoading: false,
        });

        // Download preferences and sync
        await syncService.downloadPreferences();
        await syncService.autoSync();
      }
    } catch (error) {
      console.error('Sign in error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign in',
      });
      throw error;
    }
  },

  // Sign up
  signUp: async (email, password) => {
    try {
      set({ isLoading: true, error: null });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Note: User will need to verify email before they can sign in
      // The profile will be created automatically by the database trigger

      set({
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up',
      });
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      set({
        user: null,
        session: null,
        profile: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error) {
      console.error('Sign out error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign out',
      });
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      set({ isLoading: true, error: null });

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'hifdh-app://reset-password',
      });

      if (error) {
        throw error;
      }

      set({ isLoading: false });
    } catch (error) {
      console.error('Reset password error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to reset password',
      });
      throw error;
    }
  },

  // Update profile
  updateProfile: async (updates) => {
    try {
      const { user, profile } = get();

      if (!user || !profile) {
        throw new Error('Not authenticated');
      }

      set({ isLoading: true, error: null });

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: updates.displayName ?? profile.displayName,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      // Update local state
      set({
        profile: {
          ...profile,
          ...updates,
          updatedAt: new Date().toISOString(),
        },
        isLoading: false,
      });
    } catch (error) {
      console.error('Update profile error:', error);
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
      throw error;
    }
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },
}));
