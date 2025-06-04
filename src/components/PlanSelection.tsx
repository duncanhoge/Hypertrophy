import React, { useState } from 'react';
import { WORKOUT_PLANS } from '../data/workoutData';
import { Card } from './ui/Card';
import { Dumbbell, Calendar, PlusCircle, MinusCircle } from 'lucide-react';

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  workoutHistory: Record<string, any[]>;
}

function PlanSelection({ onSelectPlan, workoutHistory }: PlanSelectionProps) {
  const [showHistory, setShowHistory] = useState(false);

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
              </div>
            </div>
          </Card>
        ))}
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
                <div key={date} className="p-3 bg-theme-black-lighter rounded-md border border-theme-gold/10">
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
    </div>
  );
}

export default PlanSelection;