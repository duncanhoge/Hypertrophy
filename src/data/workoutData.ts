import { getExerciseById } from './exerciseDictionary';

export const REST_DURATION_SECONDS = 90; // Default rest time

export interface Exercise {
  id: string;
  sets: number;
  reps: string;
  notes?: string;
  type: string;
}

export interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

export interface TrainingLevel {
  level: number;
  name: string;
  description: string;
  workouts: Record<string, WorkoutDay>;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  levels: TrainingLevel[];
}

/**
 * Enhanced Exercise interface that includes dictionary data
 */
export interface EnhancedExercise extends Exercise {
  name: string;
  primaryMuscle?: string;
  secondaryMuscle?: string[];
  equipment?: string[];
  movementPattern?: string;
  alternatives?: string[];
  description?: string;
}

/**
 * Utility function to get enhanced exercise data
 */
export function getEnhancedExercise(exercise: Exercise): EnhancedExercise {
  const dictionaryEntry = getExerciseById(exercise.id);
  
  return {
    ...exercise,
    name: dictionaryEntry?.name || `Exercise ${exercise.id}`,
    primaryMuscle: dictionaryEntry?.primaryMuscle,
    secondaryMuscle: dictionaryEntry?.secondaryMuscle,
    equipment: dictionaryEntry?.equipment,
    movementPattern: dictionaryEntry?.movementPattern,
    alternatives: dictionaryEntry?.alternatives,
    description: exercise.notes || dictionaryEntry?.description || '',
  };
}

/**
 * Get current level workouts for a plan
 */
export function getCurrentLevelWorkouts(plan: WorkoutPlan, levelIndex: number = 0): Record<string, WorkoutDay> {
  const level = plan.levels[levelIndex];
  return level ? level.workouts : {};
}

/**
 * Get current level info for a plan
 */
export function getCurrentLevel(plan: WorkoutPlan, levelIndex: number = 0): TrainingLevel | null {
  return plan.levels[levelIndex] || null;
}

