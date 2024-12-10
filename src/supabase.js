// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pltoqaezbjavrukiayvx.supabase.co'; // Your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsdG9xYWV6YmphdnJ1a2lheXZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyOTk4MDUsImV4cCI6MjA0ODg3NTgwNX0.4frVsZr4iR9pyJYYB1KE4kS_Zw8sMSKe4JqchB4rd2I'; // Your public anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;

