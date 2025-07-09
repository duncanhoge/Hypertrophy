import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { IconButton } from './IconButton';

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
  variant?: 'icon' | 'full';
}

export function LogoutButton({ 
  className = '', 
  showText = false, 
  variant = 'icon' 
}: LogoutButtonProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to sign out? Any unsaved progress will be lost."
    );
    
    if (!confirmed) return;

    setIsLoggingOut(true);
    
    try {
      await signOut();
      // The AuthWrapper will handle the redirect to login screen
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (variant === 'full') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className={`inline-flex items-center justify-center gap-2 p-3 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-lg transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 border border-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        aria-label="Sign Out"
      >
        {isLoggingOut ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400" />
        ) : (
          <LogOut size={20} />
        )}
        {showText && (
          <span className="font-medium">
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </span>
        )}
      </button>
    );
  }

  return (
    <IconButton
      onClick={handleLogout}
      ariaLabel={isLoggingOut ? "Signing Out..." : "Sign Out"}
      className={`text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-500/30 ${className}`}
      disabled={isLoggingOut}
    >
      {isLoggingOut ? (
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-400" />
      ) : (
        <LogOut size={20} />
      )}
    </IconButton>
  );
}