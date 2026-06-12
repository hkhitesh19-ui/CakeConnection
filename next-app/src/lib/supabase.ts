import { createClient } from '@supabase/supabase-js';

// These should be set in your .env.local
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
if (!supabaseUrl || (!supabaseUrl.startsWith('http://') && !supabaseUrl.startsWith('https://'))) {
  supabaseUrl = 'https://placeholder.supabase.co';
}

const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


