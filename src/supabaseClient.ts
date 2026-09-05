import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nvkmzywyladeikhxcvos.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im52a216eXd5bGFkZWlraHhjdm9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg1NDA2MTQsImV4cCI6MjEwNDExNjYxNH0.X3bkZy7nuz7TIsTeJio1E7r42nxPb5OoONnwTIYzjPs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
