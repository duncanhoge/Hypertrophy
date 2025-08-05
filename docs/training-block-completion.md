# Training Block Workout Count-Based Progression Architecture

## Overview

The Training Block Workout Count-Based Progression system provides users with structured workout programs based on completed workouts rather than elapsed time. This feature establishes the concept of "training blocks" - workout count-based periods where users commit to a specific workout plan, with built-in flexibility to adjust targets and celebrate completion.

**Updated December 2025**: The system now includes Automated Level Up Progression for generated plans, enabling dynamic creation of subsequent training levels with exercise variety and progressive overload.
## Purpose

This system was created to:

1. **Provide Structure**: Give users clear workout targets and expectations for their training programs
2. **Increase Commitment**: Create psychological commitment through explicit plan selection and workout count boundaries
3. **Celebrate Achievement**: Recognize user accomplishments to maintain motivation and engagement
4. **Enable Progression**: Lay the foundation for future features like automatic level progression and program periodization
5. **Improve Accuracy**: Tie progression to actual work completed rather than time elapsed
6. **Handle Flexibility**: Gracefully support users who miss workouts or have irregular schedules
7. **Automate Progression**: Dynamically generate new training levels for personalized plans

## Architecture Components

### 1. Database Schema

#### User Profiles Table (`user_profiles`)

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan_id text,                    -- ID of active workout plan
  current_level_index integer DEFAULT 0,   -- Current level within the plan
  block_start_date timestamptz,            -- When current block started
  block_duration_weeks integer DEFAULT 6,  -- Multiplier for target workout count
  target_workout_count integer,            -- Total workouts required to complete block
  completed_workout_count integer DEFAULT 0, -- Number of workouts completed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Fields:**
- `current_plan_id`: References the active plan from `WORKOUT_PLANS` (e.g., 'duncans-plan')
- `current_level_index`: Index into the plan's levels array (enables multi-level progression)
- `block_start_date`: Timestamp when user clicked "Start This Plan"
- `block_duration_weeks`: User-configurable multiplier for calculating target workout count (default 6)
- `target_workout_count`: Total number of workouts required to complete the training block
- `completed_workout_count`: Running count of workouts completed in the current block

#### Enhanced Workout Logs

The existing `workout_logs` table was extended with training block tracking:

```sql
ALTER TABLE workout_logs ADD COLUMN current_plan_id text;
ALTER TABLE workout_logs ADD COLUMN current_level_index integer DEFAULT 0;
```

These fields are populated during workout logging for future analytics and progression tracking.

### 2. Multi-Level Plan Structure

Workout plans were refactored from single-level to multi-level architecture:

```typescript
interface TrainingLevel {
  level: number;
  name: string;
  description: string;
  workouts: Record<string, WorkoutDay>;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  levels: TrainingLevel[];  // Array of training levels
}
```

**Benefits:**
- Supports future progression features
- Maintains backward compatibility (existing plans become single-level arrays)
- Enables different difficulty levels within the same program
- **Enhanced**: Supports dynamically generated levels for personalized plans

### 3. User Profile Management Hook

The `useUserProfile` hook provides centralized state management for training blocks:

```typescript
export function useUserProfile() {
  // Core profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Key methods
  const startTrainingBlock = async (planId: string, levelIndex: number = 0);
  const endTrainingBlock = async ();
  const updateBlockDuration = async (weeks: number);
  const getWorkoutsRemaining = (): number | null;
  const getWorkoutProgressPercentage = (): number;
  const incrementCompletedWorkoutCount = async ();
  const updateWorkoutCounts = async (newCompleted: number, newTarget: number);
  const isBlockComplete = (): boolean;
}
```

**Key Features:**
- Automatic profile creation on first access
- Real-time calculation of remaining workouts and progress percentage
- Completion status checking
- Manual workout count adjustment for flexibility
- Optimistic UI updates
- **Enhanced**: Automated level progression for generated plans

### 4. Plan Selection Flow

#### Conditional Button Logic

The plan selection interface adapts based on user state:

