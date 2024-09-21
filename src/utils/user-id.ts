import { supabase } from '@/utils/supabase/supabase.ts';
import { memoize } from 'moderndash';

export const getUserId = memoize(async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const { data: { user } } = await supabase.auth.signInAnonymously();
    return user?.id;
  }
  return user.id;
});
