# Workout Templates Architecture

## Overview

The Workout Templates system provides a blueprint-based approach to generating personalized workout plans in Hypertrophy Hub. Templates define the structure and requirements for complete training programs, which the Plan Generation Engine uses to create customized plans based on user equipment and preferences.

## Table of Contents

- [Template Schema](#template-schema)
- [Template Library](#template-library)
- [Day-Specific Skeletons](#day-specific-skeletons)
- [Adding New Templates](#adding-new-templates)
- [Best Practices](#best-practices)

## Template Schema

### WorkoutTemplate Interface

```typescript
export interface WorkoutTemplate {
  id: string;                    // Unique identifier (e.g., 'push_pull_legs_3day')
  name: string;                  // User-facing name (e.g., 'Push/Pull/Legs')
  description: string;           // Benefit-oriented summary for users
  weeklySchedule: string;        // Training frequency (e.g., '3 Days / Week')
  tags: string[];                // Categorization tags (e.g., ['Strength', 'Hypertrophy'])
  daysPerWeek: number;           // Number of training days per week
  dayRotation: string[];         // Day type rotation (e.g., ['push', 'pull', 'legs'])
  workouts: WorkoutSkeleton[];   // Workout structure definitions
}
```

### WorkoutSlot Interface

Each workout consists of core slots (always included) and accessory pools (volume-dependent):

```typescript
export interface WorkoutSlot {
  slotId: string;                      // Unique slot identifier
  movementPattern: string;             // Movement pattern from Exercise Dictionary
  slotType: 'compound' | 'isolation' | 'core';
  targetSets: number;                  // Number of sets
  targetReps: string;                  // Rep range (e.g., '8-12', '30-45s')
  exerciseType: 'weight_reps' | 'reps_only' | 'reps_only_with_optional_weight' | 'timed';
}
```

### WorkoutSkeleton Interface

```typescript
export interface WorkoutSkeleton {
  day: string;                   // Day identifier (e.g., 'Day 1', 'Monday')
  name: string;                  // Workout name (e.g., 'Day 1 - Push')
  coreSlots: WorkoutSlot[];      // Always-included exercises
  accessoryPool: WorkoutSlot[];  // Optional exercises based on TU budget
}
```

## Template Library

### Current Templates

#### 1. Full Body Hypertrophy (3 Days/Week)
- **ID**: `full_body_hypertrophy_3day`
- **Description**: A balanced 3-day program hitting all major muscle groups each session
- **Tags**: Full Body, Hypertrophy, Balanced
- **Day Rotation**: push, pull, legs
- **Focus**: Optimal training frequency with full-body coverage

#### 2. Push/Pull/Legs (3 Days/Week)
- **ID**: `push_pull_legs_3day`
- **Description**: Logical and synergistic split grouping muscles by function
- **Tags**: Functional, Strength, Classic
- **Day Rotation**: push, pull, legs
- **Focus**: Efficient workouts with functional movement patterns

#### 3. Hypertrophy Superset (3 Days/Week)
- **ID**: `hypertrophy_superset_3day`
- **Description**: Time-efficient, high-intensity workouts with minimal rest
- **Tags**: High Intensity, Time-Efficient, Hypertrophy
- **Day Rotation**: push, pull, legs
- **Focus**: Metabolic stress and muscle growth in shorter sessions

#### 4. Upper/Lower Split (4 Days/Week)
- **ID**: `upper_lower_4day`
- **Description**: Perfect balance of frequency and volume for optimal growth
- **Tags**: Strength, Hypertrophy, Classic
- **Day Rotation**: push, legs, pull, legs
- **Focus**: Hitting muscle groups twice per week with adequate recovery

#### 5. The Bodybuilder Split (4 Days/Week)
- **ID**: `bodybuilder_split_4day`
- **Description**: Classic bro split focusing on one major muscle group per day
- **Tags**: Hypertrophy, Isolation, High Volume
- **Day Rotation**: push, pull, push, legs
- **Focus**: Maximum volume and pump through isolation work

## Day-Specific Skeletons

Day-specific skeletons are reusable workout structures referenced by `dayRotation`. The system includes three core skeleton types:

### Push Day
- **Core Slots**: Horizontal press, vertical press
- **Accessory Pool**: Tricep extensions, lateral raises, chest flies, core work

### Pull Day
- **Core Slots**: Horizontal pull, vertical pull
- **Accessory Pool**: Bicep curls, rear delt work, shrugs, core work

### Legs Day
- **Core Slots**: Squat pattern, hinge pattern
- **Accessory Pool**: Lunges, calf raises, hamstring work, core exercises

## Adding New Templates

### Step 1: Define Template Metadata

Choose appropriate metadata that helps users understand the template's purpose:

```typescript
{
  id: 'template_id',
  name: 'User-Facing Name',
  description: 'Benefit-oriented description that explains what makes this template unique',
  weeklySchedule: 'X Days / Week',
  tags: ['Tag1', 'Tag2', 'Tag3'],  // 2-4 descriptive tags
  daysPerWeek: 3,
  dayRotation: ['push', 'pull', 'legs'],
  workouts: [...]
}
```

### Step 2: Design Workout Structure

For each workout in the template:

1. **Define Core Slots** (always included):
   - 2-3 compound movements
   - Primary movement patterns for the day
   - Appropriate rep ranges and sets

2. **Create Accessory Pool** (volume-dependent):
   - 3-5 isolation or secondary exercises
   - Complimentary movement patterns
   - Higher rep ranges for hypertrophy

### Step 3: Select Movement Patterns

Reference the Exercise Dictionary for valid movement patterns:

**Upper Body**:
- `horizontal_press`, `vertical_press`
- `horizontal_pull`, `vertical_pull`
- `horizontal_adduction`, `horizontal_abduction`
- `tricep_extension`, `bicep_curl`
- `lateral_raise`, `shrug`

**Lower Body**:
- `squat`, `hinge`, `lunge`
- `knee_flexion`, `plantar_flexion`

**Core**:
- `core` (includes planks, crunches, leg raises, etc.)

### Step 4: Add to Templates Dictionary

Add your template to the `WORKOUT_TEMPLATES` object in `src/data/workoutTemplates.ts`:

```typescript
export const WORKOUT_TEMPLATES: Record<string, WorkoutTemplate> = {
  // ... existing templates
  'your_template_id': {
    id: 'your_template_id',
    name: 'Your Template Name',
    description: 'Your template description',
    weeklySchedule: '3 Days / Week',
    tags: ['Tag1', 'Tag2'],
    daysPerWeek: 3,
    dayRotation: ['push', 'pull', 'legs'],
    workouts: [
      {
        day: 'Day 1',
        name: 'Day 1 - Push',
        coreSlots: [
          {
            slotId: 'your_slot_1',
            movementPattern: 'horizontal_press',
            slotType: 'compound',
            targetSets: 4,
            targetReps: '6-10',
            exerciseType: 'weight_reps'
          }
          // ... more core slots
        ],
        accessoryPool: [
          {
            slotId: 'your_acc_1',
            movementPattern: 'tricep_extension',
            slotType: 'isolation',
            targetSets: 3,
            targetReps: '10-15',
            exerciseType: 'weight_reps'
          }
          // ... more accessories
        ]
      }
      // ... more workouts
    ]
  }
};
```

## Best Practices

### Template Design

1. **User-Centric Descriptions**: Write descriptions that focus on benefits, not technical details
2. **Appropriate Tags**: Use 2-4 tags that accurately categorize the template
3. **Clear Schedule**: Specify frequency in "X Days / Week" format
4. **Logical Day Rotation**: Ensure adequate recovery between similar muscle groups

### Slot Configuration

1. **Core Slots**:
   - Include 2-3 fundamental movements
   - Focus on compound exercises
   - Use lower rep ranges for strength (6-10) or moderate ranges for hypertrophy (8-12)

2. **Accessory Pool**:
   - Include 3-5 exercises
   - Mix isolation and secondary compound movements
   - Use higher rep ranges (10-15, 12-20)
   - Ensure variety in movement patterns

### Movement Pattern Selection

1. **Balance**: Include push/pull balance and upper/lower distribution
2. **Variety**: Offer different movement patterns in accessory pools
3. **Progression**: Consider exercise difficulty progression
4. **Equipment Awareness**: Include bodyweight alternatives where possible

### Testing New Templates

After adding a new template:

1. Test generation with minimal equipment (bodyweight only)
2. Test generation with full equipment availability
3. Verify all movement patterns have matching exercises in the Exercise Dictionary
4. Ensure generated workouts fall within reasonable TU budgets (11-19 TUs)
5. Confirm metadata displays correctly in the UI

## Integration with Plan Generation

### Generation Flow

1. User selects template in PlanGenerationWizard
2. User selects volume level (Short/Standard/Long)
3. User specifies available equipment
4. Engine uses template to:
   - Include all core slots
   - Select accessories based on TU budget
   - Filter exercises by equipment availability
   - Create personalized plan with template metadata

### Metadata Flow

Template metadata automatically flows to generated plans:

```typescript
generatedPlan = {
  ...planData,
  weeklySchedule: template.weeklySchedule,  // Copied from template
  tags: template.tags,                      // Copied from template
  templateId: template.id                   // Reference preserved
}
```

This ensures users see consistent information about their plan throughout the application.

## Related Documentation

- [Exercise Dictionary](./exercise-dictionary.md) - Complete exercise definitions and movement patterns
- [Plan Generation](./plan-generation.md) - Plan Generation Engine architecture
- [Training Block System](./training-block-completion.md) - Workout count-based progression

## Future Enhancements

Potential areas for template system expansion:

1. **Template Difficulty Levels**: Beginner, intermediate, advanced variants
2. **Specialized Templates**: Athletic performance, rehabilitation, sport-specific
3. **Periodization Templates**: Linear, undulating, block periodization schemes
4. **Custom Template Builder**: User-created templates with guided workflow
5. **Template Recommendations**: AI-based template suggestions based on user goals and history
