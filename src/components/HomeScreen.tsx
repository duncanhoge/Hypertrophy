import React, { useState } from 'react';
import { CalendarDays, PlusCircle, MinusCircle, ChevronLeft, Settings, Clock } from 'lucide-react';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';
import { TilePrimaryButton } from './ui/Button';
import { Modal } from './ui/Modal';
import { useUserProfile } from '../hooks/useUserProfile';
import { getCurrentLevelWorkouts, getCurrentLevel } from '../data/workoutData';
import type { WorkoutPlan } from '../data/workoutData';

interface HomeScreenProps {
  plan: WorkoutPlan;
  onStartWorkout: (day: string) => void;
  onBack: () => void;
  workoutHistory: Record<string, any[]>;
}

function HomeScreen({ plan, onStartWorkout, onBack, workoutHistory }: HomeScreenProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { profile, updateBlockDuration, endTrainingBlock, getWeeksRemaining } = useUserProfile();

  const currentLevel = getCurrentLevel(plan, profile?.current_level_index || 0);
  const currentWorkouts = getCurrentLevelWorkouts(plan, profile?.current_level_index || 0);
  const weeksRemaining = getWeeksRemaining();
  const isActivePlan = profile?.current_plan_id === plan.id;

  const handleDurationChange = async (change: number) => {
    if (!profile) return;
    const newDuration = Math.max(1, profile.block_duration_weeks + change);
    await updateBlockDuration(newDuration);
  };

  const handleEndBlock = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to end your current training block? This will reset your progress."
    );
    if (confirmed) {
      await endTrainingBlock();
      setShowSettings(false);
      onBack();
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <IconButton onClick={onBack} ariaLabel="Back to Plans" className="text-sm">
          <ChevronLeft size={20} className="mr-1" /> Back to Plans
        </IconButton>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-theme-gold">{plan.name}</h2>
          {currentLevel && (
            <p className="text-sm text-theme-gold-dark">Level {currentLevel.level}: {currentLevel.name}</p>
          )}
        </div>
        {isActivePlan && (
          <IconButton 
            onClick={() => setShowSettings(true)} 
            ariaLabel="Plan Settings"
            className="text-sm"
          >
            <Settings size={20} />
          </IconButton>
        )}
      </div>

      {isActivePlan && weeksRemaining !== null && (
        <Card className="bg-theme-gold/10 border border-theme-gold/30">
          <div className="flex items-center justify-center gap-3 text-theme-gold">
            <Clock className="w-5 h-5" />
            <span className="font-semibold">
              {weeksRemaining > 0 
                ? `${weeksRemaining} weeks remaining in your training block`
                : 'Training block complete! Great work!'
              }
            </span>
          </div>
        </Card>
      )}

      <Card className="bg-theme-black-light border border-theme-gold/20">
        <h2 className="hero text-2xl mb-12 text-center">Select a workout</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.entries(currentWorkouts).map(([day, workout]) => (
            <TilePrimaryButton
              key={day}
              onClick={() => onStartWorkout(day)}
              ariaLabel={`Start ${day} workout`}
              className="w-full py-4 px-6 flex flex-col items-center space-y-2 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <CalendarDays size={28} />
              <span>{day}</span>
              <span className="text-xs opacity-80">{workout.name.split(' - ')[1]}</span>
            </TilePrimaryButton>
          ))}
        </div>
      </Card>

      <Card className="bg-theme-black-light border border-theme-gold/20">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center text-left text-xl font-semibold text-theme-gold hover:text-theme-gold-light transition-colors py-2"
        >
          Workout History
          {showHistory ? <MinusCircle size={24} /> : <PlusCircle size={24} />}
        </button>
        {showHistory && (
          <div className="mt-4 space-y-4 max-h-96 overflow-y-auto pr-2">
            {Object.keys(workoutHistory).length > 0 ? (
              Object.entries(workoutHistory).map(([date, logs]) => (
                <div key={date} className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/10">
                  <h3 className="text-md font-semibold text-theme-gold-light mb-2">{date}</h3>
                  <ul className="space-y-1 text-sm">
                    {logs.map((log, index) => (
                      <li key={index} className="text-theme-gold-dark">
                        {log.exercise_name} - Set {log.set_number}: {log.weight ? `${log.weight} lbs/kg, ` : ''}{log.reps_logged} reps {log.duration_seconds ? `(${log.duration_seconds}s)` : ''}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <p className="text-theme-gold-dark">No workout history yet. Complete a workout to see your logs!</p>
            )}
          </div>
        )}
      </Card>

      {/* Plan Settings Modal */}
      <Modal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
        title="Plan Settings"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-theme-gold mb-4">Current Training Block</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-theme-black-lighter rounded-nested-container">
                <span className="text-theme-gold-light">Program Length:</span>
                <div className="flex items-center gap-3">
                  <IconButton
                    onClick={() => handleDurationChange(-1)}
                    ariaLabel="Decrease duration"
                    className="p-2 text-sm"
                    disabled={!profile || profile.block_duration_weeks <= 1}
                  >
                    <MinusCircle size={16} />
                  </IconButton>
                  <span className="text-theme-gold font-semibold min-w-[80px] text-center">
                    {profile?.block_duration_weeks || 6} weeks
                  </span>
                  <IconButton
                    onClick={() => handleDurationChange(1)}
                    ariaLabel="Increase duration"
                    className="p-2 text-sm"
                    disabled={!profile}
                  >
                    <PlusCircle size={16} />
                  </IconButton>
                </div>
              </div>

              {profile?.block_start_date && (
                <div className="flex items-center justify-between p-3 bg-theme-black-lighter rounded-nested-container">
                  <span className="text-theme-gold-light">Started:</span>
                  <span className="text-theme-gold-dark">
                    {new Date(profile.block_start_date).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-theme-gold/20">
            <IconButton
              onClick={handleEndBlock}
              ariaLabel="End Block Early"
              className="w-full bg-red-900/20 text-red-400 hover:bg-red-900/40 border-red-500/30"
            >
              End Block Early
            </IconButton>
            <p className="text-xs text-theme-gold-dark mt-2 text-center">
              This will end your current training block and reset your progress.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default HomeScreen;