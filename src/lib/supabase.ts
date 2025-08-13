//createClient is a function that allows us use the functions of supabase in our code 
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  //import the url and the anon key from the .env file
  //vite scan all the env variables and make them available to the code he switches from import.meta.env to environment variables
  import.meta.env.VITE_SUPABASE_URL!, //! says that the url is not null
  import.meta.env.VITE_SUPABASE_ANON_KEY! //! says that the anon key is not null
);