export const WORKOUT_PLANS: Record<string, WorkoutPlan> = {
  'test-plan': {
    id: 'test-plan',
    name: "Test Plan",
    description: "A test plan with one exercise of each type for UI testing and development purposes.",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    levels: [
      {
        level: 1,
        name: "UI Testing",
        description: "Test all exercise types and their user interfaces.",
        workouts: {
          'Test Day': {
            name: "Test Day - All Exercise Types",
            exercises: [
              { 
                id: "db_press_bench", 
                sets: 3, 
                reps: "8-12", 
                type: "weight_reps",
                notes: "Test exercise for Weight & Reps component - requires both weight and reps input"
              },
              { 
                id: "bw_pushup", 
                sets: 3, 
                reps: "AMRAP", 
                type: "reps_only",
                notes: "Test exercise for Repetition Based component - AMRAP style with reps input only"
              },
              { 
                id: "bw_plank", 
                sets: 3, 
                reps: "60s", 
                type: "timed",
                notes: "Test exercise for Timed component - duration input with integrated timer"
              }
            ]
          }
        }
      }
    ]
  },
  'duncans-plan': {
    id: 'duncans-plan',
    name: "Duncan's Plan",
    description: "A three-day split focusing on muscle hypertrophy with compound movements and isolation exercises.",
    image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    levels: [
      {
        level: 1,
        name: "Foundation",
        description: "Build your foundation with this comprehensive 3-day split program.",
        workouts: {
          Monday: {
            name: "Monday - Chest & Triceps Focus",
            exercises: [
              { id: "db_press_bench", sets: 4, reps: "6-12", type: "weight_reps" },
              { id: "db_press_incline", sets: 4, reps: "6-12", type: "weight_reps" },
              { id: "db_flyes", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bw_pushup", sets: 3, reps: "AMRAP", type: "reps_only" },
              { id: "db_extension_overhead", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_skullcrusher", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bw_dips_chair", sets: 3, reps: "AMRAP", type: "reps_only" },
            ]
          },
          Wednesday: {
            name: "Wednesday - Shoulders & Abs Focus",
            exercises: [
              { id: "db_press_overhead", sets: 4, reps: "6-12", type: "weight_reps" },
              { id: "db_raise_lateral", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_raise_front", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_flyes_reverse", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "bw_plank", sets: 3, reps: "30-60s", type: "timed" },
              { id: "bw_crunch", sets: 3, reps: "10-15", type: "reps_only_with_optional_weight" },
              { id: "bw_leg_raise", sets: 3, reps: "10-15", type: "reps_only" },
              { id: "bw_russian_twist", sets: 3, reps: "10-15", type: "reps_only_with_optional_weight" },
            ]
          },
          Friday: {
            name: "Friday - Arms & Secondary Chest",
            exercises: [
              { id: "db_curl_bicep", sets: 4, reps: "6-12", type: "weight_reps" },
              { id: "db_curl_hammer", sets: 3, reps: "6-12", type: "weight_reps" },
              { id: "db_curl_concentration", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_press_close_grip", sets: 3, reps: "6-12", type: "weight_reps" },
              { id: "db_kickback", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "bw_pushup_variations", sets: 3, reps: "AMRAP", type: "reps_only" },
              { id: "db_pullover", sets: 3, reps: "10-12", type: "weight_reps" },
            ]
          }
        }
      },
      {
        level: 2,
        name: "Intermediate",
        description: "Advance your training with increased volume and intensity for continued muscle growth.",
        workouts: {
          Monday: {
            name: "Monday - Chest & Triceps Intensified",
            exercises: [
              { id: "db_press_bench", sets: 5, reps: "6-10", type: "weight_reps" },
              { id: "db_press_incline", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "db_flyes", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "bw_pushup", sets: 4, reps: "AMRAP", type: "reps_only" },
              { id: "db_extension_overhead", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "db_skullcrusher", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "bw_dips_chair", sets: 4, reps: "AMRAP", type: "reps_only" },
              { id: "db_kickback", sets: 3, reps: "12-15", type: "weight_reps" },
            ]
          },
          Wednesday: {
            name: "Wednesday - Shoulders & Abs Advanced",
            exercises: [
              { id: "db_press_overhead", sets: 5, reps: "6-10", type: "weight_reps" },
              { id: "db_raise_lateral", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "db_raise_front", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "db_flyes_reverse", sets: 4, reps: "12-18", type: "weight_reps" },
              { id: "bw_plank", sets: 4, reps: "45-90s", type: "timed" },
              { id: "bw_crunch", sets: 4, reps: "15-25", type: "reps_only_with_optional_weight" },
              { id: "bw_leg_raise", sets: 4, reps: "12-20", type: "reps_only" },
              { id: "bw_russian_twist", sets: 4, reps: "15-25", type: "reps_only_with_optional_weight" },
              { id: "db_shrug_standing", sets: 3, reps: "12-15", type: "weight_reps" },
            ]
          },
          Friday: {
            name: "Friday - Arms & Secondary Chest Enhanced",
            exercises: [
              { id: "db_curl_bicep", sets: 5, reps: "6-10", type: "weight_reps" },
              { id: "db_curl_hammer", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "db_curl_concentration", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "db_press_close_grip", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "db_kickback", sets: 4, reps: "12-18", type: "weight_reps" },
              { id: "bw_pushup_variations", sets: 4, reps: "AMRAP", type: "reps_only" },
              { id: "db_pullover", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "db_curl_supinating", sets: 3, reps: "10-12", type: "weight_reps" },
            ]
          }
        }
      }
    ]
  },
  'muscle-fiber': {
    id: 'muscle-fiber',
    name: "Ryan's Plan",
    description: "A two-day foundational workout program focused on building muscle fiber and strength through compound movements.",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    levels: [
      {
        level: 1,
        name: "Foundation",
        description: "Build strength and muscle fiber with this foundational 2-day program.",
        workouts: {
          'Day 1': {
            name: "Day 1 - Full Body Foundation",
            exercises: [
              { id: "bb_squat", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bb_press_incline", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bb_row", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_shrug_standing", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_flyes_rear_delt", sets: 2, reps: "8-12", type: "weight_reps" },
              { id: "db_raise_lateral", sets: 2, reps: "8-12", type: "weight_reps" },
              { id: "db_curl_supinating", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bw_dips_weighted", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "calf_raise_seated", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bw_leg_raise_hanging", sets: 3, reps: "8-20", type: "reps_only" }
            ]
          },
          'Day 2': {
            name: "Day 2 - Strength Foundation",
            exercises: [
              { id: "bb_deadlift", sets: 3, reps: "4-8", type: "weight_reps" },
              { id: "leg_curl_lying", sets: 1, reps: "8-12", type: "weight_reps" },
              { id: "bb_shrug", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_press_flat", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_pullover", sets: 1, reps: "8-12", type: "weight_reps" },
              { id: "bw_chinup", sets: 2, reps: "6-12", type: "reps_only" },
              { id: "db_press_shoulder", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bb_curl", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "tricep_pressdown", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "calf_raise_standing", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "bw_situp_decline", sets: 3, reps: "30-100", type: "reps_only" }
            ]
          }
        }
      },
      {
        level: 2,
        name: "Strength Builder",
        description: "Intensify your training with heavier loads and advanced compound movements for maximum strength gains.",
        workouts: {
          'Day 1': {
            name: "Day 1 - Full Body Strength",
            exercises: [
              { id: "bb_squat", sets: 4, reps: "6-10", type: "weight_reps" },
              { id: "bb_press_incline", sets: 4, reps: "6-10", type: "weight_reps" },
              { id: "bb_row", sets: 4, reps: "6-10", type: "weight_reps" },
              { id: "db_shrug_standing", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "db_flyes_rear_delt", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "db_raise_lateral", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "db_curl_supinating", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "bw_dips_weighted", sets: 4, reps: "6-10", type: "weight_reps" },
              { id: "calf_raise_seated", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "bw_leg_raise_hanging", sets: 4, reps: "10-25", type: "reps_only" },
              { id: "db_press_overhead", sets: 3, reps: "8-12", type: "weight_reps" }
            ]
          },
          'Day 2': {
            name: "Day 2 - Power & Strength",
            exercises: [
              { id: "bb_deadlift", sets: 4, reps: "3-6", type: "weight_reps" },
              { id: "leg_curl_lying", sets: 2, reps: "10-15", type: "weight_reps" },
              { id: "bb_shrug", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "db_press_flat", sets: 4, reps: "6-10", type: "weight_reps" },
              { id: "db_pullover", sets: 2, reps: "10-15", type: "weight_reps" },
              { id: "bw_chinup", sets: 3, reps: "6-15", type: "reps_only" },
              { id: "db_press_shoulder", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "bb_curl", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "tricep_pressdown", sets: 4, reps: "8-12", type: "weight_reps" },
              { id: "calf_raise_standing", sets: 4, reps: "10-15", type: "weight_reps" },
              { id: "bw_situp_decline", sets: 4, reps: "40-120", type: "reps_only" },
              { id: "db_curl_hammer", sets: 3, reps: "10-12", type: "weight_reps" }
            ]
          }
        }
      }
    ]
  }
  },
  'back-arms-core-2day': {
    id: 'back-arms-core-2day',
    name: "Back & Arms Focus",
    description: "A 2-day per week program designed to build a strong back, muscular arms, and a stable core using only dumbbells and bodyweight.",
    image: "https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    levels: [
      {
        level: 1,
        name: "Foundation",
        description: "Build a strong foundation with targeted back, arms, and core development.",
        workouts: {
          'Workout A': {
            name: "Workout A - Back & Arms Power",
            exercises: [
              { id: "db_row_bent_over", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_pullover", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "db_curl_hammer", sets: 3, reps: "8-12", type: "weight_reps" },
              { id: "db_ext_overhead", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "bw_plank", sets: 3, reps: "60s", type: "timed" },
            ]
          },
          'Workout B': {
            name: "Workout B - Back & Arms Volume",
            exercises: [
              { id: "db_flyes_reverse", sets: 3, reps: "12-15", type: "weight_reps" },
              { id: "db_row_bent_over", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "db_curl_bicep", sets: 3, reps: "10-15", type: "weight_reps" },
              { id: "db_kickback", sets: 3, reps: "12-15", type: "weight_reps" },
              { id: "bw_leg_raises", sets: 3, reps: "15-20", type: "reps_only" },
            ]
          }
        }
      }
    ]
};