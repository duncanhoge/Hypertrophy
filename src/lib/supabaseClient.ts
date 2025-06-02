import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/supabase';

// These values are automatically provided when you link your Supabase project
// Get your own at supabase.com/dashboard
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Please connect to Supabase using the "Connect to Supabase" button.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);