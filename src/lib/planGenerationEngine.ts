/**
 * Plan Generation Engine
 * 
 * This module handles the core logic for generating personalized workout plans
 * based on user-selected templates and available equipment.
 */

import { EXERCISE_DICTIONARY, getExercisesByMovementPattern } from '../data/exerciseDictionary';
import { getTemplateById, type WorkoutTemplate, type WorkoutSlot } from '../data/workoutTemplates';
import type { Exercise, WorkoutPlan, TrainingLevel, WorkoutDay } from '../data/workoutData';

export type VolumeLevel = 'short' | 'standard' | 'long';

export interface GenerationOptions {
  templateId: string;
  selectedEquipment: string[];
  volume: VolumeLevel;
  excludeExerciseIds?: string[]; // For level up variety
  planName?: string; // Custom name for the generated plan
}

export interface GeneratedPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  templateId: string; // Reference to the template used
  levels: TrainingLevel[];
}

/**
 * Main function to generate a complete workout plan
 */
export function generateWorkoutPlan(options: GenerationOptions): GeneratedPlan | null {
  const { templateId, selectedEquipment, volume, excludeExerciseIds = [], planName } = options;
  
  // Get the template
  const template = getTemplateById(templateId);
  if (!template) {
    console.error(`Template not found: ${templateId}`);
    return null;
  }

  // Generate Level 1 workouts
  const generatedWorkouts: Record<string, WorkoutDay> = {};
  
  for (const workoutSkeleton of template.workouts) {
    const exercises: Exercise[] = [];
    
    // Always include all core slots
    for (const slot of workoutSkeleton.coreSlots) {
      const selectedExercise = selectExerciseForSlot(slot, selectedEquipment, excludeExerciseIds);
      
      if (!selectedExercise) {
        console.warn(`No suitable exercise found for core slot ${slot.slotId} with pattern ${slot.movementPattern}`);
        continue;
      }
      
      exercises.push({
        id: selectedExercise.id,
        sets: slot.targetSets,
        reps: slot.targetReps,
        type: slot.exerciseType
      });
    }
    
    // Add accessories based on volume selection
    const accessoryCount = getAccessoryCount(volume);
    const selectedAccessories = selectAccessoryExercises(
      workoutSkeleton.accessoryPool, 
      selectedEquipment, 
      excludeExerciseIds, 
      accessoryCount
    );
    
    for (const accessoryExercise of selectedAccessories) {
      exercises.push(accessoryExercise);
    }
    
    generatedWorkouts[workoutSkeleton.day] = {
      name: workoutSkeleton.name,
      exercises
    };
  }

  // Create the generated plan
  const generatedPlan: GeneratedPlan = {
    id: `generated_${Date.now()}`, // Unique ID for this generated plan
    name: planName || `My ${template.name}`,
    description: `Personalized ${template.description.toLowerCase()} generated based on your available equipment and ${volume} workout preference.`,
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    templateId,
    levels: [
      {
        level: 1,
        name: "Custom Level 1",
        description: `Your personalized ${volume} training program based on available equipment.`,
        workouts: generatedWorkouts
      }
    ]
  };

  return generatedPlan;
}

/**
 * Get the number of accessory exercises based on volume level
 */
function getAccessoryCount(volume: VolumeLevel): number {
  switch (volume) {
    case 'short': return 1;
    case 'standard': return 2;
    case 'long': return 4;
    default: return 2;
  }
}

/**
 * Select accessory exercises from the pool
 */
