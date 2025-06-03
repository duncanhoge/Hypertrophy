/*
  # Create workout logs table

  1. New Tables
    - `workout_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `workout_day` (text)
      - `exercise_id` (text)
      - `exercise_name` (text)
      - `set_number` (integer)
      - `weight` (numeric, nullable)
      - `reps_logged` (integer, nullable)
      - `duration_seconds` (integer, nullable)
      - `target_reps` (text)
      - `target_sets` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on `workout_logs` table
    - Add policies for authenticated users to:
      - Insert their own logs
      - Read their own logs

  3. Performance
    - Add index on user_id and created_at for faster queries
*/

-- Create the workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  workout_day text NOT NULL,
  exercise_id text NOT NULL,
  exercise_name text NOT NULL,
  set_number integer NOT NULL,
  weight numeric NULL,
  reps_logged integer NULL,
  duration_seconds integer NULL,
  target_reps text NOT NULL,
  target_sets integer NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,

  -- Add constraints
  CONSTRAINT positive_set_number CHECK (set_number > 0),
  CONSTRAINT positive_weight CHECK (weight IS NULL OR weight > 0),
  CONSTRAINT positive_reps CHECK (reps_logged IS NULL OR reps_logged > 0),
  CONSTRAINT positive_duration CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  CONSTRAINT positive_target_sets CHECK (target_sets > 0)
);

-- Enable Row Level Security
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'workout_logs' 
    AND policyname = 'Users can insert their own logs'
  ) THEN
    CREATE POLICY "Users can insert their own logs"
      ON workout_logs
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'workout_logs' 
    AND policyname = 'Users can read their own logs'
  ) THEN
    CREATE POLICY "Users can read their own logs"
      ON workout_logs
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS workout_logs_user_id_created_at_idx ON workout_logs (user_id, created_at DESC);