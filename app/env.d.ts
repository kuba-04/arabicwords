import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './db/database.types.ts';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
    }
  }
}

interface ImportMetaEnv {
  readonly EXPO_PUBLIC_SUPABASE_URL: string;
  readonly EXPO_PUBLIC_SUPABASE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Add a default export to prevent router from treating this as a route
const EnvTypes = {};
export default EnvTypes;