import React from 'react';
import { WORKOUT_PLANS } from '../data/workoutData';
import { Card } from './ui/Card';
import { Dumbbell, Calendar, ChevronRight } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
}

function PlanSelection({ onSelectPlan }: PlanSelectionProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 gap-6">
        {Object.values(WORKOUT_PLANS).map((plan) => (
          <Card 
            key={plan.id}
            className="bg-theme-black-light border border-theme-gold/20 transform transition-all duration-300 hover:scale-[1.02] hover:border-theme-gold/40 cursor-pointer"
            onClick={() => onSelectPlan(plan.id)}
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/3 flex items-center justify-center bg-theme-black-lighter rounded-lg">
                <div className="w-16 h-16 flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-theme-gold" />
                </div>
              </div>
              <div className="md:w-2/3 space-y-4">
                <h3 className="text-2xl font-bold text-theme-gold">
                  {plan.name}
                </h3>
                <p className="text-theme-gold-dark">{plan.description}</p>
                <div className="flex items-center gap-2 text-theme-gold-dark">
                  <Calendar className="w-5 h-5" />
                  <span>{Object.keys(plan.workouts).length} workouts per week</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(plan.workouts).map(([day, workout]) => (
                    <span key={day} className="px-3 py-1 bg-theme-black-lighter rounded-full text-sm text-theme-gold-dark">
                      {day}
                    </span>
                  ))}
                </div>
                <button className="mt-4 flex items-center gap-2 text-theme-gold hover:text-theme-gold-light transition-colors">
                  Start Plan <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default PlanSelection;