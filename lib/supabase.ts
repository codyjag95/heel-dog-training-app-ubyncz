/**
 * Supabase client — single connection point between HEEL and the cloud.
 *
 * The anon key is safe to ship in the app bundle: Row Level Security on the
 * server decides what each logged-in user can actually see. The service_role
 * key must NEVER appear in this codebase.
 */
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://idbkhuzfcglndfyjhryw.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYmtodXpmY2dsbmRmeWpocnl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMxMzM4NzksImV4cCI6MjA5ODcwOTg3OX0.ZOQ-WT9zVnmchULxhnqs0lBfJ3iItT8kpLGrc-73BeA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,        // session survives app restarts
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,    // no browser redirects in native apps
  },
});
