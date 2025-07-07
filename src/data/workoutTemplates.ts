/**
 * Workout Templates - Blueprint System for Plan Generation
 * 
 * This file defines the templates used by the Plan Generation Engine to create
 * personalized workout plans based on user goals and available equipment.
 */

export interface WorkoutSlot {
  slotId: string;
  movementPattern: string;
  slotType: 'compound' | 'isolation';
  targetSets: number;
  targetReps: string;
  exerciseType: 'weight_reps' | 'reps_only' | 'reps_only_with_optional_weight' | 'timed';
}

export interface WorkoutSkeleton {
  day: string;
  name: string;
  slots: WorkoutSlot[];
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  workouts: WorkoutSkeleton[];
}

/**
 * Master Workout Templates Dictionary
 * 
 * These templates serve as blueprints for the Plan Generation Engine.
 * Each template defines the structure and requirements for a complete training program.
 */
export const WORKOUT_TEMPLATES: Record<string, WorkoutTemplate> = {
  'full_body_hypertrophy_3day': {
    id: 'full_body_hypertrophy_3day',
    name: 'Full Body Hypertrophy',
    description: 'A 3-day full body program focused on building muscle mass with compound and isolation movements.',
    daysPerWeek: 3,
    workouts: [
      {
        day: 'Workout A',
        name: 'Workout A - Push Focus',
        slots: [
          {
            slotId: 'a1',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'a2',
            movementPattern: 'vertical_press',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'a3',
            movementPattern: 'squat',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'a4',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'a5',
            movementPattern: 'lateral_raise',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'a6',
            movementPattern: 'core',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '45-60s',
            exerciseType: 'timed'
          }
        ]
      },
      {
        day: 'Workout B',
        name: 'Workout B - Pull Focus',
        slots: [
          {
            slotId: 'b1',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'b2',
            movementPattern: 'vertical_pull',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '6-12',
            exerciseType: 'reps_only'
          },
          {
            slotId: 'b3',
            movementPattern: 'hinge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'b4',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'b5',
            movementPattern: 'horizontal_abduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'b6',
            movementPattern: 'core',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'reps_only'
          }
        ]
      },
      {
        day: 'Workout C',
        name: 'Workout C - Lower Focus',
        slots: [
          {
            slotId: 'c1',
            movementPattern: 'squat',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'c2',
            movementPattern: 'hinge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'c3',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'c4',
            movementPattern: 'lunge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'c5',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'c6',
            movementPattern: 'core',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '30-45s',
            exerciseType: 'timed'
          }
        ]
      }
    ]
  }
};

/**
 * Utility function to get template by ID
 */
export function getTemplateById(id: string): WorkoutTemplate | null {
  return WORKOUT_TEMPLATES[id] || null;
}

/**
 * Utility function to get all available templates
 */
export function getAllTemplates(): WorkoutTemplate[] {
  return Object.values(WORKOUT_TEMPLATES);
}