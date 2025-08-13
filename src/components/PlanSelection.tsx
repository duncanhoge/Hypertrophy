import React, { useState } from 'react';
import { WORKOUT_PLANS } from '../data/workoutData';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';
import { PrimaryButton, SecondaryButton } from './ui/Button';
import { Modal } from './ui/Modal';
import { PlanGenerationWizard } from './PlanGenerationWizard';
import { useUserProfile } from '../hooks/useUserProfile';
import { Dumbbell, Calendar, PlusCircle, MinusCircle, Play, Eye, Clock, CheckCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  onCreatePlan: () => void;
  workoutHistory: Record<string, any[]>;
}

function PlanSelection({ onSelectPlan, onCreatePlan, workoutHistory }: PlanSelectionProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingPlanId, setPendingPlanId] = useState<string | null>(null);
  const { profile, startTrainingBlock, startTrialMode, getWorkoutsRemaining } = useUserProfile();

  const workoutsRemaining = getWorkoutsRemaining();
  const activePlanName = profile?.current_plan_id ? WORKOUT_PLANS[profile.current_plan_id]?.name : null;
  const hasGeneratedPlan = !!profile?.active_generated_plan;
  const hasActivePlan = !!profile?.current_plan_id || hasGeneratedPlan;
  
  // State management based on user stories
  const [showPreMadePlans, setShowPreMadePlans] = useState(false);
  
  // Set initial state based on whether user has active plan
  React.useEffect(() => {
    setShowPreMadePlans(!hasActivePlan);
  }, [hasActivePlan]);

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
    // Start trial mode for the plan
    startTrialMode(planId);
    onSelectPlan(planId);
  };

  // Dynamic section title based on user state
  const preMadePlansTitle = hasActivePlan ? "Other Plans" : "Pre-Made Plans";

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Create Your Own Plan Card - Only show if no active plan */}
      {!hasActivePlan && (
        <Card className="bg-gradient-to-br from-theme-gold/20 to-theme-gold/5 border-theme-gold/40 hover:border-theme-gold/60 transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center justify-center bg-theme-gold/20 rounded-nested-container p-4">
              <div className="w-16 h-16 flex items-center justify-center mb-2">
                <Sparkles className="w-8 h-8 text-theme-gold" />
              </div>
              <div className="bg-theme-gold text-theme-black px-2 py-1 rounded-2x-nested-container text-xs font-bold mb-2">
                NEW
              </div>
              <div className="text-center">
                <div className="text-theme-gold font-semibold text-sm">
                  Custom Plan
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-theme-gold">
                  Create Your Own Plan
                </h3>
                <p className="text-theme-gold-dark">
                  Generate a personalized workout plan based on your goals and available equipment. 
                  Perfect for creating a program that fits your unique situation.
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-theme-gold-dark">
                <Sparkles className="w-5 h-5" />
                <span>Personalized • Equipment-based • Goal-focused</span>
              </div>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  onClick={onCreatePlan}
                  ariaLabel="Create Your Own Plan"
                >
                  <Sparkles size={16} className="mr-1" />
                  Create Your Own Plan
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Generated Plan Display */}
      {hasGeneratedPlan && (
        <Card className="bg-gradient-to-br from-theme-gold/10 to-theme-gold/5 border-theme-gold/40 hover:border-theme-gold/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center justify-center bg-theme-black-lighter rounded-nested-container relative p-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-theme-gold" />
              </div>
              <div className="bg-theme-gold text-theme-black px-2 py-1 rounded-2x-nested-container text-xs font-bold mb-2">
                YOUR PLAN
              </div>
              <div className="text-center">
                <div className="text-theme-gold font-semibold text-sm">
                  Level {(profile?.current_level_index || 0) + 1}
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-theme-gold">
                  {profile.active_generated_plan.name}
                </h3>
                {workoutsRemaining !== null && (
                  <div className="flex items-center gap-2 text-theme-gold-light">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {workoutsRemaining > 0 ? `${workoutsRemaining} workouts left` : 'Block Complete!'}
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-theme-gold-dark">{profile.active_generated_plan.description}</p>
              
              <div className="flex items-center gap-2 text-theme-gold-dark">
                <Calendar className="w-5 h-5" />
                <span>{Object.keys(profile.active_generated_plan.levels[0].workouts).length} workouts per week</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(profile.active_generated_plan.levels[0].workouts).map(([day, workout]: [string, any]) => (
                  <span key={day} className="px-3 py-1 bg-theme-black-lighter rounded-2x-nested-container text-sm text-theme-gold-dark">
                    {day}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  onClick={() => {
                    console.log('Selecting generated plan');
                    onSelectPlan('generated');
                  }}
                  ariaLabel={hasActivePlan ? "Continue Your Plan" : "Start Your Plan"}
                >
                  <Play size={16} className="mr-1" />
                  {hasActivePlan ? "Continue Plan" : "Start Your Plan"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pre-Made Plans / Other Plans Section */}
      <Card className="bg-theme-black-light border border-theme-gold/20">
        <button 
          onClick={() => setShowPreMadePlans(!showPreMadePlans)}
          className="w-full flex justify-between items-center text-left text-xl font-semibold text-theme-gold hover:text-theme-gold-light transition-colors py-2"
        >
          {preMadePlansTitle}
          {showPreMadePlans ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
        
        {showPreMadePlans && (
          <div className="mt-6 space-y-6">
            {/* Create Your Own Plan Card - Show inside expansion when user has active plan */}
            {hasActivePlan && (
              <Card className="bg-gradient-to-br from-theme-gold/20 to-theme-gold/5 border-theme-gold/40 hover:border-theme-gold/60 transition-all duration-300">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3 flex flex-col items-center justify-center bg-theme-gold/20 rounded-nested-container p-4">
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      <Sparkles className="w-8 h-8 text-theme-gold" />
                    </div>
                    <div className="bg-theme-gold text-theme-black px-2 py-1 rounded-2x-nested-container text-xs font-bold mb-2">
                      NEW
                    </div>
                    <div className="text-center">
                      <div className="text-theme-gold font-semibold text-sm">
                        Custom Plan
                      </div>
                    </div>
                  </div>
                  <div className="md:w-2/3 space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-theme-gold">
                        Create Your Own Plan
                      </h3>
                      <p className="text-theme-gold-dark">
                        Generate a personalized workout plan based on your goals and available equipment. 
                        Perfect for creating a program that fits your unique situation.
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-theme-gold-dark">
                      <Sparkles className="w-5 h-5" />
                      <span>Personalized • Equipment-based • Goal-focused</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 pt-2">
                      <PrimaryButton
                        onClick={onCreatePlan}
                        ariaLabel="Create Your Own Plan"
                      >
                        <Sparkles size={16} className="mr-1" />
                        Create Your Own Plan
                      </PrimaryButton>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            
            {/* Pre-Made Plans Grid */}
            <div className="grid grid-cols-1 gap-6">
            {Object.values(WORKOUT_PLANS).map((plan) => {
              const isActivePlan = profile?.current_plan_id === plan.id && !hasGeneratedPlan;
              
              // Skip displaying active plan here since it's shown above
              if (isActivePlan) return null;
              
              return (
                <Card 
                  key={plan.id}
                  className="bg-theme-black-lighter border transition-all duration-300 hover:scale-[1.02] border-theme-gold/20 hover:border-theme-gold/40"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/3 flex flex-col items-center justify-center bg-theme-black rounded-nested-container p-4">
                      <div className="w-16 h-16 flex items-center justify-center mb-2">
                        <Dumbbell className="w-8 h-8 text-theme-gold" />
                      </div>
                      <div className="text-center">
                        <div className="text-theme-gold font-semibold text-sm">
                          Pre-Made Plan
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-2xl font-bold text-theme-gold">
                          {plan.name}
                        </h3>
                      </div>
                      
                      <p className="text-theme-gold-dark">{plan.description}</p>
                      
                      <div className="flex items-center gap-2 text-theme-gold-dark">
                        <Calendar className="w-5 h-5" />
                        <span>{Object.keys(plan.levels[0].workouts).length} workouts per week</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(plan.levels[0].workouts).map(([day, workout]) => (
                          <span key={day} className="px-3 py-1 bg-theme-black rounded-2x-nested-container text-sm text-theme-gold-dark">
                            {day}
                          </span>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <PrimaryButton
                          onClick={() => handleStartPlan(plan.id)}
                          ariaLabel={hasActivePlan ? "Switch to This Plan" : "Start This Plan"}
                        >
                          <Play size={16} className="mr-1" />
                          {hasActivePlan ? "Switch to This Plan" : "Start This Plan"}
                        </PrimaryButton>
                        <IconButton
                          onClick={() => handleTryPlan(plan.id)}
                          ariaLabel="Try Plan"
                          className="text-theme-gold-dark hover:text-theme-gold"
                        >
                          <Eye size={16} className="mr-1" />
                          Try Plan
                        </IconButton>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
            </div>
          </div>
        )}
      </Card>

      {/* Current Active Pre-Made Plan - Display above Other Plans */}
      {hasActivePlan && !hasGeneratedPlan && (
        <Card className="bg-gradient-to-br from-theme-gold/10 to-theme-gold/5 border-theme-gold/40 hover:border-theme-gold/60 transition-all duration-300 hover:scale-[1.02]">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/3 flex flex-col items-center justify-center bg-theme-black-lighter rounded-nested-container relative p-4">
              <div className="w-16 h-16 flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-theme-gold" />
              </div>
              <div className="bg-theme-gold text-theme-black px-2 py-1 rounded-2x-nested-container text-xs font-bold mb-2">
                ACTIVE
              </div>
              <div className="text-center">
                <div className="text-theme-gold font-semibold text-sm">
                  Level {(profile?.current_level_index || 0) + 1}
                </div>
              </div>
            </div>
            <div className="md:w-2/3 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-theme-gold">
                  {WORKOUT_PLANS[profile?.current_plan_id || '']?.name}
                </h3>
                {workoutsRemaining !== null && (
                  <div className="flex items-center gap-2 text-theme-gold-light">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {workoutsRemaining > 0 ? `${workoutsRemaining} workouts left` : 'Block Complete!'}
                    </span>
                  </div>
                )}
              </div>
              
              <p className="text-theme-gold-dark">{WORKOUT_PLANS[profile?.current_plan_id || '']?.description}</p>
              
              <div className="flex items-center gap-2 text-theme-gold-dark">
                <Calendar className="w-5 h-5" />
                <span>{Object.keys(WORKOUT_PLANS[profile?.current_plan_id || '']?.levels[0].workouts || {}).length} workouts per week</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {Object.entries(WORKOUT_PLANS[profile?.current_plan_id || '']?.levels[0].workouts || {}).map(([day, workout]) => (
                  <span key={day} className="px-3 py-1 bg-theme-black-lighter rounded-2x-nested-container text-sm text-theme-gold-dark">
                    {day}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <PrimaryButton
                  onClick={() => onSelectPlan(profile?.current_plan_id || '')}
                  ariaLabel="Continue Plan"
                >
                  <Play size={16} className="mr-1" />
                  Continue Plan
                </PrimaryButton>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Workout History Section */}
      <Card className="bg-theme-black-light border border-theme-gold/20">
        <button 
          onClick={() => setShowHistory(!showHistory)}
          className="w-full flex justify-between items-center text-left text-xl font-semibold text-theme-gold hover:text-theme-gold-light transition-colors py-2"
        >
          Workout History
          {showHistory ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
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
            This will end your current training block on <strong className="text-theme-gold">"{activePlanName}"</strong> and start a new training block with <strong className="text-theme-gold">"{pendingPlanId ? WORKOUT_PLANS[pendingPlanId]?.name : ''}"</strong>.
          </p>
          <p className="text-theme-gold-dark text-sm">
            Your workout history will be preserved, but your current progress will be reset.
          </p>
          <div className="flex gap-3 pt-4">
            <PrimaryButton
              onClick={handleConfirmSwitch}
              ariaLabel="Confirm Switch"
              className="flex-1"
            >
              <CheckCircle size={16} className="mr-1" />
              Yes, Switch Plans
            </PrimaryButton>
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