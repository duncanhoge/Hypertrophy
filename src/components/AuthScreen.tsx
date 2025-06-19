import React, { useState } from 'react';
import { Dumbbell, Mail, Lock, User, ArrowLeft, KeyRound } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card } from './ui/Card';
import { IconButton } from './ui/IconButton';

type AuthMode = 'signin' | 'signup' | 'reset';

export function AuthScreen() {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      let result;
      
      if (authMode === 'reset') {
        result = await resetPassword(email);
        if (!result.error) {
          setMessage('Password reset email sent! Check your inbox for instructions.');
          setAuthMode('signin');
        }
      } else if (authMode === 'signup') {
        result = await signUp(email, password, rememberMe);
        if (!result.error) {
          setMessage('Account created successfully! You can now sign in.');
          setAuthMode('signin');
        }
      } else {
        result = await signIn(email, password, rememberMe);
      }

      if (result?.error) {
        setError(result.error.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (authMode) {
      case 'signup': return 'Create Account';
      case 'reset': return 'Reset Password';
      default: return 'Welcome Back';
    }
  };

  const getButtonText = () => {
    switch (authMode) {
      case 'signup': return 'Sign Up';
      case 'reset': return 'Send Reset Email';
      default: return 'Sign In';
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
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-theme-gold text-center">{getTitle()}</h2>
            {authMode === 'reset' && (
              <p className="text-sm text-theme-gold-dark text-center mt-2">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            )}
          </div>

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
                  className="w-full pl-10 pr-4 py-3 bg-theme-black-lighter border border-theme-gold/30 rounded-sm focus:ring-2 focus:ring-theme-gold focus:border-theme-gold outline-none text-theme-gold placeholder-theme-gold-dark/50"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {authMode !== 'reset' && (
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
                    className="w-full pl-10 pr-4 py-3 bg-theme-black-lighter border border-theme-gold/30 rounded-sm focus:ring-2 focus:ring-theme-gold focus:border-theme-gold outline-none text-theme-gold placeholder-theme-gold-dark/50"
                    placeholder="Enter your password"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {authMode !== 'reset' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-theme-gold bg-theme-black-lighter border-theme-gold/30 rounded-sm focus:ring-theme-gold focus:ring-2"
                  />
                  <span className="ml-2 text-sm text-theme-gold-dark">Remember me</span>
                </label>
                
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setAuthMode('reset')}
                    className="text-sm text-theme-gold-dark hover:text-theme-gold transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-sm">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {message && (
              <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-sm">
                <p className="text-green-400 text-sm">{message}</p>
              </div>
            )}

            <IconButton
              onClick={() => {}}
              ariaLabel={getButtonText()}
              className="w-full justify-center"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-theme-gold" />
              ) : (
                <>
                  {authMode === 'reset' ? (
                    <KeyRound size={20} className="mr-2" />
                  ) : (
                    <User size={20} className="mr-2" />
                  )}
                  {getButtonText()}
                </>
              )}
            </IconButton>
          </form>

          <div className="mt-6 space-y-3">
            {authMode === 'reset' && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setError(null);
                    setMessage(null);
                  }}
                  className="inline-flex items-center text-theme-gold-dark hover:text-theme-gold transition-colors text-sm"
                >
                  <ArrowLeft size={16} className="mr-1" />
                  Back to sign in
                </button>
              </div>
            )}

            {authMode === 'signin' && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-theme-gold-dark hover:text-theme-gold transition-colors text-sm"
                >
                  Don't have an account? Sign up
                </button>
              </div>
            )}

            {authMode === 'signup' && (
              <div className="text-center">
                <button
                  onClick={() => {
                    setAuthMode('signin');
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-theme-gold-dark hover:text-theme-gold transition-colors text-sm"
                >
                  Already have an account? Sign in
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}