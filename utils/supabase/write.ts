'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { Database } from 'types_db';
import { fetchCurrentUser } from '@/utils/supabase/query';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

export async function addSubreddit(subreddits: string[]) {
  const user = await fetchCurrentUser();
  if (!user) {
    return;
  }

  const { data: project, error: getProjectIdError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (getProjectIdError) {
    console.log(
      'Database Error: Failed to fetch project id while adding subreddits.',
      getProjectIdError,
    );
    return;
  }

  const { data: existed, error: getExistedError } = await supabaseAdmin
    .from('subreddits')
    .select('name')
    .in('name', subreddits);
  if (getExistedError) {
    console.log(
      'Database Error: Failed to fetch new subreddits.',
      getExistedError,
    );
    return;
  }

  const newSubreddits = subreddits.filter(
    (subreddit) => !existed.some((x) => x.name === subreddit),
  );
  if (newSubreddits.length === 0) {
    return;
  }

  const { data: inserted, error: writeError } = await supabaseAdmin
    .from('subreddits')
    .insert(newSubreddits.map((name) => ({ name })))
    .select();
  if (writeError) {
    console.log(
      `Database Error: Failed to insert new subreddits: ${newSubreddits.join(',')}`,
      writeError,
    );
    return;
  }

  const redditIds = inserted?.map((x) => x.id);
  await supabaseAdmin.from('projects_subreddits').insert(
    redditIds.map((id) => ({
      project_id: project.id,
      subreddit_id: id,
    })),
  );

  console.log(
    'Successfully added new subreddits:',
    inserted?.map((x) => x.name),
  );

  revalidatePath('/settings');
}
