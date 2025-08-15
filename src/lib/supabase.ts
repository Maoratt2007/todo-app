//createClient is a function that allows us use the functions of supabase in our code 
import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  // מכריח שהכותרות יישלחו בכל בקשה (כולל auth)
  global: {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
    },
  },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // כי את/ה עושה exchange ידנית
  },
});