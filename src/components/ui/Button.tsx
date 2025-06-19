import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({ 
  onClick, 
  children, 
  className = '', 
  ariaLabel, 
  type = 'button',
  disabled = false,
  variant = 'secondary'
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 p-3 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-theme-gold text-theme-black hover:bg-theme-gold-light font-semibold border border-theme-gold",
    secondary: "bg-theme-black hover:bg-theme-black-lighter text-theme-gold border border-theme-gold/30"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Convenience components for specific variants
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

// Tile button that inherits primary styling but uses small border radius
export const TilePrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = ({ 
  onClick, 
  children, 
  className = '', 
  ariaLabel, 
  type = 'button',
  disabled = false
}) => {
  const baseClasses = "inline-flex items-center justify-center gap-2 p-3 rounded-sm transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-theme-gold focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
  const primaryClasses = "bg-theme-gold text-theme-black hover:bg-theme-gold-light font-semibold border border-theme-gold";

  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${baseClasses} ${primaryClasses} ${className}`}
    >
      {children}
    </button>
  );
};