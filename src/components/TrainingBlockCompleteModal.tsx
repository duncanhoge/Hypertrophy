import React from 'react';
import { Trophy, CheckCircle, Star } from 'lucide-react';
import { Modal } from './ui/Modal';
import { IconButton } from './ui/IconButton';

interface TrainingBlockCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  weeksCompleted: number;
}

export function TrainingBlockCompleteModal({ 
  isOpen, 
  onClose, 
  planName, 
  weeksCompleted 
}: TrainingBlockCompleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
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
            Congratulations! You've completed all <strong>{weeksCompleted} weeks</strong> of your <strong>{planName}</strong> program.
          </p>
          <p className="text-theme-gold-dark">
            Great work staying consistent and pushing through your training block!
          </p>
        </div>

        {/* Achievement Highlights */}
        <div className="bg-theme-black-lighter rounded-nested-container p-4 space-y-2">
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">{weeksCompleted} weeks of consistent training</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Program successfully completed</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-theme-gold">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Ready for your next challenge</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <IconButton
            onClick={onClose}
            ariaLabel="Done"
            className="w-full bg-theme-gold text-theme-black hover:bg-theme-gold-light font-bold text-lg py-4"
          >
            <Trophy size={20} className="mr-2" />
            Done
          </IconButton>
        </div>

        {/* Motivational Footer */}
        <p className="text-sm text-theme-gold-dark italic">
          "Success is the sum of small efforts repeated day in and day out."
        </p>
      </div>
    </Modal>
  );
}