import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Play, Pause, RotateCcw, History, Clock, Dumbbell, Repeat, Timer, Target, ExternalLink } from 'lucide-react';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';
import { PrimaryButton } from './ui/Button';
import { Modal } from './ui/Modal';
import { ExerciseHistory } from './ExerciseHistory';
import { NextExercisePreview } from './NextExercisePreview';
import { PulsingTimerBackground } from './PulsingTimerBackground';
import { useUserProfile } from '../hooks/useUserProfile';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { getEnhancedExercise } from '../data/workoutData';
import type { WorkoutPlan, EnhancedExercise } from '../data/workoutData';

const REST_DURATION_SECONDS = 90;

interface WorkoutSessionProps {
  day: string;
  plan: WorkoutPlan;
  onGoHome: () => void;
  onLogWorkout: (log: any) => void;
}

function WorkoutSession({ day, plan, onGoHome, onLogWorkout }: WorkoutSessionProps) {
  const { user } = useAuth();
  const { profile, incrementCompletedWorkoutCount } = useUserProfile();
  
  // Get current level workouts
  const currentLevel = plan.levels[profile?.current_level_index || 0];
  const workouts = currentLevel ? currentLevel.workouts : {};
  const workout = workouts[day];
  
  if (!workout) {
    return (
      <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Workout not found</h2>
          <IconButton onClick={onGoHome} ariaLabel="Go back">
            <ChevronLeft size={20} className="mr-1" /> Go Back
          </IconButton>
        </div>
      </div>
    );
  }

  const exercises = workout.exercises.map(getEnhancedExercise);
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(REST_DURATION_SECONDS);
  const [loggedSetsForExercise, setLoggedSetsForExercise] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showNextExercise, setShowNextExercise] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [showEditSetModal, setShowEditSetModal] = useState(false);
  const [editingSet, setEditingSet] = useState<any>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editReps, setEditReps] = useState('');
  const [editDuration, setEditDuration] = useState('');

  const restTimerRef = useRef<NodeJS.Timeout | null>(null);
  const exerciseTimerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise = exercises[currentExerciseIndex];
  const nextExercise = currentExerciseIndex < exercises.length - 1 ? exercises[currentExerciseIndex + 1] : null;
  const isLastExercise = currentExerciseIndex === exercises.length - 1;
  const isLastSet = currentSet >= currentExercise.sets;

  const { history: exerciseHistory, loading: historyLoading } = useExerciseHistory(
    currentExercise.id, 
    currentExercise.name
  );

  // Load logged sets for current exercise
  useEffect(() => {
    const loadLoggedSets = async () => {
      if (!user || !currentExercise) return;

      try {
        const { data, error } = await supabase
          .from('workout_logs')
          .select('*')
          .eq('user_id', user.id)
          .eq('exercise_id', currentExercise.id)
          .eq('workout_day', day)
          .eq('created_at', new Date().toISOString().split('T')[0])
          .order('set_number', { ascending: true });

        if (error) throw error;
        setLoggedSetsForExercise(data || []);
      } catch (error) {
        console.error('Error loading logged sets:', error);
      }
    };

    loadLoggedSets();
  }, [user, currentExercise, day]);

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      restTimerRef.current = setTimeout(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0) {
      setIsResting(false);
      setRestTimeLeft(REST_DURATION_SECONDS);
    }

    return () => {
      if (restTimerRef.current) {
        clearTimeout(restTimerRef.current);
      }
    };
  }, [isResting, restTimeLeft]);

  // Exercise timer effect
  useEffect(() => {
    if (isTimerRunning) {
      exerciseTimerRef.current = setTimeout(() => {
        setTimerSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (exerciseTimerRef.current) {
        clearTimeout(exerciseTimerRef.current);
      }
    };
  }, [isTimerRunning, timerSeconds]);

  const startTimer = () => {
    setIsTimerRunning(true);
    setTimerSeconds(0);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setDuration(timerSeconds.toString());
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setDuration('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogSet = async () => {
    if (!user || !currentExercise) return;

    // Validation based on exercise type
    if (currentExercise.type === 'weight_reps' && (!weight || !reps)) {
      alert('Please enter both weight and reps');
      return;
    }
    if ((currentExercise.type === 'reps_only' || currentExercise.type === 'reps_only_with_optional_weight') && !reps) {
      alert('Please enter reps');
      return;
    }
    if (currentExercise.type === 'timed' && !duration) {
      alert('Please enter duration');
      return;
    }

    // Handle AMRAP reps
    let finalReps = reps;
    if (reps.toLowerCase() === 'amrap') {
      const amrapReps = prompt('How many reps did you complete?');
      if (!amrapReps || isNaN(parseInt(amrapReps))) {
        alert('Please enter a valid number of reps');
        return;
      }
      finalReps = amrapReps;
    }

    const logData = {
      user_id: user.id,
      workout_day: day,
      exercise_id: currentExercise.id,
      exercise_name: currentExercise.name,
      set_number: currentSet,
      weight: weight ? parseFloat(weight) : null,
      reps_logged: finalReps ? parseInt(finalReps) : null,
      duration_seconds: duration ? parseInt(duration) : null,
      target_reps: currentExercise.reps,
      target_sets: currentExercise.sets,
      current_plan_id: profile?.active_generated_plan?.id || profile?.current_plan_id || null,
      current_level_index: profile?.current_level_index || 0,
      created_at: new Date().toISOString()
    };

    try {
      // Only save to database if not in trial mode
      if (!profile?.is_trial_mode) {
        const { error } = await supabase
          .from('workout_logs')
          .insert([logData]);

        if (error) throw error;
      }

      // Update local state
      setLoggedSetsForExercise(prev => [...prev, { ...logData, id: Date.now().toString() }]);
      onLogWorkout(logData);

      // Clear inputs
      setWeight('');
      setReps('');
      setDuration('');
      setTimerSeconds(0);

      // Move to next set or exercise
      if (currentSet < currentExercise.sets) {
        setCurrentSet(prev => prev + 1);
        setIsResting(true);
        setRestTimeLeft(REST_DURATION_SECONDS);
      } else {
        // Move to next exercise or complete workout
        if (currentExerciseIndex < exercises.length - 1) {
          setCurrentExerciseIndex(prev => prev + 1);
          setCurrentSet(1);
          setLoggedSetsForExercise([]);
        } else {
          // Workout complete
          setShowCompletionModal(true);
        }
      }
    } catch (error) {
      console.error('Error logging set:', error);
      alert('Failed to log set. Please try again.');
    }
  };

  const handleEditSet = (set: any) => {
    setEditingSet(set);
    setEditWeight(set.weight?.toString() || '');
    setEditReps(set.reps_logged?.toString() || '');
    setEditDuration(set.duration_seconds?.toString() || '');
    setShowEditSetModal(true);
  };

  const handleSaveEditedSet = async () => {
    if (!editingSet) return;

    // Validation based on exercise type
    if (currentExercise.type === 'weight_reps' && (!editWeight || !editReps)) {
      alert('Please enter both weight and reps');
      return;
    }
    if ((currentExercise.type === 'reps_only' || currentExercise.type === 'reps_only_with_optional_weight') && !editReps) {
      alert('Please enter reps');
      return;
    }
    if (currentExercise.type === 'timed' && !editDuration) {
      alert('Please enter duration');
      return;
    }

    const updatedData = {
      weight: editWeight ? parseFloat(editWeight) : null,
      reps_logged: editReps ? parseInt(editReps) : null,
      duration_seconds: editDuration ? parseInt(editDuration) : null,
    };

    try {
      // Only update database if not in trial mode
      if (!profile?.is_trial_mode) {
        const { error } = await supabase
          .from('workout_logs')
          .update(updatedData)
          .eq('id', editingSet.id);

        if (error) throw error;
      }

      // Update local state
      setLoggedSetsForExercise(prev => 
        prev.map(log => 
          log.id === editingSet.id 
            ? { ...log, ...updatedData }
            : log
        )
      );

      setShowEditSetModal(false);
      setEditingSet(null);
      setEditWeight('');
      setEditReps('');
      setEditDuration('');
    } catch (error) {
      console.error('Error updating set:', error);
      alert('Failed to update set. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    setShowEditSetModal(false);
    setEditingSet(null);
    setEditWeight('');
    setEditReps('');
    setEditDuration('');
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(REST_DURATION_SECONDS);
  };

  const handleCompletionModalClose = async () => {
    // Only increment workout count if not in trial mode
    if (!profile?.is_trial_mode) {
      await incrementCompletedWorkoutCount();
    }
    setShowCompletionModal(false);
    onGoHome();
  };

  const openExerciseLink = (exerciseName: string) => {
    const searchQuery = encodeURIComponent(`${exerciseName} form`);
    const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
    window.open(googleSearchUrl, '_blank');
  };

  // Rest timer overlay
  if (isResting) {
    return (
      <div className="min-h-screen bg-theme-black text-theme-gold font-sans relative overflow-hidden">
        <PulsingTimerBackground 
          timeLeft={restTimeLeft} 
          totalTime={REST_DURATION_SECONDS} 
          isActive={isResting} 
        />
        
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Rest Time</h2>
              <p className="text-theme-gold-dark">Get ready for your next set</p>
            </div>
            
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-theme-gold/20"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - restTimeLeft / REST_DURATION_SECONDS)}`}
                  className="text-theme-gold transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl font-bold">{restTimeLeft}s</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-theme-gold-light">Next: Set {currentSet} of {currentExercise.name}</p>
                <p className="text-theme-gold-dark text-sm">{currentExercise.reps} reps</p>
              </div>
              
              <PrimaryButton
                onClick={skipRest}
                ariaLabel="Skip Rest"
                className="px-8 py-3"
              >
                Skip Rest
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <IconButton onClick={onGoHome} ariaLabel="Go back" className="text-sm">
            <ChevronLeft size={20} className="mr-1" /> Back
          </IconButton>
          <div className="text-center">
            <h2 className="text-xl font-bold text-theme-gold">{workout.name}</h2>
            <p className="text-sm text-theme-gold-dark">
              Exercise {currentExerciseIndex + 1} of {exercises.length}
            </p>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Exercise Progress */}
        <div className="flex justify-center">
          <div className="flex space-x-2">
            {exercises.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index < currentExerciseIndex
                    ? 'bg-theme-gold'
                    : index === currentExerciseIndex
                    ? 'bg-theme-gold/50'
                    : 'bg-theme-gold/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Current Exercise */}
        <Card className="bg-theme-black-light border border-theme-gold/20">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => openExerciseLink(currentExercise.name)}
                className="flex items-center gap-2 text-2xl font-bold text-theme-gold hover:text-theme-gold-light transition-colors"
              >
                {currentExercise.name}
                <ExternalLink size={18} className="text-theme-gold-dark" />
              </button>
              <IconButton
                onClick={() => setShowHistory(true)}
                ariaLabel="View exercise history"
                className="p-2"
              >
                <History size={16} />
              </IconButton>
            </div>
            
            <div className="flex items-center gap-4 text-theme-gold-light">
              <span className="flex items-center gap-1">
                <Target size={16} />
                Set {currentSet} of {currentExercise.sets}
              </span>
              <span>Target: {currentExercise.reps}</span>
            </div>

            {/* Exercise Type Specific Inputs */}
            <div className="space-y-4">
              {currentExercise.type === 'weight_reps' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-gold mb-2">
                      Weight (lbs)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-theme-gold mb-2">
                      Reps
                    </label>
                    <input
                      type="number"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                      placeholder="0"
                    />
                  </div>
                </div>
              )}

              {(currentExercise.type === 'reps_only' || currentExercise.type === 'reps_only_with_optional_weight') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-theme-gold mb-2">
                      Reps
                    </label>
                    <input
                      type="text"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                      placeholder="Enter reps or AMRAP"
                    />
                  </div>
                  {currentExercise.type === 'reps_only_with_optional_weight' && (
                    <div>
                      <label className="block text-sm font-medium text-theme-gold mb-2">
                        Weight (optional)
                      </label>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              )}

              {currentExercise.type === 'timed' && (
                <div className="space-y-4">
                  {/* Timer Display */}
                  {isTimerRunning && (
                    <div className="text-center p-6 bg-theme-black-lighter rounded-nested-container border border-theme-gold/30">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold text-theme-gold">{currentExercise.name}</h4>
                        <p className="text-sm text-theme-gold-dark">Target: {currentExercise.reps}</p>
                        <div className="text-4xl font-bold text-theme-gold">
                          {formatTime(timerSeconds)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Timer Controls */}
                  <div className="flex gap-3">
                    {!isTimerRunning ? (
                      <PrimaryButton
                        onClick={startTimer}
                        ariaLabel="Start Stopwatch"
                        className="flex-1"
                      >
                        <Play size={16} className="mr-1" />
                        Start Stopwatch
                      </PrimaryButton>
                    ) : (
                      <>
                        <PrimaryButton
                          onClick={stopTimer}
                          ariaLabel="End Set"
                          className="flex-1"
                        >
                          <Pause size={16} className="mr-1" />
                          End Set
                        </PrimaryButton>
                        <IconButton
                          onClick={resetTimer}
                          ariaLabel="Reset Timer"
                        >
                          <RotateCcw size={16} />
                        </IconButton>
                      </>
                    )}
                  </div>

                  {/* Duration Input */}
                  <div>
                    <label className="block text-sm font-medium text-theme-gold mb-2">
                      Duration (seconds)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                      placeholder="Enter duration"
                    />
                  </div>
                </div>
              )}

              <PrimaryButton
                onClick={handleLogSet}
                ariaLabel="Log Set & Start Rest"
                className="w-full py-3 text-lg font-semibold"
              >
                {isLastSet && isLastExercise ? 'Complete Workout' : 'Log Set & Start Rest'}
              </PrimaryButton>
            </div>
          </div>
        </Card>

        {/* Logged Sets */}
        {loggedSetsForExercise.length > 0 && (
          <Card className="bg-theme-black-lighter border border-theme-gold/20">
            <h3 className="text-lg font-semibold text-theme-gold mb-3">Completed Sets</h3>
            <div className="space-y-2">
              {loggedSetsForExercise.map((set, index) => (
                <button
                  key={index}
                  onClick={() => handleEditSet(set)}
                  className="w-full text-left p-3 bg-theme-black rounded-2x-nested-container border border-theme-gold/10 hover:border-theme-gold/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-theme-gold-light">
                      Set {set.set_number}: {set.weight ? `${set.weight} lbs, ` : ''}{set.reps_logged ? `${set.reps_logged} reps` : ''}{set.duration_seconds ? `${set.duration_seconds}s` : ''}
                    </span>
                    <span className="text-xs text-theme-gold-dark">Tap to edit</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Next Exercise Preview */}
        {nextExercise && (
          <div className="space-y-2">
            <button
              onClick={() => setShowNextExercise(!showNextExercise)}
              className="flex items-center gap-2 text-theme-gold-dark hover:text-theme-gold transition-colors"
            >
              <span className="text-sm">Next Exercise Preview</span>
              <span className="text-xs">{showNextExercise ? '▼' : '▶'}</span>
            </button>
            
            {showNextExercise && (
              <NextExercisePreview
                exercise={nextExercise}
                history={[]} // We could load this if needed
                loading={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Exercise History Modal */}
      <ExerciseHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        exerciseId={currentExercise.id}
        exerciseName={currentExercise.name}
      />

      {/* Edit Set Modal */}
      <Modal
        isOpen={showEditSetModal}
        onClose={handleCancelEdit}
        title="Edit Set"
      >
        <div className="space-y-4">
          {currentExercise.type === 'weight_reps' && (
            <>
              <div>
                <label className="block text-sm font-medium text-theme-gold mb-2">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={editWeight}
                  onChange={(e) => setEditWeight(e.target.value)}
                  className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-theme-gold mb-2">
                  Reps
                </label>
                <input
                  type="number"
                  value={editReps}
                  onChange={(e) => setEditReps(e.target.value)}
                  className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                  placeholder="0"
                />
              </div>
            </>
          )}

          {(currentExercise.type === 'reps_only' || currentExercise.type === 'reps_only_with_optional_weight') && (
            <>
              <div>
                <label className="block text-sm font-medium text-theme-gold mb-2">
                  Reps
                </label>
                <input
                  type="number"
                  value={editReps}
                  onChange={(e) => setEditReps(e.target.value)}
                  className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                  placeholder="0"
                />
              </div>
              {currentExercise.type === 'reps_only_with_optional_weight' && (
                <div>
                  <label className="block text-sm font-medium text-theme-gold mb-2">
                    Weight (optional)
                  </label>
                  <input
                    type="number"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                    placeholder="0"
                  />
                </div>
              )}
            </>
          )}

          {currentExercise.type === 'timed' && (
            <div>
              <label className="block text-sm font-medium text-theme-gold mb-2">
                Duration (seconds)
              </label>
              <input
                type="number"
                value={editDuration}
                onChange={(e) => setEditDuration(e.target.value)}
                className="w-full p-3 bg-theme-black-lighter border border-theme-gold/30 rounded-nested-container text-theme-gold placeholder-theme-gold-dark/50 focus:outline-none focus:ring-2 focus:ring-theme-gold/50"
                placeholder="0"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <IconButton
              onClick={handleCancelEdit}
              ariaLabel="Cancel"
              className="flex-1 text-theme-gold-dark hover:text-theme-gold"
            >
              Cancel
            </IconButton>
            <PrimaryButton
              onClick={handleSaveEditedSet}
              ariaLabel="Save Changes"
              className="flex-1"
            >
              Save Changes
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      {/* Workout Completion Modal */}
      <Modal
        isOpen={showCompletionModal}
        onClose={handleCompletionModalClose}
        title="Workout Complete!"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-theme-gold/20 rounded-full flex items-center justify-center mx-auto">
            <Target className="w-8 h-8 text-theme-gold" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-theme-gold mb-2">Great Work!</h3>
            <p className="text-theme-gold-dark">
              You've completed your {workout.name} workout. Keep up the momentum!
            </p>
          </div>
          <PrimaryButton
            onClick={handleCompletionModalClose}
            ariaLabel="Finish Workout"
            className="w-full py-3"
          >
            Finish Workout
          </PrimaryButton>
        </div>
      </Modal>
    </div>
  );
}

export default WorkoutSession;