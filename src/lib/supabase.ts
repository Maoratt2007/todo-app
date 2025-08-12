import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    //import the url and the anon key from the .env file
  import.meta.env.VITE_SUPABASE_URL!, 
  import.meta.env.VITE_SUPABASE_ANON_KEY!    
);
