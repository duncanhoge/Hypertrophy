# Frontend Component Reference

This document serves as the comprehensive reference for all frontend components, design tokens, and styling patterns used in the Hypertrophy Hub application.

## Design System Overview

The Hypertrophy Hub application follows a premium "Apple-level" design aesthetic with a sophisticated gold and black theme. The design emphasizes clean typography, consistent spacing, and thoughtful micro-interactions.

## Design Tokens

### Color Palette

#### Primary Colors
```css
theme-gold: #FFD700          /* Primary actions, highlights, success states */
theme-gold-light: #FFE55C    /* Hover states, lighter accents */
theme-gold-dark: #B7A000     /* Muted text, secondary elements */
```

#### Background Colors
```css
theme-black: #000000         /* Primary background */
theme-black-light: #121212   /* Secondary background, cards */
theme-black-lighter: #1A1A1A /* Tertiary background, nested elements */
```

#### Neutral Colors
```css
theme-white: #FFFFFF         /* High contrast text */
theme-white-muted: rgba(255, 255, 255, 0.7) /* Muted white text */
```

### Typography

#### Font Family
- **Primary**: Archivo (Google Fonts)
- **Fallback**: sans-serif

#### Font Weights
- **Regular**: 400
- **Semibold**: 600
- **Bold**: 700
- **Black**: 900 (for hero text)

