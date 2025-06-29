import React, { useState, useEffect } from 'react';
import { TimerIcon } from 'lucide-react';
import PlanSelection from './components/PlanSelection';
import HomeScreen from './components/HomeScreen';
import WorkoutSession from './components/WorkoutSession';
import { TrainingBlockCompleteModal } from './components/TrainingBlockCompleteModal';
import { AuthWrapper } from './components/AuthWrapper';
import { useUserProfile } from './hooks/useUserProfile';
import { WORKOUT_PLANS, getCurrentLevelWorkouts } from './data/workoutData';

type Page = 'plans' | 'workouts' | 'session';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('plans');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any[]>>({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const { profile, isBlockComplete, endTrainingBlock } = useUserProfile();

  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Check for training block completion on app load
  useEffect(() => {
    if (profile && isBlockComplete() && profile.current_plan_id) {
      setShowCompletionModal(true);
    }
  }, [profile, isBlockComplete]);

  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    setCurrentPage('workouts');
  };

  const startWorkout = (day: string) => {
    setSelectedDay(day);
    setCurrentPage('session');
  };

  const goToPlans = () => {
    setCurrentPage('plans');
    setSelectedPlanId(null);
    setSelectedDay(null);
  };

  const goToWorkouts = () => {
    setCurrentPage('workouts');
    setSelectedDay(null);
  };

  const updateWorkoutHistory = (newLog: any) => {
    const dateStr = new Date(newLog.created_at).toLocaleDateString();
    const updatedHistory = { ...workoutHistory };
    
    if (!updatedHistory[dateStr]) {
      updatedHistory[dateStr] = [];
    }
    updatedHistory[dateStr].push(newLog);
    
    setWorkoutHistory(updatedHistory);
    localStorage.setItem('workoutHistory', JSON.stringify(updatedHistory));
  };

  const handleCompletionModalClose = async () => {
    setShowCompletionModal(false);
    await endTrainingBlock();
    setCurrentPage('plans');
    setSelectedPlanId(null);
    setSelectedDay(null);
  };

  // Get current plan for workout session
  const currentPlan = selectedPlanId ? WORKOUT_PLANS[selectedPlanId] : null;
  const currentWorkouts = currentPlan && profile ? 
    getCurrentLevelWorkouts(currentPlan, profile.current_level_index || 0) : 
    currentPlan?.levels[0]?.workouts || {};

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          <header className="mb-8 text-center">
            <h1 className="hero" data-text="It's a great day for gains">
              It's a great day for gains
            </h1>
          </header>

          {currentPage === 'plans' && (
            <PlanSelection 
              onSelectPlan={handleSelectPlan} 
              workoutHistory={workoutHistory}
            />
          )}

          {currentPage === 'workouts' && selectedPlanId && currentPlan && (
            <HomeScreen 
              plan={currentPlan}
              onStartWorkout={startWorkout}
              onBack={goToPlans}
              workoutHistory={workoutHistory}
            />
          )}
          
          {currentPage === 'session' && selectedPlanId && selectedDay && currentPlan && (
            <WorkoutSession
              day={selectedDay}
              plan={currentPlan}
              onGoHome={goToWorkouts}
              onLogWorkout={updateWorkoutHistory}
            />
          )}

          {/* Training Block Completion Modal */}
          <TrainingBlockCompleteModal
            isOpen={showCompletionModal}
            onClose={handleCompletionModalClose}
            planName={profile?.current_plan_id ? WORKOUT_PLANS[profile.current_plan_id]?.name || 'Your Plan' : 'Your Plan'}
            weeksCompleted={profile?.block_duration_weeks || 6}
          />
        </div>
      </div>
    </AuthWrapper>
  );
}

export default App;