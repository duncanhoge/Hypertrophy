import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TimerIcon, XCircle } from 'lucide-react';
import { supabase } from './lib/supabaseClient';
import HomeScreen from './components/HomeScreen';
import WorkoutSession from './components/WorkoutSession';
import { WORKOUT_PLAN } from './data/workoutData';

function App() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [workoutHistory, setWorkoutHistory] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setUserId(session.user.id);
        } else {
          try {
            const { data, error } = await supabase.auth.signUp({
              email: `anonymous-${crypto.randomUUID()}@example.com`,
              password: crypto.randomUUID(),
            });
            
            if (error) throw error;
            if (data.user) {
              setUserId(data.user.id);
            }
          } catch (error) {
            console.error("Error during sign-in:", error);
            setUserId(crypto.randomUUID());
          }
        }
        setIsAuthReady(true);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
        setIsAuthReady(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const fetchWorkoutHistory = async () => {
      const { data, error } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching workout history:", error);
        return;
      }

      const history: Record<string, any[]> = {};
      data.forEach((log) => {
        const dateStr = new Date(log.created_at).toLocaleDateString();
        if (!history[dateStr]) {
          history[dateStr] = [];
        }
        history[dateStr].push(log);
      });
      
      setWorkoutHistory(history);
    };

    fetchWorkoutHistory();

    const subscription = supabase
      .channel('workout_logs_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'workout_logs',
          filter: `user_id=eq.${userId}`
        }, 
        () => {
          fetchWorkoutHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [isAuthReady, userId]);

  const startWorkout = (day: string) => {
    setSelectedDay(day);
    setCurrentPage('workout');
  };

  const goHome = () => {
    setCurrentPage('home');
    setSelectedDay(null);
  };

  if (!isAuthReady) {
    return <div className="min-h-screen bg-theme-black flex items-center justify-center text-theme-gold"><TimerIcon className="animate-spin mr-2" />Loading authentication...</div>;
  }
  
  if (!userId) {
     return <div className="min-h-screen bg-theme-black flex items-center justify-center text-red-500"><XCircle className="mr-2" />Authentication failed. Please ensure Supabase is configured correctly.</div>;
  }

  return (
    <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 sm:p-6 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-theme-gold">
          Hypertrophy Hub
        </h1>
        {userId && <p className="text-xs text-theme-gold-dark mt-1">User ID: {userId.substring(0, 8)}...</p>}
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
          userId={userId}
        />
      )}
    </div>
  );
}

export default App