function selectAccessoryExercises(
  accessoryPool: WorkoutSlot[],
  selectedEquipment: string[],
  excludeExerciseIds: string[],
  count: number
): Exercise[] {
  const availableAccessories: Exercise[] = [];
  
  // Filter accessories by equipment availability
  for (const slot of accessoryPool) {
    const selectedExercise = selectExerciseForSlot(slot, selectedEquipment, excludeExerciseIds);
    
    if (selectedExercise) {
      availableAccessories.push({
        id: selectedExercise.id,
        sets: slot.targetSets,
        reps: slot.targetReps,
        type: slot.exerciseType
      });
    }
  }
  
  // Shuffle and select the requested count
  const shuffled = [...availableAccessories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Select an appropriate exercise for a given slot
 */
function selectExerciseForSlot(
  slot: WorkoutSlot, 
  selectedEquipment: string[], 
  excludeExerciseIds: string[]
): { id: string } | null {
  // Get all exercises matching the movement pattern
  const candidateExercises = getExercisesByMovementPattern(slot.movementPattern);
  
  // Filter by exercise type (compound/isolation)
  const typeFilteredExercises = candidateExercises.filter(
    exercise => exercise.exerciseType === slot.slotType
  );
  
  // Filter by equipment availability (inclusive filtering)
  const equipmentFilteredExercises = typeFilteredExercises.filter(exercise => 
    exercise.equipment.every(requiredEquipment => 
      selectedEquipment.includes(requiredEquipment)
    )
  );
  
  // Filter out excluded exercises (for level up variety)
  const availableExercises = equipmentFilteredExercises.filter(
    exercise => !excludeExerciseIds.includes(exercise.id)
  );
  
  // If no exercises available after exclusion, fall back to all equipment-filtered exercises
  const finalCandidates = availableExercises.length > 0 ? availableExercises : equipmentFilteredExercises;
  
  if (finalCandidates.length === 0) {
    return null;
  }
  
  // Select a random exercise from the candidates
  const randomIndex = Math.floor(Math.random() * finalCandidates.length);
  const selectedExercise = finalCandidates[randomIndex];
  
  return { id: selectedExercise.id };
}

/**
 * Generate a new level for an existing plan (Level Up functionality)
 */
export function generateNextLevel(
  currentPlan: GeneratedPlan,
  selectedEquipment: string[],
  previousLevelExerciseIds: string[]
): TrainingLevel | null {
  const template = getTemplateById(currentPlan.templateId);
  if (!template) {
    console.error(`Template not found: ${currentPlan.templateId}`);
    return null;
  }

  const generatedWorkouts: Record<string, WorkoutDay> = {};
  
  for (const workoutSkeleton of template.workouts) {
    const exercises: Exercise[] = [];
    
    // Core exercises with increased sets
    for (const slot of workoutSkeleton.coreSlots) {
      const selectedExercise = selectExerciseForSlot(slot, selectedEquipment, previousLevelExerciseIds);
      
      if (!selectedExercise) {
        console.warn(`No suitable exercise found for slot ${slot.slotId} with pattern ${slot.movementPattern}`);
        continue;
      }
      
      exercises.push({
        id: selectedExercise.id,
        sets: slot.targetSets + 1, // Increase sets for progression
        reps: slot.targetReps,
        type: slot.exerciseType
      });
    }
    
    // Add more accessories for progression (standard volume + 1)
    const selectedAccessories = selectAccessoryExercises(
      workoutSkeleton.accessoryPool, 
      selectedEquipment, 
      previousLevelExerciseIds, 
      3 // Standard + 1 for progression
    );
    
    for (const accessoryExercise of selectedAccessories) {
      exercises.push({
        ...accessoryExercise,
        sets: accessoryExercise.sets + 1 // Increase sets for accessories too
      });
    }
    
    generatedWorkouts[workoutSkeleton.day] = {
      name: workoutSkeleton.name,
      exercises
    };
  }

  const nextLevelNumber = currentPlan.levels.length + 1;
  
  return {
    level: nextLevelNumber,
    name: `Custom Level ${nextLevelNumber}`,
    description: `Advanced progression with increased volume and exercise variety.`,
    workouts: generatedWorkouts
  };
}

/**
 * Get all available equipment options from the exercise dictionary
 */
export function getAllAvailableEquipment(): string[] {
  const equipmentSet = new Set<string>();
  
  Object.values(EXERCISE_DICTIONARY).forEach(exercise => {
    exercise.equipment.forEach(equipment => {
      equipmentSet.add(equipment);
    });
  });
  
  return Array.from(equipmentSet).sort();
}

/**
 * Get user-friendly equipment names
 */
export function getEquipmentDisplayName(equipment: string): string {
  const displayNames: Record<string, string> = {
    'bodyweight': 'Bodyweight',
    'dumbbell': 'Dumbbells',
    'barbell': 'Barbell',
    'bench': 'Bench',
    'incline_bench': 'Incline Bench',
    'decline_bench': 'Decline Bench',
    'pullup_bar': 'Pull-up Bar',
    'chair': 'Chair',
    'dip_station': 'Dip Station',
    'cable_machine': 'Cable Machine',
    'leg_curl_machine': 'Leg Curl Machine',
    'calf_raise_machine': 'Calf Raise Machine',
    'squat_rack': 'Squat Rack',
    'weight': 'Additional Weight',
    'preacher_bench': 'Preacher Bench'
  };
  
  return displayNames[equipment] || equipment.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Get volume level display information
 */
export function getVolumeDisplayInfo(volume: VolumeLevel): { name: string; description: string; duration: string } {
  switch (volume) {
    case 'short':
      return {
        name: 'Short',
        description: 'Quick and efficient workouts for busy schedules',
        duration: '~30-40 minutes'
      };
    case 'standard':
      return {
        name: 'Standard',
        description: 'Balanced workouts with optimal muscle development',
        duration: '~45-55 minutes'
      };
    case 'long':
      return {
        name: 'Long',
        description: 'Comprehensive sessions for maximum muscle growth',
        duration: '~60+ minutes'
      };
    default:
      return {
        name: 'Standard',
        description: 'Balanced workouts with optimal muscle development',
        duration: '~45-55 minutes'
      };
  }
}