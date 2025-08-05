# Hypertrophy Hub

A sleek and modern workout tracking application designed for strength training and muscle building. Built with React, TypeScript, Tailwind CSS, and Supabase for real-time data persistence and user authentication.

![Hypertrophy Hub](https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## 🚀 Live Demo

Visit the live application: [https://weights.duncanhoge.com](https://weights.duncanhoge.com)

## ✨ Features

### Core Workout Features
- 🏋️‍♂️ Multiple workout plans to choose from (Duncan's Plan & Ryan's Plan)
- ✨ **NEW: Custom Plan Generation** - Create personalized workout plans based on your goals and available equipment
- ⚖️ **NEW: Workout Volume Control** - Choose from Short (~30-40 min), Standard (~45-55 min), or Long (~60+ min) workout durations
- ⏱️ Built-in rest timer with customizable durations
- 📊 Real-time workout history tracking with Supabase integration
- 💪 Support for various exercise types (see Exercise Types section below)
- 📱 Responsive design optimized for all devices
- 🎯 Progress tracking for each workout session
- 🎛️ **NEW: Plan Management** - Rename and delete your custom generated plans

#### Exercise Types

The application supports three distinct exercise types, each with specific input requirements and user interactions:

##### 1. Weight & Reps Based (`weight_reps`)
- **Description**: Traditional strength training exercises that require both weight and repetition tracking
- **Input Fields**: 
  - Weight (required): Amount of weight lifted in lbs/kg
  - Reps (required): Number of repetitions performed
- **Examples**: Dumbbell Bench Press, Barbell Squats, Overhead Press
- **Usage**: User enters the weight used and reps completed for each set

##### 2. Repetition Based (`reps_only`, `reps_only_with_optional_weight`)
- **Description**: Bodyweight or rep-focused exercises, including AMRAP (As Many Reps As Possible) exercises
- **Input Fields**:
  - Reps (required): Number of repetitions performed
  - Weight (optional): Additional weight if applicable (for `reps_only_with_optional_weight`)
- **Examples**: Push-ups, Pull-ups, Crunches, Weighted Dips
- **Usage**: 
  - For standard rep exercises: User enters reps completed
  - For AMRAP exercises: User enters "AMRAP" initially, then logs actual reps achieved via prompt
  - Optional weight can be added for exercises like weighted push-ups

##### 3. Timed Based (`timed`)
- **Description**: Duration-based exercises with integrated timer functionality and flexible input options
- **Input Fields**:
  - Duration (required): Target time in seconds
- **Enhanced Timer Features**:
  - **Start Stopwatch**: Interactive count-up timer with real-time display
  - **Manual Duration Entry**: Option to enter duration directly without using the stopwatch
  - **Flexible Workflow**: Users can use the stopwatch to time their exercise, then manually adjust the duration before logging
  - **Visual Progress**: Large, clear timer display with exercise name and target time reference
  - **Early Completion**: "End Set" option to stop timer before target time is reached
  - **Automatic Population**: Stopwatch results automatically populate the duration field for easy editing
- **User Flow**:
  1. **Start Stopwatch** (optional): Begin timing the exercise with visual feedback
  2. **End Set**: Stop the timer when exercise is complete (populates duration field)
  3. **Adjust Duration** (optional): Manually edit the duration field if needed
  4. **Log Set & Start Rest**: Record the set and begin rest period
- **Examples**: Plank, Wall Sit, Dead Hang
- **Usage**: Provides maximum flexibility - users can time exercises with the stopwatch for accuracy, or enter durations manually for convenience

### Advanced Features
- 🔐 **User Authentication**: Secure email/password authentication with Supabase
- 📈 **Exercise History**: View detailed performance history for each exercise
- 🎨 **Plan Generation Engine**: AI-powered workout plan creation with equipment-based exercise selection
- 🎮 **Interactive Workout Queue**: Visual progress tracking during workouts
- ⏰ **Smart Rest Timer**: Automatic rest periods between sets with pulsing background animation
- 💾 **Cloud Data Persistence**: All workout data synced to Supabase
- 🔄 **Real-time Updates**: Instant data synchronization across sessions
- 📚 **Centralized Exercise Dictionary**: Single source of truth for all exercise data
- 🎯 **Training Block System**: Structured 6-week programs with completion tracking
- ⚙️ **Flexible Duration**: User-configurable training block lengths
- 🏆 **Achievement Celebration**: Success screens for completed training blocks

### User Experience
- 🎨 Premium "Apple-level" design aesthetics with gold/black theme
- ⚡ Smooth animations and micro-interactions
- 🎯 Intuitive navigation with clear visual hierarchy
- 📊 Comprehensive workout completion tracking
- 🏆 Motivational progress indicators
- 📅 Time-bound training programs with progress tracking
- ⏱️ **Enhanced Timed Exercise Experience**: Intuitive stopwatch interface with flexible manual override options
- 🎯 **Personalized Training**: Custom plans tailored to your equipment and time constraints
- 🔧 **Custom Plan Management**: Full control over your generated workout plans

## 🏗️ Architecture

### Frontend Architecture
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   ├── Card.tsx     # Styled card container
│   │   ├── IconButton.tsx # Consistent button styling
│   │   └── Modal.tsx    # Modal overlay component
│   ├── AuthScreen.tsx   # Authentication interface
│   ├── AuthWrapper.tsx  # Authentication state management
│   ├── ExerciseHistory.tsx # Exercise performance history
│   ├── HomeScreen.tsx   # Workout plan selection
│   ├── PlanSelection.tsx # Main plan selection screen
│   ├── WorkoutSession.tsx # Active workout interface with enhanced timed exercise support
│   ├── TrainingBlockCompleteModal.tsx # Completion celebration
│   └── PulsingTimerBackground.tsx # Animated timer background
├── hooks/               # Custom React hooks
│   ├── useGeneratedPlans.ts # Generated plan state management
│   ├── useAuth.ts       # Authentication state management
│   ├── useUserProfile.ts # Training block state management
│   └── useExerciseHistory.ts # Exercise history data fetching
├── lib/                 # External service integrations
│   └── supabase.ts      # Supabase client configuration
├── data/                # Static data and configurations
│   ├── exerciseDictionary.ts # Centralized exercise definitions
│   └── workoutData.ts   # Workout plans and exercise references
│   ├── workoutTemplates.ts # Plan generation templates
│   └── planGenerationEngine.ts # Plan generation logic
├── docs/                # Architecture documentation
│   ├── exercise-dictionary.md # Exercise Dictionary documentation
│   └── training-block-completion.md # Training Block system documentation
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

### Plan Generation Architecture

The **Plan Generation Engine** creates personalized workout plans using a template-based system:

- **Templates**: Define workout structure with core and accessory exercise slots
- **Volume Control**: Adjusts workout length by varying accessory exercise count
- **Equipment Filtering**: Selects exercises based on available equipment
- **Exercise Dictionary Integration**: Leverages centralized exercise database
- **Plan Management**: Full CRUD operations for generated plans

#### Volume Levels
- **Short**: 1 accessory exercise (~30-40 minutes)
- **Standard**: 2 accessory exercises (~45-55 minutes) - Default
- **Long**: 4 accessory exercises (~60+ minutes)

For detailed information about the Plan Generation system, see: [Plan Generation Documentation](docs/plan-generation.md)

### Exercise Dictionary Architecture

The application uses a **Centralized Exercise Dictionary** as the single source of truth for all exercise data. This architecture provides:

- **Maintainability**: Single location for all exercise definitions
- **Scalability**: Easy addition of new exercises and equipment types
- **Feature Enablement**: Foundation for advanced features like exercise substitutions
- **Data Consistency**: Eliminates duplication and ensures accuracy

For detailed information about the Exercise Dictionary, see: [Exercise Dictionary Documentation](docs/exercise-dictionary.md)

### Training Block System

The **Training Block Duration & Completion** system provides structured, time-bound workout programs:

- **Time-Bound Programs**: Default 6-week duration with user customization
- **Progress Tracking**: Visual indicators showing weeks remaining
- **Completion Celebration**: Success screens acknowledging user achievements
- **Flexible Management**: Settings panel for duration adjustments
- **Multi-Level Support**: Architecture ready for program progression

For detailed information about the Training Block system, see: [Training Block Documentation](docs/training-block-completion.md)

### Backend Architecture (Supabase)
```
Database Schema:
├── auth.users (managed by Supabase Auth)
├── user_profiles
│   ├── id (uuid, primary key, references auth.users)
│   ├── current_plan_id (text, nullable)
│   ├── current_level_index (integer, default 0)
│   ├── block_start_date (timestamptz, nullable)
│   ├── block_duration_weeks (integer, default 6)
│   ├── created_at (timestamptz)
│   └── updated_at (timestamptz)
└── workout_logs
    ├── id (uuid, primary key)
    ├── user_id (uuid, foreign key)
    ├── workout_day (text)
    ├── exercise_id (text)
    ├── exercise_name (text)
    ├── set_number (integer)
    ├── weight (numeric, nullable)
    ├── reps_logged (integer, nullable)
    ├── duration_seconds (integer, nullable)
    ├── target_reps (text)
    ├── target_sets (integer)
    ├── current_plan_id (text, nullable) # Training block tracking
    ├── current_level_index (integer, default 0) # Training block tracking
    └── created_at (timestamp)

Security:
├── Row Level Security (RLS) enabled
├── User isolation policies
└── Authenticated user access only
```

## 🧩 Component Details

### Core Components

#### `AuthWrapper`
- Manages global authentication state
- Provides loading states during auth checks
- Conditionally renders auth screen or main app

#### `PlanSelection`
- **Enhanced plan selection** with training block integration:
  - Conditional buttons based on active plan status
  - Generated plan display and management
  - "Start This Plan" vs "Switch to This Plan" logic
  - Plan switching confirmation modals
  - Active plan visual indicators with progress display
  - "Try Plan" option for exploration without commitment

#### `HomeScreen`
- **Plan management interface** with training block controls:
  - Current level display and navigation
  - Generated plan rename and delete functionality
  - Weeks remaining indicator for active blocks
  - Settings panel access for duration management
  - Contextual workout selection based on current level

#### `WorkoutSession`
- **Primary workout interface** with comprehensive features:
  - Real-time set logging with validation
  - Automatic rest timer with pulsing background animation
  - Exercise queue with visual progress tracking
  - Exercise history modal integration
  - **Enhanced timed exercise support**:
    - Interactive stopwatch with count-up timer
    - Manual duration entry with validation
    - Flexible workflow allowing stopwatch + manual adjustment
    - Clear visual feedback during timed exercises
    - Automatic duration field population from stopwatch
  - Support for all exercise types (weight/reps, timed, AMRAP)
  - Smart navigation between exercises
  - Workout completion celebration
  - Integration with Exercise Dictionary for rich exercise metadata
  - Training block context tracking in workout logs

#### `TrainingBlockCompleteModal`
#### `PlanGenerationWizard`
- **Step-by-step plan creation interface**:
  - Template selection with goal-based options
  - Volume selection for workout duration control
  - Equipment selection with dynamic filtering
  - Plan generation with real-time feedback
  - Custom naming and immediate plan activation
  - Progress indicators and validation

- **Celebration interface** for completed training blocks:
  - Trophy and achievement graphics with animations
  - Personalized completion message with plan name and duration
  - Achievement highlights and motivational content
  - Single action flow to acknowledge completion

#### `PulsingTimerBackground`
- **Animated background** for rest and timed exercise periods:
  - Canvas-based pulsing animation synchronized with timer
  - Dynamic pulse frequency based on remaining time
  - Smooth gradient overlays for text readability
  - Responsive design adapting to screen size

### UI Components

#### `Card`
- Consistent styling wrapper with theme integration
- Optional click handlers for interactive cards
- Responsive design with proper spacing

#### `IconButton`
- Standardized button component with icon support
- Consistent hover states and focus management
- Disabled state handling
- Flexible sizing and styling options

#### `Modal`
- Overlay component with backdrop blur
- Consistent header with close functionality
- Responsive sizing and positioning
- Keyboard accessibility support

### Custom Hooks

#### `useAuth`
- Manages Supabase authentication state
- Provides sign up, sign in, and sign out methods
- Handles session persistence and state changes
- Loading state management during auth operations

#### `useUserProfile`
- **Training block state management**:
  - Fetches and manages user profile data
  - Generated plan lifecycle management
  - Provides training block lifecycle methods
  - Calculates weeks remaining and completion status
  - Handles block duration updates and early termination
  - Automatic profile creation for new users

#### `useExerciseHistory`
- Fetches exercise-specific performance data
- Optimized queries with user and exercise filtering
- Error handling and loading states
- Automatic refetch capabilities

## 📊 Data Flow

### Authentication Flow
1. User visits app → `AuthWrapper` checks session
2. No session → `AuthScreen` renders
3. Plan generation available → `PlanGenerationWizard` accessible
3. User signs in → Supabase handles authentication
4. Session established → Main app renders

### Training Block Flow
1. User visits plan selection → `useUserProfile` loads current state
2. User clicks "Start This Plan" → Profile updated with block details
3. Plan home screen shows → Current level workouts and progress
4. Settings accessible → Duration adjustments and early termination
5. Completion check on load → Success modal if block complete
6. User acknowledges completion → Block state cleared, return to selection

### Workout Logging Flow
### Plan Generation Flow
1. User clicks "Create Your Own Plan" → `PlanGenerationWizard` opens
2. Template selection → User chooses training goal
3. Volume selection → User selects workout duration preference
4. Equipment selection → User specifies available equipment
5. Plan generation → Engine creates personalized plan
6. Plan naming → User customizes plan name
7. Plan activation → Becomes active training block

1. User selects plan → `PlanSelection` (with training block context)
2. User selects workout day → `HomeScreen` (current level aware)
3. User starts workout → `WorkoutSession`
4. User logs sets → Data saved to Supabase with training block context
5. Real-time updates → UI reflects changes immediately

### Plan Management Flow
1. Generated plan appears → Plan selection screen with management options
2. Rename plan → Edit icon opens modal with name input
3. Delete plan → Trash icon opens confirmation modal
4. Plan operations → Database updates with immediate UI feedback
5. Navigation → Appropriate screen based on operation

### Enhanced Timed Exercise Flow
1. User encounters timed exercise → Duration input field and "Start Stopwatch" button displayed
2. **Option A - Stopwatch Flow**:
   - User clicks "Start Stopwatch" → Interactive timer begins
   - User performs exercise while timer counts up
   - User clicks "End Set" → Timer stops, duration field populated with elapsed time
   - User can manually adjust duration if needed
   - User clicks "Log Set & Start Rest" → Set logged, rest timer begins
3. **Option B - Manual Entry Flow**:
   - User enters duration directly in input field
   - User clicks "Log Set & Start Rest" → Set logged with manual duration, rest timer begins
4. **Validation**: All duration entries validated for positive values before database insertion

### Exercise Data Flow
1. Workout plans reference exercises by ID
2. `getEnhancedExercise()` combines plan data with dictionary data
3. UI components receive complete exercise information
4. Exercise metadata enhances user experience and enables features

### Exercise History Flow
1. User clicks history button → `ExerciseHistory` modal opens
2. `useExerciseHistory` hook fetches data from Supabase
3. Data filtered by user ID and exercise identifier
4. Results displayed chronologically with performance metrics

## 🎨 Design System

### Color Palette
- **Primary**: Gold (#FFD700) - Actions, highlights, success states
- **Secondary**: Gold variants (#FFE55C, #B7A000) - Subtle accents
- **Background**: Black variants (#000000, #121212, #1A1A1A) - Depth layers
- **Text**: Gold on black for optimal contrast and premium feel

### Typography
- **Font**: Archivo (Google Fonts) - Modern, athletic aesthetic
- **Hierarchy**: Hero text, headings, body text with consistent scaling
- **Weights**: Regular, semibold, bold for clear information hierarchy

### Spacing System
- **Base unit**: 8px grid system for consistent alignment
- **Component spacing**: Standardized padding and margins
- **Responsive breakpoints**: Mobile-first approach with desktop enhancements

## 🛠️ Tech Stack

### Frontend
- **Plan Generation Engine** - Custom TypeScript-based workout plan generator
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type safety and enhanced developer experience
- **Tailwind CSS** - Utility-first styling with custom theme
- **Vite** - Fast development server and optimized builds
- **Lucide React** - Consistent icon system

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Row Level Security** - Database-level user data isolation
- **Real-time subscriptions** - Live data updates
- **Authentication** - Email/password with session management

### Development Tools
- **ESLint** - Code quality and consistency
- **TypeScript** - Static type checking
- **PostCSS** - CSS processing with Tailwind
- **Netlify** - Deployment and hosting platform

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hypertrophy-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy your project URL and anon key
   - Create a `.env` file:
     - Generated plans stored in user profiles table
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Set up the database**
   - Run the SQL migrations to create the required tables
   - Enable Row Level Security
   - Set up authentication policies

5. **Start the development server**
   ```bash
   npm run dev
   ```

### Database Setup

The application requires the following database structure:

#### User Profiles Table
```sql
CREATE TABLE user_profiles (
  active_generated_plan jsonb,  -- Stores complete generated plan
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_plan_id text,
  current_level_index integer DEFAULT 0,
  block_start_date timestamptz,
  block_duration_weeks integer DEFAULT 6 CHECK (block_duration_weeks > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### Enhanced Workout Logs Table
```sql
CREATE TABLE workout_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  workout_day text NOT NULL,
  exercise_id text NOT NULL,
  exercise_name text NOT NULL,
  set_number integer NOT NULL CHECK (set_number > 0),
  weight numeric CHECK (weight IS NULL OR weight > 0),
  reps_logged integer CHECK (reps_logged IS NULL OR reps_logged > 0),
  duration_seconds integer CHECK (duration_seconds IS NULL OR duration_seconds > 0),
  target_reps text NOT NULL,
  target_sets integer NOT NULL CHECK (target_sets > 0),
  current_plan_id text,
  current_level_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

#### Security Setup
```sql
-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can read own logs" ON workout_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" ON workout_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
```

## 📱 Usage

### Creating Custom Plans
### Starting a Training Block
1. **Select a Plan** - Choose from available workout programs
2. **Start Training Block** - Click "Start This Plan" to begin 6-week commitment
3. **Track Progress** - View weeks remaining and access settings
4. **Complete Workouts** - Log sets with automatic training block context
5. **Celebrate Completion** - Receive achievement recognition after 6 weeks

### Creating Custom Plans
1. **Start Creation** - Click "Create Your Own Plan" on plan selection screen
2. **Choose Template** - Select training goal (e.g., Full Body Hypertrophy)
3. **Select Volume** - Choose workout length (Short/Standard/Long)
4. **Pick Equipment** - Specify available equipment for exercise selection
5. **Generate Plan** - Engine creates personalized workout program
6. **Name & Save** - Customize plan name and activate training block

### Managing Training Blocks
- **Adjust Duration**: Use settings panel to modify block length
- **Switch Plans**: Confirmation required to prevent accidental progress loss
- **End Early**: Option to terminate block before completion
- **Try Plans**: Explore without starting formal training block

### Exercise Types
### Managing Custom Plans
- **Rename Plans**: Edit icon next to plan title opens rename modal
- **Delete Plans**: Trash icon with confirmation prevents accidental deletion
- **Plan Display**: Custom names appear throughout the application

- **Weight + Reps**: Standard strength training exercises with weight and rep inputs
- **Reps Only**: Bodyweight exercises with rep counting (including AMRAP support)
- **Timed**: Duration-based exercises with enhanced timer functionality:
  - **Interactive Stopwatch**: Count-up timer with real-time visual feedback
  - **Manual Entry**: Direct duration input for convenience
  - **Flexible Workflow**: Use stopwatch then adjust duration before logging
  - **Validation**: Ensures positive duration values for database integrity

### Features During Workout
- **Rest Timer**: Automatic countdown with pulsing background animation
- **Exercise Queue**: Visual progress through the workout
- **History Access**: Quick reference to previous performance
- **Smart Navigation**: Seamless flow between exercises
- **Exercise Information**: Rich metadata from Exercise Dictionary
- **Enhanced Timed Exercise Experience**: 
  - Large, clear timer display during stopwatch use
  - Target time reference for goal-oriented training
  - Flexible completion options (reach target or end early)
  - Automatic duration field population with manual override capability

## 🔧 Configuration

### Workout Plans
Workout plans are defined in `src/data/workoutData.ts` with multi-level structure:
- Generated plans use template-based architecture
- Exercise IDs referencing dictionary entries
- Set and rep schemes
- Exercise types and configurations
- Plan metadata and descriptions
- Multiple levels for progression

### Exercise Dictionary
The Exercise Dictionary (`src/data/exerciseDictionary.ts`) contains:
- Complete exercise definitions with metadata
- Muscle group classifications
- Equipment requirements
- Movement patterns
- Alternative exercise suggestions
- Form cues and descriptions

### Plan Generation Templates
Templates (`src/data/workoutTemplates.ts`) define:
- Core exercise slots (always included)
- Accessory exercise pools (volume-dependent)
- Movement pattern requirements
- Exercise type specifications
- Target sets and rep ranges

### Training Block Settings
- **Default Duration**: 6 weeks (user configurable)
- **Minimum Duration**: 1 week
- **Completion Check**: Every app load
- **Progress Calculation**: Based on start date and duration

### Styling
The application uses a custom Tailwind theme defined in `tailwind.config.js`:
- Custom color palette for the gold/black theme
- Typography settings for the Archivo font
- Responsive breakpoints and spacing

## 🚀 Deployment

The application is deployed on Netlify with automatic builds from the main branch.

### Build Process
```bash
npm run build    # Creates optimized production build
npm run preview  # Preview the production build locally
```

### Environment Variables
Ensure the following environment variables are set in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Maintain component modularity
- Use the established design system
- Write descriptive commit messages
- Test authentication flows thoroughly
- Test plan generation with various equipment combinations
- When adding exercises, update the Exercise Dictionary
- Follow the established ID naming conventions
- Consider training block context in new features
- **Timed Exercise Development**: Ensure proper validation for duration inputs and maintain the flexible stopwatch + manual entry workflow

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Supabase** - For providing an excellent backend-as-a-service platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon system
- **Pexels** - For the high-quality stock photography