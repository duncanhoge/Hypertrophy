# Plan Generation Architecture

## Overview

The Plan Generation system enables users to create personalized workout plans based on their goals, available equipment, and time preferences. This document outlines the complete architecture, including the new Custom Plan Management & Volume Control features.

## Purpose

The Plan Generation Engine was created to:

1. **Personalize Training**: Generate workout plans tailored to individual equipment availability and goals
2. **Provide Flexibility**: Allow users to choose workout duration based on their schedule
3. **Enable Management**: Give users control over their custom plans with rename and delete functionality
4. **Support Progression**: Foundation for future features like automatic level advancement

## Architecture Components

### 1. Workout Templates

Templates serve as blueprints for plan generation, defining the structure and exercise requirements for complete training programs.

#### Template Schema

```typescript
interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
  workouts: WorkoutSkeleton[];
}

interface WorkoutSkeleton {
  day: string;
  name: string;
  coreSlots: WorkoutSlot[];      // Essential exercises (always included)
  accessoryPool: WorkoutSlot[];  // Optional exercises (volume-dependent)
}

interface WorkoutSlot {
  slotId: string;
  movementPattern: string;
  slotType: 'compound' | 'isolation';
  targetSets: number;
  targetReps: string;
  exerciseType: 'weight_reps' | 'reps_only' | 'reps_only_with_optional_weight' | 'timed';
}
```

#### Core vs Accessory Structure

- **Core Slots**: Essential exercises that form the foundation of every workout (e.g., primary compound lifts)
- **Accessory Pool**: Optional isolation/accessory exercises selected based on volume preference

This structure ensures all generated workouts maintain proper exercise selection regardless of chosen duration.

### 2. Plan Generation Engine

The engine (`src/lib/planGenerationEngine.ts`) handles the core logic for creating personalized plans.

#### Generation Process

1. **Template Selection**: User chooses training goal/template
2. **Volume Selection**: User selects workout length (Short/Standard/Long)
3. **Equipment Selection**: User specifies available equipment
4. **Plan Generation**: Engine creates personalized plan based on selections

#### Volume Control Logic

```typescript
function getAccessoryCount(volume: VolumeLevel): number {
  switch (volume) {
    case 'short': return 1;     // ~30-40 minutes
    case 'standard': return 2;  // ~45-55 minutes (default)
    case 'long': return 4;      // ~60+ minutes
  }
}
```

The engine always includes all core exercises and selects accessories based on volume preference.

### 3. Database Schema

#### User Profiles Table

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan_id text,
  current_level_index integer DEFAULT 0,
  block_start_date timestamptz,
  block_duration_weeks integer DEFAULT 6,
  active_generated_plan jsonb,  -- Stores complete generated plan
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Fields:**
- `active_generated_plan`: JSONB field storing the complete generated plan object
- `current_plan_id`: References either pre-made plan ID or template ID for generated plans
- Integration with existing training block system

### 4. Plan Generation Wizard

The wizard (`src/components/PlanGenerationWizard.tsx`) provides a step-by-step interface for plan creation.

#### Wizard Steps

1. **Template Selection**: Choose training goal
2. **Volume Selection**: Select workout length (NEW)
3. **Equipment Selection**: Specify available equipment
4. **Plan Generation**: Create and name the plan

#### Volume Selection Step

- **UI**: Three clear options with duration estimates
- **Default**: Standard volume (45-55 minutes)
- **Visual**: Clock icons and descriptive text for each option

### 5. Custom Plan Management

#### Rename Functionality

- **Location**: Plan home screen (edit icon next to plan title)
- **Implementation**: Updates `active_generated_plan.name` in database
- **UI**: Modal with text input pre-filled with current name

#### Delete Functionality

- **Location**: Plan home screen (delete icon next to plan title)
- **Confirmation**: Required confirmation modal with clear warning
- **Implementation**: Sets `active_generated_plan` to null, clears related state

#### Plan Naming

- **Initial Naming**: Text input in final wizard step
- **Default Name**: Template-based (e.g., "My Full Body Hypertrophy")
- **Post-Creation**: Editable via rename functionality

