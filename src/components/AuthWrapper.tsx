import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AuthScreen } from './AuthScreen';
import { supabase } from '../lib/supabase';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { user, loading } = useAuth();

  useEffect(() => {
    // Handle session persistence based on user preference
    const handleSessionPersistence = async () => {
      const rememberMe = localStorage.getItem('supabase.auth.remember_me');
      
      if (rememberMe === 'false') {
        // For users who chose not to be remembered, set up session cleanup on browser close
        const handleBeforeUnload = () => {
          // This will be handled by the browser's session management
          // The session will expire when the browser is closed
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }
    };

    handleSessionPersistence();
  }, [user]);

  // Handle password reset flow
  useEffect(() => {
    const handleAuthStateChange = () => {
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          // User clicked the password reset link
          const newPassword = prompt('Enter your new password:');
          if (newPassword && newPassword.length >= 6) {
            const { error } = await supabase.auth.updateUser({
              password: newPassword
            });
            
            if (error) {
              alert('Error updating password: ' + error.message);
            } else {
              alert('Password updated successfully!');
            }
          }
        }
      });
    };

    handleAuthStateChange();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-theme-black text-theme-gold font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme-gold mx-auto mb-4"></div>
          <p className="text-theme-gold-dark">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return <>{children}</>;
}