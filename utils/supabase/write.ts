'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import type { Database, Tables } from 'types_db';
import { fetchCurrentUser } from '@/utils/supabase/query';

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
);

type Subreddit = Tables<'subreddits'>;

export async function updateUserSubreddits(deletes: string[], adds: string[]) {
  const user = await fetchCurrentUser();
  if (!user) {
    return;
  }

  const { data: project, error: getProjectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (getProjectError) {
    console.log(
      'Database Error: Failed to fetch project id while update subreddits.',
      getProjectError,
    );
    return;
  }

  if (deletes.length > 0) {
    await deleteUserSubreddits(project!.id, deletes);
  }

  if (adds.length > 0) {
    await addUserSubreddits(project!.id, adds);
  }

  revalidatePath('/settings');
}

async function addUserSubreddits(projectId: string, adds: string[]) {
  let allSubreddits: Subreddit[] = [];

  const { data: existed, error: getExistedError } = await supabaseAdmin
    .from('subreddits')
    .select('*')
    .in('name', adds);
  if (getExistedError) {
    console.log(
      'Database Error: Failed to fetch new subreddits.',
      getExistedError,
    );
    return;
  }

  allSubreddits.push(...existed);

  const newSubreddits = adds.filter(
    (add) => !existed.some((x) => x.name === add),
  );
  if (newSubreddits.length > 0) {
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

    allSubreddits.push(...inserted!);

    console.log(
      'Successfully added new subreddits:',
      inserted?.map((x) => x.name),
    );
  }

  // get subreddit ids to insert into projects_subreddits
  const redditIds = allSubreddits
    .filter((x) => adds.includes(x.name!))
    .map((x) => x.id);

  await supabaseAdmin.from('projects_subreddits').insert(
    redditIds.map((id) => ({
      project_id: projectId,
      subreddit_id: id,
    })),
  );

  console.log('Successfully added new subreddits for user:', redditIds);
}

async function deleteUserSubreddits(projectId: string, deletes: string[]) {
  // get subreddit ids to delete from projects_subreddits
  const { data: subreddits, error: getSubredditError } = await supabaseAdmin
    .from('subreddits')
    .select('id')
    .in('name', deletes);
  if (getSubredditError) {
    console.log(
      `Database Error: Failed to fetch subreddits: ${deletes.join(',')}`,
      getSubredditError,
    );
    return;
  }

  const redditIds = subreddits?.map((x) => x.id);
  await supabaseAdmin
    .from('projects_subreddits')
    .delete()
    .eq('project_id', projectId)
    .in('subreddit_id', redditIds);

  console.log('Successfully deleted subreddits for user:', redditIds);
}
