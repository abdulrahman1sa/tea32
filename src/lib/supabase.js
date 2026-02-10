import { createClient } from '@supabase/supabase-js'

// Hardcoded fallback for production (Netlify) to prevent white screen
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://qirdhgzmbkyxnscbhofz.supabase.co"
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_qC4rI5S3Vh2nM3qUnxvavg_bfwTPC-n"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase Config: Using default fallback keys.");
}
