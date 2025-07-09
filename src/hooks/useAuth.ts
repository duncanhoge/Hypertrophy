import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, rememberMe: boolean = true) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Set session persistence based on rememberMe
        data: {
          remember_me: rememberMe
        }
      }
    });

    // Configure session persistence after signup
    if (!error && rememberMe) {
      await supabase.auth.updateUser({
        data: { remember_me: true }
      });
    }

    return { data, error };
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    // Configure session persistence before sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Set session persistence based on rememberMe preference
    if (!error && data.session) {
      // Store the remember me preference in localStorage for session management
      if (rememberMe) {
        localStorage.setItem('supabase.auth.remember_me', 'true');
        // Set session to persist (default behavior)
        await supabase.auth.updateUser({
          data: { remember_me: true }
        });
      } else {
        localStorage.setItem('supabase.auth.remember_me', 'false');
        // For non-persistent sessions, we'll rely on the browser session
        await supabase.auth.updateUser({
          data: { remember_me: false }
        });
      }
    }

    return { data, error };
  };

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    return { data, error };
  };

  const signOut = async () => {
    // Clear remember me preference
    localStorage.removeItem('supabase.auth.remember_me');
    
    // Clear any other app-specific data
    localStorage.removeItem('workoutHistory');
    
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { data, error };
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
  };
}