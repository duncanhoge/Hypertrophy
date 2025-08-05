import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Repeat, Play, Save, CheckCircle, SkipForward, Info, Target, Clock, ListChecks, History } from 'lucide-react';
import { REST_DURATION_SECONDS, getCurrentLevelWorkouts, getEnhancedExercise } from '../data/workoutData';
import { getExerciseById } from '../data/exerciseDictionary';
import { IconButton } from './ui/IconButton';
import { PrimaryButton } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { ExerciseHistory } from './ExerciseHistory';
import { TrainingBlockCompleteModal } from './TrainingBlockCompleteModal';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useUserProfile } from '../hooks/useUserProfile';
import type { Exercise, WorkoutPlan } from '../data/workoutData';

interface WorkoutSessionProps {
  day: string;
  plan: WorkoutPlan;
  onGoHome: () => void;
  onLogWorkout: (log: any) => void;
}

interface InlineTimerProps {
  timeLeft: number;
  totalTime: number;
  isActive: boolean;
  onSkip: () => void;
}

function InlineTimer({ timeLeft, totalTime, isActive, onSkip }: InlineTimerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>();
  const pulsesRef = React.useRef<Array<{
    x: number;
    y: number;
    radius: number;
    lifespan: number;
    speed: number;
  }>>([]);
  const frameCountRef = React.useRef(0);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = 200; // Fixed height for inline display
      }
    };

    resizeCanvas();

    const createPulse = () => {
      const pulse = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        radius: 0,
        lifespan: 255,
        speed: Math.max(0.5, (timeLeft / totalTime) * 2.5)
      };
      pulsesRef.current.push(pulse);
    };

    const updatePulse = (pulse: any) => {
      pulse.radius += pulse.speed;
      pulse.lifespan -= 1.5;
    };

    const drawPulse = (pulse: any) => {
      ctx.strokeStyle = `rgba(255, 215, 0, ${pulse.lifespan / 255})`;
      ctx.lineWidth = Math.max(0, (pulse.lifespan / 255) * 3);
      ctx.beginPath();
      ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
      ctx.stroke();
    };

    const animate = () => {
      if (!isActive) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      frameCountRef.current++;

      // Clear canvas with dark background
      ctx.fillStyle = 'rgba(26, 26, 26, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new pulses
      const pulseFrequency = Math.floor(Math.max(30, Math.min(150, (timeLeft / totalTime) * 120 + 30)));
      if (frameCountRef.current % pulseFrequency === 0 && timeLeft > 0) {
        createPulse();
      }

      // Update and draw pulses
      pulsesRef.current = pulsesRef.current.filter(pulse => {
        updatePulse(pulse);
        drawPulse(pulse);
        return pulse.lifespan > 0;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [timeLeft, totalTime, isActive]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const timerProgress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="relative w-full h-48 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Timer Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex items-center justify-center">
          {/* SVG for circular timer */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-theme-gold tracking-tighter font-mono">
              {formatTime(timeLeft)}
            </span>
            <p className="text-theme-gold-light uppercase tracking-widest text-xs mt-1 font-semibold">
              REST
            </p>
          </div>
        </div>
      </div>
      
      {/* Skip button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={onSkip}
          className="text-theme-gold-dark bg-theme-black-lighter/80 hover:bg-theme-gold/20 hover:text-theme-gold transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium border border-theme-gold/30 backdrop-blur-sm flex items-center gap-2"
        >
          <SkipForward size={16} />
          Skip Rest
        </button>
      </div>
    </div>
  );
}

interface TimedExerciseTimerProps {
  timeElapsed: number;
  targetTime: number;
  exerciseName: string;
  onFinish: () => void;
}

function TimedExerciseTimer({ timeElapsed, targetTime, exerciseName, onFinish }: TimedExerciseTimerProps) {
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const isComplete = timeElapsed >= targetTime;

  return (
    <div className="relative w-full h-48 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20 overflow-hidden">
      {/* Timer Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          {/* Timer Display */}
          <div className="mb-4">
            <span className="text-6xl font-bold text-theme-gold tracking-tighter font-mono block">
              {formatTime(timeElapsed)}
            </span>
            <div className="text-sm text-theme-gold-dark mt-2">
              Target: {formatTime(targetTime)}
            </div>
          </div>
          
          {/* Exercise Name */}
          <p className="text-theme-gold-light uppercase tracking-widest text-sm font-semibold mb-4">
            {exerciseName.toUpperCase()}
          </p>

          {/* Status Indicator */}
          {isComplete && (
            <div className="text-theme-gold text-sm font-medium mb-2">
              ✓ Target Time Reached!
            </div>
          )}
        </div>
      </div>
      
      {/* Finish button */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <button 
          onClick={onFinish}
          className={`transition-all duration-200 px-6 py-2 rounded-lg text-sm font-medium border backdrop-blur-sm flex items-center gap-2 ${
            isComplete 
              ? 'text-theme-gold bg-theme-gold/20 hover:bg-theme-gold/30 border-theme-gold/50' 
              : 'text-theme-gold-dark bg-theme-black-lighter/80 hover:bg-theme-gold/20 hover:text-theme-gold border-theme-gold/30'
          }`}
        >
          <CheckCircle size={16} />
          {isComplete ? 'Complete Exercise' : 'End Set'}
        </button>
      </div>
    </div>
  );
}

function WorkoutSession({ day, plan, onGoHome, onLogWorkout }: WorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [loggedSetsForExercise, setLoggedSetsForExercise] = useState<any[]>([]);
  
  // Timer state with timestamp-based tracking
  const [timerActive, setTimerActive] = useState(false);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [timerDuration, setTimerDuration] = useState(REST_DURATION_SECONDS);
  const [timerSeconds, setTimerSeconds] = useState(REST_DURATION_SECONDS);
  const [isResting, setIsResting] = useState(false);
  
  // Timed exercise state with timestamp-based tracking
  const [isTimedExerciseActive, setIsTimedExerciseActive] = useState(false);
  const [timedExerciseStartTime, setTimedExerciseStartTime] = useState<number | null>(null);
  const [timedExerciseElapsed, setTimedExerciseElapsed] = useState(0);
  
  const [justCompletedFinalSet, setJustCompletedFinalSet] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showExerciseInfoModal, setShowExerciseInfoModal] = useState(false);
  const [showWorkoutQueue, setShowWorkoutQueue] = useState(false);
  const [showExerciseHistory, setShowExerciseHistory] = useState(false);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const { user } = useAuth();
  const { profile, incrementCompletedWorkoutCount, isBlockComplete, startNextLevel, restartCurrentLevel, endTrainingBlock } = useUserProfile();
  
  // Get current level workouts
  const currentWorkouts = getCurrentLevelWorkouts(plan, profile?.current_level_index || 0);
  const currentWorkout = currentWorkouts[day];
  const currentExercise = currentWorkout?.exercises[currentExerciseIndex];
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
    setTimerStartTime(null);
    setIsTimedExerciseActive(false);
    setTimedExerciseStartTime(null);
    setTimedExerciseElapsed(0);
    setJustCompletedFinalSet(false);
  }, [currentExerciseIndex, enhancedCurrentExercise?.type, enhancedCurrentExercise?.reps]);

  // Timer effect with timestamp-based calculation
  useEffect(() => {
    let interval: number | undefined;
    
    if (timerActive && timerStartTime) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - timerStartTime) / 1000);
        
        if (isResting) {
          // Rest timer countdown
          const remaining = Math.max(0, timerDuration - elapsed);
          setTimerSeconds(remaining);
          
          if (remaining === 0) {
            // Rest timer finished
            setTimerActive(false);
            setTimerStartTime(null);
            setIsResting(false);
            
            // If we just finished resting after the final set, move to next exercise
            if (justCompletedFinalSet && currentExerciseIndex < currentWorkout.exercises.length - 1) {
              moveToNextExercise();
            }
          }
        } else if (isTimedExerciseActive) {
          // Timed exercise count-up
          setTimedExerciseElapsed(elapsed);
        }
      }, 100); // Update more frequently for better accuracy
    }
    
    return () => clearInterval(interval);
  }, [timerActive, timerStartTime, timerDuration, isResting, isTimedExerciseActive, justCompletedFinalSet, currentExerciseIndex, currentWorkout?.exercises.length]);

  const handleLogSet = async () => {
    if (!enhancedCurrentExercise || !user || !currentWorkout) return;

    // Check if we're in trial mode - if so, don't save to database
    const isTrialMode = profile?.is_trial_mode || false;

    let repsLogged = reps;
    let durationLogged = null;

    if (enhancedCurrentExercise.type === 'timed') {
      // For timed exercises, ONLY use the manually entered duration from the input field
      const manualDuration = parseInt(duration);
      if (isNaN(manualDuration) || manualDuration <= 0) {
        alert("Please enter a valid duration in seconds (greater than 0).");
        return;
      }
      durationLogged = manualDuration;
    } else if (enhancedCurrentExercise.type === 'reps_only' && reps.toUpperCase() === 'AMRAP') {
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
      duration_seconds: durationLogged,
      target_reps: enhancedCurrentExercise.reps,
      target_sets: enhancedCurrentExercise.sets,
      current_plan_id: profile?.current_plan_id || null,
      current_level_index: profile?.current_level_index || 0,
      created_at: new Date().toISOString(),
    };

    try {
      // Only save to Supabase if not in trial mode
      if (!isTrialMode) {
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
      }

      setLoggedSetsForExercise(prev => [...prev, logEntry]);
      
      setWeight('');
      setReps('');
      setTimedExerciseElapsed(0);
      setIsTimedExerciseActive(false);
      setTimedExerciseStartTime(null);
      setTimerActive(false);
      setTimerStartTime(null);

      if (currentSet < enhancedCurrentExercise.sets) {
        // Not the final set - increment and start rest timer
        setCurrentSet(prev => prev + 1);
        setJustCompletedFinalSet(false);
        
        // Start rest timer for all exercise types
        startRestTimer();
      } else {
        // Final set completed - mark it and handle next steps
        setJustCompletedFinalSet(true);
        
        if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
          // More exercises remaining - start rest timer before next exercise
          startRestTimer();
        } else {
          // This was the last exercise - show completion modal
          setShowCompletionModal(true);
        }
      }
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to save workout log. Please try again.');
    }
  };

  const startRestTimer = () => {
    const now = Date.now();
    setIsResting(true);
    setTimerDuration(REST_DURATION_SECONDS);
    setTimerSeconds(REST_DURATION_SECONDS);
    setTimerStartTime(now);
    setTimerActive(true);
  };
  
  const startTimedExercise = () => {
    if (enhancedCurrentExercise?.type === 'timed' && duration) {
      const now = Date.now();
      setIsTimedExerciseActive(true);
      setTimedExerciseStartTime(now);
      setTimedExerciseElapsed(0);
      setTimerStartTime(now);
      setTimerActive(true);
    }
  };

  const finishTimedExercise = () => {
    setIsTimedExerciseActive(false);
    setTimedExerciseStartTime(null);
    setTimerActive(false);
    setTimerStartTime(null);
    // Update the duration field with the elapsed time from the stopwatch
    setDuration(timedExerciseElapsed.toString());
  };

  const moveToNextExercise = () => {
    if (currentExerciseIndex < currentWorkout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setIsResting(false);
      setTimerActive(false);
      setTimerStartTime(null);
      setJustCompletedFinalSet(false);
    } else {
      setShowCompletionModal(true);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setTimerActive(false);
    setTimerStartTime(null);
    
    // Check if we just finished the final set of an exercise
    if (justCompletedFinalSet && currentExerciseIndex < currentWorkout.exercises.length - 1) {
      moveToNextExercise();
    }
  };

  const handleCompletionModalClose = async () => {
    setShowCompletionModal(false);
    
    // Only increment workout count if not in trial mode
    const isTrialMode = profile?.is_trial_mode || false;
    if (!isTrialMode) {
      try {
        const updatedProfile = await incrementCompletedWorkoutCount();
        
        // Check if this completion makes the training block complete
        if (updatedProfile) {
          // Force a small delay to ensure state is updated, then check completion
          setTimeout(() => {
            if (isBlockComplete()) {
              // Show level-up modal instead of going home
              setShowLevelUpModal(true);
              return;
            }
            // If not complete, go home normally
            onGoHome();
          }, 100);
        } else {
          onGoHome();
        }
      } catch (error) {
        console.error('Failed to increment workout count:', error);
        // Don't block the user flow if this fails
        onGoHome();
      }
    } else {
      onGoHome();
    }
  };

  const handleLevelUpModalClose = () => {
    setShowLevelUpModal(false);
    // Go home after dismissing the level-up modal
    onGoHome();
  };

  const handleStartNextLevel = async () => {
    try {
      await startNextLevel();
      setShowLevelUpModal(false);
      onGoHome();
    } catch (error) {
      console.error('Failed to start next level:', error);
      setShowLevelUpModal(false);
      onGoHome();
    }
  };

  const handleRestartLevel = async () => {
    try {
      await restartCurrentLevel();
      setShowLevelUpModal(false);
      onGoHome();
    } catch (error) {
      console.error('Failed to restart level:', error);
      setShowLevelUpModal(false);
      onGoHome();
    }
  };

  const handleCreateCustomPlanFromCompletion = () => {
    setShowLevelUpModal(false);
    endTrainingBlock();
    // Navigate to plan creation - this would need to be passed as a prop
    // For now, just go home and let the user navigate manually
    onGoHome();
  };

  if (!currentWorkout) {
    return (
      <Card className="bg-theme-black-light border border-theme-gold/20 text-center">
        <p className="text-xl text-red-400">Error: Workout not found for {day}.</p>
        <IconButton onClick={onGoHome} ariaLabel="Go Home" className="mt-4">
          <ChevronLeft size={20} className="mr-1" /> Go Home
        </IconButton>
      </Card>
    );
  }

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

  // Calculate total sets in workout
  const totalSets = currentWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  
  // Calculate completed sets
  const completedSets = currentWorkout.exercises.slice(0, currentExerciseIndex).reduce((acc, ex) => acc + ex.sets, 0) + (currentSet - 1);
  
  // Calculate progress percentage
  const progressPercentage = (completedSets / totalSets) * 100;

  const isLastSetForExercise = currentSet >= enhancedCurrentExercise.sets;
  const isLastExerciseOverall = currentExerciseIndex >= currentWorkout.exercises.length - 1;

  // Determine if we should show input fields
  const shouldShowInputs = !isResting && !isTimedExerciseActive;

  // Determine button text and behavior
  const getLogButtonText = () => {
    if (isLastSetForExercise && isLastExerciseOverall) {
      return "Log Set & Finish Workout";
    } else if (isLastSetForExercise) {
      return "Log Set & Next Exercise";
    } else {
      return "Log Set & Start Rest";
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      <Card className="bg-theme-black-light border border-theme-gold/20">
        <div className="flex justify-between items-center mb-4">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-theme-gold">{currentWorkout.name}</h2>
            <p className="text-sm text-theme-gold-dark mt-1">
              Set {completedSets + 1} of {totalSets} Total Sets
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
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

        <div className="h-2 bg-theme-black-lighter rounded-lg mb-4">
          <div 
            className="h-full bg-theme-gold rounded-lg transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {showWorkoutQueue && (
          <div className="mb-6 p-4 bg-theme-black-lighter rounded-nested-container border border-theme-gold/10">
            <h3 className="text-lg font-medium text-theme-gold mb-3">Workout Queue</h3>
            <div className="space-y-2">
              {currentWorkout.exercises.map((exercise, index) => {
                const enhancedExercise = getEnhancedExercise(exercise);
                const isCurrentExercise = index === currentExerciseIndex;
                const isPastExercise = index < currentExerciseIndex;
                const exerciseProgress = isCurrentExercise ? currentSet - 1 : (isPastExercise ? exercise.sets : 0);
                
                return (
                  <div 
                    key={exercise.id}
                    className={`p-2 rounded-2x-nested-container border ${
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

        <div className="mb-6 p-4 bg-theme-black-lighter rounded-nested-container border border-theme-gold/10">
          <h3 className="text-xl font-medium text-theme-gold">{enhancedCurrentExercise.name}</h3>
          <p className="text-sm text-theme-gold-dark flex items-center">
            <Target size={16} className="mr-2"/> 
            Set {currentSet} of {enhancedCurrentExercise.sets} | Target Reps: {enhancedCurrentExercise.reps}
          </p>
        </div>
        
        {/* Rest timer display */}
        {isResting && timerActive && (
          <div className="mb-6">
            <InlineTimer
              timeLeft={timerSeconds}
              totalTime={timerDuration}
              isActive={timerActive}
              onSkip={skipRest}
            />
          </div>
        )}

        {/* Timed exercise timer display */}
        {isTimedExerciseActive && timerActive && (
          <div className="mb-6">
            <TimedExerciseTimer
              timeElapsed={timedExerciseElapsed}
              targetTime={parseInt(duration)}
              exerciseName={enhancedCurrentExercise.name}
              onFinish={finishTimedExercise}
            />
          </div>
        )}

        {/* Input fields and buttons - reorganized for timed exercises */}
        {shouldShowInputs && (
          <div className="space-y-4 mb-6">
            {/* For timed exercises: Start Stopwatch button first */}
            {enhancedCurrentExercise.type === 'timed' && (
              <PrimaryButton 
                onClick={startTimedExercise}
                ariaLabel="Start Stopwatch"
                className="w-full"
                disabled={!duration || parseInt(duration) <= 0}
              >
                <Play size={20} className="mr-2" /> Start Stopwatch
              </PrimaryButton>
            )}

            {/* Weight input for weight-based exercises */}
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

            {/* Reps input for rep-based exercises */}
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

            {/* Optional weight for reps_only_with_optional_weight */}
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

            {/* Duration input for timed exercises */}
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

            {/* Log Set button for all exercise types (below inputs) */}
            {enhancedCurrentExercise.type !== 'timed' && (
              <PrimaryButton 
                onClick={handleLogSet}
                ariaLabel={getLogButtonText()}
                className="w-full"
              >
                <Save size={20} className="mr-2" /> {getLogButtonText()}
              </PrimaryButton>
            )}

            {/* For timed exercises: Log Set and Start Rest button below duration input */}
            {enhancedCurrentExercise.type === 'timed' && !isTimedExerciseActive && (
              <PrimaryButton 
                onClick={handleLogSet}
                ariaLabel={getLogButtonText()}
                className="w-full"
              >
                <Save size={20} className="mr-2" /> {getLogButtonText()}
              </PrimaryButton>
            )}
          </div>
        )}
        
        {loggedSetsForExercise.length > 0 && (
          <div className="mt-6 pt-4 border-t border-theme-gold/20">
            <h4 className="text-md font-semibold text-theme-gold mb-2">Logged Sets for {enhancedCurrentExercise.name}:</h4>
            <ul className="space-y-1 text-sm">
              {loggedSetsForExercise.map((log, index) => (
                <li key={index} className="p-2 bg-theme-black-lighter rounded-2x-nested-container border border-theme-gold/10 text-theme-gold-dark">
                  Set {log.set_number}: {log.weight ? `${log.weight} lbs/kg, ` : ''} {log.reps_logged ? `${log.reps_logged} reps` : ''} {log.duration_seconds ? `${log.duration_seconds}s` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <IconButton onClick={onGoHome} ariaLabel="Go Home" className="w-full sm:w-auto">
        <ChevronLeft size={20} className="mr-1" /> Back to Home
      </IconButton>

      <Modal isOpen={showCompletionModal} onClose={handleCompletionModalClose} title="Workout Complete!">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-theme-gold mb-4" />
          <p className="text-lg text-theme-gold">Great job finishing the {day} workout!</p>
          <p className="text-sm text-theme-gold-dark">Your progress has been logged.</p>
          <IconButton onClick={handleCompletionModalClose} ariaLabel="Go Home" className="mt-6">
            Continue
          </IconButton>
        </div>
      </Modal>

      <Modal isOpen={showExerciseInfoModal} onClose={() => setShowExerciseInfoModal(false)} title={enhancedCurrentExercise.name + " Info"}>
        <div className="space-y-4 text-theme-gold">
          {/* Workout Plan Information */}
          <div className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20">
            <h3 className="text-lg font-semibold text-theme-gold mb-3">Workout Information</h3>
            <div className="space-y-2">
              <p><strong className="text-theme-gold-light">Target Sets:</strong> {enhancedCurrentExercise.sets}</p>
              <p><strong className="text-theme-gold-light">Target Reps/Duration:</strong> {enhancedCurrentExercise.reps}</p>
              <p><strong className="text-theme-gold-light">Exercise Type:</strong> {enhancedCurrentExercise.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
          </div>

          {/* Exercise Dictionary Information */}
          <div className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20">
            <h3 className="text-lg font-semibold text-theme-gold mb-3">Exercise Details</h3>
            <div className="space-y-2">
              <p><strong className="text-theme-gold-light">Exercise ID:</strong> <code className="text-theme-gold-dark bg-theme-black px-2 py-1 rounded text-sm">{enhancedCurrentExercise.id}</code></p>
              
              {enhancedCurrentExercise.primaryMuscle && (
                <p><strong className="text-theme-gold-light">Primary Muscle:</strong> {enhancedCurrentExercise.primaryMuscle}</p>
              )}
              
              {enhancedCurrentExercise.secondaryMuscle && enhancedCurrentExercise.secondaryMuscle.length > 0 && (
                <p><strong className="text-theme-gold-light">Secondary Muscles:</strong> {enhancedCurrentExercise.secondaryMuscle.join(', ')}</p>
              )}
              
              {enhancedCurrentExercise.equipment && enhancedCurrentExercise.equipment.length > 0 && (
                <p><strong className="text-theme-gold-light">Equipment Required:</strong> {enhancedCurrentExercise.equipment.map(eq => eq.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())).join(', ')}</p>
              )}
              
              {enhancedCurrentExercise.movementPattern && (
                <p><strong className="text-theme-gold-light">Movement Pattern:</strong> {enhancedCurrentExercise.movementPattern.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              )}
            </div>
          </div>

          {/* Alternative Exercises */}
          {enhancedCurrentExercise.alternatives && enhancedCurrentExercise.alternatives.length > 0 && (
            <div className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20">
              <h3 className="text-lg font-semibold text-theme-gold mb-3">Alternative Exercises</h3>
              <div className="space-y-1">
                {enhancedCurrentExercise.alternatives.map((altId, index) => {
                  const altExercise = getEnhancedExercise({ id: altId, sets: 0, reps: '', type: '' });
                  return (
                    <p key={index} className="text-theme-gold-dark">
                      • {altExercise.name}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Exercise Description/Notes */}
          {enhancedCurrentExercise.description && (
            <div className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/20">
              <h3 className="text-lg font-semibold text-theme-gold mb-3">Form & Notes</h3>
              <p className="text-theme-gold-dark leading-relaxed">{enhancedCurrentExercise.description}</p>
            </div>
          )}
        </div>
      </Modal>

      <ExerciseHistory
        isOpen={showExerciseHistory}
        onClose={() => setShowExerciseHistory(false)}
        exerciseId={enhancedCurrentExercise.id}
        exerciseName={enhancedCurrentExercise.name}
      />

      {/* Training Block Complete Modal */}
      <TrainingBlockCompleteModal
        isOpen={showLevelUpModal}
        onStartNextLevel={handleStartNextLevel}
        onRestartLevel={handleRestartLevel}
        onDecideLater={handleLevelUpModalClose}
        onCreateCustomPlan={handleCreateCustomPlanFromCompletion}
        planName={plan.name}
        workoutsCompleted={profile?.completed_workout_count || 0}
        currentPlanId={profile?.active_generated_plan?.id || profile?.current_plan_id || ''}
        currentLevelIndex={profile?.current_level_index || 0}
      />
    </div>
  );
}

export default WorkoutSession;