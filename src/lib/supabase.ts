import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configure Supabase client with session persistence options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure session persistence
    persistSession: true,
    // Automatically refresh the session
    autoRefreshToken: true,
    // Detect session in URL (for password reset flows)
    detectSessionInUrl: true,
    // Storage key for session data
    storageKey: 'supabase.auth.token',
    // Use localStorage by default, but can be overridden
    storage: {
      getItem: (key: string) => {
        // Check if user chose to be remembered
        const rememberMe = localStorage.getItem('supabase.auth.remember_me');
        
        if (rememberMe === 'false') {
          // Use sessionStorage for non-persistent sessions
          return sessionStorage.getItem(key);
        }
        
        // Use localStorage for persistent sessions (default)
        return localStorage.getItem(key);
      },
      setItem: (key: string, value: string) => {
        const rememberMe = localStorage.getItem('supabase.auth.remember_me');
        
        if (rememberMe === 'false') {
          sessionStorage.setItem(key, value);
        } else {
          localStorage.setItem(key, value);
        }
      },
      removeItem: (key: string) => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      }
    }
  }
});

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          current_plan_id: string | null;
          current_level_index: number;
          block_start_date: string | null;
          block_duration_weeks: number;
          active_generated_plan: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          current_plan_id?: string | null;
          current_level_index?: number;
          block_start_date?: string | null;
          block_duration_weeks?: number;
          active_generated_plan?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          current_plan_id?: string | null;
          current_level_index?: number;
          block_start_date?: string | null;
          block_duration_weeks?: number;
          active_generated_plan?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workout_logs: {
        Row: {
          id: string;
          user_id: string;
          workout_day: string;
          exercise_id: string;
          exercise_name: string;
          set_number: number;
          weight: number | null;
          reps_logged: number | null;
          duration_seconds: number | null;
          target_reps: string;
          target_sets: number;
          current_plan_id: string | null;
          current_level_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_day: string;
          exercise_id: string;
          exercise_name: string;
          set_number: number;
          weight?: number | null;
          reps_logged?: number | null;
          duration_seconds?: number | null;
          target_reps: string;
          target_sets: number;
          current_plan_id?: string | null;
          current_level_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_day?: string;
          exercise_id?: string;
          exercise_name?: string;
          set_number?: number;
          weight?: number | null;
          reps_logged?: number | null;
          duration_seconds?: number | null;
          target_reps?: string;
          target_sets?: number;
          current_plan_id?: string | null;
          current_level_index?: number;
          created_at?: string;
        };
      };
    };
  };
};