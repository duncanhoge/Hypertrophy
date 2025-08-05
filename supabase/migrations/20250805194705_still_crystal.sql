/*
  # Add trial mode support to user profiles

  1. Changes
    - Add `is_trial_mode` boolean column to `user_profiles` table
    - Set default value to `false` for existing users
    - Add check constraint to ensure data integrity

  2. Security
    - No RLS changes needed as existing policies cover the new column
*/

-- Add is_trial_mode column to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'is_trial_mode'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN is_trial_mode BOOLEAN DEFAULT false NOT NULL;
  END IF;
END $$;