- **No Active Plan**: Shows "Start This Plan" buttons
- **Has Active Plan**: 
  - Active plan shows "Continue Plan" and progress indicator
  - Other plans show "Switch to This Plan" with confirmation modal
- **Try Plan**: Always available for exploration without commitment

#### Plan Switching Confirmation

When users attempt to switch plans, a confirmation modal prevents accidental progress loss:

```typescript
const handleConfirmSwitch = async () => {
  if (pendingPlanId) {
    await startTrainingBlock(pendingPlanId);
    onSelectPlan(pendingPlanId);
  }
  // Clear existing block state and start new one
};
```

### 5. Settings Panel

The contextual settings panel provides block management:

**Location**: Accessible from the plan home screen (gear icon in header)

**Features:**
- Duration adjustment with +/- controls
- Block start date display
- "End Block Early" option with confirmation
- Immediate database updates

### 6. Completion Detection & Celebration

#### Completion Logic

Completion is checked based on workout count:

```typescript
const isBlockComplete = (): boolean => {
  if (!profile?.target_workout_count) return false;
  
  const completed = profile.completed_workout_count || 0;
  return completed >= profile.target_workout_count;
};
```

#### Success Screen

The `TrainingBlockCompleteModal` provides celebration and closure:

- **Visual Elements**: Trophy icon, animated stars, achievement checkmarks
- **Personalization**: Shows actual plan name and duration completed
- **Action**: Single "Done" button that clears block state
- **Motivation**: Inspirational quote and achievement highlights
- **Enhanced**: Different progression options based on plan type

### 7. Automated Level Progression

**New in December 2025**: Dynamic level generation for personalized plans.

#### Plan Type Detection

The system differentiates between two plan types:
- **Pre-made Plans**: Static plans defined in `WORKOUT_PLANS`
- **Generated Plans**: Dynamic plans stored in `active_generated_plan`

#### Progression Logic

```typescript
const startNextLevel = async () => {
  if (profile.active_generated_plan) {
    // Generated plan: Use plan generation engine
    const currentGeneratedPlan = profile.active_generated_plan as GeneratedPlan;
    const currentLevel = currentGeneratedPlan.levels[profile.current_level_index || 0];
    
    // Extract exercise IDs from completed level
    const previousLevelExerciseIds = extractExerciseIds(currentLevel);
    
    // Generate next level with exercise variety
    const nextLevel = generateNextLevel(currentGeneratedPlan, previousLevelExerciseIds);
    
    // Add to plan and update user state
    const updatedPlan = { ...currentGeneratedPlan, levels: [...levels, nextLevel] };
    await updateProfile({ active_generated_plan: updatedPlan, ... });
  } else {
    // Pre-made plan: Use traditional progression
    // Advance to next pre-defined level
  }
};
```

#### Exercise Variety System

To ensure fresh workouts, the system:
1. **Extracts Context**: Gets exercise IDs from the just-completed level
2. **Excludes Previous**: Passes these IDs to the generation engine as exclusions
3. **Generates Variety**: Engine selects different exercises for the same movement patterns
4. **Maintains Structure**: Uses day-specific skeletons to preserve workout balance

#### Progressive Overload

Each generated level includes progression:
- **Increased Sets**: Core exercises get +1 set
- **Accessory Progression**: Accessory exercises also get +1 set
- **Volume Consistency**: Maintains user's original volume preference
- **Equipment Consistency**: Uses same equipment selection
## User Flow

### 1. Starting a Training Block

1. User visits plan selection screen
2. Clicks "Start This Plan" on desired program
3. System creates/updates user profile:
   - Sets `current_plan_id`
   - Sets `block_start_date` to current timestamp
   - Calculates `target_workout_count` as (workout days × multiplier)
   - Sets `completed_workout_count` to 0
   - Sets `current_level_index` to 0
4. User is navigated to plan home screen

### 2. During Training Block

1. Plan home screen shows:
   - "X / Y Workouts Completed" indicator with progress bar
   - Settings gear icon for adjustments and progress editing
   - Current level information
2. Each completed workout increments `completed_workout_count`
3. Settings panel allows multiplier adjustments and manual progress editing

