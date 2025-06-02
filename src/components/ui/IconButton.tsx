import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className = '', ariaLabel }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className={`p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
  >
    {children}
  </button>
);