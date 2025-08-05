import React from 'react';
import { Trophy, CheckCircle, Star, ArrowRight, RotateCcw, Clock, Sparkles } from 'lucide-react';
import { Modal } from './ui/Modal';
import { PrimaryButton, SecondaryButton } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { WORKOUT_PLANS } from '../data/workoutData';

interface TrainingBlockCompleteModalProps {
  isOpen: boolean;
  onStartNextLevel: () => void;
  onRestartLevel: () => void;
  onDecideLater: () => void;
 onCreateCustomPlan?: () => void;
  planName: string;
  workoutsCompleted: number;
  currentPlanId: string;
  currentLevelIndex: number;
}

export function TrainingBlockCompleteModal({ 
  isOpen, 
  onStartNextLevel,
  onRestartLevel,
  onDecideLater,
 onCreateCustomPlan,
  planName, 
  workoutsCompleted,
  currentPlanId,
  currentLevelIndex
}: TrainingBlockCompleteModalProps) {
  // Check if next level exists
  const currentPlan = WORKOUT_PLANS[currentPlanId];
  const hasNextLevel = currentPlan && currentPlan.levels[currentLevelIndex + 1];
  const nextLevel = hasNextLevel ? currentPlan.levels[currentLevelIndex + 1] : null;
  const currentLevel = currentPlan ? currentPlan.levels[currentLevelIndex] : null;
 const isGeneratedPlan = currentPlanId && !WORKOUT_PLANS[currentPlanId];

  return (
    <Modal isOpen={isOpen} onClose={onDecideLater} title="">
      <div className="text-center space-y-6 py-4">
        {/* Celebration Graphics */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-theme-gold/20 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-theme-gold" />
          </div>
          <div className="absolute -top-2 -right-2 animate-bounce">
            <Star className="w-6 h-6 text-theme-gold fill-current" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-bounce delay-300">
            <Star className="w-4 h-4 text-theme-gold fill-current" />
          </div>
        </div>

        {/* Main Message */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold text-theme-gold">
            Training Block Complete!
          </h2>
          <p className="text-lg text-theme-gold-light">
            Congratulations! You've completed all <strong>{workoutsCompleted} workouts</strong> of your <strong>{planName}</strong> program.
          </p>
          {currentLevel && (
            <p className="text-theme-gold-dark">
              You've finished <strong>Level {currentLevel.level}: {currentLevel.name}</strong>
            </p>
          )}
          <p className="text-theme-gold-dark">
            Great work staying consistent and pushing through your training block!
          </p>
        </div>

        {/* Achievement Highlights */}
        <div className="bg-theme-black-lighter rounded-nested-container p-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{workoutsCompleted} workouts completed</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Program successfully completed</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Ready for progression</span>
          </div>
        </div>

        {/* Progression Options */}
        <div className="pt-4 space-y-3">
         {/* Next Level Option - Different logic for generated vs pre-made plans */}
         {(isGeneratedPlan || (hasNextLevel && nextLevel)) && (
            <div className="space-y-2">
              <PrimaryButton
                onClick={onStartNextLevel}
               ariaLabel={isGeneratedPlan ? "Generate Next Level" : `Start Level ${nextLevel?.level}`}
                className="w-full text-lg py-4 font-bold"
              >
                <ArrowRight size={20} className="mr-2" />
               {isGeneratedPlan ? "Generate Next Level" : `Start Level ${nextLevel?.level}`}
              </PrimaryButton>
             {!isGeneratedPlan && nextLevel && (
               <p className="text-sm text-theme-gold-dark">
                 <strong>{nextLevel.name}:</strong> {nextLevel.description}
               </p>
             )}
             {isGeneratedPlan && (
               <p className="text-sm text-theme-gold-dark">
                 A new personalized level will be generated with fresh exercises and increased difficulty.
               </p>
             )}
            </div>
          )}
          
         {/* Create Custom Plan Option - Only for pre-made plans */}
         {!isGeneratedPlan && onCreateCustomPlan && (
           <PrimaryButton
             onClick={onCreateCustomPlan}
             ariaLabel="Create a Custom Plan"
             className="w-full text-lg py-4 font-bold"
           >
             <Sparkles size={20} className="mr-2" />
             Create a Custom Plan
           </PrimaryButton>
         )}
         
          {/* Restart Current Level Option */}
          <SecondaryButton
            onClick={onRestartLevel}
            ariaLabel="Restart This Level"
            className="w-full text-lg py-3 font-semibold"
          >
            <RotateCcw size={20} className="mr-2" />
            Restart This Level
          </SecondaryButton>
          
          {/* Decide Later Option */}
          <div className="pt-2">
            <button
              onClick={onDecideLater}
              className="text-theme-gold-dark hover:text-theme-gold transition-colors text-sm underline"
            >
              <Clock size={16} className="inline mr-1" />
              Decide Later
            </button>
          </div>
        </div>

        {/* Motivational Footer */}
        <p className="text-sm text-theme-gold-dark italic">
         {(isGeneratedPlan || hasNextLevel)
            ? "Every level completed is a step closer to your strongest self." 
            : "You've mastered this program - time to take on new challenges!"
          }
        </p>
      </div>
    </Modal>
  );
}