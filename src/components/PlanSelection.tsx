import React, { useState } from 'react';
import { WORKOUT_PLANS } from '../data/workoutData';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';
import { Modal } from './ui/Modal';
import { useUserProfile } from '../hooks/useUserProfile';
import { Dumbbell, Calendar, PlusCircle, MinusCircle, Play, Eye, Clock, CheckCircle } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  workoutHistory: Record<string, any[]>;
}

function PlanSelection({ onSelectPlan, workoutHistory }: PlanSelectionProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const { profile, startTrainingBlock, getWeeksRemaining } = useUserProfile();

  const handleStartPlan = async (planId: string) => {
    if (profile?.current_plan_id && profile.current_plan_id !== planId) {
      // User has an active plan and wants to switch
      setPendingPlanId(planId);
      setShowSwitchModal(true);
    } else {
      // No active plan or same plan - start directly
      await startTrainingBlock(planId);
      onSelectPlan(planId);
    }
  };

  const handleConfirmSwitch = async () => {
    if (pendingPlanId) {
      await startTrainingBlock(pendingPlanId);
      onSelectPlan(pendingPlanId);
    }
    setShowSwitchModal(false);
    setPendingPlanId(null);
  };

  const handleTryPlan = (planId: string) => {
    // Try plan without starting a training block
    onSelectPlan(planId);
  };

  const weeksRemaining = getWeeksRemaining();
  const activePlanName = profile?.current_plan_id ? WORKOUT_PLANS[profile.current_plan_id]?.name : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {Object.values(WORKOUT_PLANS).map((plan) => {
          const isActivePlan = profile?.current_plan_id === plan.id;
          const hasActivePlan = !!profile?.current_plan_id;
          
          return (
            <Card 
              key={plan.id}
              className={`bg-theme-black-light border transition-all duration-300 hover:scale-[1.02] ${
                isActivePlan 
                  ? 'border-theme-gold bg-theme-gold/5' 
                  : 'border-theme-gold/20 hover:border-theme-gold/40'
              }`}
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3 flex items-center justify-center bg-theme-black-lighter rounded-nested-container relative">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Dumbbell className="w-8 h-8 text-theme-gold" />
                  </div>
                  {isActivePlan && (
                    <div className="absolute top-2 right-2 bg-theme-gold text-theme-black px-2 py-1 rounded-2x-nested-container text-xs font-bold">
                      ACTIVE
                    </div>
                  )}
                </div>
                <div className="md:w-2/3 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-theme-gold">
                      {plan.name}
                    </h3>
                    {isActivePlan && weeksRemaining !== null && (
                      <div className="flex items-center gap-2 text-theme-gold-light">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {weeksRemaining > 0 ? `${weeksRemaining} weeks left` : 'Block Complete!'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-theme-gold-dark">{plan.description}</p>
                  
                  <div className="flex items-center gap-2 text-theme-gold-dark">
                    <Calendar className="w-5 h-5" />
                    <span>{Object.keys(plan.levels[0].workouts).length} workouts per week</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(plan.levels[0].workouts).map(([day, workout]) => (
                      <span key={day} className="px-3 py-1 bg-theme-black-lighter rounded-2x-nested-container text-sm text-theme-gold-dark">
                        {day}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    {!isActivePlan && (
                      <>
                        <IconButton
                          onClick={() => handleStartPlan(plan.id)}
                          ariaLabel={hasActivePlan ? "Switch to This Plan" : "Start This Plan"}
                          className="bg-theme-gold text-theme-black hover:bg-theme-gold-light font-semibold"
                        >
                          <Play size={16} className="mr-1" />
                          {hasActivePlan ? "Switch to This Plan" : "Start This Plan"}
                        </IconButton>
                        <IconButton
                          onClick={() => handleTryPlan(plan.id)}
                          ariaLabel="Try Plan"
                          className="text-theme-gold-dark hover:text-theme-gold"
                        >
                          <Eye size={16} className="mr-1" />
                          Try Plan
                        </IconButton>
                      </>
                    )}
                    {isActivePlan && (
                      <IconButton
                        onClick={() => onSelectPlan(plan.id)}
                        ariaLabel="Continue Plan"
                        className="bg-theme-gold text-theme-black hover:bg-theme-gold-light font-semibold"
                      >
                        <Play size={16} className="mr-1" />
                        Continue Plan
                      </IconButton>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

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
              Object.entries(workoutHistory)
                .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                .map(([date, logs]) => (
                <div key={date} className="p-3 bg-theme-black-lighter rounded-nested-container border border-theme-gold/10">
                  <h3 className="text-md font-semibold text-theme-gold-light mb-2">{date}</h3>
                  <ul className="space-y-1 text-sm">
                    {logs.map((log, index) => (
                      <li key={index} className="text-theme-gold-dark">
                        {log.workout_day} - {log.exercise_name} - Set {log.set_number}: {log.weight ? `${log.weight} lbs/kg, ` : ''}{log.reps_logged} reps {log.duration_seconds ? `(${log.duration_seconds}s)` : ''}
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

      {/* Switch Plan Confirmation Modal */}
      <Modal 
        isOpen={showSwitchModal} 
        onClose={() => setShowSwitchModal(false)} 
        title="Switch Training Plan"
      >
        <div className="space-y-4">
          <p className="text-theme-gold-dark">
            This will end your current training block on <strong className="text-theme-gold">"{activePlanName}"</strong> and start a new 6-week block with <strong className="text-theme-gold">"{pendingPlanId ? WORKOUT_PLANS[pendingPlanId]?.name : ''}"</strong>.
          </p>
          <p className="text-theme-gold-dark text-sm">
            Your workout history will be preserved, but your current progress will be reset.
          </p>
          <div className="flex gap-3 pt-4">
            <IconButton
              onClick={handleConfirmSwitch}
              ariaLabel="Confirm Switch"
              className="flex-1 bg-theme-gold text-theme-black hover:bg-theme-gold-light font-semibold"
            >
              <CheckCircle size={16} className="mr-1" />
              Yes, Switch Plans
            </IconButton>
            <IconButton
              onClick={() => setShowSwitchModal(false)}
              ariaLabel="Cancel"
              className="flex-1 text-theme-gold-dark hover:text-theme-gold"
            >
              Cancel
            </IconButton>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PlanSelection;