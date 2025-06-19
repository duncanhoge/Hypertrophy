# Training Block Duration & Completion Architecture

## Overview

The Training Block Duration & Completion system provides users with structured, time-bound workout programs. This feature establishes the concept of "training blocks" - fixed-duration periods where users commit to a specific workout plan, with built-in flexibility to adjust duration and celebrate completion.

## Purpose

This system was created to:

1. **Provide Structure**: Give users clear timelines and expectations for their training programs
2. **Increase Commitment**: Create psychological commitment through explicit plan selection and time boundaries
3. **Celebrate Achievement**: Recognize user accomplishments to maintain motivation and engagement
4. **Enable Progression**: Lay the foundation for future features like automatic level progression and program periodization

## Architecture Components

### 1. Database Schema

#### User Profiles Table (`user_profiles`)

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan_id text,                    -- ID of active workout plan
  current_level_index integer DEFAULT 0,   -- Current level within the plan
  block_start_date timestamptz,            -- When current block started
  block_duration_weeks integer DEFAULT 6,  -- Duration of current block
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Fields:**
- `current_plan_id`: References the active plan from `WORKOUT_PLANS` (e.g., 'duncans-plan')
- `current_level_index`: Index into the plan's levels array (enables multi-level progression)
- `block_start_date`: Timestamp when user clicked "Start This Plan"
- `block_duration_weeks`: User-configurable duration (default 6 weeks)

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
  const getWeeksRemaining = (): number | null;
  const isBlockComplete = (): boolean;
}
```

**Key Features:**
- Automatic profile creation on first access
- Real-time calculation of remaining weeks
- Completion status checking
- Optimistic UI updates

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

Completion is checked on every app load:

```typescript
const isBlockComplete = (): boolean => {
  if (!profile?.block_start_date || !profile.current_plan_id) return false;
  
  const startDate = new Date(profile.block_start_date);
  const currentDate = new Date();
  const weeksElapsed = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
  
  return weeksElapsed >= profile.block_duration_weeks;
};
```

#### Success Screen

The `TrainingBlockCompleteModal` provides celebration and closure:

- **Visual Elements**: Trophy icon, animated stars, achievement checkmarks
- **Personalization**: Shows actual plan name and duration completed
- **Action**: Single "Done" button that clears block state
- **Motivation**: Inspirational quote and achievement highlights

## User Flow

### 1. Starting a Training Block

1. User visits plan selection screen
2. Clicks "Start This Plan" on desired program
3. System creates/updates user profile:
   - Sets `current_plan_id`
   - Sets `block_start_date` to current timestamp
   - Sets `block_duration_weeks` to 6 (default)
   - Sets `current_level_index` to 0
4. User is navigated to plan home screen

### 2. During Training Block

1. Plan home screen shows:
   - "X weeks remaining" indicator
   - Settings gear icon for adjustments
   - Current level information
2. Workout logging includes plan/level metadata
3. Settings panel allows duration adjustments

### 3. Block Completion

1. App checks completion status on load
2. If complete, shows celebration modal immediately
3. User clicks "Done" to acknowledge
4. System clears block state (returns to plan selection)
5. User can start new block (same or different plan)

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

## Future Enhancements

This architecture enables several planned features:

1. **Automatic Level Progression**: Move to next level on completion
2. **Program Periodization**: Different phases within training blocks
3. **Achievement System**: Badges for consistency, completion streaks
4. **Analytics Dashboard**: Progress visualization across blocks
5. **Social Features**: Share completions, compare with friends

## Configuration

### Default Values

- **Block Duration**: 6 weeks (configurable per user)
- **Level Index**: 0 (first level of selected plan)
- **Completion Check**: Every app load/home screen render

### Customization Points

- Block duration limits (currently 1+ weeks)
- Completion celebration content
- Plan switching confirmation messages
- Progress indicators and visual design

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
- Workout logs stamped with current block context
- Plan data validated before block creation

This architecture provides a solid foundation for structured training programs while maintaining the flexibility and user experience that makes the application engaging and effective.