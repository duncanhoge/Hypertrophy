# Hypertrophy Hub

A sleek and modern workout tracking application designed for strength training and muscle building. Built with React, TypeScript, Tailwind CSS, and Supabase for real-time data persistence and user authentication.

![Hypertrophy Hub](https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)

## 🚀 Live Demo

Visit the live application: [https://weights.duncanhoge.com](https://weights.duncanhoge.com)

## ✨ Features

### Core Workout Features
- 🏋️‍♂️ Multiple workout plans to choose from (Duncan's Plan & Ryan's Plan)
- ⏱️ Built-in rest timer with customizable durations
- 📊 Real-time workout history tracking with Supabase integration
- 💪 Support for various exercise types:
  - Weight and reps exercises
  - Bodyweight exercises (with optional weight)
  - Timed exercises with countdown timer
  - AMRAP (As Many Reps As Possible) exercises
- 📱 Responsive design optimized for all devices
- 🎯 Progress tracking for each workout session

### Advanced Features
- 🔐 **User Authentication**: Secure email/password authentication with Supabase
- 📈 **Exercise History**: View detailed performance history for each exercise
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
│   ├── WorkoutSession.tsx # Active workout interface
│   ├── TrainingBlockCompleteModal.tsx # Completion celebration
│   └── PulsingTimerBackground.tsx # Animated timer background
├── hooks/               # Custom React hooks
│   ├── useAuth.ts       # Authentication state management
│   ├── useUserProfile.ts # Training block state management
│   └── useExerciseHistory.ts # Exercise history data fetching
├── lib/                 # External service integrations
│   └── supabase.ts      # Supabase client configuration
├── data/                # Static data and configurations
│   ├── exerciseDictionary.ts # Centralized exercise definitions
│   └── workoutData.ts   # Workout plans and exercise references
├── docs/                # Architecture documentation
│   ├── exercise-dictionary.md # Exercise Dictionary documentation
│   └── training-block-completion.md # Training Block system documentation
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

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
  - "Start This Plan" vs "Switch to This Plan" logic
  - Plan switching confirmation modals
  - Active plan visual indicators with progress display
  - "Try Plan" option for exploration without commitment

#### `HomeScreen`
- **Plan management interface** with training block controls:
  - Current level display and navigation
  - Weeks remaining indicator for active blocks
  - Settings panel access for duration management
  - Contextual workout selection based on current level

#### `WorkoutSession`
- **Primary workout interface** with comprehensive features:
  - Real-time set logging with validation
  - Automatic rest timer with pulsing background animation
  - Exercise queue with visual progress tracking
  - Exercise history modal integration
  - Support for all exercise types (weight/reps, timed, AMRAP)
  - Smart navigation between exercises
  - Workout completion celebration
  - Integration with Exercise Dictionary for rich exercise metadata
  - Training block context tracking in workout logs

#### `TrainingBlockCompleteModal`
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
1. User selects plan → `PlanSelection` (with training block context)
2. User selects workout day → `HomeScreen` (current level aware)
3. User starts workout → `WorkoutSession`
4. User logs sets → Data saved to Supabase with training block context
5. Real-time updates → UI reflects changes immediately

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

### Starting a Training Block
1. **Select a Plan** - Choose from available workout programs
2. **Start Training Block** - Click "Start This Plan" to begin 6-week commitment
3. **Track Progress** - View weeks remaining and access settings
4. **Complete Workouts** - Log sets with automatic training block context
5. **Celebrate Completion** - Receive achievement recognition after 6 weeks

### Managing Training Blocks
- **Adjust Duration**: Use settings panel to modify block length
- **Switch Plans**: Confirmation required to prevent accidental progress loss
- **End Early**: Option to terminate block before completion
- **Try Plans**: Explore without starting formal training block

### Exercise Types
- **Weight + Reps**: Standard strength training exercises
- **Reps Only**: Bodyweight exercises with rep counting
- **Timed**: Duration-based exercises with countdown timer
- **AMRAP**: As Many Reps As Possible with manual entry

### Features During Workout
- **Rest Timer**: Automatic countdown with pulsing background animation
- **Exercise Queue**: Visual progress through the workout
- **History Access**: Quick reference to previous performance
- **Smart Navigation**: Seamless flow between exercises
- **Exercise Information**: Rich metadata from Exercise Dictionary

## 🔧 Configuration

### Workout Plans
Workout plans are defined in `src/data/workoutData.ts` with multi-level structure:
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
- When adding exercises, update the Exercise Dictionary
- Follow the established ID naming conventions
- Consider training block context in new features

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- **Supabase** - For providing an excellent backend-as-a-service platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon system
- **Pexels** - For the high-quality stock photography