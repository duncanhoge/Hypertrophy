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
  coreSlots: WorkoutSlot[];
  accessoryPool: WorkoutSlot[];
}

/**
 * Day-Specific Workout Skeletons
 * 
 * These represent the structure for individual workout day types.
 * They are used by the Plan Generation Engine to assemble full plans
 * based on the dayRotation specified in WorkoutTemplates.
 */
export interface DaySpecificSkeleton {
  dayType: string;
  name: string;
  coreSlots: WorkoutSlot[];
  accessoryPool: WorkoutSlot[];
}

/**
 * Day-Specific Workout Skeletons Dictionary
 */
export const DAY_SPECIFIC_SKELETONS: Record<string, DaySpecificSkeleton> = {
  'push': {
    dayType: 'push',
    name: 'Push Day',
    coreSlots: [
      {
        slotId: 'push_core_1',
        movementPattern: 'horizontal_press',
        slotType: 'compound',
        targetSets: 4,
        targetReps: '6-10',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'push_core_2',
        movementPattern: 'vertical_press',
        slotType: 'compound',
        targetSets: 3,
        targetReps: '8-12',
        exerciseType: 'weight_reps'
      }
    ],
    accessoryPool: [
      {
        slotId: 'push_acc_1',
        movementPattern: 'tricep_extension',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '10-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'push_acc_2',
        movementPattern: 'lateral_raise',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '12-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'push_acc_3',
        movementPattern: 'horizontal_adduction',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '10-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'push_acc_4',
        movementPattern: 'core',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '45-60s',
        exerciseType: 'timed'
      }
    ]
  },
  'pull': {
    dayType: 'pull',
    name: 'Pull Day',
    coreSlots: [
      {
        slotId: 'pull_core_1',
        movementPattern: 'horizontal_pull',
        slotType: 'compound',
        targetSets: 4,
        targetReps: '6-10',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'pull_core_2',
        movementPattern: 'vertical_pull',
        slotType: 'compound',
        targetSets: 3,
        targetReps: '6-12',
        exerciseType: 'reps_only'
      }
    ],
    accessoryPool: [
      {
        slotId: 'pull_acc_1',
        movementPattern: 'bicep_curl',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '10-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'pull_acc_2',
        movementPattern: 'horizontal_abduction',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '12-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'pull_acc_3',
        movementPattern: 'shrug',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '12-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'pull_acc_4',
        movementPattern: 'core',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '10-15',
        exerciseType: 'reps_only'
      }
    ]
  },
  'legs': {
    dayType: 'legs',
    name: 'Legs Day',
    coreSlots: [
      {
        slotId: 'legs_core_1',
        movementPattern: 'squat',
        slotType: 'compound',
        targetSets: 4,
        targetReps: '8-12',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'legs_core_2',
        movementPattern: 'hinge',
        slotType: 'compound',
        targetSets: 3,
        targetReps: '8-12',
        exerciseType: 'weight_reps'
      }
    ],
    accessoryPool: [
      {
        slotId: 'legs_acc_1',
        movementPattern: 'lunge',
        slotType: 'compound',
        targetSets: 3,
        targetReps: '10-15',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'legs_acc_2',
        movementPattern: 'plantar_flexion',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '12-20',
        exerciseType: 'weight_reps'
      },
      {
        slotId: 'legs_acc_3',
        movementPattern: 'core',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '30-45s',
        exerciseType: 'timed'
      },
      {
        slotId: 'legs_acc_4',
        movementPattern: 'knee_flexion',
        slotType: 'isolation',
        targetSets: 3,
        targetReps: '12-15',
        exerciseType: 'weight_reps'
      }
    ]
  }
};
export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
 dayRotation: string[];
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
   dayRotation: ['push', 'pull', 'legs'],
    workouts: [
      {
        day: 'Workout A',
        name: 'Workout A - Push Focus',
        coreSlots: [
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
          }
        ],
        accessoryPool: [
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
          },
          {
            slotId: 'a7',
            movementPattern: 'horizontal_adduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Workout B',
        name: 'Workout B - Pull Focus',
        coreSlots: [
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
          }
        ],
        accessoryPool: [
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
          },
          {
            slotId: 'b7',
            movementPattern: 'shrug',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Workout C',
        name: 'Workout C - Lower Focus',
        coreSlots: [
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
          }
        ],
        accessoryPool: [
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
          },
          {
            slotId: 'c7',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
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
 * Utility function to get day-specific skeleton by day type
 */
export function getDaySpecificSkeleton(dayType: string): DaySpecificSkeleton | null {
  return DAY_SPECIFIC_SKELETONS[dayType] || null;
}
/**
 * Utility function to get all available templates
 */
export function getAllTemplates(): WorkoutTemplate[] {
  return Object.values(WORKOUT_TEMPLATES);
}