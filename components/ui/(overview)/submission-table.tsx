import { DataTable } from '@/components/ui/(overview)/data-table';
import { columns } from '@/components/ui/(overview)/submission-columns';
import {
  fetchSubreddits,
  fetchUserSubmissionScore,
} from '@/utils/supabase/server-query';
import { User } from '@supabase/supabase-js';

export default async function SubmissionTable({ user }: { user: User }) {
  console.log(user);
  const submissions = await fetchUserSubmissionScore('', user.id);
  const subreddits = await fetchSubreddits(user.id);
  return (
    <DataTable
      columns={columns}
      data={submissions}
      subreddits={subreddits.map((x) => x.name ?? '')}
    />
  );
}
