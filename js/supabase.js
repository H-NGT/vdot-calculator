import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabaseInstance

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please check your .env file.')
    // Dummy client to prevent crash and allow UI logic to handle missing config
    supabaseInstance = {
        auth: {
            getSession: async () => ({ data: { session: null } }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signUp: async () => ({ error: { message: 'Supabase not configured' } }),
            signInWithPassword: async () => ({ error: { message: 'Supabase not configured' } }),
            signOut: async () => ({ error: { message: 'Supabase not configured' } }),
            getUser: async () => ({ data: { user: null } }),
        },
        supabaseUrl: null,
        supabaseKey: null
    }
} else {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = supabaseInstance