### 6. Integration with Existing Systems

#### Training Block System

Generated plans integrate seamlessly with the existing training block system:
- 6-week default duration
- Progress tracking
- Completion celebration
- Level progression support

#### Exercise Dictionary

Generated plans leverage the centralized exercise dictionary:
- Movement pattern matching
- Equipment filtering
- Exercise metadata
- Alternative exercise support

#### Workout Session

Generated plans work with the existing workout session interface:
- Exercise logging
- Rest timers
- Progress tracking
- History integration

## User Flow

### Plan Creation Flow

1. **Entry Point**: "Create Your Own Plan" card on plan selection screen
2. **Template Selection**: User chooses training goal
3. **Volume Selection**: User selects workout length preference
4. **Equipment Selection**: User specifies available equipment
5. **Generation**: System creates personalized plan
6. **Naming**: User can customize plan name
7. **Activation**: Plan becomes active training block

### Plan Management Flow

1. **Access**: Generated plan appears on plan selection screen
2. **Management**: Edit/delete icons on plan home screen
3. **Rename**: Modal allows name editing
4. **Delete**: Confirmation modal prevents accidental deletion
5. **Navigation**: Returns to plan selection after deletion

## Technical Implementation

### Exercise Selection Algorithm

```typescript
function selectExerciseForSlot(
  slot: WorkoutSlot, 
  selectedEquipment: string[], 
  excludeExerciseIds: string[]
): { id: string } | null {
  // 1. Filter by movement pattern
  // 2. Filter by exercise type (compound/isolation)
  // 3. Filter by equipment availability
  // 4. Filter out excluded exercises
  // 5. Random selection from candidates
}
```

### Volume-Based Exercise Selection

```typescript
function selectAccessoryExercises(
  accessoryPool: WorkoutSlot[],
  selectedEquipment: string[],
  excludeExerciseIds: string[],
  count: number
): Exercise[] {
  // Filter accessories by equipment
  // Shuffle and select requested count
  // Ensure variety and equipment compatibility
}
```

### State Management

The `useUserProfile` hook manages generated plan state:

```typescript
// Plan creation
const startGeneratedPlan = async (generatedPlan: any) => {
  return updateProfile({
    active_generated_plan: generatedPlan,
    current_plan_id: generatedPlan.templateId,
    current_level_index: 0,
    block_start_date: new Date().toISOString(),
    block_duration_weeks: 6
  });
};

// Plan management
const updateGeneratedPlanName = async (newName: string);
const deleteGeneratedPlan = async ();
```

## Future Enhancements

The current architecture enables several planned features:

1. **Advanced Volume Control**: More granular duration options
2. **Exercise Substitution**: Swap exercises within generated plans
3. **Progressive Overload**: Automatic weight/rep progression
4. **Plan Templates**: User-created templates for sharing
5. **Workout Balancing**: Muscle group distribution analysis
6. **Equipment Recommendations**: Suggest equipment for better plans

## Configuration

### Template Management

Templates are defined in `src/data/workoutTemplates.ts`:
- Core/accessory slot structure
- Movement pattern requirements
- Exercise type specifications
- Set/rep schemes

### Volume Settings

Volume levels are configurable in the plan generation engine:
- Accessory exercise counts
- Duration estimates
- User-facing descriptions

### Equipment Options

Equipment list is automatically generated from the exercise dictionary:
- Dynamic equipment detection
- User-friendly display names
- Bodyweight always included

## Maintenance Notes

### Adding New Templates

1. Define template in `workoutTemplates.ts`
2. Structure with core/accessory slots
3. Specify movement patterns and exercise types
4. Test with various equipment combinations

### Updating Volume Logic

1. Modify `getAccessoryCount()` function
2. Update volume display information
3. Test with all templates
4. Verify workout duration estimates

### Database Migrations

Generated plan data is stored as JSONB for flexibility:
- Schema changes don't require migrations
- Plan structure can evolve over time
- Backward compatibility maintained

This architecture provides a robust foundation for personalized workout plan generation while maintaining integration with existing systems and enabling future feature development.