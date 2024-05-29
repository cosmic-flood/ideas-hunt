import { fetchUserSubmissionScore } from '@/utils/supabase/reddit-submissions';
import { DataTable } from '@/components/ui/(overview)/data-table';
import { columns } from '@/components/ui/(overview)/submission-columns';
import { fetchSubreddits } from '@/utils/supabase/query';

export default async function SubmissionTable() {
  const submissions = await fetchUserSubmissionScore(
    '',
    '4a9184bd-357d-42b1-80ab-3d471e54a16c',
  );

  const subreddits = await fetchSubreddits(
    '4a9184bd-357d-42b1-80ab-3d471e54a16c',
  );

  return (
    <DataTable
      columns={columns}
      data={submissions}
      subreddits={subreddits.map((x) => x.name ?? '')}
    />
  );
}
