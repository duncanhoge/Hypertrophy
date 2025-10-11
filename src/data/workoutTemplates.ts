/**
 * Workout Templates - Blueprint System for Plan Generation
 * 
 * This file defines the templates used by the Plan Generation Engine to create
 * personalized workout plans based on user goals and available equipment.
 */

export interface WorkoutSlot {
  slotId: string;
  movementPattern: string;
  slotType: 'compound' | 'isolation' | 'core';
  targetSets: number;
  targetReps: string;
  exerciseType: 'weight_reps' | 'reps_only' | 'reps_only_with_optional_weight' | 'timed';
}

export interface SupersetSlot {
  slotId: string;
  isSuperset: true;
  slotA: WorkoutSlot;
  slotB: WorkoutSlot;
}

export type WorkoutSlotOrSuperset = WorkoutSlot | SupersetSlot;

export function isSupersetSlot(slot: WorkoutSlotOrSuperset): slot is SupersetSlot {
  return 'isSuperset' in slot && slot.isSuperset === true;
}

export interface WorkoutSkeleton {
  day: string;
  name: string;
  coreSlots: WorkoutSlotOrSuperset[];
  accessoryPool: WorkoutSlotOrSuperset[];
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
  coreSlots: WorkoutSlotOrSuperset[];
  accessoryPool: WorkoutSlotOrSuperset[];
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
        slotType: 'core',
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
        slotType: 'core',
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
        slotType: 'core',
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
  weeklySchedule: string;
  tags: string[];
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
    description: 'A balanced 3-day program hitting all major muscle groups each session with optimal frequency for muscle growth.',
    weeklySchedule: '3 Days / Week',
    tags: ['Full Body', 'Hypertrophy', 'Balanced'],
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
            slotType: 'core',
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
            slotType: 'core',
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
            slotType: 'core',
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
  },
  'push_pull_legs_3day': {
    id: 'push_pull_legs_3day',
    name: 'Push/Pull/Legs',
    description: 'A logical and synergistic split, grouping muscles by their function for efficient workouts and great recovery.',
    weeklySchedule: '3 Days / Week',
    tags: ['Functional', 'Strength', 'Classic'],
    daysPerWeek: 3,
    dayRotation: ['push', 'pull', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Push',
        coreSlots: [
          {
            slotId: 'push_1',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'push_2',
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
          }
        ]
      },
      {
        day: 'Day 2',
        name: 'Day 2 - Pull',
        coreSlots: [
          {
            slotId: 'pull_1',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'pull_2',
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
          }
        ]
      },
      {
        day: 'Day 3',
        name: 'Day 3 - Legs',
        coreSlots: [
          {
            slotId: 'legs_1',
            movementPattern: 'squat',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'legs_2',
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
            slotType: 'core',
            targetSets: 3,
            targetReps: '30-45s',
            exerciseType: 'timed'
          }
        ]
      }
    ]
  },
  'hypertrophy_superset_3day': {
    id: 'hypertrophy_superset_3day',
    name: 'Hypertrophy Superset',
    description: 'A time-efficient, high-intensity workout. Pair different muscle groups to maximize metabolic stress and muscle growth with minimal rest.',
    weeklySchedule: '3 Days / Week',
    tags: ['High Intensity', 'Time-Efficient', 'Hypertrophy'],
    daysPerWeek: 3,
    dayRotation: ['push', 'pull', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Push Superset',
        coreSlots: [
          {
            slotId: 'superset_push_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_push_1a',
              movementPattern: 'horizontal_press',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_push_1b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 4,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          },
          {
            slotId: 'superset_push_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_push_2a',
              movementPattern: 'vertical_press',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_push_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'superset_push_acc_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_push_acc_1a',
              movementPattern: 'tricep_extension',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_push_acc_1b',
              movementPattern: 'lateral_raise',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'superset_push_acc_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_push_acc_2a',
              movementPattern: 'horizontal_adduction',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_push_acc_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          }
        ]
      },
      {
        day: 'Day 2',
        name: 'Day 2 - Pull Superset',
        coreSlots: [
          {
            slotId: 'superset_pull_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_pull_1a',
              movementPattern: 'horizontal_pull',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_pull_1b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 4,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          },
          {
            slotId: 'superset_pull_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_pull_2a',
              movementPattern: 'vertical_pull',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '8-12',
              exerciseType: 'reps_only'
            },
            slotB: {
              slotId: 'superset_pull_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'superset_pull_acc_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_pull_acc_1a',
              movementPattern: 'bicep_curl',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_pull_acc_1b',
              movementPattern: 'horizontal_abduction',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'superset_pull_acc_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_pull_acc_2a',
              movementPattern: 'shrug',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_pull_acc_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          }
        ]
      },
      {
        day: 'Day 3',
        name: 'Day 3 - Legs Superset',
        coreSlots: [
          {
            slotId: 'superset_legs_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_legs_1a',
              movementPattern: 'squat',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_legs_1b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '45-60s',
              exerciseType: 'timed'
            }
          },
          {
            slotId: 'superset_legs_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_legs_2a',
              movementPattern: 'hinge',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_legs_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'superset_legs_acc_1',
            isSuperset: true,
            slotA: {
              slotId: 'superset_legs_acc_1a',
              movementPattern: 'lunge',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'superset_legs_acc_1b',
              movementPattern: 'plantar_flexion',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'superset_legs_acc_2',
            isSuperset: true,
            slotA: {
              slotId: 'superset_legs_acc_2a',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            },
            slotB: {
              slotId: 'superset_legs_acc_2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          }
        ]
      }
    ]
  },
  'upper_lower_4day': {
    id: 'upper_lower_4day',
    name: 'Upper/Lower Split',
    description: 'The perfect balance of frequency and volume, hitting every muscle group twice a week for optimal growth and strength.',
    weeklySchedule: '4 Days / Week',
    tags: ['Strength', 'Hypertrophy', 'Classic'],
    daysPerWeek: 4,
    dayRotation: ['push', 'legs', 'pull', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Upper A',
        coreSlots: [
          {
            slotId: 'upper_a_1',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_a_2',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_a_3',
            movementPattern: 'vertical_press',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'upper_a_acc_1',
            movementPattern: 'lateral_raise',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_a_acc_2',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_a_acc_3',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Day 2',
        name: 'Day 2 - Lower A',
        coreSlots: [
          {
            slotId: 'lower_a_1',
            movementPattern: 'squat',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_a_2',
            movementPattern: 'hinge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'lower_a_acc_1',
            movementPattern: 'lunge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_a_acc_2',
            movementPattern: 'plantar_flexion',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-20',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_a_acc_3',
            movementPattern: 'core',
            slotType: 'core',
            targetSets: 3,
            targetReps: '30-45s',
            exerciseType: 'timed'
          }
        ]
      },
      {
        day: 'Day 3',
        name: 'Day 3 - Upper B',
        coreSlots: [
          {
            slotId: 'upper_b_1',
            movementPattern: 'vertical_pull',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-12',
            exerciseType: 'reps_only'
          },
          {
            slotId: 'upper_b_2',
            movementPattern: 'vertical_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_b_3',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'upper_b_acc_1',
            movementPattern: 'horizontal_adduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_b_acc_2',
            movementPattern: 'horizontal_abduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'upper_b_acc_3',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Day 4',
        name: 'Day 4 - Lower B',
        coreSlots: [
          {
            slotId: 'lower_b_1',
            movementPattern: 'hinge',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_b_2',
            movementPattern: 'squat',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'lower_b_acc_1',
            movementPattern: 'knee_flexion',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_b_acc_2',
            movementPattern: 'plantar_flexion',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '15-20',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'lower_b_acc_3',
            movementPattern: 'core',
            slotType: 'core',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'reps_only'
          }
        ]
      }
    ]
  },
  'bodybuilder_split_4day': {
    id: 'bodybuilder_split_4day',
    name: 'The Bodybuilder Split',
    description: 'The classic bro split. Focus on one major muscle group per day for maximum volume, pump, and muscle isolation.',
    weeklySchedule: '4 Days / Week',
    tags: ['Hypertrophy', 'Isolation', 'High Volume'],
    daysPerWeek: 4,
    dayRotation: ['push', 'pull', 'push', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Chest & Triceps',
        coreSlots: [
          {
            slotId: 'chest_tri_1',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'chest_tri_2',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'chest_tri_acc_1',
            movementPattern: 'horizontal_adduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'chest_tri_acc_2',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'chest_tri_acc_3',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Day 2',
        name: 'Day 2 - Back & Biceps',
        coreSlots: [
          {
            slotId: 'back_bi_1',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'back_bi_2',
            movementPattern: 'vertical_pull',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '8-12',
            exerciseType: 'reps_only'
          }
        ],
        accessoryPool: [
          {
            slotId: 'back_bi_acc_1',
            movementPattern: 'horizontal_pull',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'back_bi_acc_2',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'back_bi_acc_3',
            movementPattern: 'bicep_curl',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Day 3',
        name: 'Day 3 - Shoulders',
        coreSlots: [
          {
            slotId: 'shoulders_1',
            movementPattern: 'vertical_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '8-12',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'shoulders_2',
            movementPattern: 'lateral_raise',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ],
        accessoryPool: [
          {
            slotId: 'shoulders_acc_1',
            movementPattern: 'horizontal_abduction',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'shoulders_acc_2',
            movementPattern: 'lateral_raise',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '15-20',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'shoulders_acc_3',
            movementPattern: 'shrug',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '12-15',
            exerciseType: 'weight_reps'
          }
        ]
      },
      {
        day: 'Day 4',
        name: 'Day 4 - Legs & Core',
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
            slotId: 'legs_core_acc_1',
            movementPattern: 'lunge',
            slotType: 'compound',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'legs_core_acc_2',
            movementPattern: 'plantar_flexion',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '15-20',
            exerciseType: 'weight_reps'
          },
          {
            slotId: 'legs_core_acc_3',
            movementPattern: 'core',
            slotType: 'core',
            targetSets: 3,
            targetReps: '45-60s',
            exerciseType: 'timed'
          }
        ]
      }
    ]
  },
  'antagonistic_superset': {
    id: 'antagonistic_superset',
    name: 'Antagonistic Superset',
    description: 'A high-intensity workout that pairs opposing muscle groups (like Chest & Back or Biceps & Triceps). This technique increases workout density and delivers a unique muscle pump.',
    weeklySchedule: '4 Days / Week',
    tags: ['High Intensity', 'Body Part Focus', 'Advanced'],
    daysPerWeek: 4,
    dayRotation: ['push', 'pull', 'push', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Chest & Back',
        coreSlots: [
          {
            slotId: 'chest_back_ss1',
            isSuperset: true,
            slotA: {
              slotId: 'chest_back_ss1a',
              movementPattern: 'horizontal_press',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'chest_back_ss1b',
              movementPattern: 'horizontal_pull',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'chest_back_ss2',
            isSuperset: true,
            slotA: {
              slotId: 'chest_back_ss2a',
              movementPattern: 'horizontal_press',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'chest_back_ss2b',
              movementPattern: 'vertical_pull',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '8-12',
              exerciseType: 'reps_only'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'chest_back_acc1',
            isSuperset: true,
            slotA: {
              slotId: 'chest_back_acc1a',
              movementPattern: 'horizontal_adduction',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'chest_back_acc1b',
              movementPattern: 'horizontal_pull',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'chest_back_acc2',
            isSuperset: true,
            slotA: {
              slotId: 'chest_back_acc2a',
              movementPattern: 'horizontal_press',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'chest_back_acc2b',
              movementPattern: 'horizontal_abduction',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            }
          }
        ]
      },
      {
        day: 'Day 2',
        name: 'Day 2 - Shoulders & Core',
        coreSlots: [
          {
            slotId: 'shoulders_core_ss1',
            isSuperset: true,
            slotA: {
              slotId: 'shoulders_core_ss1a',
              movementPattern: 'vertical_press',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'shoulders_core_ss1b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 4,
              targetReps: '45-60s',
              exerciseType: 'timed'
            }
          },
          {
            slotId: 'shoulders_core_ss2',
            isSuperset: true,
            slotA: {
              slotId: 'shoulders_core_ss2a',
              movementPattern: 'lateral_raise',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'shoulders_core_ss2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'shoulders_core_acc1',
            isSuperset: true,
            slotA: {
              slotId: 'shoulders_core_acc1a',
              movementPattern: 'horizontal_abduction',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'shoulders_core_acc1b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          },
          {
            slotId: 'shoulders_core_acc2',
            isSuperset: true,
            slotA: {
              slotId: 'shoulders_core_acc2a',
              movementPattern: 'front_raise',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'shoulders_core_acc2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'reps_only'
            }
          }
        ]
      },
      {
        day: 'Day 3',
        name: 'Day 3 - Legs',
        coreSlots: [
          {
            slotId: 'legs_ss1',
            isSuperset: true,
            slotA: {
              slotId: 'legs_ss1a',
              movementPattern: 'squat',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'legs_ss1b',
              movementPattern: 'hinge',
              slotType: 'compound',
              targetSets: 4,
              targetReps: '8-12',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'legs_ss2',
            isSuperset: true,
            slotA: {
              slotId: 'legs_ss2a',
              movementPattern: 'lunge',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'legs_ss2b',
              movementPattern: 'knee_flexion',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'legs_acc1',
            isSuperset: true,
            slotA: {
              slotId: 'legs_acc1a',
              movementPattern: 'squat',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'legs_acc1b',
              movementPattern: 'hinge',
              slotType: 'compound',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'legs_acc2',
            isSuperset: true,
            slotA: {
              slotId: 'legs_acc2a',
              movementPattern: 'plantar_flexion',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'legs_acc2b',
              movementPattern: 'core',
              slotType: 'core',
              targetSets: 3,
              targetReps: '30-45s',
              exerciseType: 'timed'
            }
          }
        ]
      },
      {
        day: 'Day 4',
        name: 'Day 4 - Arms',
        coreSlots: [
          {
            slotId: 'arms_ss1',
            isSuperset: true,
            slotA: {
              slotId: 'arms_ss1a',
              movementPattern: 'bicep_curl',
              slotType: 'isolation',
              targetSets: 4,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'arms_ss1b',
              movementPattern: 'tricep_extension',
              slotType: 'isolation',
              targetSets: 4,
              targetReps: '10-15',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'arms_ss2',
            isSuperset: true,
            slotA: {
              slotId: 'arms_ss2a',
              movementPattern: 'hammer_curl',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'arms_ss2b',
              movementPattern: 'horizontal_extension',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          }
        ],
        accessoryPool: [
          {
            slotId: 'arms_acc1',
            isSuperset: true,
            slotA: {
              slotId: 'arms_acc1a',
              movementPattern: 'bicep_curl',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'arms_acc1b',
              movementPattern: 'vertical_extension',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '12-15',
              exerciseType: 'weight_reps'
            }
          },
          {
            slotId: 'arms_acc2',
            isSuperset: true,
            slotA: {
              slotId: 'arms_acc2a',
              movementPattern: 'bicep_curl',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            },
            slotB: {
              slotId: 'arms_acc2b',
              movementPattern: 'tricep_extension',
              slotType: 'isolation',
              targetSets: 3,
              targetReps: '15-20',
              exerciseType: 'weight_reps'
            }
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