### 3. Block Completion

1. App checks completion status on load
2. If `completed_workout_count >= target_workout_count`, shows celebration modal
3. User presented with progression options:
   - **Start Next Level** (if available): Advances to next level in current plan
   - **Restart This Level**: Repeats current level with fresh 6-week block
   - **Decide Later**: Clears block state and returns to plan selection
4. System updates user state based on selection
5. User navigated to appropriate screen (plan home or plan selection)

## Level Up Progression Flow

The completion screen now serves as a dynamic decision point for user progression, transforming from a simple acknowledgment into an active progression system.

**Enhanced December 2025**: Different flows for generated vs pre-made plans.
### Progression Logic

#### Generated Plan Progression

**New in December 2025**: Automated level generation.

- **Button Label**: "Generate Next Level"
- **Process**:
  1. Extract template, volume, and equipment from current plan
  2. Get exercise IDs from completed level for exclusion
  3. Call `generateNextLevel()` with context and exclusions
  4. Add generated level to plan and update user state
- **Benefits**: Fresh exercises, progressive overload, maintained structure
- **Description**: "A new personalized level will be generated with fresh exercises and increased difficulty."
#### Start Next Level
- **Availability**: Only shown if `plan.levels[currentLevelIndex + 1]` exists
- **Button Label**: "Start Level [X]" (e.g., "Start Level 2")
- **State Changes**:
  - `current_level_index` incremented by 1
  - `completed_workout_count` reset to 0
  - `target_workout_count` recalculated for new level
  - `block_start_date` reset to current timestamp
- **Navigation**: User taken to plan home screen for new level
- **Description**: Shows next level name and description for context

#### Restart This Level
- **Availability**: Always available
- **Button Label**: "Restart This Level"
- **State Changes**:
  - `current_level_index` remains unchanged
  - `completed_workout_count` reset to 0
  - `target_workout_count` remains the same
  - `block_start_date` reset to current timestamp
- **Navigation**: User taken to plan home screen for current level
- **Use Case**: For users who want to master current level before progressing

#### Create a Custom Plan

**New in December 2025**: Transition option for pre-made plans.

- **Availability**: Only shown for completed pre-made plans
- **Button Label**: "Create a Custom Plan"
- **Action**: Launches `PlanGenerationWizard`
- **Purpose**: Allows users to transition from static to dynamic progression
- **Benefits**: Personalized future progression with automated level generation
#### Decide Later
- **Availability**: Always available as tertiary option
- **Button Style**: Text link or less prominent button
- **State Changes**: Clears all block state (legacy behavior)
- **Navigation**: Returns to plan selection screen
- **Use Case**: For users who want to explore other plans or take a break

### Multi-Level Plan Structure

The progression system leverages the existing multi-level architecture:

```typescript
interface TrainingLevel {
  level: number;
  name: string;
  description: string;
  workouts: Record<string, WorkoutDay>;
}
```

#### Level Progression Design
- **Level 1 (Foundation)**: Base program with moderate volume and intensity
- **Level 2 (Intermediate/Advanced)**: Increased sets, reps, and exercise variety
- **Future Levels**: Can be added to extend progression indefinitely
- **Generated Levels**: Dynamically created with exercise variety and progressive overload

#### Content Scaling
- **Volume Increase**: More sets per exercise (3→4→5)
- **Intensity Increase**: Lower rep ranges for strength focus
- **Exercise Variety**: Additional exercises for comprehensive development
- **Duration Increase**: Longer timed exercises for endurance progression
- **Dynamic Variety**: Different exercises for same movement patterns (generated plans only)

### User Experience Enhancements

#### Visual Feedback
- **Level Achievement**: Clear indication of completed level
- **Next Level Preview**: Name and description of upcoming level
- **Progress Context**: Shows current level completion in celebration
- **Plan Type Awareness**: Different UI elements for generated vs pre-made plans

#### Motivational Elements
- **Achievement Recognition**: Acknowledges specific level completion
- **Forward Momentum**: Emphasizes progression and growth
- **Choice Empowerment**: Gives users control over their progression path
- **Personalization**: Highlights the custom nature of generated progressions

