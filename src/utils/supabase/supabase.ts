import type { Database } from './database.types.ts';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xwkxfckigjymfihkdxht.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3a3hmY2tpZ2p5bWZpaGtkeGh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjY4ODg3NTksImV4cCI6MjA0MjQ2NDc1OX0.LfBvPliCte5zCJHToW5wODRd79YsAkFXqM4LFxC8qFA';

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
