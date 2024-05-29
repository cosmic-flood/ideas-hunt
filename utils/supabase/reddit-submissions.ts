import { createClient } from '@/utils/supabase/server';

export type UserSubmissionScore = {
  subreddit: string | null;
  title: string | null;
  posted_at: string | null;
  text: string | null;
  url: string | null;
  permalink: string | null;
  content_type: string | null;
  score: number | null;
};

export async function fetchUserSubmissionScore(
  query: string,
  userId: string,
): Promise<UserSubmissionScore[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc('get_user_submission_score', { p_user_id: userId, query: query })
    .returns<UserSubmissionScore[]>();

  if (error) {
    console.log('Database Error: Failed to fetch user submissions.', error);
    return [];
  }

  return data;
}
