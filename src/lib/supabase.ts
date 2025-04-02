
import { createClient } from '@supabase/supabase-js';

// These are public keys - safe to be exposed in client code
const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-public-anon-key';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
