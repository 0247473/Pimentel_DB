/**
 * Supabase client initialization.
 * Purpose: Single instance of the Supabase client used by all hooks.
 * Modify: Add auth listeners or custom config if needed.
 *
 * Environment variables (.env.local):
 * - VITE_SUPABASE_URL: Get from Supabase Dashboard > Project Settings > API > Project URL
 * - VITE_SUPABASE_KEY: Get from Supabase Dashboard > Project Settings > API > anon public
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)
