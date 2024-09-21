import { supabase } from '@/utils/supabase/supabase.ts';
import { getUserId } from '@/utils/user-id.ts';
import { formatISO } from 'date-fns';

export async function getRating10(pageSlug: string) {
  const userId = await getUserId() ?? '';

  return Promise.resolve(supabase
    .from('feel-good')
    .select('rating10')
    .eq('user_id', userId)
    .eq('page_slug', pageSlug)
    .maybeSingle());
}

export async function setRating10(pageSlug: string, rating: number) {
  const userId = await getUserId() ?? '';

  return Promise.resolve(supabase
    .from('feel-good')
    .upsert({
      rating10: rating,
      time: formatISO(new Date()),
      user_id: userId,
      page_slug: pageSlug,
    }, { onConflict: 'user_id,page_slug' })
    .select()
    .single());
}
