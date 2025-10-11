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
  exerciseType: 'compound' | 'isolation' | 'core';
  timeUnits: number;
  alternatives: string[];
  description: string;
  antagonistMuscle: string | null;
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
    timeUnits: 3,
    alternatives: ['db_press_floor', 'db_press_incline', 'bw_pushup'],
    description: 'If no bench, perform Dumbbell Floor Press. Focus on squeezing the chest at the top.',
    antagonistMuscle: 'Back'
  },
  
  'db_press_incline': {
    id: 'db_press_incline',
    name: 'Incline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'db_press_overhead'],
    description: 'Set bench to a 30-45 degree incline. Emphasizes the upper portion of the chest.',
    antagonistMuscle: 'Back'
  },

  'db_floor_press': {
    id: 'db_floor_press',
    name: 'Dumbbell Floor Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Triceps', 'Shoulders'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'bw_pushup'],
    description: 'Lying on the floor, press dumbbells up. Limits range of motion to protect shoulders and emphasize triceps.',
    antagonistMuscle: 'Back'
  },
  
  'db_flyes': {
    id: 'db_flyes',
    name: 'Dumbbell Flyes',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_pullover', 'bw_pushup_wide'],
    description: 'Control the movement, feel the stretch.',
    antagonistMuscle: 'Back'
  },
  
  'bw_pushup': {
    id: 'bw_pushup',
    name: 'Push-ups',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'bw_pushup_wide'],
    description: 'As Many Reps As Possible with good form. Elevate feet for more challenge.',
    antagonistMuscle: 'Back'
  },

  'bw_pushup_wide': {
    id: 'bw_pushup_wide',
    name: 'Wide Push-up',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pushup', 'db_press_bench'],
    description: 'Place hands wider than shoulder-width to increase focus on the chest. Keep your core tight.',
    antagonistMuscle: 'Back'
  },
  
  'db_press_close_grip': {
    id: 'db_press_close_grip',
    name: 'Close-Grip Dumbbell Press',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pushup_close_grip', 'db_skullcrusher'],
    description: 'Keep elbows tucked in. Or Close-Grip Push-ups.',
    antagonistMuscle: 'Biceps'
  },
  
  'bw_pushup_variations': {
    id: 'bw_pushup_variations',
    name: 'Push-ups (Variations)',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'db_press_incline'],
    description: 'Try incline, decline, or standard. Focus on volume.',
    antagonistMuscle: 'Back'
  },
  
  'db_pullover': {
    id: 'db_pullover',
    name: 'Dumbbell Pullovers',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Lats', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'pullover',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes', 'lat_pulldown'],
    description: 'Use one dumbbell. Good for chest expansion.',
    antagonistMuscle: 'Back'
  },
  
  'db_press_flat': {
    id: 'db_press_flat',
    name: 'Flat Dumbbell Chest Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_incline', 'bw_pushup'],
    description: 'Full range of motion.',
    antagonistMuscle: 'Back'
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
    timeUnits: 3,
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
    timeUnits: 3,
    alternatives: ['db_press_overhead'],
    description: 'Start with palms facing you, rotate palms forward as you press overhead. Hits all three shoulder heads.',
    antagonistMuscle: 'Core'
  },

  'bw_pike_pushup': {
    id: 'bw_pike_pushup',
    name: 'Pike Push-up',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps', 'Chest'],
    equipment: ['bodyweight'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_overhead', 'bw_pushup'],
    description: 'From a downward dog position, lower your head towards the floor. A great bodyweight shoulder press.',
    antagonistMuscle: 'Core'
  },
  
  'db_raise_lateral': {
    id: 'db_raise_lateral',
    name: 'Dumbbell Lateral Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'lateral_raise',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_press_overhead', 'db_raise_front'],
    description: 'Lead with the elbows, avoid shrugging.',
    antagonistMuscle: 'Core'
  },
  
  'db_raise_front': {
    id: 'db_raise_front',
    name: 'Dumbbell Front Raises',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'front_raise',
    exerciseType: 'isolation',
    timeUnits: 2,
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
    timeUnits: 2,
    alternatives: ['bw_pike_pushup_hold', 'db_row_bent_over'],
    description: 'Bend at hips, flat back. Or Pike Push-up holds.',
    antagonistMuscle: 'Core'
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
    description: 'Control the movement.',
    antagonistMuscle: 'Core'
  },
  
  'db_shrug_standing': {
    id: 'db_shrug_standing',
    name: 'Standing Dumbbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'shrug',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_shrug', 'db_row_upright'],
    description: 'Hold at top for a second.',
    antagonistMuscle: null
  },
  
  'db_flyes_rear_delt': {
    id: 'db_flyes_rear_delt',
    name: 'Rear Delt Flyes',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Upper_Back'],
    equipment: ['dumbbell'],
    movementPattern: 'horizontal_abduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes_reverse', 'bb_row_bent'],
    description: 'Control the movement.',
    antagonistMuscle: 'Core'
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
    timeUnits: 3,
    alternatives: ['db_row_single_arm'],
    description: 'Hinge at the hips with a flat back. Pull the dumbbells towards your lower chest, squeezing your back muscles.',
    antagonistMuscle: 'Chest'
  },

  'db_row_chest_supported': {
    id: 'db_row_chest_supported',
    name: 'Chest-Supported Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over'],
    description: 'Lie face down on an incline bench. Removes momentum and isolates the back muscles effectively.',
    antagonistMuscle: 'Chest'
  },

  'bb_row': {
    id: 'bb_row',
    name: 'Barbell Rows',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over', 'bw_chinup'],
    description: 'Keep back straight, squeeze shoulder blades.',
    antagonistMuscle: 'Chest'
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
    timeUnits: 3,
    alternatives: ['bw_chinup'],
    description: 'Overhand grip, wider than shoulders. Pull your chest to the bar. The king of upper body pulling exercises.',
    antagonistMuscle: 'Chest'
  },

  'bw_chinup': {
    id: 'bw_chinup',
    name: 'Chin-up',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['pullup_bar'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pullup', 'db_curl_bicep'],
    description: 'Underhand, shoulder-width grip. Puts more emphasis on the biceps while still building a strong back.',
    antagonistMuscle: 'Chest'
  },

  'bb_shrug': {
    id: 'bb_shrug',
    name: 'Barbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['barbell'],
    movementPattern: 'shrug',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_shrug_standing', 'db_row_upright'],
    description: 'Hold at top.',
    antagonistMuscle: null
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
    timeUnits: 2,
    alternatives: ['db_skullcrusher', 'bw_dips'],
    description: 'Seated or standing.',
    antagonistMuscle: 'Biceps'
  },

  'db_ext_overhead': {
    id: 'db_ext_overhead',
    name: 'Overhead Dumbbell Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'tricep_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_skullcrusher'],
    description: 'Can be done with one or two hands. Focus on the stretch at the bottom and a full squeeze at the top.',
    antagonistMuscle: 'Biceps'
  },
  
  'db_skullcrusher': {
    id: 'db_skullcrusher',
    name: 'Dumbbell Skullcrushers',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_extension_overhead', 'db_press_close_grip'],
    description: 'Keep elbows stable. Or Close-Grip DB Press.',
    antagonistMuscle: 'Biceps'
  },
  
  'bw_dips_chair': {
    id: 'bw_dips_chair',
    name: 'Tricep Dips (Chair)',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Shoulders', 'Chest'],
    equipment: ['chair'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_tricep_extensions', 'db_extension_overhead'],
    description: 'Or Bodyweight Tricep Extensions.',
    antagonistMuscle: 'Biceps'
  },
  
  'db_kickback': {
    id: 'db_kickback',
    name: 'Dumbbell Kickback',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'tricep_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_skullcrusher', 'bw_dips_chair'],
    description: 'Hinge at the hips with a flat back. Keep your upper arm parallel to the floor and extend your elbow.',
    antagonistMuscle: 'Biceps'
  },
  
  'bw_dips_weighted': {
    id: 'bw_dips_weighted',
    name: 'Weighted Dips',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dip_station', 'weight'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_dips_chair', 'db_press_close_grip'],
    description: 'Control the descent.',
    antagonistMuscle: 'Biceps'
  },
  
  'tricep_pressdown': {
    id: 'tricep_pressdown',
    name: 'Tricep Pressdowns',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_extension_overhead', 'db_kickback'],
    description: 'Keep elbows tucked.',
    antagonistMuscle: 'Biceps'
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
    timeUnits: 2,
    alternatives: ['db_curl_hammer', 'bb_curl'],
    description: 'Alternating or both arms. Avoid swinging.',
    antagonistMuscle: 'Triceps'
  },
  
  'db_curl_hammer': {
    id: 'db_curl_hammer',
    name: 'Dumbbell Hammer Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'hammer_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'db_curl_concentration'],
    description: 'Palms facing your body.',
    antagonistMuscle: 'Triceps'
  },
  
  'db_curl_concentration': {
    id: 'db_curl_concentration',
    name: 'Concentration Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Seated, with your elbow braced against your inner thigh. Focus on peak contraction.',
    antagonistMuscle: 'Triceps'
  },

  'db_curl_incline': {
    id: 'db_curl_incline',
    name: 'Incline Dumbbell Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep'],
    description: 'Sit on an incline bench. Puts a great stretch on the bicep long head for a unique stimulus.',
    antagonistMuscle: 'Triceps'
  },
  
  'db_curl_supinating': {
    id: 'db_curl_supinating',
    name: 'Dumbbell Supinating Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Rotate wrists during curl.',
    antagonistMuscle: 'Triceps'
  },
  
  'bb_curl': {
    id: 'bb_curl',
    name: 'Barbell Curls',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['barbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Keep elbows at sides.',
    antagonistMuscle: 'Triceps'
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
    timeUnits: 3,
    alternatives: ['bw_squat'],
    description: 'Hold one dumbbell vertically against your chest. Keep your chest up and back straight as you squat down.',
    antagonistMuscle: 'Hamstrings'
  },

  'bb_squat': {
    id: 'bb_squat',
    name: 'Barbell Squats',
    primaryMuscle: 'Quadriceps',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_squat_goblet', 'bw_squat'],
    description: 'Focus on form and depth.',
    antagonistMuscle: 'Hamstrings'
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
    timeUnits: 3,
    alternatives: ['bb_deadlift'],
    description: 'Keep a slight bend in your knees. Hinge at your hips, keeping the dumbbells close to your legs. Feel the stretch.',
    antagonistMuscle: 'Quads'
  },

  'bb_deadlift': {
    id: 'bb_deadlift',
    name: 'Barbell Deadlifts',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Back', 'Traps'],
    equipment: ['barbell'],
    movementPattern: 'hinge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_deadlift_romanian', 'bb_row_bent'],
    description: 'Focus on form and hip hinge.',
    antagonistMuscle: 'Quads'
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
    timeUnits: 3,
    alternatives: ['db_lunge_reverse'],
    description: 'Step forward and lower your hips until both knees are bent at a 90-degree angle. Push back to the start.',
    antagonistMuscle: 'Hamstrings'
  },

  'leg_curl_lying': {
    id: 'leg_curl_lying',
    name: 'Lying Leg Curls',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: [],
    equipment: ['leg_curl_machine'],
    movementPattern: 'knee_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_deadlift', 'db_deadlift_romanian'],
    description: 'Squeeze at peak contraction.',
    antagonistMuscle: 'Quads'
  },
  
  'calf_raise_seated': {
    id: 'calf_raise_seated',
    name: 'Seated Calf Raises',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['calf_raise_machine'],
    movementPattern: 'plantar_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['calf_raise_standing', 'calf_raise_single_leg'],
    description: 'Full range of motion.',
    antagonistMuscle: null
  },
  
  'calf_raise_standing': {
    id: 'calf_raise_standing',
    name: 'Standing Calf Raises',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['calf_raise_machine'],
    movementPattern: 'plantar_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['calf_raise_seated', 'calf_raise_single_leg'],
    description: 'Full extension at top.',
    antagonistMuscle: null
  },

  // Core Exercises
  'bw_plank': {
    id: 'bw_plank',
    name: 'Plank',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Shoulders'],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_side_plank'],
    description: 'Hold a push-up position on your forearms. Keep a straight line from your head to your heels. Brace your abs.',
    antagonistMuscle: null
  },

  'bw_leg_raises': {
    id: 'bw_leg_raises',
    name: 'Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: [],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'core',
    timeUnits: 1,
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
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_situp', 'bw_leg_raise'],
    description: 'Focus on contracting abs. Hold DB for resistance.',
    antagonistMuscle: null
  },
  
  'bw_leg_raise': {
    id: 'bw_leg_raise',
    name: 'Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Hip_Flexors'],
    equipment: ['bodyweight'],
    movementPattern: 'hip_flexion',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_crunch', 'bw_leg_raise_hanging'],
    description: 'Keep lower back pressed into the floor.',
    antagonistMuscle: null
  },
  
  'bw_russian_twist': {
    id: 'bw_russian_twist',
    name: 'Russian Twists',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['bodyweight'],
    movementPattern: 'rotation',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_crunch', 'bw_plank'],
    description: 'Per side. Can hold a dumbbell.',
    antagonistMuscle: null
  },
  
  'bw_leg_raise_hanging': {
    id: 'bw_leg_raise_hanging',
    name: 'Hanging Leg Raises',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Lats', 'Forearms'],
    equipment: ['pull_up_bar'],
    movementPattern: 'hip_flexion',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_leg_raise', 'bw_crunch'],
    description: 'Keep core engaged.',
    antagonistMuscle: null
  },
  
  'bw_situp_decline': {
    id: 'bw_situp_decline',
    name: 'Bodyweight Decline Sit-Ups',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Hip_Flexors'],
    equipment: ['decline_bench'],
    movementPattern: 'spinal_flexion',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_crunch', 'bw_situp'],
    description: 'Control the movement.',
    antagonistMuscle: null
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
    timeUnits: 3,
    alternatives: ['db_press_incline', 'bb_press_flat'],
    description: 'Control the movement.',
    antagonistMuscle: 'Back'
  },

  // Additional Chest Exercises
  'bb_press_flat': {
    id: 'bb_press_flat',
    name: 'Flat Barbell Bench Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['barbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'bb_press_incline'],
    description: 'The king of upper body pressing. Keep your feet planted and drive through the bar.',
    antagonistMuscle: 'Back'
  },

  'bb_press_decline': {
    id: 'bb_press_decline',
    name: 'Decline Barbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Triceps', 'Shoulders'],
    equipment: ['barbell', 'decline_bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_press_flat', 'db_press_bench'],
    description: 'Set bench to decline angle. Emphasizes lower chest development.',
    antagonistMuscle: 'Back'
  },

  'db_press_decline': {
    id: 'db_press_decline',
    name: 'Decline Dumbbell Press',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Triceps', 'Shoulders'],
    equipment: ['dumbbell', 'decline_bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_bench', 'bb_press_decline'],
    description: 'Targets lower chest with increased range of motion compared to barbell.',
    antagonistMuscle: 'Back'
  },

  'cable_fly_high': {
    id: 'cable_fly_high',
    name: 'High-to-Low Cable Fly',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes', 'cable_fly_mid'],
    description: 'Set cables high and bring handles down and together. Targets lower chest.',
    antagonistMuscle: 'Back'
  },

  'cable_fly_mid': {
    id: 'cable_fly_mid',
    name: 'Mid Cable Fly',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes', 'cable_fly_high'],
    description: 'Set cables at chest height. Constant tension throughout the movement.',
    antagonistMuscle: 'Back'
  },

  'cable_fly_low': {
    id: 'cable_fly_low',
    name: 'Low-to-High Cable Fly',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes', 'cable_fly_mid'],
    description: 'Set cables low and bring handles up and together. Emphasizes upper chest.',
    antagonistMuscle: 'Back'
  },

  'bw_dips_chest': {
    id: 'bw_dips_chest',
    name: 'Chest Dips',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Triceps', 'Shoulders'],
    equipment: ['dip_station'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_dips_weighted', 'db_press_bench'],
    description: 'Lean forward and flare elbows slightly to emphasize chest over triceps.',
    antagonistMuscle: 'Back'
  },

  'db_flyes_incline': {
    id: 'db_flyes_incline',
    name: 'Incline Dumbbell Flyes',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_adduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes', 'cable_fly_low'],
    description: 'Set bench to incline. Targets upper chest with deep stretch.',
    antagonistMuscle: 'Back'
  },

  'bw_pushup_decline': {
    id: 'bw_pushup_decline',
    name: 'Decline Push-up',
    primaryMuscle: 'Chest',
    secondaryMuscle: ['Shoulders', 'Triceps'],
    equipment: ['bodyweight', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pushup', 'bw_pushup_wide'],
    description: 'Elevate feet on bench. Increases difficulty and upper chest emphasis.',
    antagonistMuscle: 'Back'
  },

  'bw_pushup_diamond': {
    id: 'bw_pushup_diamond',
    name: 'Diamond Push-up',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['bodyweight'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pushup_close_grip', 'db_press_close_grip'],
    description: 'Form diamond shape with hands. Intense tricep focus.',
    antagonistMuscle: 'Biceps'
  },

  // Additional Back Exercises
  'bb_row_bent': {
    id: 'bb_row_bent',
    name: 'Bent-Over Barbell Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over', 'bb_row_pendlay'],
    description: 'Hinge at hips with flat back. Pull bar to lower chest. The staple back builder.',
    antagonistMuscle: 'Chest'
  },

  'bb_row_pendlay': {
    id: 'bb_row_pendlay',
    name: 'Pendlay Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_row_bent', 'db_row_bent_over'],
    description: 'Bar starts from floor each rep. Explosive pull to chest with torso parallel to floor.',
    antagonistMuscle: 'Chest'
  },

  'db_row_single_arm': {
    id: 'db_row_single_arm',
    name: 'Single-Arm Dumbbell Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Core'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over', 'db_row_chest_supported'],
    description: 'Support one hand on bench. Pull dumbbell to hip, focus on squeezing lat.',
    antagonistMuscle: 'Chest'
  },

  'cable_row_seated': {
    id: 'cable_row_seated',
    name: 'Seated Cable Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over', 'bb_row'],
    description: 'Keep torso upright. Pull handles to abdomen, squeeze shoulder blades together.',
    antagonistMuscle: 'Chest'
  },

  'lat_pulldown_wide': {
    id: 'lat_pulldown_wide',
    name: 'Wide-Grip Lat Pulldown',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pullup', 'lat_pulldown_close'],
    description: 'Wide overhand grip. Pull bar to upper chest, lean back slightly.',
    antagonistMuscle: 'Chest'
  },

  'lat_pulldown_close': {
    id: 'lat_pulldown_close',
    name: 'Close-Grip Lat Pulldown',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_chinup', 'lat_pulldown_wide'],
    description: 'Close parallel grip. Pull to upper chest with vertical torso.',
    antagonistMuscle: 'Chest'
  },

  'bw_pullup_wide': {
    id: 'bw_pullup_wide',
    name: 'Wide-Grip Pull-up',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps'],
    equipment: ['pullup_bar'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_pullup', 'lat_pulldown_wide'],
    description: 'Hands wider than shoulders. Emphasizes lat width.',
    antagonistMuscle: 'Chest'
  },

  'bw_inverted_row': {
    id: 'bw_inverted_row',
    name: 'Inverted Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Core'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_bent_over', 'cable_row_seated'],
    description: 'Set bar at waist height. Pull chest to bar with body straight.',
    antagonistMuscle: 'Chest'
  },

  't_bar_row': {
    id: 't_bar_row',
    name: 'T-Bar Row',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Biceps', 'Shoulders'],
    equipment: ['barbell'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_row_bent', 'db_row_bent_over'],
    description: 'Straddle bar, hinge at hips. Pull bar to chest with neutral grip.',
    antagonistMuscle: 'Chest'
  },

  'cable_pullover': {
    id: 'cable_pullover',
    name: 'Cable Pullover',
    primaryMuscle: 'Back',
    secondaryMuscle: ['Chest', 'Triceps'],
    equipment: ['cable_machine'],
    movementPattern: 'pullover',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_pullover', 'lat_pulldown_wide'],
    description: 'Set cable high. Pull down with straight arms to thighs.',
    antagonistMuscle: 'Chest'
  },

  'db_shrug': {
    id: 'db_shrug',
    name: 'Dumbbell Shrugs',
    primaryMuscle: 'Traps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'shrug',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_shrug', 'db_shrug_standing'],
    description: 'Hold dumbbells at sides. Shrug shoulders straight up, pause at top.',
    antagonistMuscle: null
  },

  'bb_row_upright': {
    id: 'bb_row_upright',
    name: 'Upright Barbell Row',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Traps'],
    equipment: ['barbell'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_row_upright', 'db_raise_lateral'],
    description: 'Pull bar up along torso to chest height. Elbows high and wide.',
    antagonistMuscle: 'Core'
  },

  'db_row_upright': {
    id: 'db_row_upright',
    name: 'Upright Dumbbell Row',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Traps'],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_pull',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_row_upright', 'db_raise_lateral'],
    description: 'Hold dumbbells in front of thighs. Pull up to shoulder height.',
    antagonistMuscle: 'Core'
  },

  // Additional Shoulder Exercises
  'db_press_seated': {
    id: 'db_press_seated',
    name: 'Seated Dumbbell Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_overhead', 'bb_press_overhead'],
    description: 'Seated with back support. Press dumbbells overhead to full extension.',
    antagonistMuscle: 'Core'
  },

  'bb_press_overhead': {
    id: 'bb_press_overhead',
    name: 'Standing Barbell Overhead Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps', 'Core'],
    equipment: ['barbell'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_overhead', 'bb_press_seated'],
    description: 'The military press. Bar starts at shoulders, press straight overhead.',
    antagonistMuscle: 'Core'
  },

  'bb_press_seated': {
    id: 'bb_press_seated',
    name: 'Seated Barbell Press',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Triceps'],
    equipment: ['barbell', 'bench'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_press_overhead', 'db_press_seated'],
    description: 'Seated with back support. More isolation than standing variation.',
    antagonistMuscle: 'Core'
  },

  'db_raise_front_alternating': {
    id: 'db_raise_front_alternating',
    name: 'Alternating Front Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'front_raise',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_raise_front', 'db_press_overhead'],
    description: 'Alternate arms raising dumbbell to shoulder height. Controlled motion.',
    antagonistMuscle: 'Core'
  },

  'cable_raise_lateral': {
    id: 'cable_raise_lateral',
    name: 'Cable Lateral Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'lateral_raise',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_raise_lateral', 'db_press_overhead'],
    description: 'Attach handle to low cable. Raise arm out to side. Constant tension.',
    antagonistMuscle: 'Core'
  },

  'cable_raise_rear_delt': {
    id: 'cable_raise_rear_delt',
    name: 'Cable Rear Delt Raise',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Upper_Back'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_abduction',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes_rear_delt', 'db_flyes_reverse'],
    description: 'Set cable across body. Pull across to work rear delts.',
    antagonistMuscle: 'Core'
  },

  'face_pull': {
    id: 'face_pull',
    name: 'Face Pull',
    primaryMuscle: 'Shoulders',
    secondaryMuscle: ['Upper_Back', 'Traps'],
    equipment: ['cable_machine'],
    movementPattern: 'horizontal_pull',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_flyes_reverse', 'cable_raise_rear_delt'],
    description: 'Set cable high with rope. Pull to face, externally rotate shoulders at end.',
    antagonistMuscle: 'Core'
  },

  // Additional Arm Exercises - Biceps
  'bb_curl_ez': {
    id: 'bb_curl_ez',
    name: 'EZ-Bar Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['barbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_curl', 'db_curl_bicep'],
    description: 'Use EZ-bar for more comfortable wrist position during curls.',
    antagonistMuscle: 'Triceps'
  },

  'cable_curl_straight_bar': {
    id: 'cable_curl_straight_bar',
    name: 'Cable Bicep Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['cable_machine'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_curl', 'db_curl_bicep'],
    description: 'Attach straight bar to low cable. Constant tension throughout movement.',
    antagonistMuscle: 'Triceps'
  },

  'cable_curl_rope': {
    id: 'cable_curl_rope',
    name: 'Cable Rope Hammer Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms', 'Brachialis'],
    equipment: ['cable_machine'],
    movementPattern: 'hammer_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_hammer', 'cable_curl_straight_bar'],
    description: 'Use rope attachment. Keep palms facing each other throughout.',
    antagonistMuscle: 'Triceps'
  },

  'db_curl_zottman': {
    id: 'db_curl_zottman',
    name: 'Zottman Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['dumbbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'db_curl_hammer'],
    description: 'Curl with palms up, rotate wrists at top, lower with palms down.',
    antagonistMuscle: 'Triceps'
  },

  'bb_curl_21s': {
    id: 'bb_curl_21s',
    name: 'Barbell Curl 21s',
    primaryMuscle: 'Biceps',
    secondaryMuscle: ['Forearms'],
    equipment: ['barbell'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_curl', 'db_curl_bicep'],
    description: '7 bottom-half reps, 7 top-half reps, 7 full reps. Intense bicep pump.',
    antagonistMuscle: 'Triceps'
  },

  'cable_curl_high': {
    id: 'cable_curl_high',
    name: 'High Cable Curl',
    primaryMuscle: 'Biceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'bicep_curl',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_curl_bicep', 'cable_curl_straight_bar'],
    description: 'Set cables high on both sides. Curl handles to shoulders in crucifix position.',
    antagonistMuscle: 'Triceps'
  },

  // Additional Arm Exercises - Triceps
  'cable_pressdown_straight_bar': {
    id: 'cable_pressdown_straight_bar',
    name: 'Cable Tricep Pressdown',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['tricep_pressdown', 'db_extension_overhead'],
    description: 'Attach straight bar to high cable. Press down to full extension.',
    antagonistMuscle: 'Biceps'
  },

  'cable_pressdown_rope': {
    id: 'cable_pressdown_rope',
    name: 'Rope Tricep Pressdown',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['cable_pressdown_straight_bar', 'db_extension_overhead'],
    description: 'Use rope attachment. Split rope at bottom for maximum contraction.',
    antagonistMuscle: 'Biceps'
  },

  'cable_extension_overhead': {
    id: 'cable_extension_overhead',
    name: 'Cable Overhead Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_extension_overhead', 'cable_pressdown_rope'],
    description: 'Face away from cable. Extend rope overhead for long head emphasis.',
    antagonistMuscle: 'Biceps'
  },

  'bb_skullcrusher': {
    id: 'bb_skullcrusher',
    name: 'Barbell Skullcrusher',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['barbell', 'bench'],
    movementPattern: 'horizontal_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_skullcrusher', 'bb_skullcrusher_ez'],
    description: 'Lower bar to forehead, extend back up. Keep elbows stable.',
    antagonistMuscle: 'Biceps'
  },

  'bb_skullcrusher_ez': {
    id: 'bb_skullcrusher_ez',
    name: 'EZ-Bar Skullcrusher',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['barbell', 'bench'],
    movementPattern: 'horizontal_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['bb_skullcrusher', 'db_skullcrusher'],
    description: 'Use EZ-bar for more comfortable wrist angle during skullcrushers.',
    antagonistMuscle: 'Biceps'
  },

  'bw_dips_tricep': {
    id: 'bw_dips_tricep',
    name: 'Tricep Dips',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['dip_station'],
    movementPattern: 'vertical_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_dips_chair', 'bw_dips_weighted'],
    description: 'Keep torso upright with elbows tucked to emphasize triceps.',
    antagonistMuscle: 'Biceps'
  },

  'db_extension_overhead_single': {
    id: 'db_extension_overhead_single',
    name: 'Single-Arm Overhead Extension',
    primaryMuscle: 'Triceps',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'vertical_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['db_extension_overhead', 'db_kickback'],
    description: 'One arm at a time. Deep stretch and full contraction.',
    antagonistMuscle: 'Biceps'
  },

  'bb_press_close_grip': {
    id: 'bb_press_close_grip',
    name: 'Close-Grip Barbell Press',
    primaryMuscle: 'Triceps',
    secondaryMuscle: ['Chest', 'Shoulders'],
    equipment: ['barbell', 'bench'],
    movementPattern: 'horizontal_press',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_press_close_grip', 'bw_pushup_diamond'],
    description: 'Hands shoulder-width apart. Powerful tricep mass builder.',
    antagonistMuscle: 'Biceps'
  },

  // Additional Leg Exercises - Quads
  'bb_squat_front': {
    id: 'bb_squat_front',
    name: 'Front Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Core'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_squat', 'db_squat_goblet'],
    description: 'Bar rests on front delts. More quad-dominant than back squat.',
    antagonistMuscle: 'Hamstrings'
  },

  'bb_squat_box': {
    id: 'bb_squat_box',
    name: 'Box Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['barbell', 'squat_rack', 'bench'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_squat', 'bb_squat_pause'],
    description: 'Squat to seated position on box, then explode up. Great for power.',
    antagonistMuscle: 'Hamstrings'
  },

  'bb_squat_pause': {
    id: 'bb_squat_pause',
    name: 'Pause Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['barbell', 'squat_rack'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_squat', 'bb_squat_front'],
    description: 'Pause for 2-3 seconds at bottom. Builds strength out of the hole.',
    antagonistMuscle: 'Hamstrings'
  },

  'leg_press': {
    id: 'leg_press',
    name: 'Leg Press',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['leg_curl_machine'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_squat', 'hack_squat'],
    description: 'Push platform away with feet. Controlled descent without locking knees.',
    antagonistMuscle: 'Hamstrings'
  },

  'hack_squat': {
    id: 'hack_squat',
    name: 'Hack Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes'],
    equipment: ['leg_curl_machine'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['leg_press', 'bb_squat'],
    description: 'Machine-based squat variation. Great quad isolation.',
    antagonistMuscle: 'Hamstrings'
  },

  'leg_extension': {
    id: 'leg_extension',
    name: 'Leg Extension',
    primaryMuscle: 'Quads',
    secondaryMuscle: [],
    equipment: ['leg_curl_machine'],
    movementPattern: 'knee_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['leg_press', 'bb_squat'],
    description: 'Extend knees to full contraction. Squeeze quads at top.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_squat': {
    id: 'bw_squat',
    name: 'Bodyweight Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['bodyweight'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_squat_goblet', 'bw_squat_jump'],
    description: 'Fundamental movement pattern. Go deep and maintain upright torso.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_squat_jump': {
    id: 'bw_squat_jump',
    name: 'Jump Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Calves'],
    equipment: ['bodyweight'],
    movementPattern: 'squat',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_squat', 'bw_lunge_jump'],
    description: 'Explosive jump from squat position. Power and cardio combined.',
    antagonistMuscle: 'Hamstrings'
  },

  'db_bulgarian_split_squat': {
    id: 'db_bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_lunge_forward', 'db_lunge_reverse'],
    description: 'Rear foot elevated on bench. Excellent single-leg quad developer.',
    antagonistMuscle: 'Hamstrings'
  },

  // Additional Leg Exercises - Hamstrings/Glutes
  'bb_deadlift_sumo': {
    id: 'bb_deadlift_sumo',
    name: 'Sumo Deadlift',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Back', 'Traps'],
    equipment: ['barbell'],
    movementPattern: 'hinge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_deadlift', 'db_deadlift_romanian'],
    description: 'Wide stance, toes pointed out. More quad and glute emphasis.',
    antagonistMuscle: 'Quads'
  },

  'bb_deadlift_stiff_leg': {
    id: 'bb_deadlift_stiff_leg',
    name: 'Stiff-Leg Deadlift',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: ['Glutes', 'Lower_Back'],
    equipment: ['barbell'],
    movementPattern: 'hinge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_deadlift_romanian', 'bb_deadlift'],
    description: 'Minimal knee bend. Maximum hamstring stretch and development.',
    antagonistMuscle: 'Quads'
  },

  'bb_hip_thrust': {
    id: 'bb_hip_thrust',
    name: 'Barbell Hip Thrust',
    primaryMuscle: 'Glutes',
    secondaryMuscle: ['Hamstrings'],
    equipment: ['barbell', 'bench'],
    movementPattern: 'hip_extension',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_hip_thrust', 'bb_glute_bridge'],
    description: 'Upper back on bench, bar over hips. Thrust through heels, squeeze glutes.',
    antagonistMuscle: 'Hamstrings'
  },

  'db_hip_thrust': {
    id: 'db_hip_thrust',
    name: 'Dumbbell Hip Thrust',
    primaryMuscle: 'Glutes',
    secondaryMuscle: ['Hamstrings'],
    equipment: ['dumbbell', 'bench'],
    movementPattern: 'hip_extension',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_hip_thrust', 'bb_glute_bridge'],
    description: 'Hold dumbbell on hips. Upper back on bench, thrust upward.',
    antagonistMuscle: 'Hamstrings'
  },

  'bb_glute_bridge': {
    id: 'bb_glute_bridge',
    name: 'Barbell Glute Bridge',
    primaryMuscle: 'Glutes',
    secondaryMuscle: ['Hamstrings'],
    equipment: ['barbell'],
    movementPattern: 'hip_extension',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_hip_thrust', 'bw_glute_bridge'],
    description: 'Lie on floor, bar over hips. Bridge up, full glute contraction at top.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_glute_bridge': {
    id: 'bw_glute_bridge',
    name: 'Glute Bridge',
    primaryMuscle: 'Glutes',
    secondaryMuscle: ['Hamstrings'],
    equipment: ['bodyweight'],
    movementPattern: 'hip_extension',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bb_glute_bridge', 'bw_glute_bridge_single'],
    description: 'Lie on back, feet flat. Drive through heels, lift hips high.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_glute_bridge_single': {
    id: 'bw_glute_bridge_single',
    name: 'Single-Leg Glute Bridge',
    primaryMuscle: 'Glutes',
    secondaryMuscle: ['Hamstrings'],
    equipment: ['bodyweight'],
    movementPattern: 'hip_extension',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_glute_bridge', 'db_hip_thrust'],
    description: 'One leg extended. Bridge with single leg, maximum glute activation.',
    antagonistMuscle: 'Hamstrings'
  },

  'db_lunge_reverse': {
    id: 'db_lunge_reverse',
    name: 'Reverse Lunge',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['dumbbell'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_lunge_forward', 'db_bulgarian_split_squat'],
    description: 'Step backward into lunge. Easier on knees than forward lunge.',
    antagonistMuscle: 'Hamstrings'
  },

  'db_lunge_walking': {
    id: 'db_lunge_walking',
    name: 'Walking Lunge',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes', 'Hamstrings'],
    equipment: ['dumbbell'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_lunge_forward', 'db_lunge_reverse'],
    description: 'Lunge forward alternating legs in walking motion. Great for glutes.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_lunge': {
    id: 'bw_lunge',
    name: 'Bodyweight Lunge',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes'],
    equipment: ['bodyweight'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_squat', 'bw_lunge_jump'],
    description: 'Master the movement pattern before adding weight.',
    antagonistMuscle: 'Hamstrings'
  },

  'bw_lunge_jump': {
    id: 'bw_lunge_jump',
    name: 'Jump Lunge',
    primaryMuscle: 'Quads',
    secondaryMuscle: ['Glutes'],
    equipment: ['bodyweight'],
    movementPattern: 'lunge',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['bw_lunge', 'bw_squat_jump'],
    description: 'Explosive lunge with leg switch mid-air. Challenging plyometric.',
    antagonistMuscle: 'Hamstrings'
  },

  'leg_curl_seated': {
    id: 'leg_curl_seated',
    name: 'Seated Leg Curl',
    primaryMuscle: 'Hamstrings',
    secondaryMuscle: [],
    equipment: ['leg_curl_machine'],
    movementPattern: 'knee_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['leg_curl_lying', 'db_deadlift_romanian'],
    description: 'Curl legs down, squeeze hamstrings at peak contraction.',
    antagonistMuscle: 'Quads'
  },

  // Additional Calf Exercises
  'calf_raise_single_leg': {
    id: 'calf_raise_single_leg',
    name: 'Single-Leg Calf Raise',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['bodyweight'],
    movementPattern: 'plantar_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['calf_raise_standing', 'calf_raise_seated'],
    description: 'One leg at a time. Can add dumbbell for extra resistance.',
    antagonistMuscle: null
  },

  'db_calf_raise': {
    id: 'db_calf_raise',
    name: 'Dumbbell Calf Raise',
    primaryMuscle: 'Calves',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'plantar_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['calf_raise_standing', 'calf_raise_single_leg'],
    description: 'Hold dumbbells at sides. Rise onto toes, full extension.',
    antagonistMuscle: null
  },

  // Additional Core Exercises
  'bw_situp': {
    id: 'bw_situp',
    name: 'Sit-ups',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Hip_Flexors'],
    equipment: ['bodyweight'],
    movementPattern: 'spinal_flexion',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_crunch', 'bw_situp_decline'],
    description: 'Full range sit-up motion. Can anchor feet for stability.',
    antagonistMuscle: null
  },

  'bw_side_plank': {
    id: 'bw_side_plank',
    name: 'Side Plank',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_plank', 'bw_russian_twist'],
    description: 'Balance on forearm and side of foot. Keep body straight, hips up.',
    antagonistMuscle: null
  },

  'bw_mountain_climber': {
    id: 'bw_mountain_climber',
    name: 'Mountain Climbers',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Shoulders', 'Hip_Flexors'],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_plank', 'bw_leg_raise'],
    description: 'Plank position, alternate bringing knees to chest. Dynamic core work.',
    antagonistMuscle: null
  },

  'bw_bicycle_crunch': {
    id: 'bw_bicycle_crunch',
    name: 'Bicycle Crunches',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['bodyweight'],
    movementPattern: 'rotation',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_russian_twist', 'bw_crunch'],
    description: 'Alternate elbow to opposite knee. Effective ab and oblique exercise.',
    antagonistMuscle: null
  },

  'cable_crunch': {
    id: 'cable_crunch',
    name: 'Cable Crunch',
    primaryMuscle: 'Core',
    secondaryMuscle: [],
    equipment: ['cable_machine'],
    movementPattern: 'spinal_flexion',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_crunch', 'ab_wheel'],
    description: 'Hold rope attachment at head. Crunch down, flex abs fully.',
    antagonistMuscle: null
  },

  'ab_wheel': {
    id: 'ab_wheel',
    name: 'Ab Wheel Rollout',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Shoulders', 'Back'],
    equipment: ['bodyweight'],
    movementPattern: 'core',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_plank', 'cable_crunch'],
    description: 'Roll wheel forward while keeping core tight. Advanced core exercise.',
    antagonistMuscle: null
  },

  'pallof_press': {
    id: 'pallof_press',
    name: 'Pallof Press',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['cable_machine'],
    movementPattern: 'anti_rotation',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_plank', 'bw_side_plank'],
    description: 'Cable at chest height. Press out and resist rotation. Anti-rotation core work.',
    antagonistMuscle: null
  },

  'db_side_bend': {
    id: 'db_side_bend',
    name: 'Dumbbell Side Bend',
    primaryMuscle: 'Core',
    secondaryMuscle: ['Obliques'],
    equipment: ['dumbbell'],
    movementPattern: 'lateral_flexion',
    exerciseType: 'core',
    timeUnits: 1,
    alternatives: ['bw_side_plank', 'cable_crunch'],
    description: 'Hold dumbbell at side. Bend laterally, engaging obliques.',
    antagonistMuscle: null
  },

  // Additional Forearm/Grip Exercises
  'wrist_curl_seated': {
    id: 'wrist_curl_seated',
    name: 'Seated Wrist Curl',
    primaryMuscle: 'Forearms',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'wrist_flexion',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['wrist_curl_reverse', 'db_curl_hammer'],
    description: 'Forearms on thighs, curl wrists up. Builds forearm flexors.',
    antagonistMuscle: null
  },

  'wrist_curl_reverse': {
    id: 'wrist_curl_reverse',
    name: 'Reverse Wrist Curl',
    primaryMuscle: 'Forearms',
    secondaryMuscle: [],
    equipment: ['dumbbell'],
    movementPattern: 'wrist_extension',
    exerciseType: 'isolation',
    timeUnits: 2,
    alternatives: ['wrist_curl_seated', 'db_curl_hammer'],
    description: 'Palms down, curl wrists up. Targets forearm extensors.',
    antagonistMuscle: null
  },

  'farmers_walk': {
    id: 'farmers_walk',
    name: 'Farmers Walk',
    primaryMuscle: 'Forearms',
    secondaryMuscle: ['Traps', 'Core'],
    equipment: ['dumbbell'],
    movementPattern: 'carry',
    exerciseType: 'compound',
    timeUnits: 3,
    alternatives: ['db_shrug', 'bb_deadlift'],
    description: 'Heavy dumbbells at sides. Walk with good posture. Total body conditioning.',
    antagonistMuscle: null
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