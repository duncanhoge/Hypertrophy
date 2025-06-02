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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800 border border-slate-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-100">{title}</h2>
          <IconButton onClick={onClose} ariaLabel="Close modal" className="bg-red-500 hover:bg-red-600 p-2">
            <XCircle size={20} />
          </IconButton>
        </div>
        {children}
      </Card>
    </div>
  );
};