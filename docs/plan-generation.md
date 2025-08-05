# Plan Generation Architecture

## Overview

The Plan Generation system enables users to create personalized workout plans based on their goals, available equipment, and time preferences. This document outlines the complete architecture, including the Custom Plan Management & Volume Control features implemented in July 2025.

**Updated December 2025**: The system now includes Automated Level Up Progression, enabling dynamic generation of subsequent training levels with exercise variety and progressive overload.
## Purpose

The Plan Generation Engine was created to:

1. **Personalize Training**: Generate workout plans tailored to individual equipment availability and goals
2. **Provide Flexibility**: Allow users to choose workout duration based on their schedule
3. **Enable Management**: Give users control over their custom plans with rename and delete functionality
4. **Control Volume**: Provide workout length options from short (30-40 min) to long (60+ min) sessions
5. **Automate Progression**: Dynamically generate new training levels with exercise variety and progressive overload

## Architecture Components

### 1. Workout Templates

Templates serve as blueprints for plan generation, defining the structure and exercise requirements for complete training programs.

**Updated July 2025**: Templates now use a core/accessory slot structure for volume control.
**Updated December 2025**: Templates now include `dayRotation` arrays for structured multi-day programs.

#### Template Schema

```typescript
interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  daysPerWeek: number;
 dayRotation: string[];        // NEW: Defines sequence of day types
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

#### Day-Specific Skeletons

**New in December 2025**: Separate day-specific workout skeletons for modular plan assembly.

```typescript
interface DaySpecificSkeleton {
  dayType: string;              // e.g., 'push', 'pull', 'legs'
  name: string;                 // e.g., 'Push Day', 'Pull Day'
  coreSlots: WorkoutSlot[];     // Essential exercises for this day type
  accessoryPool: WorkoutSlot[]; // Optional exercises for this day type
}
```

**Available Day Types**:
- **Push Day**: Horizontal press, vertical press, tricep extensions, lateral raises
- **Pull Day**: Horizontal pull, vertical pull, bicep curls, rear delt work
- **Legs Day**: Squat, hinge patterns, lunges, calf raises

**Usage**: The `dayRotation` array in templates (e.g., `['push', 'pull', 'legs']`) determines which day-specific skeletons are used to assemble the complete program.
#### Core vs Accessory Structure

**New in July 2025**: Template structure updated to support volume control.

- **Core Slots**: Essential exercises that form the foundation of every workout (e.g., primary compound lifts)
- **Accessory Pool**: Optional isolation/accessory exercises selected based on volume preference

This structure ensures all generated workouts maintain proper exercise selection regardless of chosen duration.

### 2. Plan Generation Engine

**Enhanced July 2025**: Added volume control and improved plan management.
**Enhanced December 2025**: Added automated level progression with exercise variety.

The engine (`src/lib/planGenerationEngine.ts`) handles the core logic for creating personalized plans.

#### Generation Process

1. **Template Selection**: User chooses training goal/template
2. **Volume Selection**: User selects workout length (Short/Standard/Long)
3. **Equipment Selection**: User specifies available equipment
4. **Plan Naming**: User customizes plan name (optional)
4. **Plan Generation**: Engine creates personalized plan based on selections
5. **Level Progression**: Engine can generate subsequent levels with exercise variety

#### Volume Control Logic

```typescript
function getAccessoryCount(volume: VolumeLevel): number {
  switch (volume) {
    case 'short': return 1;     // ~30-40 minutes - Quick, efficient workouts
    case 'standard': return 2;  // ~45-55 minutes (default) - Balanced sessions
    case 'long': return 4;      // ~60+ minutes - Comprehensive training
  }
}
```

The engine always includes all core exercises and selects accessories based on volume preference.

#### Automated Level Progression

**New in December 2025**: Dynamic generation of subsequent training levels.

```typescript
export function generateNextLevel(
  currentPlan: GeneratedPlan,
  previousLevelExerciseIds: string[],
  volume?: VolumeLevel
): TrainingLevel | null
```

**Progression Features**:
- **Exercise Variety**: Excludes exercises from previous level to ensure freshness
- **Progressive Overload**: Increases sets for both core and accessory exercises
- **Template Integrity**: Uses `dayRotation` and day-specific skeletons for consistent structure
- **Equipment Consistency**: Maintains user's original equipment selection
- **Volume Preservation**: Respects user's original volume preference
### 3. Database Schema

**Updated July 2025**: Enhanced to support plan management features.
**Updated December 2025**: Enhanced to support automated progression metadata.

#### User Profiles Table

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan_id text,
  current_level_index integer DEFAULT 0,
  block_start_date timestamptz,
  block_duration_weeks integer DEFAULT 6,
  -- Enhanced JSONB structure supports custom naming and management
  active_generated_plan jsonb,  -- Stores complete generated plan
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Key Fields:**
- `active_generated_plan`: JSONB field storing the complete generated plan object
  - Now includes `name` field for custom plan naming
 - **Enhanced**: Now includes `volume` and `selectedEquipment` for progression context
- `current_plan_id`: References either pre-made plan ID or template ID for generated plans
- Integration with existing training block system

#### Enhanced GeneratedPlan Structure

```typescript
interface GeneratedPlan {
  id: string;
  name: string;
  description: string;
  image: string;
  templateId: string;
  volume: VolumeLevel;          // NEW: Preserved for level progression
  selectedEquipment: string[];  // NEW: Preserved for level progression
  levels: TrainingLevel[];      // Can contain multiple dynamically generated levels
}
```
### 4. Plan Generation Wizard

The wizard (`src/components/PlanGenerationWizard.tsx`) provides a step-by-step interface for plan creation.

**Enhanced July 2025**: Added volume selection step and plan naming.

#### Wizard Steps

1. **Template Selection**: Choose training goal
2. **Volume Selection**: Select workout length (NEW)
3. **Equipment Selection**: Specify available equipment
4. **Plan Generation**: Create and name the plan

**New Step**: Volume Selection
#### Volume Selection Step

- **UI**: Three clear options with duration estimates
- **Default**: Standard volume (45-55 minutes)
- **Visual**: Clock icons and descriptive text for each option

### 5. Custom Plan Management

**New in July 2025**: Complete plan management system.

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
- **Validation**: Name trimming and length validation

### 6. Integration with Existing Systems

#### Training Block System

Generated plans integrate seamlessly with the existing training block system:
- 6-week default duration
- Custom plan names displayed throughout the application
- Progress tracking
- Completion celebration
- Level progression support
- **Enhanced**: Automated level generation on completion

#### Automated Level Progression Flow

**New in December 2025**: Seamless progression for generated plans.

1. **Completion Detection**: Training block completion triggers progression options
2. **Plan Type Check**: System differentiates between generated and pre-made plans
3. **Context Extraction**: For generated plans, extracts template, volume, equipment, and previous exercises
4. **Level Generation**: Creates new level with exercise variety and progressive overload
5. **State Update**: Saves new level to plan and resets training block counters
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

**Updated July 2025**: Enhanced with volume selection and plan management.
**Updated December 2025**: Enhanced with automated level progression.

### Plan Creation Flow

1. **Entry Point**: "Create Your Own Plan" card on plan selection screen
2. **Template Selection**: User chooses training goal
3. **Volume Selection**: User selects workout length preference
4. **Equipment Selection**: User specifies available equipment
5. **Generation**: System creates personalized plan
6. **Plan Naming**: User can customize plan name (with smart defaults)
6. **Naming**: User can customize plan name
7. **Activation**: Plan becomes active training block

### Plan Management Flow

1. **Access**: Generated plan appears on plan selection screen
2. **Management**: Edit/delete icons on plan home screen
3. **Visual Indicators**: Generated plans clearly distinguished from pre-made plans
4. **Custom Names**: User-defined names displayed throughout the application
3. **Rename**: Modal allows name editing
4. **Delete**: Confirmation modal prevents accidental deletion
5. **Navigation**: Returns to plan selection after deletion

### Automated Level Progression Flow

**New in December 2025**: Dynamic progression for generated plans.

1. **Block Completion**: User completes all workouts in current level
2. **Completion Modal**: Shows progression options based on plan type
3. **Generated Plan Path**:
   - "Generate Next Level" button appears
   - System extracts context from completed level
   - New level generated with exercise variety
   - Progressive overload applied (increased sets)
   - User continues with fresh, challenging workouts
4. **Pre-Made Plan Path**:
   - Traditional "Start Level X" progression
   - **New**: "Create a Custom Plan" option for transition to generated system
## Technical Implementation

### Exercise Selection Algorithm

**Enhanced July 2025**: Improved filtering and selection logic.
**Enhanced December 2025**: Added exercise exclusion for variety.

```typescript
function selectExerciseForSlot(
  slot: WorkoutSlot, 
  selectedEquipment: string[], 
  excludeExerciseIds: string[]
): { id: string } | null {
  // Enhanced algorithm with better equipment filtering
  // 1. Filter by movement pattern
  // 2. Filter by exercise type (compound/isolation)
  // 3. Filter by equipment availability
  // 4. Filter out excluded exercises
  // 5. Random selection from candidates
}
```

### Volume-Based Exercise Selection

**New in July 2025**: Core feature for workout duration control.

```typescript
function selectAccessoryExercises(
  accessoryPool: WorkoutSlot[],
  selectedEquipment: string[],
  excludeExerciseIds: string[],
  count: number
): Exercise[] {
  // Volume-based selection from accessory pool
  // Filter accessories by equipment
  // Shuffle and select requested count
  // Ensure variety and equipment compatibility
}
```

### Day-Specific Plan Assembly

**New in December 2025**: Modular workout construction.

```typescript
// Generate workouts based on dayRotation
template.dayRotation.forEach((dayType, index) => {
  const daySpecificSkeleton = getDaySpecificSkeleton(dayType);
  // Populate skeleton with exercises based on equipment and volume
  // Apply progressive overload for level progression
  // Ensure exercise variety by excluding previous level exercises
});
```
### State Management

**Enhanced July 2025**: Added plan management functions.
**Enhanced December 2025**: Added automated progression functions.

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
// Automated progression
const startNextLevel = async () => {
  // Differentiates between generated and pre-made plans
  // For generated plans: extracts context and generates new level
  // For pre-made plans: uses traditional progression
};

**New Functions**:
const deleteGeneratedPlan = async ();
const startNextLevel = async (); // Enhanced with automated generation
```

