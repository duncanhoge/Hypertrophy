import React from 'react';
import { Clock, Dumbbell, Repeat, Calendar } from 'lucide-react';
import { Modal } from './ui/Modal';
import { useExerciseHistory } from '../hooks/useExerciseHistory';
import type { ExerciseHistoryEntry } from '../hooks/useExerciseHistory';

interface ExerciseHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  exerciseId: string;
  exerciseName: string;
}

function ExerciseHistoryItem({ entry }: { entry: ExerciseHistoryEntry }) {
  return (
    <div className="p-3 bg-theme-black-lighter rounded-2x-nested-container border border-theme-gold/10">
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-theme-gold-light">
          <Calendar size={14} />
          <span className="text-sm font-medium">{entry.date}</span>
        </div>
        <div className="text-xs text-theme-gold-dark">
          {entry.workout_day} - Set {entry.set_number}
        </div>
      </div>
      
      <div className="flex items-center gap-4 text-sm">
        {entry.weight && (
          <div className="flex items-center gap-1 text-theme-gold">
            <Dumbbell size={14} />
            <span>{entry.weight} lbs</span>
          </div>
        )}
        
        {entry.reps && (
          <div className="flex items-center gap-1 text-theme-gold">
            <Repeat size={14} />
            <span>{entry.reps} reps</span>
          </div>
        )}
        
        {entry.duration_seconds && (
          <div className="flex items-center gap-1 text-theme-gold">
            <Clock size={14} />
            <span>{entry.duration_seconds}s</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ExerciseHistory({ isOpen, onClose, exerciseId, exerciseName }: ExerciseHistoryProps) {
  const { history, loading, error } = useExerciseHistory(exerciseId, exerciseName);

  // Group entries by date for better organization
  const groupedHistory = history.reduce((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, ExerciseHistoryEntry[]>);

  // Get most recent performance for quick reference
  const mostRecentEntry = history.length > 0 ? history[0] : null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${exerciseName} History`}>
      <div className="space-y-4">
        {mostRecentEntry && (
          <div className="p-3 bg-theme-gold/10 rounded-nested-container border border-theme-gold/30">
            <h4 className="text-sm font-semibold text-theme-gold mb-2">Most Recent Performance</h4>
            <div className="flex items-center gap-4 text-sm text-theme-gold">
              <span>{mostRecentEntry.date}</span>
              {mostRecentEntry.weight && (
                <span className="flex items-center gap-1">
                  <Dumbbell size={12} />
                  {mostRecentEntry.weight} lbs
                </span>
              )}
              {mostRecentEntry.reps && (
                <span className="flex items-center gap-1">
                  <Repeat size={12} />
                  {mostRecentEntry.reps} reps
                </span>
              )}
              {mostRecentEntry.duration_seconds && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {mostRecentEntry.duration_seconds}s
                </span>
              )}
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto space-y-3">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-gold mx-auto"></div>
              <p className="text-theme-gold-dark mt-2">Loading history...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400">Error loading history: {error}</p>
            </div>
          )}

          {!loading && !error && history.length === 0 && (
            <div className="text-center py-8">
              <Clock size={48} className="mx-auto text-theme-gold-dark mb-4" />
              <p className="text-theme-gold-dark">No history found for this exercise.</p>
              <p className="text-sm text-theme-gold-dark mt-1">Complete some sets to see your progress!</p>
            </div>
          )}

          {!loading && !error && Object.keys(groupedHistory).length > 0 && (
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-theme-gold-light">All Sessions</h4>
              {Object.entries(groupedHistory).map(([date, entries]) => (
                <div key={date} className="space-y-2">
                  <h5 className="text-xs font-medium text-theme-gold-dark uppercase tracking-wide">
                    {date} ({entries.length} set{entries.length !== 1 ? 's' : ''})
                  </h5>
                  {entries.map((entry) => (
                    <ExerciseHistoryItem key={entry.id} entry={entry} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}