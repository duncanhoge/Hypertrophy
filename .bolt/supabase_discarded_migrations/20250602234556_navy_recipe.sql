/*
  # Create workout logs table

  1. New Tables
    - `workout_logs`
      - `id` (uuid, primary key)
      - `user_id` (text, foreign key to auth.users)
      - `workout_day` (text) - e.g., 'Monday', 'Wednesday', 'Friday'
      - `exercise_id` (text) - unique identifier for the exercise
      - `exercise_name` (text) - name of the exercise
      - `set_number` (integer) - which set in the sequence
      - `weight` (numeric, nullable) - weight used if applicable
      - `reps_logged` (integer, nullable) - number of reps completed
      - `duration_seconds` (integer, nullable) - duration for timed exercises
      - `target_reps` (text) - target reps/duration for the exercise
      - `target_sets` (integer) - total number of sets for the exercise
      - `created_at` (timestamptz) - when the log was created

  2. Security
    - Enable RLS on `workout_logs` table
    - Add policies for:
      - Users can insert their own logs
      - Users can read their own logs
      - Users cannot modify or delete logs (preserving workout history)
*/

-- Create the workout_logs table
CREATE TABLE IF NOT EXISTS workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text REFERENCES auth.users(id) NOT NULL,
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

-- Create policies
CREATE POLICY "Users can insert their own logs"
  ON workout_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own logs"
  ON workout_logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX workout_logs_user_id_created_at_idx ON workout_logs (user_id, created_at DESC);