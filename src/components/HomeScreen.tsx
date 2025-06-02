import React, { useState } from 'react';
import { CalendarDays, PlusCircle, MinusCircle } from 'lucide-react';
import { Card } from './ui/Card';
import { WORKOUT_PLAN } from '../data/workoutData';

interface HomeScreenProps {
  onStartWorkout: (day: string) => void;
  workoutHistory: Record<string, any[]>;
}

function HomeScreen({ onStartWorkout, workoutHistory }: HomeScreenProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card className="bg-theme-black-light border border-theme-gold/20">
        <h2 className="text-2xl font-semibold mb-6 text-center text-theme-gold">Choose Your Workout</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.keys(WORKOUT_PLAN).map((day) => (
            <button
              key={day}
              onClick={() => onStartWorkout(day)}
              className="w-full bg-theme-black-lighter hover:bg-theme-gold/20 text-theme-gold font-semibold py-4 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 flex flex-col items-center space-y-2 border border-theme-gold/30"
            >
              <CalendarDays size={28} />
              <span>{day}</span>
              <span className="text-xs text-theme-gold-dark">{WORKOUT_PLAN[day].name.split(' - ')[1]}</span>
            </button>
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
                <div key={date} className="p-3 bg-theme-black-lighter rounded-md border border-theme-gold/10">
                  <h3 className="text-md font-semibold text-theme-gold-light mb-2">{date}</h3>
                  <ul className="space-y-1 text-sm">
                    {logs.map(log => (
                      <li key={log.id} className="text-theme-gold-dark">
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
    </div>
  );
}

export default HomeScreen