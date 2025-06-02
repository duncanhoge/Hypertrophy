import React from 'react';
import { XCircle } from 'lucide-react';
import { Card } from './Card';
import { IconButton } from './IconButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-theme-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-theme-black-light border border-theme-gold/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-theme-gold">{title}</h2>
          <IconButton onClick={onClose} ariaLabel="Close modal" className="bg-theme-black-lighter hover:bg-red-900/50 p-2">
            <XCircle size={20} />
          </IconButton>
        </div>
        {children}
      </Card>
    </div>
  );
};