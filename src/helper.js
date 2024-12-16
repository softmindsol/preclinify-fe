// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Your Supabase URL
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Your public anon key

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase environment variables are missing!');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

