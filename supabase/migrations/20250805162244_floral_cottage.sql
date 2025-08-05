/*
  # Add Workout Count Fields to User Profiles

  This migration adds the new workout count tracking fields to support
  the workout count-based progression system.

  ## Changes
  1. Add target_workout_count field (nullable integer)
  2. Add completed_workout_count field (integer, default 0)
  3. Add check constraints for data integrity
  4. Add indexes for performance
*/

-- Add target_workout_count field
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'target_workout_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN target_workout_count integer;
  END IF;
END $$;

-- Add completed_workout_count field with default value
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'completed_workout_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN completed_workout_count integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Add check constraints for data integrity
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_target_workout_count_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_target_workout_count_check 
    CHECK (target_workout_count IS NULL OR target_workout_count > 0);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.check_constraints
    WHERE constraint_name = 'user_profiles_completed_workout_count_check'
  ) THEN
    ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_completed_workout_count_check 
    CHECK (completed_workout_count >= 0);
  END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS user_profiles_workout_counts_idx 
ON user_profiles (target_workout_count, completed_workout_count);

-- Update existing profiles to have completed_workout_count = 0 if null
UPDATE user_profiles 
SET completed_workout_count = 0 
WHERE completed_workout_count IS NULL;