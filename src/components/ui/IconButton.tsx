import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({ 
  onClick, 
  children, 
  className = '', 
  ariaLabel, 
  type = 'button',
  disabled = false 
}) => (
  <button
    type={type}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    className={`inline-flex items-center justify-center gap-2 p-3 bg-theme-black hover:bg-theme-black-lighter text-theme-gold rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 border border-theme-gold/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);