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
  exerciseType: 'compound' | 'isolation';
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
  // Chest Exercises - Horizontal Press
  'db_press_bench': {
    id: 'db_press_bench',
    name: 'Dumbbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    alternatives: ['db_press_floor', 'db_press_incline', 'bw_pushup'],
    description: 'If no bench, perform Dumbbell Floor Press. Focus on squeezing the chest at the top.'
  },
  
  'db_press_incline': {
    id: 'db_press_incline',
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    alternatives: ['db_press_bench', 'db_press_overhead'],
    description: 'Set bench to a 30-45 degree incline. Emphasizes the upper portion of the chest.'
  },

  'db_floor_press': {
    id: 'db_floor_press',
    name: 'Dumbbell Floor Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Triceps', 'Shoulders'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    alternatives: ['db_press_bench', 'bw_pushup'],
    description: 'Lying on the floor, press dumbbells up. Limits range of motion to protect shoulders and emphasize triceps.'
  },
  
  'db_flyes': {
    id: 'db_flyes',
    name: 'Dumbbell Flyes',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
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
    exerciseType: 'compound',
    alternatives: ['db_press_bench', 'bw_pushup_wide'],
    description: 'As Many Reps As Possible with good form. Elevate feet for more challenge.'
  },

  'bw_pushup_wide': {
    id: 'bw_pushup_wide',
    name: 'Wide Push-up',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    alternatives: ['bw_pushup', 'db_press_bench'],
    description: 'Place hands wider than shoulder-width to increase focus on the chest. Keep your core tight.'
  },
  
  'db_press_close_grip': {
    id: 'db_press_close_grip',
    name: 'Close-Grip Dumbbell Press',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
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
    exerciseType: 'compound',
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
    exerciseType: 'isolation',
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
    exerciseType: 'compound',
    alternatives: ['db_press_incline', 'bw_pushup'],
    description: 'Full range of motion.'
  },

  // Shoulder Exercises - Vertical Press
  'db_press_overhead': {
    id: 'db_press_overhead',
    name: 'Dumbbell Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps', 'Core'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    alternatives: ['db_press_shoulder', 'bw_pike_pushup'],
    description: 'Seated or standing. Keep core tight.'
  },

  'db_press_arnold': {
    id: 'db_press_arnold',
    name: 'Arnold Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    alternatives: ['db_press_overhead'],
    description: 'Start with palms facing you, rotate palms forward as you press overhead. Hits all three shoulder heads.'
  },

  'bw_pike_pushup': {
    id: 'bw_pike_pushup',
    name: 'Pike Push-up',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps', 'Chest'],
    equipment: ['bodyweight'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    alternatives: ['db_press_overhead', 'bw_pushup'],
    description: 'From a downward dog position, lower your head towards the floor. A great bodyweight shoulder press.'
  },
  
  'db_raise_lateral': {
    id: 'db_raise_lateral',
    name: 'Dumbbell Lateral Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'lateral_raise',
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
    alternatives: ['bw_pike_pushup_hold', 'db_row_bent_over'],
    description: 'Bend at hips, flat back. Or Pike Push-up holds.'
  },
  
  'db_press_shoulder': {
    id: 'db_press_shoulder',
    name: 'Dumbbell Shoulder Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
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
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
    alternatives: ['db_flyes_reverse', 'bb_row_bent'],
    description: 'Control the movement.'
  },

  // Back Exercises - Horizontal Pull
  'db_row_bent_over': {
    id: 'db_row_bent_over',
    name: 'Bent-Over Dumbbell Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    alternatives: ['db_row_single_arm'],
    description: 'Hinge at the hips with a flat back. Pull the dumbbells towards your lower chest, squeezing your back muscles.'
  },

  'db_row_chest_supported': {
    id: 'db_row_chest_supported',
    name: 'Chest-Supported Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    alternatives: ['db_row_bent_over'],
    description: 'Lie face down on an incline bench. Removes momentum and isolates the back muscles effectively.'
  },

  'bb_row': {
    id: 'bb_row',
    name: 'Barbell Rows',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    alternatives: ['db_row_bent_over', 'bw_chinup'],
    description: 'Keep back straight, squeeze shoulder blades.'
  },

  // Back Exercises - Vertical Pull
  'bw_pullup': {
    id: 'bw_pullup',
    name: 'Pull-up',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['pullup_bar'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    alternatives: ['bw_chinup'],
    description: 'Overhand grip, wider than shoulders. Pull your chest to the bar. The king of upper body pulling exercises.'
  },

  'bw_chinup': {
    id: 'bw_chinup',
    name: 'Chin-up',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['pullup_bar'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    alternatives: ['bw_pullup', 'db_curl_bicep'],
    description: 'Underhand, shoulder-width grip. Puts more emphasis on the biceps while still building a strong back.'
  },

  'bb_shrug': {
    id: 'bb_shrug',
    name: 'Barbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['barbell'],
    movementPattern: 'shrug',
    exerciseType: 'isolation',
    alternatives: ['db_shrug_standing', 'db_row_upright'],
    description: 'Hold at top.'
  },

  // Tricep Exercises
  'db_extension_overhead': {
    id: 'db_extension_overhead',
    name: 'Dumbbell Overhead Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    alternatives: ['db_skullcrusher', 'bw_dips'],
    description: 'Seated or standing.'
  },

  'db_ext_overhead': {
    id: 'db_ext_overhead',
    name: 'Overhead Dumbbell Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'tricep_extension',
    exerciseType: 'isolation',
    alternatives: ['db_skullcrusher'],
    description: 'Can be done with one or two hands. Focus on the stretch at the bottom and a full squeeze at the top.'
  },
  
  'db_skullcrusher': {
    id: 'db_skullcrusher',
    name: 'Dumbbell Skullcrushers',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_extension',
    exerciseType: 'isolation',
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
    exerciseType: 'compound',
    alternatives: ['bw_tricep_extensions', 'db_extension_overhead'],
    description: 'Or Bodyweight Tricep Extensions.'
  },
  
  'db_kickback': {
    id: 'db_kickback',
    name: 'Dumbbell Kickback',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'tricep_extension',
    exerciseType: 'isolation',
    alternatives: ['db_skullcrusher', 'bw_dips_chair'],
    description: 'Hinge at the hips with a flat back. Keep your upper arm parallel to the floor and extend your elbow.'
  },
  
  'bw_dips_weighted': {
    id: 'bw_dips_weighted',
    name: 'Weighted Dips',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dip_station', 'weight'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
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
    exerciseType: 'isolation',
    alternatives: ['db_extension_overhead', 'db_kickback'],
    description: 'Keep elbows tucked.'
  },

  // Bicep Exercises
  'db_curl_bicep': {
    id: 'db_curl_bicep',
    name: 'Dumbbell Bicep Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
    alternatives: ['db_curl_bicep', 'db_curl_concentration'],
    description: 'Palms facing your body.'
  },
  
  'db_curl_concentration': {
    id: 'db_curl_concentration',
    name: 'Concentration Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Seated, with your elbow braced against your inner thigh. Focus on peak contraction.'
  },

  'db_curl_incline': {
    id: 'db_curl_incline',
    name: 'Incline Dumbbell Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    alternatives: ['db_curl_bicep'],
    description: 'Sit on an incline bench. Puts a great stretch on the bicep long head for a unique stimulus.'
  },
  
  'db_curl_supinating': {
    id: 'db_curl_supinating',
    name: 'Dumbbell Supinating Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Keep elbows at sides.'
  },

  // Leg Exercises - Squat Pattern
  'db_squat_goblet': {
    id: 'db_squat_goblet',
    name: 'Goblet Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Core'],
    equipment: ['dumbbell'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    alternatives: ['bw_squat'],
    description: 'Hold one dumbbell vertically against your chest. Keep your chest up and back straight as you squat down.'
  },

  'bb_squat': {
    id: 'bb_squat',
    name: 'Barbell Squats',
    primaryMuscle: 'Quadriceps',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    alternatives: ['db_squat_goblet', 'bw_squat'],
    description: 'Focus on form and depth.'
  },

  // Leg Exercises - Hinge Pattern
  'db_deadlift_romanian': {
    id: 'db_deadlift_romanian',
    name: 'Romanian Deadlift',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Lower Back'],
    equipment: ['dumbbell'],
    movementPattern: 'hinge',
    exerciseType: 'compound',
    alternatives: ['bb_deadlift'],
    description: 'Keep a slight bend in your knees. Hinge at your hips, keeping the dumbbells close to your legs. Feel the stretch.'
  },

  'bb_deadlift': {
    id: 'bb_deadlift',
    name: 'Barbell Deadlifts',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Back', 'Traps'],
    equipment: ['barbell'],
    movementPattern: 'hinge',
    exerciseType: 'compound',
    alternatives: ['db_deadlift_romanian', 'bb_row_bent'],
    description: 'Focus on form and hip hinge.'
  },

  // Leg Exercises - Lunge Pattern
  'db_lunge_forward': {
    id: 'db_lunge_forward',
    name: 'Forward Lunge',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes'],
    equipment: ['dumbbell'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    alternatives: ['db_lunge_reverse'],
    description: 'Step forward and lower your hips until both knees are bent at a 90-degree angle. Push back to the start.'
  },

  'leg_curl_lying': {
    id: 'leg_curl_lying',
    name: 'Lying Leg Curls',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: [],
    equipment: ['leg_curl_machine'],
    movementPattern: 'knee_flexion',
    exerciseType: 'isolation',
    alternatives: ['bb_deadlift', 'db_deadlift_romanian'],
    description: 'Squeeze at peak contraction.'
  },
  
  'calf_raise_seated': {
    id: 'calf_raise_seated',
    name: 'Seated Calf Raises',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['calf_raise_machine'],
    movementPattern: 'plantar_flexion',
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
    alternatives: ['calf_raise_seated', 'calf_raise_single_leg'],
    description: 'Full extension at top.'
  },

  // Core Exercises
  'bw_plank': {
    id: 'bw_plank',
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Shoulders'],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'isolation',
    alternatives: ['bw_side_plank'],
    description: 'Hold a push-up position on your forearms. Keep a straight line from your head to your heels. Brace your abs.'
  },

  'bw_leg_raises': {
    id: 'bw_leg_raises',
    name: 'Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: [],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'isolation',
    alternatives: ['bw_crunch'],
    description: 'Lie on your back, legs straight. Raise your legs until they are vertical, then slowly lower them. Don\'t let your feet touch the floor.'
  },
  
  'bw_crunch': {
    id: 'bw_crunch',
    name: 'Crunches / Dumbbell Crunch',
    primaryMuscle: 'Core',
    secondaryMuscle: [],
    equipment: ['bodyweight'],
    movementPattern: 'spinal_flexion',
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
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
    exerciseType: 'isolation',
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
    exerciseType: 'compound',
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
    exerciseType: 'isolation',
    alternatives: ['bw_crunch', 'bw_situp'],
    description: 'Control the movement.'
  },
  
  // Compound Exercises
  'bb_press_incline': {
    id: 'bb_press_incline',
    name: 'Incline Barbell Chest Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['barbell', 'incline_bench'],
    movementPattern: 'incline_press',
    exerciseType: 'compound',
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
 * Utility function to get exercises by movement pattern
 */
export function getExercisesByMovementPattern(pattern: string): ExerciseDefinition[] {
  return Object.values(EXERCISE_DICTIONARY).filter(
    exercise => exercise.movementPattern.toLowerCase() === pattern.toLowerCase()
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