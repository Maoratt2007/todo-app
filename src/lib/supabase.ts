//createClient is a function that allows us use the functions of supabase in our code 
import { createClient } from '@supabase/supabase-js';

const url  = import.meta.env.VITE_SUPABASE_URL!;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true, //saves the session automaticly in the local storage, the user will be connected with refresh
    autoRefreshToken: true,//refresh token automaticly-we refresh token for security 
    detectSessionInUrl: true, //very important take the accesstoken and all this varibles and create session and saves hom in local storage of the supabase
  },
});
