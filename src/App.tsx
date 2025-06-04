import React, { useState, useEffect } from 'react';
import { TimerIcon } from 'lucide-react';
import PlanSelection from './components/PlanSelection';
import HomeScreen from './components/HomeScreen';
import WorkoutSession from './components/WorkoutSession';
import { WORKOUT_PLANS } from './data/workoutData';

type Page = 'plans' | 'workouts' | 'session';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('plans');
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory));
    }
  }, []);

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

  return (
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

        {currentPage === 'workouts' && selectedPlanId && (
          <HomeScreen 
            plan={WORKOUT_PLANS[selectedPlanId]}
            onStartWorkout={startWorkout}
            onBack={goToPlans}
            workoutHistory={workoutHistory}
          />
        )}
        
        {currentPage === 'session' && selectedPlanId && selectedDay && (
          <WorkoutSession
            day={selectedDay}
            plan={WORKOUT_PLANS[selectedPlanId].workouts[selectedDay]}
            onGoHome={goToWorkouts}
            onLogWorkout={updateWorkoutHistory}
          />
        )}
      </div>
    </div>
  );
}

export default App;