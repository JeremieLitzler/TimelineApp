import { supabase } from '@/lib/supabaseClient'

export const readKeepAliveQuery = async () =>
  await supabase.from('keep_alive').select('is_set').limit(1)
