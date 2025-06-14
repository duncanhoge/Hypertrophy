/**
 * Exercise Dictionary - Centralized Exercise Data
 * 
 * This file serves as the single source of truth for all exercise definitions
 * in the Hypertrophy Hub application. Each exercise is defined with comprehensive
 * metadata to support current and future features.
 */

export interface ExerciseDefinition {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscle: string[];
  equipment: string[];
  movementPattern: string;
  alternatives: string[];
  description: string;
}

/**
 * Master Exercise Dictionary
 * 
 * Convention for IDs: [equipment]_[movement]_[name]
 * - Use lowercase with underscores
 * - Keep consistent and descriptive
 */
export const EXERCISE_DICTIONARY: Record<string, ExerciseDefinition> = {
  // Chest Exercises
  'db_press_bench': {
    id: 'db_press_bench',
    name: 'Dumbbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    alternatives: ['db_press_floor', 'db_press_incline', 'bw_pushup'],
    description: 'If no bench, perform Dumbbell Floor Press. Focus on squeezing the chest at the top.'
  },
  
  'db_press_incline': {
    id: 'db_press_incline',
    name: 'Dumbbell Incline Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'incline_bench'],
    movementPattern: 'incline_press',
    alternatives: ['db_press_bench', 'bw_pike_pushup'],
    description: 'If no incline bench, use pillows or perform Pike Push-ups.'
  },
  
  'db_flyes': {
    id: 'db_flyes',
    name: 'Dumbbell Flyes',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_adduction',
    alternatives: ['db_pullover', 'bw_pushup_wide'],
    description: 'Control the movement, feel the stretch.'
  },
  
  'bw_pushup': {
    id: 'bw_pushup',
    name: 'Push-ups',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    alternatives: ['db_press_bench', 'bw_pushup_incline'],
    description: 'As Many Reps As Possible with good form. Elevate feet for more challenge.'
  },
  
  'db_press_close_grip': {
    id: 'db_press_close_grip',
    name: 'Close-Grip Dumbbell Press',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    alternatives: ['bw_pushup_close_grip', 'db_skullcrusher'],
    description: 'Keep elbows tucked in. Or Close-Grip Push-ups.'
  },
  
  'bw_pushup_variations': {
    id: 'bw_pushup_variations',
    name: 'Push-ups (Variations)',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    alternatives: ['db_press_bench', 'db_press_incline'],
    description: 'Try incline, decline, or standard. Focus on volume.'
  },
  
  'db_pullover': {
    id: 'db_pullover',
    name: 'Dumbbell Pullovers',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Lats', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'pullover',
    alternatives: ['db_flyes', 'lat_pulldown'],
    description: 'Use one dumbbell. Good for chest expansion.'
  },
  
  'db_press_flat': {
    id: 'db_press_flat',
    name: 'Flat Dumbbell Chest Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    alternatives: ['db_press_incline', 'bw_pushup'],
    description: 'Full range of motion.'
  },
  
  // Tricep Exercises
  'db_extension_overhead': {
    id: 'db_extension_overhead',
    name: 'Dumbbell Overhead Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_extension',
    alternatives: ['db_skullcrusher', 'bw_dips'],
    description: 'Seated or standing.'
  },
  
  'db_skullcrusher': {
    id: 'db_skullcrusher',
    name: 'Dumbbell Skullcrushers',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_extension',
    alternatives: ['db_extension_overhead', 'db_press_close_grip'],
    description: 'Keep elbows stable. Or Close-Grip DB Press.'
  },
  
  'bw_dips_chair': {
    id: 'bw_dips_chair',
    name: 'Tricep Dips (Chair)',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Shoulders', 'Chest'],
    equipment: ['chair'],
    movementPattern: 'vertical_press',
    alternatives: ['bw_tricep_extensions', 'db_extension_overhead'],
    description: 'Or Bodyweight Tricep Extensions.'
  },
  
  'db_kickback': {
    id: 'db_kickback',
    name: 'Dumbbell Kickbacks',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_extension',
    alternatives: ['db_skullcrusher', 'tricep_pressdown'],
    description: 'Keep elbow high and stable, extend arm fully.'
  },
  
  'bw_dips_weighted': {
    id: 'bw_dips_weighted',
    name: 'Weighted Dips',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dip_station', 'weight'],
    movementPattern: 'vertical_press',
    alternatives: ['bw_dips_chair', 'db_press_close_grip'],
    description: 'Control the descent.'
  },
  
  'tricep_pressdown': {
    id: 'tricep_pressdown',
    name: 'Tricep Pressdowns',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_extension',
    alternatives: ['db_extension_overhead', 'db_kickback'],
    description: 'Keep elbows tucked.'
  },
  
  // Shoulder Exercises
  'db_press_overhead': {
    id: 'db_press_overhead',
    name: 'Dumbbell Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps', 'Core'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_press',
    alternatives: ['db_press_shoulder', 'bw_pike_pushup'],
    description: 'Seated or standing. Keep core tight.'
  },
  
  'db_raise_lateral': {
    id: 'db_raise_lateral',
    name: 'Dumbbell Lateral Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'lateral_raise',
    alternatives: ['db_press_overhead', 'db_raise_front'],
    description: 'Lead with the elbows, avoid shrugging.'
  },
  
  'db_raise_front': {
    id: 'db_raise_front',
    name: 'Dumbbell Front Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'front_raise',
    alternatives: ['db_press_overhead', 'db_raise_lateral'],
    description: 'Control the weight, don\'t swing.'
  },
  
  'db_flyes_reverse': {
    id: 'db_flyes_reverse',
    name: 'Dumbbell Reverse Flyes',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Upper_Back'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_abduction',
    alternatives: ['bw_pike_pushup_hold', 'db_row_bent'],
    description: 'Bend at hips, flat back. Or Pike Push-up holds.'
  },
  
  'db_press_shoulder': {
    id: 'db_press_shoulder',
    name: 'Dumbbell Shoulder Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_press',
    alternatives: ['db_press_overhead', 'bw_pike_pushup'],
    description: 'Control the movement.'
  },
  
  'db_shrug_standing': {
    id: 'db_shrug_standing',
    name: 'Standing Dumbbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'shrug',
    alternatives: ['bb_shrug', 'db_row_upright'],
    description: 'Hold at top for a second.'
  },
  
  'db_flyes_rear_delt': {
    id: 'db_flyes_rear_delt',
    name: 'Rear Delt Flyes',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Upper_Back'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_abduction',
    alternatives: ['db_flyes_reverse', 'bb_row_bent'],
    description: 'Control the movement.'
  },
  
  // Bicep Exercises
  'db_curl_bicep': {
    id: 'db_curl_bicep',
    name: 'Dumbbell Bicep Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    alternatives: ['db_curl_hammer', 'bb_curl'],
    description: 'Alternating or both arms. Avoid swinging.'
  },
  
  'db_curl_hammer': {
    id: 'db_curl_hammer',
    name: 'Dumbbell Hammer Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'hammer_curl',
    alternatives: ['db_curl_bicep', 'db_curl_concentration'],
    description: 'Palms facing your body.'
  },
  
  'db_curl_concentration': {
    id: 'db_curl_concentration',
    name: 'Dumbbell Concentration Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Isolate the bicep. Rest elbow on inner thigh.'
  },
  
  'db_curl_supinating': {
    id: 'db_curl_supinating',
    name: 'Dumbbell Supinating Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Rotate wrists during curl.'
  },
  
  'bb_curl': {
    id: 'bb_curl',
    name: 'Barbell Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['barbell'],
    movementPattern: 'bicep_curl',
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Keep elbows at sides.'
  },
  
  // Core/Abs Exercises
  'bw_plank': {
    id: 'bw_plank',
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Shoulders'],
    equipment: ['bodyweight'],
    movementPattern: 'isometric_hold',
    alternatives: ['bw_plank_side', 'bw_crunch'],
    description: 'Maintain a straight line from head to heels.'
  },
  
  'bw_crunch': {
    id: 'bw_crunch',
    name: 'Crunches / Dumbbell Crunch',
    primaryMuscle: 'Core',
    secondaryMuscle: [],
    equipment: ['bodyweight'],
    movementPattern: 'spinal_flexion',
    alternatives: ['bw_situp', 'bw_leg_raise'],
    description: 'Focus on contracting abs. Hold DB for resistance.'
  },
  
  'bw_leg_raise': {
    id: 'bw_leg_raise',
    name: 'Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Hip_Flexors'],
    equipment: ['bodyweight'],
    movementPattern: 'hip_flexion',
    alternatives: ['bw_crunch', 'bw_leg_raise_hanging'],
    description: 'Keep lower back pressed into the floor.'
  },
  
  'bw_russian_twist': {
    id: 'bw_russian_twist',
    name: 'Russian Twists',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['bodyweight'],
    movementPattern: 'rotation',
    alternatives: ['bw_crunch', 'bw_plank'],
    description: 'Per side. Can hold a dumbbell.'
  },
  
  'bw_leg_raise_hanging': {
    id: 'bw_leg_raise_hanging',
    name: 'Hanging Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Lats', 'Forearms'],
    equipment: ['pull_up_bar'],
    movementPattern: 'hip_flexion',
    alternatives: ['bw_leg_raise', 'bw_crunch'],
    description: 'Keep core engaged.'
  },
  
  'bw_situp_decline': {
    id: 'bw_situp_decline',
    name: 'Bodyweight Decline Sit-Ups',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Hip_Flexors'],
    equipment: ['decline_bench'],
    movementPattern: 'spinal_flexion',
    alternatives: ['bw_crunch', 'bw_situp'],
    description: 'Control the movement.'
  },
  
  // Back Exercises
  'bb_row': {
    id: 'bb_row',
    name: 'Barbell Rows',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    alternatives: ['db_row_bent', 'bw_chinup'],
    description: 'Keep back straight, squeeze shoulder blades.'
  },
  
  'bb_shrug': {
    id: 'bb_shrug',
    name: 'Barbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['barbell'],
    movementPattern: 'shrug',
    alternatives: ['db_shrug_standing', 'db_row_upright'],
    description: 'Hold at top.'
  },
  
  'bw_chinup': {
    id: 'bw_chinup',
    name: 'Bodyweight Chin-Ups',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['pull_up_bar'],
    movementPattern: 'vertical_pull',
    alternatives: ['bb_row', 'db_row_bent'],
    description: 'Use assistance if needed.'
  },
  
  // Leg Exercises
  'bb_squat': {
    id: 'bb_squat',
    name: 'Barbell Squats',
    primaryMuscle: 'Quadriceps',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'squat',
    alternatives: ['db_squat', 'bw_squat'],
    description: 'Focus on form and depth.'
  },
  
  'bb_deadlift': {
    id: 'bb_deadlift',
    name: 'Barbell Deadlifts',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Back', 'Traps'],
    equipment: ['barbell'],
    movementPattern: 'hip_hinge',
    alternatives: ['db_deadlift', 'bb_row_bent'],
    description: 'Focus on form and hip hinge.'
  },
  
  'leg_curl_lying': {
    id: 'leg_curl_lying',
    name: 'Lying Leg Curls',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: [],
    equipment: ['leg_curl_machine'],
    movementPattern: 'knee_flexion',
    alternatives: ['bb_deadlift', 'db_deadlift'],
    description: 'Squeeze at peak contraction.'
  },
  
  'calf_raise_seated': {
    id: 'calf_raise_seated',
    name: 'Seated Calf Raises',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['calf_raise_machine'],
    movementPattern: 'plantar_flexion',
    alternatives: ['calf_raise_standing', 'calf_raise_single_leg'],
    description: 'Full range of motion.'
  },
  
  'calf_raise_standing': {
    id: 'calf_raise_standing',
    name: 'Standing Calf Raises',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['calf_raise_machine'],
    movementPattern: 'plantar_flexion',
    alternatives: ['calf_raise_seated', 'calf_raise_single_leg'],
    description: 'Full extension at top.'
  },
  
  // Compound Exercises
  'bb_press_incline': {
    id: 'bb_press_incline',
    name: 'Incline Barbell Chest Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['barbell', 'incline_bench'],
    movementPattern: 'incline_press',
    alternatives: ['db_press_incline', 'bb_press_flat'],
    description: 'Control the movement.'
  }
};

/**
 * Utility function to get exercise by ID
 */
export function getExerciseById(id: string): ExerciseDefinition | null {
  return EXERCISE_DICTIONARY[id] || null;
}

/**
 * Utility function to get exercises by primary muscle
 */
export function getExercisesByMuscle(muscle: string): ExerciseDefinition[] {
  return Object.values(EXERCISE_DICTIONARY).filter(
    exercise => exercise.primaryMuscle.toLowerCase() === muscle.toLowerCase()
  );
}

/**
 * Utility function to get exercises by equipment
 */
export function getExercisesByEquipment(equipment: string): ExerciseDefinition[] {
  return Object.values(EXERCISE_DICTIONARY).filter(
    exercise => exercise.equipment.includes(equipment.toLowerCase())
  );
}

/**
 * Utility function to get alternative exercises
 */
export function getAlternativeExercises(exerciseId: string): ExerciseDefinition[] {
  const exercise = getExerciseById(exerciseId);
  if (!exercise) return [];
  
  return exercise.alternatives
    .map(altId => getExerciseById(altId))
    .filter((alt): alt is ExerciseDefinition => alt !== null);
}