## Future Enhancements

The current architecture enables several planned features:

1. **Enhanced Volume Control**: ✅ **IMPLEMENTED** - Granular duration options
2. **Automated Level Progression**: ✅ **IMPLEMENTED** - Dynamic level generation
1. **Advanced Volume Control**: More granular duration options
2. **Exercise Substitution**: Swap exercises within generated plans
3. **Progressive Overload**: Automatic weight/rep progression
4. **Plan Templates**: User-created templates for sharing
5. **Workout Balancing**: Muscle group distribution analysis
6. **Equipment Recommendations**: Suggest equipment for better plans
7. **AI-Powered Progression**: Machine learning for optimal progression timing
8. **Social Features**: Share generated plans and progression achievements

**Recently Added**: Plan management, volume control, custom naming
## Configuration

### Template Management

Templates are defined in `src/data/workoutTemplates.ts`:
- Core/accessory slot structure
- Day rotation sequences for multi-day programs
- Movement pattern requirements
- Slot type specifications (compound/isolation)
- Exercise type specifications
- Set/rep schemes

### Day-Specific Skeletons

Day-specific skeletons are defined in `src/data/workoutTemplates.ts`:
- Modular workout day structures
- Movement pattern focus for each day type
- Core and accessory exercise pools
- Progressive overload compatibility
### Volume Settings

