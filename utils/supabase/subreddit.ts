import { createClient } from '@/utils/supabase/server';
import { Tables } from '@/types_db';

const supabase = createClient();

type Subreddit = Tables<'subreddits'>;

export async function fetchSubreddits(userId: string): Promise<Subreddit[]> {
  const { data, error } = await supabase.rpc('get_user_subreddits', {
    p_user_id: userId,
  });

  if (error) {
    console.log('Database Error: Failed to fetch subreddits.', error);
    return [];
  }

  return data;
}
