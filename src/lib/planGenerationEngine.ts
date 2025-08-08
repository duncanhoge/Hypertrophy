/**
 * Plan Generation Engine
 * 
 * This module handles the core logic for generating personalized workout plans
 * based on user-selected templates and available equipment.
 */

import { EXERCISE_DICTIONARY, getExercisesByMovementPattern } from '../data/exerciseDictionary';
import { getTemplateById, getDaySpecificSkeleton, type WorkoutTemplate, type WorkoutSlot, type DaySpecificSkeleton } from '../data/workoutTemplates';
import type { Exercise, WorkoutPlan, TrainingLevel, WorkoutDay } from '../data/workoutData';

export type VolumeLevel = 'short' | 'standard' | 'long';

export interface GenerationOptions {
  templateId: string;
  selectedEquipment: string[];
  tuBudget: number;
  excludeExerciseIds?: string[]; // For level up variety
  planName?: string; // Custom name for the generated plan
}

export interface GeneratedPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  templateId: string; // Reference to the template used
  tuBudget: number; // TU budget used for generation
  selectedEquipment: string[]; // Equipment used for generation
  levels: TrainingLevel[];
}

/**
 * Convert volume level to TU budget
 */
function getVolumeTuBudget(volume: VolumeLevel): number {
  switch (volume) {
    case 'short': return 11;
    case 'standard': return 15;
    case 'long': return 19;
    default: return 15;
  }
}

/**
 * Main function to generate a complete workout plan
 */
export function generateWorkoutPlan(options: GenerationOptions): GeneratedPlan | null {
  const { templateId, selectedEquipment, tuBudget, excludeExerciseIds = [], planName } = options;
  
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
    
    // Calculate current TU count from core exercises
    let currentTuCount = 0;
    for (const exercise of exercises) {
      const exerciseDefinition = EXERCISE_DICTIONARY[exercise.id];
      if (exerciseDefinition) {
        currentTuCount += exerciseDefinition.timeUnits;
      }
    }
    
    // Add accessories based on TU budget
    const selectedAccessories = selectAccessoriesByTuBudget(
      workoutSkeleton.accessoryPool,
      selectedEquipment,
      excludeExerciseIds,
      tuBudget,
      currentTuCount
    );
    
    for (const accessoryExercise of selectedAccessories) {
      exercises.push(accessoryExercise);
      const exerciseDefinition = EXERCISE_DICTIONARY[accessoryExercise.id];
      if (exerciseDefinition) {
        currentTuCount += exerciseDefinition.timeUnits;
      }
    }
    
    // Log the final TU count for validation
    console.log(`Generated workout "${workoutSkeleton.day}" with ${currentTuCount} TUs (budget: ${tuBudget})`);
    
    generatedWorkouts[workoutSkeleton.day] = {
      name: workoutSkeleton.name,
      exercises
    };
  }

  // Create the generated plan
  const generatedPlan: GeneratedPlan = {
    id: `generated_${Date.now()}`, // Unique ID for this generated plan
    name: planName || `My ${template.name}`,
    description: `Personalized ${template.description.toLowerCase()} generated based on your available equipment and workout preferences.`,
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    templateId,
    tuBudget,
    selectedEquipment,
    levels: [
      {
        level: 1,
        name: "Custom Level 1",
        description: `Your personalized training program based on available equipment.`,
        workouts: generatedWorkouts
      }
    ]
  };

  return generatedPlan;
}

/**
 * Select accessory exercises based on TU budget
 */
function selectAccessoriesByTuBudget(
  accessoryPool: WorkoutSlot[],
  selectedEquipment: string[],
  excludeExerciseIds: string[],
  tuBudget: number,
  currentTuCount: number
): Exercise[] {
  const selectedAccessories: Exercise[] = [];
  let remainingBudget = tuBudget - currentTuCount;
  
  // Create a shuffled list of available accessories
  const availableSlots = [...accessoryPool].sort(() => Math.random() - 0.5);
  
  // Iteratively select accessories that fit within budget
  for (const slot of availableSlots) {
    const selectedExercise = selectExerciseForSlot(slot, selectedEquipment, excludeExerciseIds);
    
    if (selectedExercise) {
      const exerciseDefinition = EXERCISE_DICTIONARY[selectedExercise.id];
      
      if (exerciseDefinition && exerciseDefinition.timeUnits <= remainingBudget) {
        selectedAccessories.push({
          id: selectedExercise.id,
          sets: slot.targetSets,
          reps: slot.targetReps,
          type: slot.exerciseType
        });
        
        remainingBudget -= exerciseDefinition.timeUnits;
      }
    }
  }
  
  return selectedAccessories;
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
 * Generate a new level for an existing plan using day-specific skeletons
 */
export function generateNextLevel(
  currentPlan: GeneratedPlan,
  previousLevelExerciseIds: string[],
  volume?: VolumeLevel
): TrainingLevel | null {
  const template = getTemplateById(currentPlan.templateId);
  if (!template) {
    console.error(`Template not found: ${currentPlan.templateId}`);
    return null;
  }

  // Use stored equipment and volume from the current plan
  const selectedEquipment = currentPlan.selectedEquipment;
  const planVolume = volume || currentPlan.volume;
  
  // Use dayRotation to generate workouts
  if (!template.dayRotation || template.dayRotation.length === 0) {
    console.error(`Template ${currentPlan.templateId} missing dayRotation`);
    return null;
  }
  
  const generatedWorkouts: Record<string, WorkoutDay> = {};
  
  // Generate workouts based on dayRotation
  template.dayRotation.forEach((dayType, index) => {
    const daySpecificSkeleton = getDaySpecificSkeleton(dayType);
    if (!daySpecificSkeleton) {
      console.warn(`Day-specific skeleton not found for dayType: ${dayType}`);
      return;
    }
    
    const workoutName = `Workout ${String.fromCharCode(65 + index)}`;
    const dayName = `${daySpecificSkeleton.name}: Level ${currentPlan.levels.length + 1}`;
    
    const exercises: Exercise[] = [];
    
    // Core exercises with increased sets
    for (const slot of daySpecificSkeleton.coreSlots) {
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
    
    // Add accessories based on volume
    const accessoryCount = getAccessoryCount(planVolume);
    const selectedAccessories = selectAccessoryExercises(
      daySpecificSkeleton.accessoryPool, 
      selectedEquipment, 
      previousLevelExerciseIds, 
      accessoryCount
    );
    
    for (const accessoryExercise of selectedAccessories) {
      exercises.push({
        ...accessoryExercise,
        sets: accessoryExercise.sets + 1 // Increase sets for accessories too
      });
    }
    
    generatedWorkouts[workoutName] = {
      name: dayName,
      exercises
    };
  });

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

function getAccessoryCount(volume: VolumeLevel): number {
  switch (volume) {
    case 'short': return 2;
    case 'standard': return 3;
    case 'long': return 4;
    default: return 3;
  }
}

function selectAccessoryExercises(
  accessoryPool: WorkoutSlot[],
  selectedEquipment: string[],
  excludeExerciseIds: string[],
  count: number
): Exercise[] {
  const selectedAccessories: Exercise[] = [];
  const availableSlots = [...accessoryPool].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, availableSlots.length); i++) {
    const slot = availableSlots[i];
    const selectedExercise = selectExerciseForSlot(slot, selectedEquipment, excludeExerciseIds);
    
    if (selectedExercise) {
      selectedAccessories.push({
        id: selectedExercise.id,
        sets: slot.targetSets,
        reps: slot.targetReps,
        type: slot.exerciseType
      });
    }
  }
  
  return selectedAccessories;
}