#### Typography Scale
- **Hero Text**: `clamp(3rem, 10vw, 8rem)` - Uppercase, black weight, tracking-wider
- **Headings**: 
  - H1: `text-3xl` (48px)
  - H2: `text-2xl` (32px)
  - H3: `text-xl` (24px)
  - H4: `text-lg` (20px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Extra Small**: `text-xs` (12px)

### Spacing System

Based on 8px grid system:
- **Base unit**: 8px
- **Spacing scale**: 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64

### Border Radius Hierarchy

```css
/* Semantic container hierarchy */
top-level-container: 48px    /* Level 1: Main cards, primary containers */
nested-container: 32px       /* Level 2: Containers inside main cards */
2x-nested-container: 8px     /* Level 3: Items inside nested containers */

/* Standard Tailwind aliases */
sm: 8px                      /* Small elements */
md: 32px                     /* Medium containers */
lg: 64px                     /* Buttons (pill shape) */
xl: 48px                     /* Large containers */
```

## Core UI Components

### Button Components

#### `Button` (Base Component)
**Location**: `src/components/ui/Button.tsx`

**Purpose**: Base button component with variant support

**Props**:
- `onClick: () => void` - Click handler
- `children: React.ReactNode` - Button content
- `className?: string` - Additional CSS classes
- `ariaLabel: string` - Accessibility label
- `type?: 'button' | 'submit'` - Button type
- `disabled?: boolean` - Disabled state
- `variant?: 'primary' | 'secondary'` - Visual variant

**Variants**:
- **Primary**: Gold background, black text, bold font weight
- **Secondary**: Black background, gold text, gold border

**Usage**:
```tsx
<Button onClick={handleClick} ariaLabel="Save changes" variant="primary">
  Save Changes
</Button>
```

#### `PrimaryButton`
**Purpose**: Convenience wrapper for primary variant
**Styling**: Gold background (`bg-theme-gold`), black text, semibold font

#### `SecondaryButton`
**Purpose**: Convenience wrapper for secondary variant
**Styling**: Black background, gold text, gold border

#### `TilePrimaryButton`
**Purpose**: Primary button with small border radius for tile layouts
**Styling**: Same as primary but with `rounded-sm` (8px)

#### `IconButton`
**Location**: `src/components/ui/IconButton.tsx`

**Purpose**: Button specifically designed for icons with consistent styling

**Props**:
- `onClick: () => void`
- `children: React.ReactNode` - Icon content
- `className?: string`
- `ariaLabel: string`
- `type?: 'button' | 'submit'`
- `disabled?: boolean`

**Styling**: 
- Black background with gold border
- Hover: Lighter black background
- Padding: `p-3` (12px)
- Border radius: `rounded-lg` (64px)

**Usage**:
```tsx
<IconButton onClick={handleEdit} ariaLabel="Edit item">
  <Edit3 size={20} />
</IconButton>
```

### Container Components

#### `Card`
**Location**: `src/components/ui/Card.tsx`

**Purpose**: Primary container component for content sections

**Props**:
- `children: React.ReactNode`
- `className?: string`
- `onClick?: () => void` - Optional click handler for interactive cards

**Styling**:
- Border radius: `rounded-top-level-container` (48px)
- Border: `border-theme-white/20`
- Padding: `p-6` (24px)

**Usage**:
```tsx
<Card className="bg-theme-black-light">
  <h2>Card Title</h2>
  <p>Card content...</p>
</Card>
```

#### `Modal`
**Location**: `src/components/ui/Modal.tsx`

**Purpose**: Overlay modal component with backdrop and header

**Props**:
- `isOpen: boolean`
- `onClose: () => void`
- `title: string`
- `children: React.ReactNode`

**Features**:
- Backdrop blur effect
- Automatic close button in header
- Responsive sizing (`max-w-md`)
- Z-index: `z-50`

**Usage**:
```tsx
<Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Settings">
  <p>Modal content...</p>
</Modal>
```

## Feature Components

### Authentication Components

#### `AuthScreen`
**Location**: `src/components/AuthScreen.tsx`

**Purpose**: Complete authentication interface with sign in, sign up, and password reset

**Features**:
- Multi-mode support (signin/signup/reset)
- Form validation
- Loading states
- Error handling
- Remember me functionality

**States**:
- `signin` - Default login form
- `signup` - Account creation
- `reset` - Password reset

#### `AuthWrapper`
**Location**: `src/components/AuthWrapper.tsx`

**Purpose**: Authentication state management and route protection

**Features**:
- Session persistence handling
- Loading state management
- Automatic profile creation
- Password reset flow handling

### Workout Components

#### `WorkoutSession`
**Location**: `src/components/WorkoutSession.tsx`

**Purpose**: Primary workout interface for logging exercises

**Features**:
- Multi-exercise type support (weight_reps, reps_only, timed)
- Integrated rest timer with pulsing animation
- Exercise queue visualization
- Progress tracking
- Exercise history integration
- Enhanced timed exercise interface with stopwatch

**Exercise Types**:
1. **Weight & Reps** (`weight_reps`): Weight and repetition inputs
2. **Reps Only** (`reps_only`): Repetition input only, AMRAP support
3. **Timed** (`timed`): Duration input with interactive stopwatch

#### `ExerciseHistory`
**Location**: `src/components/ExerciseHistory.tsx`

**Purpose**: Modal displaying exercise performance history

**Features**:
- Chronological exercise logs
- Performance metrics display
- Most recent performance highlight
- Grouped by date
- Loading and error states

#### `PulsingTimerBackground`
**Location**: `src/components/PulsingTimerBackground.tsx`

**Purpose**: Animated canvas background for rest timers

**Features**:
- Canvas-based pulsing animation
- Dynamic pulse frequency based on remaining time
- Responsive design
- Performance optimized

#### `TrainingBlockCompleteModal`
**Location**: `src/components/TrainingBlockCompleteModal.tsx`

**Purpose**: Celebration modal for completed training blocks

**Features**:
- Achievement graphics with animations
- Personalized completion messages
- Level progression options
- Motivational content

### Plan Management Components

#### `PlanSelection`
**Location**: `src/components/PlanSelection.tsx`

**Purpose**: Main plan selection interface with training block integration

**Features**:
- Pre-made plan display
- Generated plan management
- Training block status indicators
- Plan switching confirmation
- Workout history section

**Plan States**:
- **No Active Plan**: "Start This Plan" buttons
- **Active Plan**: "Continue Plan" with progress
- **Different Plan**: "Switch to This Plan" with confirmation

#### `HomeScreen`
**Location**: `src/components/HomeScreen.tsx`

**Purpose**: Plan home interface with workout selection and management

**Features**:
- Current level display
- Workout day selection
- Training block progress indicator
- Settings panel access
- Generated plan management (rename/delete)

#### `PlanGenerationWizard`
**Location**: `src/components/PlanGenerationWizard.tsx`

**Purpose**: Step-by-step plan generation interface

**Steps**:
1. **Template Selection**: Choose training goal
2. **Volume Selection**: Select workout length
3. **Equipment Selection**: Specify available equipment
4. **Generation**: Create and name the plan

**Features**:
- Progress indicator
- Form validation
- Equipment filtering
- Plan customization

## Specialized Components

### Timer Components

#### `InlineTimer` (within WorkoutSession)
**Purpose**: Inline rest timer with circular progress

**Features**:
- Circular SVG progress ring
- Countdown display
- Skip functionality
- Pulsing background animation

#### `TimedExerciseTimer` (within WorkoutSession)
**Purpose**: Stopwatch interface for timed exercises

**Features**:
- Count-up timer display
- Target time reference
- Completion detection
- Large, clear time display

### Form Components

#### Input Fields (within components)
**Styling Patterns**:
- Background: `bg-theme-black-lighter`
- Border: `border-theme-gold/30`
- Focus: `focus:ring-2 focus:ring-theme-gold/50`
- Text: `text-theme-gold`
- Placeholder: `placeholder-theme-gold-dark/50`

#### Labels
**Styling**: 
- Floating labels: `absolute -top-2 left-4 px-2 bg-theme-black-light text-xs text-theme-gold-dark`

## Layout Patterns

### Container Hierarchy

1. **Page Level**: `max-w-7xl mx-auto` - Main page container
2. **Section Level**: `max-w-4xl mx-auto` - Content sections
3. **Component Level**: `max-w-2xl mx-auto` - Individual components

### Grid Systems

#### Plan Cards
```css
grid-cols-1 gap-6                    /* Mobile */
md:grid-cols-2 gap-6                 /* Tablet */
lg:grid-cols-3 gap-6                 /* Desktop */
```

#### Workout Days
```css
grid-cols-1 sm:grid-cols-3 gap-4     /* Responsive workout day grid */
```

### Spacing Patterns

#### Component Spacing
- **Between sections**: `space-y-8` (32px)
- **Between elements**: `space-y-6` (24px)
- **Between related items**: `space-y-4` (16px)
- **Between tight items**: `space-y-2` (8px)

#### Padding Patterns
- **Cards**: `p-6` (24px)
- **Buttons**: `p-3` (12px)
- **Nested containers**: `p-4` (16px)
- **Small elements**: `p-2` (8px)

## Animation & Interaction Patterns

### Hover States
- **Cards**: `hover:scale-[1.02]` - Subtle scale up
- **Buttons**: `hover:bg-theme-gold-light` - Color transition
- **Interactive elements**: `transition-all duration-200` - Smooth transitions

### Loading States
- **Spinners**: `animate-spin rounded-full h-8 w-8 border-b-2 border-theme-gold`
- **Pulse**: `animate-pulse` for skeleton loading

### Focus States
- **Interactive elements**: `focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50`

## Responsive Design Patterns

### Breakpoints
- **Mobile**: Default (< 640px)
- **Small**: `sm:` (≥ 640px)
- **Medium**: `md:` (≥ 768px)
- **Large**: `lg:` (≥ 1024px)

### Typography Responsiveness
- **Hero text**: `clamp(3rem, 10vw, 8rem)` - Fluid scaling
- **Headings**: Responsive sizing with `text-xl md:text-2xl lg:text-3xl`

### Layout Responsiveness
- **Flex direction**: `flex-col md:flex-row` - Stack on mobile, row on desktop
- **Grid columns**: Progressive enhancement from 1 to 2 to 3 columns
- **Padding**: `p-4 sm:p-6 md:p-8` - Increased padding on larger screens

## Accessibility Patterns

### ARIA Labels
- All interactive elements have `ariaLabel` props
- Buttons include descriptive labels
- Form inputs have proper labeling

### Keyboard Navigation
- Focus management in modals
- Tab order preservation
- Escape key handling for modals

### Color Contrast
- Gold on black meets WCAG AA standards
- Sufficient contrast ratios maintained
- Color not used as sole indicator

## Performance Considerations

### Component Optimization
- React.memo for expensive components
- useCallback for event handlers
- Lazy loading for heavy components

### Animation Performance
- CSS transforms over layout changes
- RequestAnimationFrame for smooth animations
- Canvas for complex animations (timer backgrounds)

## Usage Guidelines

### When to Use Each Component

#### Buttons
- **PrimaryButton**: Main actions, form submissions
- **SecondaryButton**: Secondary actions, cancellations
- **IconButton**: Icon-only actions, toolbar buttons
- **TilePrimaryButton**: Grid layouts, card actions

#### Containers
- **Card**: Content grouping, information display
- **Modal**: Overlays, confirmations, detailed views

### Styling Best Practices

1. **Consistency**: Use design tokens consistently
2. **Hierarchy**: Follow container border radius hierarchy
3. **Spacing**: Stick to 8px grid system
4. **Colors**: Use semantic color names
5. **Typography**: Maintain scale and hierarchy

### Component Composition

Components are designed to be composable:

```tsx
<Card className="bg-theme-black-light">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-semibold text-theme-gold">Title</h2>
    <IconButton onClick={handleEdit} ariaLabel="Edit">
      <Edit3 size={20} />
    </IconButton>
  </div>
  <p className="text-theme-gold-dark">Content...</p>
  <div className="flex gap-3 pt-4">
    <SecondaryButton onClick={handleCancel} ariaLabel="Cancel">
      Cancel
    </SecondaryButton>
    <PrimaryButton onClick={handleSave} ariaLabel="Save">
      Save
    </PrimaryButton>
  </div>
</Card>
```

This reference document should be updated as new components are added or existing components are modified to maintain consistency across the application.