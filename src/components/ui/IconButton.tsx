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
    className={`inline-flex items-center justify-center gap-2 p-3 bg-theme-black hover:bg-theme-black-lighter text-theme-gold rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 border border-theme-gold/30 ${className}`}
  >
    {children}
  </button>
);