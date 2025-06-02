export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_day: string
          exercise_id: string
          exercise_name: string
          set_number: number
          weight: number | null
          reps_logged: number | null
          duration_seconds: number | null
          target_reps: string
          target_sets: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          workout_day: string
          exercise_id: string
          exercise_name: string
          set_number: number
          weight?: number | null
          reps_logged?: number | null
          duration_seconds?: number | null
          target_reps: string
          target_sets: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          workout_day?: string
          exercise_id?: string
          exercise_name?: string
          set_number?: number
          weight?: number | null
          reps_logged?: number | null
          duration_seconds?: number | null
          target_reps?: string
          target_sets?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}