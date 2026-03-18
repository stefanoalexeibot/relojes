import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qtypcfjevvxxabzecado.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_9Se4ph4ijTRWJnx964y_nw_0iYTy7wu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
