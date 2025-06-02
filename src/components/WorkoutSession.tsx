import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Dumbbell, Repeat, Play, Save, CheckCircle, SkipForward, Info, Target, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { REST_DURATION_SECONDS } from '../data/workoutData';
import { IconButton } from './ui/IconButton';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  notes: string;
  type: string;
}

interface WorkoutSessionProps {
  day: string;
  plan: {
    name: string;
    exercises: Exercise[];
  };
  onGoHome: () => void;
  userId: string;
}

function WorkoutSession({ day, plan, onGoHome, userId }: WorkoutSessionProps) {
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

  const currentExercise = plan.exercises[currentExerciseIndex];

  // Reset for new exercise
  useEffect(() => {
    setCurrentSet(1);
    setWeight('');
    setReps('');
    setDuration(currentExercise.type === 'timed' ? currentExercise.reps.match(/\d+/)?.[0] || '' : '');
    setLoggedSetsForExercise([]);
    setIsResting(false);
    setTimerActive(false);
    setIsTimedExerciseActive(false);
  }, [currentExerciseIndex, currentExercise.type, currentExercise.reps]);

  // Timer logic
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
    if (!currentExercise) return;

    let repsLogged = reps;
    if (currentExercise.type === 'reps_only' && reps.toUpperCase() === 'AMRAP') {
        const amrapReps = prompt("Enter AMRAP reps achieved:");
        if (amrapReps === null || isNaN(parseInt(amrapReps))) {
            alert("Valid number required for AMRAP reps.");
            return;
        }
        repsLogged = parseInt(amrapReps);
    } else if (currentExercise.type !== 'timed' && (isNaN(parseInt(repsLogged)) || parseInt(repsLogged) <= 0)) {
        alert("Please enter a valid number of reps.");
        return;
    }
    
    const logEntry = {
      user_id: userId,
      workout_day: day,
      exercise_id: currentExercise.id,
      exercise_name: currentExercise.name,
      set_number: currentSet,
      weight: currentExercise.type.includes('weight') ? (weight ? parseFloat(weight) : 0) : null,
      reps_logged: currentExercise.type === 'timed' ? null : parseInt(repsLogged),
      duration_seconds: currentExercise.type === 'timed' ? (duration ? parseInt(duration) : parseInt(currentExercise.reps.match(/\d+/)?.[0] || '0')) : null,
      target_reps: currentExercise.reps,
      target_sets: currentExercise.sets,
      created_at: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from('workout_logs')
        .insert([logEntry])
        .select();

      if (error) throw error;
      
      if (data && data.length > 0) {
        setLoggedSetsForExercise(prev => [...prev, data[0]]);
      }
      
      setWeight('');
      setReps('');

      if (currentSet < currentExercise.sets) {
        setCurrentSet(prev => prev + 1);
        if (currentExercise.type !== 'timed') {
          setIsResting(true);
          setTimerSeconds(REST_DURATION_SECONDS);
          setTimerActive(true);
        }
      } else {
        // All sets for this exercise done
        if (currentExerciseIndex < plan.exercises.length - 1) {
          // User will need to click next
        } else {
          setShowCompletionModal(true);
        }
      }
    } catch (error) {
      console.error("Error logging set: ", error);
      alert("Failed to log set. Check console for details.");
    }
  };
  
  const startTimedExercise = () => {
    if (currentExercise.type === 'timed' && duration) {
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

  if (!currentExercise) {
    return (
      <Card className="bg-slate-800 border border-slate-700 text-center">
        <p className="text-xl text-red-400">Error: Exercise not found.</p>
        <IconButton onClick={onGoHome} ariaLabel="Go Home" className="mt-4 bg-red-500 hover:bg-red-600">
          <ChevronLeft size={20} className="mr-1" /> Go Home
        </IconButton>
      </Card>
    );
  }

  const isLastSetForExercise = currentSet >= currentExercise.sets;
  const isLastExerciseOverall = currentExerciseIndex >= plan.exercises.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="bg-slate-800 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-teal-400">{plan.name}</h2>
          <IconButton onClick={() => setShowExerciseInfoModal(true)} ariaLabel="Exercise Info" className="bg-sky-500 hover:bg-sky-600">
            <Info size={20} />
          </IconButton>
        </div>
        
        <div className="mb-6 p-4 bg-slate-700 rounded-lg">
          <h3 className="text-xl font-medium text-blue-300">{currentExercise.name}</h3>
          <p className="text-sm text-gray-400 flex items-center">
            <Target size={16} className="mr-2 text-green-400"/> 
            Set {currentSet} of {currentExercise.sets} | Target Reps: {currentExercise.reps}
          </p>
        </div>

        {/* Timer Display */}
        {(isResting || isTimedExerciseActive) && timerActive && (
          <div className="my-6 p-4 bg-slate-700 rounded-lg text-center">
            <p className="text-lg font-semibold text-yellow-400 mb-1">
              {isResting ? "Resting" : "Exercise In Progress"}
            </p>
            <p className="text-5xl font-bold text-yellow-300">{formatTime(timerSeconds)}</p>
            {isResting && (
              <IconButton onClick={skipRest} ariaLabel="Skip Rest" className="mt-3 bg-orange-500 hover:bg-orange-600 text-sm py-2 px-3">
                <SkipForward size={18} className="mr-1" /> Skip Rest
              </IconButton>
            )}
          </div>
        )}
        
        {/* Input Fields */}
        {!isTimedExerciseActive && !isResting && (
          <div className="space-y-4 mb-6">
            {currentExercise.type === 'weight_reps' && (
              <div className="flex items-center space-x-3">
                <Dumbbell size={20} className="text-gray-400" />
                <label htmlFor="weight" className="w-16 text-gray-300">Weight:</label>
                <input
                  type="number"
                  id="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 25"
                  className="flex-grow p-3 bg-slate-600 border border-slate-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                />
              </div>
            )}
            {(currentExercise.type === 'weight_reps' || currentExercise.type === 'reps_only' || currentExercise.type === 'reps_only_with_optional_weight') && (
              <div className="flex items-center space-x-3">
                <Repeat size={20} className="text-gray-400" />
                <label htmlFor="reps" className="w-16 text-gray-300">Reps:</label>
                <input
                  type={currentExercise.reps.toUpperCase() === 'AMRAP' ? "text" : "number"}
                  id="reps"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder={currentExercise.reps.toUpperCase() === 'AMRAP' ? "AMRAP" : "e.g., 10"}
                  className="flex-grow p-3 bg-slate-600 border border-slate-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                />
              </div>
            )}
             {currentExercise.type === 'reps_only_with_optional_weight' && (
              <div className="flex items-center space-x-3">
                <Dumbbell size={20} className="text-gray-400" />
                <label htmlFor="optional_weight" className="w-16 text-gray-300">Weight (Opt):</label>
                <input
                  type="number"
                  id="optional_weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g., 10 (optional)"
                  className="flex-grow p-3 bg-slate-600 border border-slate-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                />
              </div>
            )}
            {currentExercise.type === 'timed' && (
              <div className="flex items-center space-x-3">
                <Clock size={20} className="text-gray-400" />
                <label htmlFor="duration" className="w-16 text-gray-300">Duration (s):</label>
                <input
                  type="number"
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 60"
                  className="flex-grow p-3 bg-slate-600 border border-slate-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-white"
                />
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {currentExercise.type === 'timed' && !isTimedExerciseActive && !isResting && (
            <IconButton onClick={startTimedExercise} ariaLabel="Start Timed Exercise" className="flex-1 bg-green-500 hover:bg-green-600">
              <Play size={20} className="mr-2" /> Start Timer
            </IconButton>
          )}
          {currentExercise.type !== 'timed' && !isResting && (
             <IconButton onClick={handleLogSet} ariaLabel="Log Set" className="flex-1 bg-green-500 hover:bg-green-600">
              <Save size={20} className="mr-2" /> Log Set {isLastSetForExercise ? '& Next Exercise' : '& Start Rest'}
            </IconButton>
          )}
          {isLastSetForExercise && !isResting && (
            <IconButton onClick={moveToNextExercise} ariaLabel="Next Exercise" className="flex-1 bg-blue-500 hover:bg-blue-600">
              {isLastExerciseOverall ? 'Finish Workout' : 'Next Exercise'} <ChevronRight size={20} className="ml-2" />
            </IconButton>
          )}
        </div>
        
        {/* Logged Sets for Current Exercise */}
        {loggedSetsForExercise.length > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-700">
            <h4 className="text-md font-semibold text-gray-300 mb-2">Logged Sets for {currentExercise.name}:</h4>
            <ul className="space-y-1 text-sm text-gray-400">
              {loggedSetsForExercise.map((log, index) => (
                <li key={log.id || index} className="p-2 bg-slate-700 rounded">
                  Set {log.set_number}: {log.weight ? `${log.weight} lbs/kg, ` : ''} {log.reps_logged} reps {log.duration_seconds ? `(${log.duration_seconds}s)` : ''}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      <IconButton onClick={onGoHome} ariaLabel="Go Home" className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700">
        <ChevronLeft size={20} className="mr-1" /> Back to Home
      </IconButton>

      {/* Modals */}
      <Modal isOpen={showCompletionModal} onClose={() => { setShowCompletionModal(false); onGoHome(); }} title="Workout Complete!">
        <div className="text-center">
          <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
          <p className="text-lg text-gray-300">Great job finishing the {day} workout!</p>
          <p className="text-sm text-gray-400">Your progress has been logged.</p>
          <IconButton onClick={() => { setShowCompletionModal(false); onGoHome(); }} ariaLabel="Go Home" className="mt-6 bg-blue-500 hover:bg-blue-600">
            Return to Home
          </IconButton>
        </div>
      </Modal>

      <Modal isOpen={showExerciseInfoModal} onClose={() => setShowExerciseInfoModal(false)} title={currentExercise.name + " Info"}>
        <div className="space-y-3 text-gray-300">
          <p><strong className="text-blue-300">Target Sets:</strong> {currentExercise.sets}</p>
          <p><strong className="text-blue-300">Target Reps/Duration:</strong> {currentExercise.reps}</p>
          <p><strong className="text-blue-300">Type:</strong> {currentExercise.type.replace('_', ' ')}</p>
          {currentExercise.notes && <p><strong className="text-blue-300">Notes:</strong> {currentExercise.notes}</p>}
        </div>
      </Modal>
    </div>
  );
}

export default WorkoutSession;