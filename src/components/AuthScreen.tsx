import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { Card } from './ui/Card';

function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      setMessage({
        type: 'success',
        text: 'Check your email for the magic link!',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to send magic link. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-theme-black-light border border-theme-gold/20">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-theme-gold mb-2">Welcome</h1>
          <p className="text-theme-gold-dark">Sign in to track your workouts</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-theme-gold mb-2">
              Email address
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 bg-theme-black-lighter border border-theme-gold/30 rounded-lg focus:ring-2 focus:ring-theme-gold focus:border-theme-gold outline-none text-theme-gold placeholder-theme-gold-dark/50"
              />
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-gold-dark" size={20} />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-900/20 text-green-400' : 'bg-red-900/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-theme-gold hover:bg-theme-gold-light text-theme-black font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Mail size={20} />
                <span>Send Magic Link</span>
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  );
}

export default AuthScreen;