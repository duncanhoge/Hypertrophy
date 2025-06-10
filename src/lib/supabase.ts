import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
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
          created_at?: string;
        };
      };
    };
  };
};