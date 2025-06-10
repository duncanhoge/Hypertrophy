import React, { useState } from 'react';
import { Dumbbell, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';

export function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        setError(error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-black text-theme-gold font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Dumbbell className="w-12 h-12 text-theme-gold" />
          </div>
          <h1 className="text-3xl font-bold text-theme-gold mb-2">Hypertrophy Hub</h1>
          <p className="text-theme-gold-dark">Track your gains, build your strength</p>
        </div>

        <Card className="bg-theme-black-light border border-theme-gold/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-theme-gold mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-gold-dark" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-theme-black-lighter border border-theme-gold/30 rounded-md focus:ring-2 focus:ring-theme-gold focus:border-theme-gold outline-none text-theme-gold placeholder-theme-gold-dark/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-theme-gold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-theme-gold-dark" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-theme-black-lighter border border-theme-gold/30 rounded-md focus:ring-2 focus:ring-theme-gold focus:border-theme-gold outline-none text-theme-gold placeholder-theme-gold-dark/50"
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <IconButton
              onClick={() => {}}
              ariaLabel={isSignUp ? 'Sign Up' : 'Sign In'}
              className="w-full justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-theme-gold" />
              ) : (
                <>
                  <User size={20} className="mr-2" />
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </>
              )}
            </IconButton>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-theme-gold-dark hover:text-theme-gold transition-colors text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}