import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TimerIcon } from 'lucide-react';
import HomeScreen from './components/HomeScreen';
import WorkoutSession from './components/WorkoutSession';
import { WORKOUT_PLAN } from './data/workoutData';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    // Load workout history from localStorage
    const savedHistory = localStorage.getItem('workoutHistory');
    if (savedHistory) {
      setWorkoutHistory(JSON.parse(savedHistory));
    }
  }, []);

  const startWorkout = (day: string) => {
    setSelectedDay(day);
    setCurrentPage('workout');
  };

  const goHome = () => {
    setCurrentPage('home');
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
    <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="hero" data-text="Hypertrophy Hub">
            Hypertrophy Hub
          </h1>
        </header>

        {currentPage === 'home' && (
          <HomeScreen 
            onStartWorkout={startWorkout} 
            workoutHistory={workoutHistory} 
          />
        )}
        
        {currentPage === 'workout' && selectedDay && (
          <WorkoutSession
            day={selectedDay}
            plan={WORKOUT_PLAN[selectedDay]}
            onGoHome={goHome}
            onLogWorkout={updateWorkoutHistory}
          />
        )}
      </div>
    </div>
  );
}

export default App;