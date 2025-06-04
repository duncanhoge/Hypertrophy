export const REST_DURATION_SECONDS = 90; // Default rest time

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes: string;
  type: string;
}

export interface WorkoutDay {
  name: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  workouts: Record<string, WorkoutDay>;
}

export const WORKOUT_PLANS: Record<string, WorkoutPlan> = {
  'duncans-plan': {
    id: 'duncans-plan',
    name: "Duncan's Plan",
    description: "A three-day split focusing on muscle hypertrophy with compound movements and isolation exercises.",
    image: "https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    workouts: {
      Monday: {
        name: "Monday - Chest & Triceps Focus",
        exercises: [
          { id: "mon_ex1", name: "Dumbbell Bench Press", sets: 4, reps: "6-12", notes: "If no bench, perform Dumbbell Floor Press. Focus on squeezing the chest at the top.", type: "weight_reps" },
          { id: "mon_ex2", name: "Dumbbell Incline Press", sets: 4, reps: "6-12", notes: "If no incline bench, use pillows or perform Pike Push-ups.", type: "weight_reps" },
          { id: "mon_ex3", name: "Dumbbell Flyes", sets: 3, reps: "8-12", notes: "Control the movement, feel the stretch.", type: "weight_reps" },
          { id: "mon_ex4", name: "Push-ups", sets: 3, reps: "AMRAP", notes: "As Many Reps As Possible with good form. Elevate feet for more challenge.", type: "reps_only" },
          { id: "mon_ex5", name: "Dumbbell Overhead Extension", sets: 3, reps: "8-12", notes: "Seated or standing.", type: "weight_reps" },
          { id: "mon_ex6", name: "Dumbbell Skullcrushers", sets: 3, reps: "8-12", notes: "Keep elbows stable. Or Close-Grip DB Press.", type: "weight_reps" },
          { id: "mon_ex7", name: "Tricep Dips (Chair)", sets: 3, reps: "AMRAP", notes: "Or Bodyweight Tricep Extensions.", type: "reps_only" },
        ]
      },
      Wednesday: {
        name: "Wednesday - Shoulders & Abs Focus",
        exercises: [
          { id: "wed_ex1", name: "Dumbbell Overhead Press", sets: 4, reps: "6-12", notes: "Seated or standing. Keep core tight.", type: "weight_reps" },
          { id: "wed_ex2", name: "Dumbbell Lateral Raises", sets: 3, reps: "8-12", notes: "Lead with the elbows, avoid shrugging.", type: "weight_reps" },
          { id: "wed_ex3", name: "Dumbbell Front Raises", sets: 3, reps: "8-12", notes: "Control the weight, don't swing.", type: "weight_reps" },
          { id: "wed_ex4", name: "Dumbbell Reverse Flyes", sets: 3, reps: "10-15", notes: "Bend at hips, flat back. Or Pike Push-up holds.", type: "weight_reps" },
          { id: "wed_ex5", name: "Plank", sets: 3, reps: "30-60s", notes: "Maintain a straight line from head to heels.", type: "timed" },
          { id: "wed_ex6", name: "Crunches / Dumbbell Crunch", sets: 3, reps: "10-15", notes: "Focus on contracting abs. Hold DB for resistance.", type: "reps_only_with_optional_weight" },
          { id: "wed_ex7", name: "Leg Raises", sets: 3, reps: "10-15", notes: "Keep lower back pressed into the floor.", type: "reps_only" },
          { id: "wed_ex8", name: "Russian Twists", sets: 3, reps: "10-15", notes: "Per side. Can hold a dumbbell.", type: "reps_only_with_optional_weight" },
        ]
      },
      Friday: {
        name: "Friday - Arms & Secondary Chest",
        exercises: [
          { id: "fri_ex1", name: "Dumbbell Bicep Curls", sets: 4, reps: "6-12", notes: "Alternating or both arms. Avoid swinging.", type: "weight_reps" },
          { id: "fri_ex2", name: "Dumbbell Hammer Curls", sets: 3, reps: "6-12", notes: "Palms facing your body.", type: "weight_reps" },
          { id: "fri_ex3", name: "Dumbbell Concentration Curls", sets: 3, reps: "8-12", notes: "Isolate the bicep. Rest elbow on inner thigh.", type: "weight_reps" },
          { id: "fri_ex4", name: "Close-Grip Dumbbell Press", sets: 3, reps: "6-12", notes: "Keep elbows tucked in. Or Close-Grip Push-ups.", type: "weight_reps" },
          { id: "fri_ex5", name: "Dumbbell Kickbacks", sets: 3, reps: "10-15", notes: "Keep elbow high and stable, extend arm fully.", type: "weight_reps" },
          { id: "fri_ex6", name: "Push-ups (Variations)", sets: 3, reps: "AMRAP", notes: "Try incline, decline, or standard. Focus on volume.", type: "reps_only" },
          { id: "fri_ex7", name: "Dumbbell Pullovers", sets: 3, reps: "10-12", notes: "Use one dumbbell. Good for chest expansion.", type: "weight_reps" },
        ]
      }
    }
  },
  'muscle-fiber': {
    id: 'muscle-fiber',
    name: "Phase II: Muscle Fiber",
    description: "A two-day foundational workout program focused on building muscle fiber and strength through compound movements.",
    image: "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    workouts: {
      'Day 1': {
        name: "Day 1 - Full Body Foundation",
        exercises: [
          { id: "d1_ex1", name: "Barbell Squats", sets: 3, reps: "8-12", notes: "Focus on form and depth.", type: "weight_reps" },
          { id: "d1_ex2", name: "Incline Barbell Chest Press", sets: 3, reps: "8-12", notes: "Control the movement.", type: "weight_reps" },
          { id: "d1_ex3", name: "Barbell Rows", sets: 3, reps: "8-12", notes: "Keep back straight, squeeze shoulder blades.", type: "weight_reps" },
          { id: "d1_ex4", name: "Standing Dumbbell Shrugs", sets: 3, reps: "8-12", notes: "Hold at top for a second.", type: "weight_reps" },
          { id: "d1_ex5", name: "Rear Delt Flyes", sets: 2, reps: "8-12", notes: "Control the movement.", type: "weight_reps" },
          { id: "d1_ex6", name: "Lateral Raise", sets: 2, reps: "8-12", notes: "Keep slight bend in elbows.", type: "weight_reps" },
          { id: "d1_ex7", name: "Dumbbell Supinating Curls", sets: 3, reps: "8-12", notes: "Rotate wrists during curl.", type: "weight_reps" },
          { id: "d1_ex8", name: "Weighted Dips", sets: 3, reps: "8-12", notes: "Control the descent.", type: "weight_reps" },
          { id: "d1_ex9", name: "Seated Calf Raises", sets: 3, reps: "8-12", notes: "Full range of motion.", type: "weight_reps" },
          { id: "d1_ex10", name: "Hanging Leg Raises", sets: 3, reps: "8-20", notes: "Keep core engaged.", type: "reps_only" }
        ]
      },
      'Day 2': {
        name: "Day 2 - Strength Foundation",
        exercises: [
          { id: "d2_ex1", name: "Barbell Deadlifts", sets: 3, reps: "4-8", notes: "Focus on form and hip hinge.", type: "weight_reps" },
          { id: "d2_ex2", name: "Lying Leg Curls", sets: 1, reps: "8-12", notes: "Squeeze at peak contraction.", type: "weight_reps" },
          { id: "d2_ex3", name: "Barbell Shrugs", sets: 3, reps: "8-12", notes: "Hold at top.", type: "weight_reps" },
          { id: "d2_ex4", name: "Flat Dumbbell Chest Press", sets: 3, reps: "8-12", notes: "Full range of motion.", type: "weight_reps" },
          { id: "d2_ex5", name: "Dumbbell Pullover", sets: 1, reps: "8-12", notes: "Keep arms slightly bent.", type: "weight_reps" },
          { id: "d2_ex6", name: "Bodyweight Chin-Ups", sets: 2, reps: "6-12", notes: "Use assistance if needed.", type: "reps_only" },
          { id: "d2_ex7", name: "Dumbbell Shoulder Press", sets: 3, reps: "8-12", notes: "Control the movement.", type: "weight_reps" },
          { id: "d2_ex8", name: "Barbell Curls", sets: 3, reps: "8-12", notes: "Keep elbows at sides.", type: "weight_reps" },
          { id: "d2_ex9", name: "Tricep Pressdowns", sets: 3, reps: "8-12", notes: "Keep elbows tucked.", type: "weight_reps" },
          { id: "d2_ex10", name: "Standing Calf Raises", sets: 3, reps: "8-12", notes: "Full extension at top.", type: "weight_reps" },
          { id: "d2_ex11", name: "Bodyweight Decline Sit-Ups", sets: 3, reps: "30-100", notes: "Control the movement.", type: "reps_only" }
        ]
      }
    }
  }
};