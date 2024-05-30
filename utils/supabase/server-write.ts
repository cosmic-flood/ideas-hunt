'use server';

import { revalidatePath } from 'next/cache';
import type { Tables } from 'types_db';
import { fetchCurrentUser } from '@/utils/supabase/server-query';
import { SupabaseClient } from '@supabase/supabase-js';
import { createAdminClient } from '@/utils/supabase/admin-client';

type Subreddit = Tables<'subreddits'>;

export async function updateProduct(description: string) {
  const supabaseAdmin = createAdminClient();

  const user = await fetchCurrentUser();
  if (!user) {
    console.warn('Failed to fetch current user in server action.');
    return;
  }

  await supabaseAdmin
    .from('projects')
    .update({ description })
    .eq('user_id', user.id);

  revalidatePath('/settings');
}

export async function updateUserSubreddits(deletes: string[], adds: string[]) {
  const supabaseAdmin = createAdminClient();

  const user = await fetchCurrentUser();
  if (!user) {
    console.warn('Failed to fetch current user in server action.');
    return;
  }

  const { data: project, error: getProjectError } = await supabaseAdmin
    .from('projects')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (getProjectError) {
    console.error(
      'Database Error: Failed to fetch project id while update subreddits.',
      getProjectError,
    );
    return;
  }

  if (deletes.length > 0) {
    await deleteUserSubreddits(supabaseAdmin, project!.id, deletes);
  }

  if (adds.length > 0) {
    await addUserSubreddits(supabaseAdmin, project!.id, adds);
  }

  revalidatePath('/settings');
}

async function addUserSubreddits(
  supabase: SupabaseClient,
  projectId: string,
  adds: string[],
) {
  let allSubreddits: Subreddit[] = [];

  const { data: existed, error: getExistedError } = await supabase
    .from('subreddits')
    .select('*')
    .in('name', adds);
  if (getExistedError) {
    console.error(
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
    const { data: inserted, error: writeError } = await supabase
      .from('subreddits')
      .insert(newSubreddits.map((name) => ({ name })))
      .select();
    if (writeError) {
      console.error(
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

  await supabase.from('projects_subreddits').insert(
    redditIds.map((id) => ({
      project_id: projectId,
      subreddit_id: id,
    })),
  );

  console.log('Successfully added new subreddits for user:', redditIds);
}

async function deleteUserSubreddits(
  supabase: SupabaseClient,
  projectId: string,
  deletes: string[],
) {
  // get subreddit ids to delete from projects_subreddits
  const { data: subreddits, error: getSubredditError } = await supabase
    .from('subreddits')
    .select('id')
    .in('name', deletes);
  if (getSubredditError) {
    console.error(
      `Database Error: Failed to fetch subreddits: ${deletes.join(',')}`,
      getSubredditError,
    );
    return;
  }

  const redditIds = subreddits?.map((x) => x.id);
  await supabase
    .from('projects_subreddits')
    .delete()
    .eq('project_id', projectId)
    .in('subreddit_id', redditIds);

  console.log('Successfully deleted subreddits for user:', redditIds);
}
