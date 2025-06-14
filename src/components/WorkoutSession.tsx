import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Repeat, Play, Save, CheckCircle, SkipForward, Info, Target, Clock, ListChecks, History } from 'lucide-react';
import { REST_DURATION_SECONDS, getEnhancedExercise } from '../data/workoutData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { ExerciseHistory } from './ExerciseHistory';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type { Exercise, WorkoutDay } from '../data/workoutData';

interface WorkoutSessionProps {
  day: string;
  plan: WorkoutDay;
  onGoHome: () => void;
  onLogWorkout: (log: any) => void;
}

function WorkoutSession({ day, plan, onGoHome, onLogWorkout }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [loggedSetsForExercise, setLoggedSetsForExercise] = useState<any[]>([]);
  
  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(REST_DURATION_SECONDS);
  const [isResting, setIsResting] = useState(false);
  const [isTimedExerciseActive, setIsTimedExerciseActive] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExerciseInfoModal, setShowExerciseInfoModal] = useState(false);
  const [showWorkoutQueue, setShowWorkoutQueue] = useState(false);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);

  const { user } = useAuth();
  const currentExercise = plan.exercises[currentExerciseIndex];
  const enhancedCurrentExercise = currentExercise ? getEnhancedExercise(currentExercise) : null;

  useEffect(() => {
    if (!enhancedCurrentExercise) return;
    
    setCurrentSet(1);
    setWeight('');
    setReps('');
    setDuration(enhancedCurrentExercise.type === 'timed' ? enhancedCurrentExercise.reps.match(/\d+/)?.[0] || '' : '');
    setLoggedSetsForExercise([]);
    setIsResting(false);
    setTimerActive(false);
    setIsTimedExerciseActive(false);
  }, [currentExerciseIndex, enhancedCurrentExercise?.type, enhancedCurrentExercise?.reps]);

  useEffect(() => {
    let interval: number | undefined;
    if (timerActive && timerSeconds > 0) {
      interval = window.setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    } else if (timerActive && timerSeconds === 0) {
      setTimerActive(false);
      if (isResting) {
        setIsResting(false);
      }
      if (isTimedExerciseActive) {
        setIsTimedExerciseActive(false);
        handleLogSet();
      }
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds, isResting, isTimedExerciseActive]);

  const handleLogSet = async () => {
    if (!enhancedCurrentExercise || !user) return;

    let repsLogged = reps;
    if (enhancedCurrentExercise.type === 'reps_only' && reps.toUpperCase() === 'AMRAP') {
        const amrapReps = prompt("Enter AMRAP reps achieved:");
        if (amrapReps === null || isNaN(parseInt(amrapReps))) {
            alert("Valid number required for AMRAP reps.");
            return;
        }
        repsLogged = parseInt(amrapReps).toString();
    } else if (enhancedCurrentExercise.type !== 'timed' && (isNaN(parseInt(repsLogged)) || parseInt(repsLogged) <= 0)) {
        alert("Please enter a valid number of reps.");
        return;
    }
    
    const logEntry = {
      user_id: user.id,
      workout_day: day,
      exercise_id: enhancedCurrentExercise.id,
      exercise_name: enhancedCurrentExercise.name,
      set_number: currentSet,
      weight: enhancedCurrentExercise.type.includes('weight') ? (weight ? parseFloat(weight) : null) : null,
      reps_logged: enhancedCurrentExercise.type === 'timed' ? null : parseInt(repsLogged),
      duration_seconds: enhancedCurrentExercise.type === 'timed' ? (duration ? parseInt(duration) : parseInt(enhancedCurrentExercise.reps.match(/\d+/)?.[0] || '0')) : null,
      target_reps: enhancedCurrentExercise.reps,
      target_sets: enhancedCurrentExercise.sets,
      created_at: new Date().toISOString(),
    };

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('workout_logs')
        .insert([logEntry]);

      if (error) {
        console.error('Error saving to Supabase:', error);
        alert('Failed to save workout log. Please try again.');
        return;
      }

      // Also call the legacy callback for local storage compatibility
      onLogWorkout(logEntry);
      setLoggedSetsForExercise(prev => [...prev, logEntry]);
      
      setWeight('');
      setReps('');

      if (currentSet < enhancedCurrentExercise.sets) {
        setCurrentSet(prev => prev + 1);
        if (enhancedCurrentExercise.type !== 'timed') {
          setIsResting(true);
          setTimerSeconds(REST_DURATION_SECONDS);
          setTimerActive(true);
        }
      } else {
        if (currentExerciseIndex < plan.exercises.length - 1) {
          // User will need to click next
        } else {
          setShowCompletionModal(true);
        }
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to save workout log. Please try again.');
    }
  };
  
  const startTimedExercise = () => {
    if (enhancedCurrentExercise?.type === 'timed' && duration) {
      setIsTimedExerciseActive(true);
      setTimerSeconds(parseInt(duration));
      setTimerActive(true);
    }
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < plan.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsResting(false);
      setTimerActive(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setTimerActive(false);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  // Calculate total sets in workout
  const totalSets = plan.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  
  // Calculate completed sets
  const completedSets = plan.exercises.slice(0, currentExerciseIndex).reduce((acc, ex) => acc + ex.sets, 0) + (currentSet - 1);
  
  // Calculate progress percentage
  const progressPercentage = (completedSets / totalSets) * 100;

  // Timer progress calculation for SVG circle
  const timerProgress = isResting || isTimedExerciseActive ? 
    ((REST_DURATION_SECONDS - timerSeconds) / REST_DURATION_SECONDS) * 100 : 0;

  if (!enhancedCurrentExercise) {
    return (
      <Card className="bg-theme-black-light border border-theme-gold/20 text-center">
        <p className="text-xl text-red-400">Error: Exercise not found.</p>
        <IconButton onClick={onGoHome} ariaLabel="Go Home" className="mt-4">
          <ChevronLeft size={20} className="mr-1" /> Go Home
        </IconButton>
      </Card>
    );
  }

  const isLastSetForExercise = currentSet >= enhancedCurrentExercise.sets;
  const isLastExerciseOverall = currentExerciseIndex >= plan.exercises.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      {/* Enhanced Timer Overlay */}
      {(isResting || isTimedExerciseActive) && timerActive && (
        <div className="fixed inset-0 bg-theme-black/90 backdrop-blur-lg flex items-center justify-center z-50 transition-all duration-500 ease-in-out">
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* SVG for circular timer */}
            <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background track */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                strokeWidth="6" 
                fill="none" 
                className="stroke-theme-gold/20"
              />
              {/* Progress ring */}
              <circle 
                cx="50" 
                cy="50" 
                r="45" 
                strokeWidth="6" 
                fill="none" 
                className="stroke-theme-gold transition-all duration-1000 ease-linear"
                strokeLinecap="round"
                style={{
                  strokeDasharray: `${2 * Math.PI * 45}`,
                  strokeDashoffset: `${2 * Math.PI * 45 * (1 - timerProgress / 100)}`
                }}
              />
            </svg>
            
            {/* Countdown Text */}
            <div className="text-center">
              <span className="text-5xl md:text-6xl font-bold text-theme-gold tracking-tighter font-mono">
                {formatTime(timerSeconds)}
              </span>
              <p className="text-theme-gold-light uppercase tracking-widest text-sm mt-2 font-semibold">
                {isResting ? "REST" : "EXERCISE"}
              </p>
            </div>
            
            {/* Skip button */}
            {isResting && (
              <button 
                onClick={skipRest}
                className="absolute bottom-[-60px] text-theme-gold-dark bg-theme-black-lighter/80 hover:bg-theme-gold/20 hover:text-theme-gold transition-all duration-200 px-6 py-3 rounded-lg text-sm font-medium border border-theme-gold/30 backdrop-blur-sm flex items-center gap-2"
              >
                <SkipForward size={16} />
                Skip Rest
              </button>
            )}
          </div>
        </div>
      )}

      <Card className="bg-theme-black-light border border-theme-gold/20">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-theme-gold">{plan.name}</h2>
            <p className="text-sm text-theme-gold-dark mt-1">
              Set {completedSets + 1} of {totalSets} Total Sets
            </p>
          </div>
          <div className="flex gap-2">
            <IconButton 
              onClick={() => setShowWorkoutQueue(!showWorkoutQueue)} 
              ariaLabel="Toggle Workout Queue" 
              className={showWorkoutQueue ? "bg-theme-gold text-theme-black hover:bg-theme-gold-light" : ""}
            >
              <ListChecks size={20} />
            </IconButton>
            <IconButton 
              onClick={() => setShowExerciseHistory(true)} 
              ariaLabel="Exercise History"
            >
              <History size={20} />
            </IconButton>
            <IconButton onClick={() => setShowExerciseInfoModal(true)} ariaLabel="Exercise Info">
              <Info size={20} />
            </IconButton>
          </div>
        </div>

        <div className="h-2 bg-theme-black-lighter rounded-full mb-4">
          <div 
            className="h-full bg-theme-gold rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {showWorkoutQueue && (
          <div className="mb-6 p-4 bg-theme-black-lighter rounded-lg border border-theme-gold/10">
            <h3 className="text-lg font-medium text-theme-gold mb-3">Workout Queue</h3>
            <div className="space-y-2">
              {plan.exercises.map((exercise, index) => {
                const enhancedExercise = getEnhancedExercise(exercise);
                const isCurrentExercise = index === currentExerciseIndex;
                const isPastExercise = index < currentExerciseIndex;
                const exerciseProgress = isCurrentExercise ? currentSet - 1 : (isPastExercise ? exercise.sets : 0);
                
                return (
                  <div 
                    key={exercise.id}
                    className={`p-2 rounded-lg border ${
                      isCurrentExercise 
                        ? 'bg-theme-gold/20 border-theme-gold' 
                        : isPastExercise
                          ? 'bg-theme-black border-theme-gold/30 opacity-50'
                          : 'bg-theme-black border-theme-gold/10'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-medium ${isCurrentExercise ? 'text-theme-gold' : 'text-theme-gold-dark'}`}>
                        {enhancedExercise.name}
                      </span>
                      <span className="text-sm text-theme-gold-dark">
                        {exerciseProgress}/{exercise.sets} sets
                      </span>
                    </div>
                    {isCurrentExercise && (
                      <div className="mt-1 text-sm text-theme-gold-dark">
                        Current Set: {currentSet} | Target: {exercise.reps}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mb-6 p-4 bg-theme-black-lighter rounded-lg border border-theme-gold/10">
          <h3 className="text-xl font-medium text-theme-gold">{enhancedCurrentExercise.name}</h3>
          <p className="text-sm text-theme-gold-dark flex items-center">
            <Target size={16} className="mr-2"/> 
            Set {currentSet} of {enhancedCurrentExercise.sets} | Target Reps: {enhancedCurrentExercise.reps}
          </p>
        </div>
        
        {!isTimedExerciseActive && !isResting && (
          <div className="space-y-4 mb-6">
            {enhancedCurrentExercise.type === 'weight_reps' && (
              <div className="relative">
                <label htmlFor="weight" className="absolute -top-2 left-4 px-2 bg-theme-black-light text-xs text-theme-gold-dark">
                  Weight
                </label>
                <div className="flex items-center bg-theme-black-lighter border border-theme-gold/30 rounded-lg">
                  <span className="pl-4 text-theme-gold-dark">
                    <Dumbbell size={20} />
                  </span>
                  <input
                    type="number"
                    id="weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full p-4 bg-transparent text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50 rounded-r-lg"
                  />
                </div>
              </div>
            )}
            {(enhancedCurrentExercise.type === 'weight_reps' || enhancedCurrentExercise.type === 'reps_only' || enhancedCurrentExercise.type === 'reps_only_with_optional_weight') && (
              <div className="relative">
                <label htmlFor="reps" className="absolute -top-2 left-4 px-2 bg-theme-black-light text-xs text-theme-gold-dark">
                  Reps
                </label>
                <div className="flex items-center bg-theme-black-lighter border border-theme-gold/30 rounded-lg">
                  <span className="pl-4 text-theme-gold-dark">
                    <Repeat size={20} />
                  </span>
                  <input
                    type={enhancedCurrentExercise.reps.toUpperCase() === 'AMRAP' ? "text" : "number"}
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    placeholder={enhancedCurrentExercise.reps.toUpperCase() === 'AMRAP' ? "AMRAP" : "e.g., 10"}
                    className="w-full p-4 bg-transparent text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50 rounded-r-lg"
                  />
                </div>
              </div>
            )}
             {enhancedCurrentExercise.type === 'reps_only_with_optional_weight' && (
              <div className="relative">
                <label htmlFor="optional_weight" className="absolute -top-2 left-4 px-2 bg-theme-black-light text-xs text-theme-gold-dark">
                  Weight (Optional)
                </label>
                <div className="flex items-center bg-theme-black-lighter border border-theme-gold/30 rounded-lg">
                  <span className="pl-4 text-theme-gold-dark">
                    <Dumbbell size={20} />
                  </span>
                  <input
                    type="number"
                    id="optional_weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 10 (optional)"
                    className="w-full p-4 bg-transparent text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50 rounded-r-lg"
                  />
                </div>
              </div>
            )}
            {enhancedCurrentExercise.type === 'timed' && (
              <div className="relative">
                <label htmlFor="duration" className="absolute -top-2 left-4 px-2 bg-theme-black-light text-xs text-theme-gold-dark">
                  Duration (seconds)
                </label>
                <div className="flex items-center bg-theme-black-lighter border border-theme-gold/30 rounded-lg">
                  <span className="pl-4 text-theme-gold-dark">
                    <Clock size={20} />
                  </span>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 60"
                    className="w-full p-4 bg-transparent text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50 rounded-r-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {enhancedCurrentExercise.type === 'timed' && !isTimedExerciseActive && !isResting && (
            <button 
              onClick={startTimedExercise}
              className="flex-1 inline-flex items-center justify-center gap-2 p-4 bg-theme-gold text-theme-black font-semibold rounded-lg hover:bg-theme-gold-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50"
            >
              <Play size={20} /> Start Timer
            </button>
          )}
          {enhancedCurrentExercise.type !== 'timed' && !isResting && (
            <button 
              onClick={handleLogSet}
              className="flex-1 inline-flex items-center justify-center gap-2 p-4 bg-theme-gold text-theme-black font-semibold rounded-lg hover:bg-theme-gold-light transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50"
            >
              <Save size={20} /> Log Set {isLastSetForExercise ? '& Next Exercise' : '& Start Rest'}
            </button>
          )}
          {isLastSetForExercise && !isResting && (
            <button 
              onClick={moveToNextExercise}
              className="flex-1 inline-flex items-center justify-center gap-2 p-4 bg-theme-black hover:bg-theme-black-lighter text-theme-gold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 border border-theme-gold/30"
            >
              {isLastExerciseOverall ? 'Finish Workout' : 'Next Exercise'} <ChevronRight size={20} />
            </button>
          )}
        </div>
        
        {loggedSetsForExercise.length > 0 && (
          <div className="mt-6 pt-4 border-t border-theme-gold/20">
            <h4 className="text-md font-semibold text-theme-gold mb-2">Logged Sets for {enhancedCurrentExercise.name}:</h4>
            <ul className="space-y-1 text-sm">
              {loggedSetsForExercise.map((log, index) => (
                <li key={index} className="p-2 bg-theme-black-lighter rounded-lg border border-theme-gold/10 text-theme-gold-dark">
                  Set {log.set_number}: {log.weight ? `${log.weight} lbs/kg, ` : ''} {log.reps_logged} reps {log.duration_seconds ? `(${log.duration_seconds}s)` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <IconButton onClick={onGoHome} ariaLabel="Go Home" className="w-full sm:w-auto">
        <ChevronLeft size={20} className="mr-1" /> Back to Home
      </IconButton>

      <Modal isOpen={showCompletionModal} onClose={() => { setShowCompletionModal(false); onGoHome(); }} title="Workout Complete!">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-theme-gold mb-4" />
          <p className="text-lg text-theme-gold">Great job finishing the {day} workout!</p>
          <p className="text-sm text-theme-gold-dark">Your progress has been logged.</p>
          <IconButton onClick={() => { setShowCompletionModal(false); onGoHome(); }} ariaLabel="Go Home" className="mt-6">
            Return to Home
          </IconButton>
        </div>
      </Modal>

      <Modal isOpen={showExerciseInfoModal} onClose={() => setShowExerciseInfoModal(false)} title={enhancedCurrentExercise.name + " Info"}>
        <div className="space-y-3 text-theme-gold">
          <p><strong className="text-theme-gold-light">Target Sets:</strong> {enhancedCurrentExercise.sets}</p>
          <p><strong className="text-theme-gold-light">Target Reps/Duration:</strong> {enhancedCurrentExercise.reps}</p>
          <p><strong className="text-theme-gold-light">Type:</strong> {enhancedCurrentExercise.type.replace('_', ' ')}</p>
          {enhancedCurrentExercise.primaryMuscle && (
            <p><strong className="text-theme-gold-light">Primary Muscle:</strong> {enhancedCurrentExercise.primaryMuscle}</p>
          )}
          {enhancedCurrentExercise.secondaryMuscle && enhancedCurrentExercise.secondaryMuscle.length > 0 && (
            <p><strong className="text-theme-gold-light">Secondary Muscles:</strong> {enhancedCurrentExercise.secondaryMuscle.join(', ')}</p>
          )}
          {enhancedCurrentExercise.equipment && enhancedCurrentExercise.equipment.length > 0 && (
            <p><strong className="text-theme-gold-light">Equipment:</strong> {enhancedCurrentExercise.equipment.join(', ')}</p>
          )}
          {enhancedCurrentExercise.description && (
            <p><strong className="text-theme-gold-light">Notes:</strong> {enhancedCurrentExercise.description}</p>
          )}
        </div>
      </Modal>

      <ExerciseHistory
        isOpen={showExerciseHistory}
        onClose={() => setShowExerciseHistory(false)}
        exerciseId={enhancedCurrentExercise.id}
        exerciseName={enhancedCurrentExercise.name}
      />
    </div>
  );
}

export default WorkoutSession;