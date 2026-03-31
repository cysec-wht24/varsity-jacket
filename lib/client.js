import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_KEY
);

export async function saveUserData(payload) {
  const { error } = await supabase
    .from('user_data')
    .insert([{ data: payload }]);

  if (error) { console.error('Supabase Insert Error:', error); return false; }
  return true;
}