import React from 'react';
import { Target, TrendingUp, Clock, Dumbbell, Repeat } from 'lucide-react';
import { Card } from './ui/Card';
import type { EnhancedExercise } from '../data/workoutData';
import type { ExerciseHistoryEntry } from '../hooks/useExerciseHistory';

interface NextExercisePreviewProps {
  exercise: EnhancedExercise;
  history: ExerciseHistoryEntry[];
  loading?: boolean;
}

interface PerformanceData {
  lastPerformance: ExerciseHistoryEntry | null;
  personalBest: ExerciseHistoryEntry | null;
}

function calculatePersonalBest(history: ExerciseHistoryEntry[], exerciseType: string): ExerciseHistoryEntry | null {
  if (history.length === 0) return null;

  let best = history[0];

  for (const entry of history) {
    switch (exerciseType) {
      case 'weight_reps':
        // For weight exercises, prioritize weight, then reps
        if (entry.weight && best.weight) {
          if (entry.weight > best.weight || 
              (entry.weight === best.weight && entry.reps && best.reps && entry.reps > best.reps)) {
            best = entry;
          }
        } else if (entry.weight && !best.weight) {
          best = entry;
        }
        break;
      
      case 'reps_only':
      case 'reps_only_with_optional_weight':
        // For rep-only exercises, prioritize reps, then weight if available
        if (entry.reps && best.reps) {
          if (entry.reps > best.reps || 
              (entry.reps === best.reps && entry.weight && best.weight && entry.weight > best.weight)) {
            best = entry;
          }
        } else if (entry.reps && !best.reps) {
          best = entry;
        }
        break;
      
      case 'timed':
        // For timed exercises, prioritize duration
        if (entry.duration_seconds && best.duration_seconds) {
          if (entry.duration_seconds > best.duration_seconds) {
            best = entry;
          }
        } else if (entry.duration_seconds && !best.duration_seconds) {
          best = entry;
        }
        break;
    }
  }

  return best;
}

function getPerformanceData(history: ExerciseHistoryEntry[], exerciseType: string): PerformanceData {
  const lastPerformance = history.length > 0 ? history[0] : null; // History is sorted by date desc
  const personalBest = calculatePersonalBest(history, exerciseType);

  return { lastPerformance, personalBest };
}

function formatPerformance(entry: ExerciseHistoryEntry | null, exerciseType: string): string {
  if (!entry) return 'No previous data';

  const parts: string[] = [];

  if (entry.weight) {
    parts.push(`${entry.weight} lbs`);
  }

  if (entry.reps) {
    parts.push(`${entry.reps} reps`);
  }

  if (entry.duration_seconds) {
    const minutes = Math.floor(entry.duration_seconds / 60);
    const seconds = entry.duration_seconds % 60;
    if (minutes > 0) {
      parts.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    } else {
      parts.push(`${entry.duration_seconds}s`);
    }
  }

  return parts.length > 0 ? parts.join(', ') : 'No data';
}

export function NextExercisePreview({ exercise, history, loading = false }: NextExercisePreviewProps) {
  const { lastPerformance, personalBest } = getPerformanceData(history, exercise.type);

  if (loading) {
    return (
      <Card className="bg-theme-black-lighter border-theme-gold/20">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-theme-gold" />
            <span className="text-theme-gold font-semibold">Next Exercise</span>
          </div>
          <div className="animate-pulse">
            <div className="h-4 bg-theme-gold/20 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-theme-gold/20 rounded w-1/2"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-theme-black-lighter border-theme-gold/30">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-theme-gold/20">
          <Target className="w-5 h-5 text-theme-gold" />
          <span className="text-theme-gold font-semibold">Next Exercise</span>
        </div>

        {/* Exercise Details */}
        <div className="space-y-2">
          <h4 className="text-lg font-semibold text-theme-gold">{exercise.name}</h4>
          <div className="flex items-center gap-4 text-sm text-theme-gold-light">
            <span className="flex items-center gap-1">
              <Repeat size={14} />
              {exercise.sets} sets
            </span>
            <span>Target: {exercise.reps}</span>
          </div>
        </div>

        {/* Performance History */}
        <div className="grid grid-cols-1 gap-3">
          {/* Last Performance */}
          <div className="bg-theme-black rounded-2x-nested-container p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-theme-gold-dark" />
              <span className="text-xs font-medium text-theme-gold-dark uppercase tracking-wide">
                Last Performance
              </span>
            </div>
            <div className="flex items-center gap-2">
              {exercise.type.includes('weight') && (
                <Dumbbell className="w-4 h-4 text-theme-gold-light" />
              )}
              {(exercise.type.includes('reps') || exercise.type === 'reps_only') && (
                <Repeat className="w-4 h-4 text-theme-gold-light" />
              )}
              {exercise.type === 'timed' && (
                <Clock className="w-4 h-4 text-theme-gold-light" />
              )}
              <span className="text-theme-gold-light text-sm">
                {formatPerformance(lastPerformance, exercise.type)}
              </span>
            </div>
            {lastPerformance && (
              <div className="text-xs text-theme-gold-dark mt-1">
                {lastPerformance.date}
              </div>
            )}
          </div>

          {/* Personal Best */}
          <div className="bg-theme-black rounded-2x-nested-container p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-theme-gold" />
              <span className="text-xs font-medium text-theme-gold uppercase tracking-wide">
                Personal Best
              </span>
            </div>
            <div className="flex items-center gap-2">
              {exercise.type.includes('weight') && (
                <Dumbbell className="w-4 h-4 text-theme-gold" />
              )}
              {(exercise.type.includes('reps') || exercise.type === 'reps_only') && (
                <Repeat className="w-4 h-4 text-theme-gold" />
              )}
              {exercise.type === 'timed' && (
                <Clock className="w-4 h-4 text-theme-gold" />
              )}
              <span className="text-theme-gold text-sm font-medium">
                {formatPerformance(personalBest, exercise.type)}
              </span>
            </div>
            {personalBest && personalBest !== lastPerformance && (
              <div className="text-xs text-theme-gold-dark mt-1">
                {personalBest.date}
              </div>
            )}
          </div>
        </div>

        {/* Muscle Groups */}
        {exercise.primaryMuscle && (
          <div className="pt-2 border-t border-theme-gold/10">
            <div className="text-xs text-theme-gold-dark">
              <span className="font-medium">Primary:</span> {exercise.primaryMuscle}
              {exercise.secondaryMuscle && exercise.secondaryMuscle.length > 0 && (
                <>
                  <span className="mx-2">•</span>
                  <span className="font-medium">Secondary:</span> {exercise.secondaryMuscle.join(', ')}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}