### Implementation Details

#### Hook Methods
```typescript
const incrementCompletedWorkoutCount = async () => {
  const newCount = (profile.completed_workout_count || 0) + 1;
  return updateProfile({ completed_workout_count: newCount });
};

const updateWorkoutCounts = async (newCompleted: number, newTarget: number) => {
  return updateProfile({
    completed_workout_count: newCompleted,
    target_workout_count: newTarget
  });
};

const startNextLevel = async () => {
 // Enhanced with generated plan detection and automated progression
  return updateProfile({
    current_level_index: (profile.current_level_index || 0) + 1,
    completed_workout_count: 0,
    target_workout_count: calculateTargetCount(),
    block_start_date: new Date().toISOString()
  });
};

const restartCurrentLevel = async () => {
  return updateProfile({
    completed_workout_count: 0,
    block_start_date: new Date().toISOString()
  });
};
```

#### Conditional UI Logic
```typescript
const workoutsRemaining = getWorkoutsRemaining();
const progressPercentage = getWorkoutProgressPercentage();
const isComplete = profile.completed_workout_count >= profile.target_workout_count;
const isGeneratedPlan = profile.active_generated_plan && !WORKOUT_PLANS[profile.current_plan_id];
```

## Technical Implementation Details

### Database Triggers

Automatic profile creation on user signup:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Row Level Security

All profile operations are user-scoped:

```sql
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
```

### Error Handling

- Profile creation fallback if not exists
- Graceful degradation for missing plan data
- Validation for duration adjustments (minimum 1 week)
- Robust error handling for level generation failures

## Future Enhancements

This architecture enables several planned features:

1. **Automatic Level Progression**: ✅ **IMPLEMENTED** - Users can progress to next level on completion
2. **Automated Level Generation**: ✅ **IMPLEMENTED** - Dynamic level creation for generated plans
2. **Program Periodization**: Different phases within training blocks
3. **Achievement System**: Badges for consistency, completion streaks
4. **Analytics Dashboard**: Progress visualization across blocks
5. **Social Features**: Share completions, compare with friends
6. **Adaptive Progression**: AI-suggested level advancement based on performance
7. **Custom Level Creation**: User-generated training progressions
8. **Cross-Plan Progression**: Transition between different workout programs
9. **Smart Exercise Selection**: ML-powered exercise recommendations based on performance
10. **Personalized Progression Timing**: Adaptive block duration based on user patterns

## Configuration

### Default Values

- **Block Multiplier**: 6 (configurable per user)
- **Target Calculation**: (workout days in plan) × multiplier
- **Level Index**: 0 (first level of selected plan)
- **Completion Check**: Based on workout count comparison

### Customization Points

- Block multiplier limits (currently 1+)
- Manual workout count adjustment
- Completion celebration content
- Plan switching confirmation messages
- Progress indicators and visual design
- Level generation parameters (progressive overload amounts, exercise variety rules)

## Maintenance Notes

### Database Migrations

All schema changes use `IF NOT EXISTS` patterns for safe deployment:

```sql
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'workout_logs' AND column_name = 'current_plan_id') 
  THEN
    ALTER TABLE workout_logs ADD COLUMN current_plan_id text;
  END IF;
END $$;
```

### Data Consistency

- User profiles auto-created on first access
- Workout completion automatically increments count
- Plan data validated before block creation
- Manual count adjustments validated for data integrity
- State transitions maintain data integrity
- Generated level validation ensures structural integrity

### Level Generation Maintenance

- Template integrity validation for dayRotation arrays
- Day-specific skeleton availability checks
- Exercise exclusion logic validation
- Progressive overload parameter tuning
- Error recovery for failed level generation
This architecture provides a more accurate and flexible foundation for structured training programs, ensuring progression is tied to actual work completed rather than time elapsed, while maintaining the user experience that makes the application engaging and effective.
**Recent Enhancement (December 2025)**: The addition of automated level progression for generated plans represents a significant advancement in personalized fitness programming, providing users with truly dynamic and adaptive training experiences that evolve based on their individual progress and preferences.