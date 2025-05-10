import { createClient } from '@supabase/supabase-js';
import type { Database } from '../db/database.types';

// Create a single instance of the Supabase client
export const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_KEY!
);

export default supabase; 