Volume levels are configurable in the plan generation engine:
- Accessory exercise counts
- Clear duration estimates for user guidance
- Duration estimates
- User-facing descriptions

### Equipment Options

Equipment list is automatically generated from the exercise dictionary:
- Dynamic equipment detection
- Smart filtering based on exercise requirements
- User-friendly display names
- Bodyweight always included

## Maintenance Notes

### Adding New Templates

**Updated July 2025**: New core/accessory structure.
**Updated December 2025**: New dayRotation requirement.

1. Define template in `workoutTemplates.ts`
2. Structure with core/accessory slots
3. **Required**: Define `dayRotation` array
3. Specify movement patterns and exercise types
4. Test with various equipment combinations
5. Ensure day-specific skeletons exist for all dayRotation entries

### Adding New Day-Specific Skeletons

1. Define skeleton in `DAY_SPECIFIC_SKELETONS`
2. Specify core exercises for the day type
3. Define accessory pool with variety
4. Test with all volume levels
5. Verify progressive overload compatibility
### Updating Volume Logic

1. Modify `getAccessoryCount()` function
2. Update volume display information in `getVolumeDisplayInfo()`
3. Test with all templates and equipment combinations
2. Update volume display information
3. Test with all templates
4. Verify workout duration estimates

### Database Migrations

Generated plan data is stored as JSONB for flexibility:
- No migrations required for plan management features
- Enhanced JSONB structure supports progression metadata
- Schema changes don't require migrations
- Plan structure can evolve over time
- Backward compatibility maintained

This architecture provides a robust foundation for personalized workout plan generation while maintaining integration with existing systems and enabling future feature development.

## Recent Updates (July 2025)

### Major Enhancements
1. **Volume Control System**: Complete workout duration management
2. **Plan Management**: Full CRUD operations for generated plans
3. **Enhanced Templates**: Core/accessory slot architecture
4. **Improved UX**: Better wizard flow and visual feedback

### Performance Improvements
- Optimized exercise selection algorithms
- Reduced database queries during generation
- Enhanced client-side plan assembly
- Improved error handling and validation

### Quality Assurance
- Comprehensive testing of all volume levels
- Validation of template structure conversions
- End-to-end plan management workflow testing
## Recent Updates (December 2025)

### Major Enhancements
1. **Automated Level Progression**: Dynamic generation of subsequent training levels
2. **Day-Specific Skeletons**: Modular workout day architecture
3. **Exercise Variety System**: Intelligent exclusion of previous level exercises
4. **Progressive Overload**: Automatic set increases for advancement
5. **Enhanced Completion Flow**: Different options for generated vs pre-made plans

### Technical Improvements
- Template integrity enforcement with dayRotation
- Enhanced GeneratedPlan interface with progression metadata
- Improved state management for multi-level plans
- Robust error handling for level generation

### User Experience Enhancements
- Seamless progression for generated plans
- Clear differentiation between plan types in completion modal
- Option to transition from pre-made to generated plans
- Preserved user context across level progressions