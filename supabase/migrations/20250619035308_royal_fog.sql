/*
  # Update workout_logs table for training block tracking

  1. Changes
    - Add `current_plan_id` column to track which plan the workout belongs to
    - Add `current_level_index` column to track which level within the plan
    - These fields will be populated when logging workouts for future analytics

  2. Migration Safety
    - Use IF NOT EXISTS to prevent errors on existing columns
    - Set nullable initially, can be made required in future migrations
*/

-- Add training block tracking columns to workout_logs
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workout_logs' AND column_name = 'current_plan_id'
  ) THEN
    ALTER TABLE workout_logs ADD COLUMN current_plan_id text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'workout_logs' AND column_name = 'current_level_index'
  ) THEN
    ALTER TABLE workout_logs ADD COLUMN current_level_index integer DEFAULT 0;
  END IF;
END $$;

-- Add indexes for future analytics queries
CREATE INDEX IF NOT EXISTS workout_logs_plan_level_idx ON workout_logs(current_plan_id, current_level_index);
CREATE INDEX IF NOT EXISTS workout_logs_user_plan_idx ON workout_logs(user_id, current_plan_id);