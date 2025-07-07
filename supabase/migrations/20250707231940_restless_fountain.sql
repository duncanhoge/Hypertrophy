/*
  # Add active_generated_plan column to user_profiles table

  1. Changes
    - Add `active_generated_plan` column to `user_profiles` table
    - Column type: jsonb (nullable)
    - Stores generated workout plan data for users

  2. Security
    - No changes to existing RLS policies needed
    - New column inherits existing user isolation policies
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'active_generated_plan'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN active_generated_plan jsonb;
  END IF;
END $$;