import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface ExerciseHistoryEntry {
  id: string;
  date: string;
  weight: number | null;
  reps: number | null;
  duration_seconds: number | null;
  set_number: number;
  workout_day: string;
}

export function useExerciseHistory(exerciseId: string, exerciseName: string) {
  const [history, setHistory] = useState<ExerciseHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchHistory = async () => {
    if (!user || !exerciseId) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('workout_logs')
        .select('id, created_at, weight, reps_logged, duration_seconds, set_number, workout_day')
        .eq('user_id', user.id)
        .or(`exercise_id.eq.${exerciseId},exercise_name.eq.${exerciseName}`)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to last 50 entries for performance

      if (fetchError) {
        throw fetchError;
      }

      const formattedHistory: ExerciseHistoryEntry[] = (data || []).map(entry => ({
        id: entry.id,
        date: new Date(entry.created_at).toLocaleDateString(),
        weight: entry.weight,
        reps: entry.reps_logged,
        duration_seconds: entry.duration_seconds,
        set_number: entry.set_number,
        workout_day: entry.workout_day,
      }));

      setHistory(formattedHistory);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch exercise history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user, exerciseId, exerciseName]);

  return {
    history,
    loading,
    error,
    refetch: fetchHistory,
  };
}