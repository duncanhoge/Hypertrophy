import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface UserProfile {
  id: string;
  current_plan_id: string | null;
  current_level_index: number;
  block_start_date: string | null;
  block_duration_weeks: number;
  active_generated_plan: any | null;
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
      
      const result = await updateProfile({
        active_generated_plan: generatedPlan,
        current_plan_id: generatedPlan.templateId,
        current_level_index: 0,
        block_start_date: new Date().toISOString(),
        block_duration_weeks: 6
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
      
      const result = await updateProfile({
        active_generated_plan: null,
        current_plan_id: planId,
        current_level_index: levelIndex,
        block_start_date: new Date().toISOString(),
        block_duration_weeks: 6
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
      block_duration_weeks: 6
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
    
    return updateProfile({
      current_level_index: (profile.current_level_index || 0) + 1,
      block_start_date: new Date().toISOString(),
      block_duration_weeks: 6
    });
  };

  const restartCurrentLevel = async () => {
    if (!profile?.current_plan_id) return null;
    
    return updateProfile({
      block_start_date: new Date().toISOString(),
      block_duration_weeks: 6
    });
  };

  const endTrainingBlock = async () => {
    return updateProfile({
      active_generated_plan: null,
      current_plan_id: null,
      current_level_index: 0,
      block_start_date: null,
      block_duration_weeks: 6
    });
  };

  const updateBlockDuration = async (weeks: number) => {
    if (weeks < 1) return null;
    return updateProfile({
      block_duration_weeks: weeks
    });
  };

  const getWeeksRemaining = (): number | null => {
    if (!profile?.block_start_date || (!profile.current_plan_id && !profile.active_generated_plan)) return null;

    const startDate = new Date(profile.block_start_date);
    const currentDate = new Date();
    const weeksElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const weeksRemaining = profile.block_duration_weeks - weeksElapsed;

    return Math.max(0, weeksRemaining);
  };

  const isBlockComplete = (): boolean => {
    const weeksRemaining = getWeeksRemaining();
    return weeksRemaining !== null && weeksRemaining <= 0;
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
    updateGeneratedPlanName,
    deleteGeneratedPlan,
    startTrainingBlock,
    addLevelToGeneratedPlan,
    startNextLevel,
    restartCurrentLevel,
    endTrainingBlock,
    updateBlockDuration,
    getWeeksRemaining,
    isBlockComplete,
    refetch: fetchProfile
  };
}