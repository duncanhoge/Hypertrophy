import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { WORKOUT_PLANS, getCurrentLevelWorkouts } from '../data/workoutData';
import { generateNextLevel, type GeneratedPlan } from '../lib/planGenerationEngine';

export interface UserProfile {
  id: string;
  current_plan_id: string | null;
  current_level_index: number;
  block_start_date: string | null;
  block_duration_weeks: number;
  target_workout_count: number | null;
  completed_workout_count: number;
  active_generated_plan: any | null;
  is_trial_mode: boolean;
  created_at: string;
  updated_at: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .limit(1);

      if (fetchError) {
        throw fetchError;
      }

      // If no profile exists, create one
      if (!data || data.length === 0) {
        const { data: newProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert([{ id: user.id }])
          .select()
          .single();

        if (createError) {
          throw createError;
        }
        setProfile(newProfile);
      } else {
        setProfile(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !profile) return null;

    try {
      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      setProfile(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return null;
    }
  };

  const startGeneratedPlan = async (generatedPlan: any) => {
    try {
      console.log('Starting generated plan with data:', generatedPlan);
      
      // Calculate target workout count for generated plan
      const workoutDaysCount = generatedPlan.levels && generatedPlan.levels[0] ? 
        Object.keys(generatedPlan.levels[0].workouts).length : 3; // Default fallback
      
      const targetCount = workoutDaysCount * (profile?.block_duration_weeks || 6);
      
      const result = await updateProfile({
        active_generated_plan: generatedPlan,
        current_plan_id: generatedPlan.templateId,
        current_level_index: 0,
        block_start_date: new Date().toISOString(),
        block_duration_weeks: profile?.block_duration_weeks || 6,
        target_workout_count: targetCount,
        completed_workout_count: 0,
        is_trial_mode: false
      });
      
      if (!result) {
        throw new Error('Failed to update profile with generated plan');
      }
      
      console.log('Generated plan saved successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in startGeneratedPlan:', error);
      throw error;
    }
  };

  const startGeneratedPlanAndNavigate = async (generatedPlan: any) => {
    const result = await startGeneratedPlan(generatedPlan);
    return result;
  };

  const startTrainingBlock = async (planId: string, levelIndex: number = 0) => {
    try {
      console.log('Starting training block:', { planId, levelIndex });
      
      // Calculate target workout count
      const plan = WORKOUT_PLANS[planId];
      const workoutDaysCount = plan ? Object.keys(
        getCurrentLevelWorkouts(plan, levelIndex)
      ).length : 3; // Default fallback
      
      const targetCount = workoutDaysCount * (profile?.block_duration_weeks || 6);
      
      const result = await updateProfile({
        active_generated_plan: null,
        current_plan_id: planId,
        current_level_index: levelIndex,
        block_start_date: new Date().toISOString(),
        block_duration_weeks: profile?.block_duration_weeks || 6,
        target_workout_count: targetCount,
        completed_workout_count: 0,
        is_trial_mode: false
      });
      
      if (!result) {
        throw new Error('Failed to start training block');
      }
      
      console.log('Training block started successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in startTrainingBlock:', error);
      throw error;
    }
  };

  const startTrialMode = async (planId: string, levelIndex: number = 0) => {
    try {
      console.log('Starting trial mode:', { planId, levelIndex });
      
      const result = await updateProfile({
        current_plan_id: planId,
        current_level_index: levelIndex,
        is_trial_mode: true,
        // Don't set training block fields during trial
        block_start_date: null,
        target_workout_count: null,
        completed_workout_count: 0
      });
      
      if (!result) {
        throw new Error('Failed to start trial mode');
      }
      
      console.log('Trial mode started successfully:', result);
      return result;
    } catch (error) {
      console.error('Error in startTrialMode:', error);
      throw error;
    }
  };

  const endTrialMode = async () => {
    return updateProfile({
      current_plan_id: null,
      current_level_index: 0,
      is_trial_mode: false
    });
  };
  const updateGeneratedPlanName = async (newName: string) => {
    if (!profile?.active_generated_plan) return null;
    
    const updatedPlan = {
      ...profile.active_generated_plan,
      name: newName
    };
    
    return updateProfile({
      active_generated_plan: updatedPlan
    });
  };

  const deleteGeneratedPlan = async () => {
    return updateProfile({
      active_generated_plan: null,
      current_plan_id: null,
      current_level_index: 0,
      block_start_date: null,
      block_duration_weeks: 6,
      target_workout_count: null,
      completed_workout_count: 0
    });
  };

  const addLevelToGeneratedPlan = async (newLevel: any) => {
    if (!profile?.active_generated_plan) return null;
    
    const updatedPlan = {
      ...profile.active_generated_plan,
      levels: [...profile.active_generated_plan.levels, newLevel]
    };
    
    return updateProfile({
      active_generated_plan: updatedPlan,
      current_level_index: (profile.current_level_index || 0) + 1,
      block_start_date: new Date().toISOString(),
      block_duration_weeks: 6
    });
  };

 const startNextLevel = async () => {
    if (!profile?.current_plan_id) return null;
    
   // Check if this is a generated plan or pre-made plan
   if (profile.active_generated_plan) {
     // This is a generated plan - use the plan generation engine
     try {
       console.log('Starting next level for generated plan');
       
       const currentGeneratedPlan = profile.active_generated_plan as GeneratedPlan;
       const currentLevel = currentGeneratedPlan.levels[profile.current_level_index || 0];
       
       if (!currentLevel) {
         throw new Error('Current level not found in generated plan');
       }
       
       // Extract exercise IDs from the completed level
       const previousLevelExerciseIds: string[] = [];
       Object.values(currentLevel.workouts).forEach(workout => {
         workout.exercises.forEach(exercise => {
           previousLevelExerciseIds.push(exercise.id);
         });
       });
       
       console.log('Previous level exercise IDs:', previousLevelExerciseIds);
       
       // Generate the next level
       const nextLevel = generateNextLevel(
         currentGeneratedPlan,
        previousLevelExerciseIds,
        currentGeneratedPlan.tuBudget
       );
       
       if (!nextLevel) {
         throw new Error('Failed to generate next level');
       }
       
       console.log('Generated next level:', nextLevel);
       
       // Add the new level to the generated plan
       const updatedPlan = {
         ...currentGeneratedPlan,
         levels: [...currentGeneratedPlan.levels, nextLevel]
       };
       
       // Calculate target workout count for the new level
       const workoutDaysCount = Object.keys(nextLevel.workouts).length;
       const targetCount = workoutDaysCount * profile.block_duration_weeks;
       
       return updateProfile({
         active_generated_plan: updatedPlan,
         current_level_index: (profile.current_level_index || 0) + 1,
         block_start_date: new Date().toISOString(),
         block_duration_weeks: profile.block_duration_weeks,
         target_workout_count: targetCount,
         completed_workout_count: 0
       });
       
     } catch (error) {
       console.error('Error generating next level:', error);
       throw error;
     }
   } else {
     // This is a pre-made plan - use existing logic
     const currentPlan = profile.current_plan_id ? WORKOUT_PLANS[profile.current_plan_id] : null;
     
     if (!currentPlan) {
       throw new Error('Current plan not found');
     }
     
     // Recalculate target workout count for next level
     const workoutDaysCount = Object.keys(
       getCurrentLevelWorkouts(currentPlan, (profile.current_level_index || 0) + 1)
     ).length;
     const targetCount = workoutDaysCount * profile.block_duration_weeks;
     
     return updateProfile({
       current_level_index: (profile.current_level_index || 0) + 1,
       block_start_date: new Date().toISOString(),
       block_duration_weeks: profile.block_duration_weeks,
       target_workout_count: targetCount,
       completed_workout_count: 0
     });
   }
  };

  const restartCurrentLevel = async () => {
    if (!profile?.current_plan_id) return null;
    
    // Reset the training block for the current level
    return updateProfile({
      block_start_date: new Date().toISOString(),
      block_duration_weeks: profile.block_duration_weeks,
      completed_workout_count: 0
    });
  };

  const endTrainingBlock = async () => {
    return updateProfile({
      active_generated_plan: null,
      current_plan_id: null,
      current_level_index: 0,
      block_start_date: null,
      block_duration_weeks: 6,
      target_workout_count: null,
      completed_workout_count: 0,
      is_trial_mode: false
    });
  };

  const updateBlockDuration = async (weeks: number) => {
    if (weeks < 1) return null;
    
    // When updating block duration, recalculate target workout count if there's an active plan
    const updates: Partial<Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>> = {
      block_duration_weeks: weeks
    };
    
    if (profile?.current_plan_id || profile?.active_generated_plan) {
      // Recalculate target workout count based on new duration
      const currentPlan = profile.active_generated_plan || 
        (profile.current_plan_id ? WORKOUT_PLANS[profile.current_plan_id] : null);
      
      if (currentPlan) {
        const workoutDaysCount = Object.keys(
          getCurrentLevelWorkouts(currentPlan, profile.current_level_index || 0)
        ).length;
        updates.target_workout_count = workoutDaysCount * weeks;
      }
    }
    
    return updateProfile(updates);
  };

  const getWorkoutsRemaining = (): number | null => {
    if (!profile?.target_workout_count || (!profile.current_plan_id && !profile.active_generated_plan)) return null;
    
    const remaining = profile.target_workout_count - (profile.completed_workout_count || 0);
    return Math.max(0, remaining);
  };

  const getWorkoutProgressPercentage = (): number => {
    if (!profile?.target_workout_count || profile.target_workout_count === 0) return 0;
    
    const completed = profile.completed_workout_count || 0;
    const percentage = (completed / profile.target_workout_count) * 100;
    return Math.min(100, Math.max(0, percentage));
  };

  const incrementCompletedWorkoutCount = async () => {
    if (!profile) return null;
    
    const newCount = (profile.completed_workout_count || 0) + 1;
    const result = await updateProfile({
      completed_workout_count: newCount
    });
    
    return result;
  };

  const updateWorkoutCounts = async (newCompleted: number, newTarget: number) => {
    if (!profile) return null;
    
    // Validate inputs
    if (newCompleted < 0 || newTarget < 1) return null;
    
    return updateProfile({
      completed_workout_count: newCompleted,
      target_workout_count: newTarget
    });
  };

  const isBlockComplete = (): boolean => {
    if (!profile?.target_workout_count) return false;
    
    const completed = profile.completed_workout_count || 0;
    return completed >= profile.target_workout_count;
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    startGeneratedPlan,
    startGeneratedPlanAndNavigate,
    startTrialMode,
    endTrialMode,
    updateGeneratedPlanName,
    deleteGeneratedPlan,
    startTrainingBlock,
    addLevelToGeneratedPlan,
    startNextLevel,
    restartCurrentLevel,
    endTrainingBlock,
    updateBlockDuration,
    getWorkoutsRemaining,
    getWorkoutProgressPercentage,
    incrementCompletedWorkoutCount,
    updateWorkoutCounts,
    isBlockComplete,
    refetch: fetchProfile
  };
}