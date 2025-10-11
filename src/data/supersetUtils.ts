/**
 * Superset Utilities
 *
 * Helper functions for working with superset exercise pairs
 */

import { Exercise, SupersetPair } from './workoutData';
import { getExerciseById } from './exerciseDictionary';

/**
 * Create a superset pair from two exercise IDs
 */
export function createSupersetPair(
  exerciseAId: string,
  exerciseBId: string,
  sets: number,
  repsA: string,
  repsB: string,
  typeA: string,
  typeB: string
): SupersetPair {
  return {
    exerciseA: {
      id: exerciseAId,
      sets,
      reps: repsA,
      type: typeA
    },
    exerciseB: {
      id: exerciseBId,
      sets,
      reps: repsB,
      type: typeB
    }
  };
}

/**
 * Check if an item in the exercises array is a superset pair
 */
export function isSupersetPair(item: Exercise | SupersetPair): item is SupersetPair {
  return 'exerciseA' in item && 'exerciseB' in item;
}

/**
 * Get superset number and position (A or B) for display
 */
export function getSupersetLabel(supersetIndex: number, position: 'A' | 'B'): string {
  return `Superset ${supersetIndex + 1}${position}`;
}

/**
 * Flatten exercises array for WorkoutSession processing
 * Converts superset pairs into individual exercise entries with metadata
 */
export interface FlattenedExercise extends Exercise {
  isSupersetExercise?: boolean;
  supersetIndex?: number;
  supersetPosition?: 'A' | 'B';
  pairedExerciseId?: string;
}

export function flattenExercises(exercises: (Exercise | SupersetPair)[]): FlattenedExercise[] {
  const flattened: FlattenedExercise[] = [];
  let supersetIndex = 0;

  for (const item of exercises) {
    if (isSupersetPair(item)) {
      flattened.push({
        ...item.exerciseA,
        isSupersetExercise: true,
        supersetIndex,
        supersetPosition: 'A',
        pairedExerciseId: item.exerciseB.id
      });
      flattened.push({
        ...item.exerciseB,
        isSupersetExercise: true,
        supersetIndex,
        supersetPosition: 'B',
        pairedExerciseId: item.exerciseA.id
      });
      supersetIndex++;
    } else {
      flattened.push(item);
    }
  }

  return flattened;
}
