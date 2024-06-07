import { DataTable } from '@/components/ui/(overview)/data-table';
import { columns } from '@/components/ui/(overview)/submission-columns';
import {
  fetchSubreddits,
  fetchUserSubmissionScore,
} from '@/utils/supabase/server-query';
import { User } from '@supabase/supabase-js';

export default async function SubmissionTable({ user }: { user: User }) {
  // const submissions = await fetchUserSubmissionScore('', user.id);
  const submissions = [
    {
      subreddit: "r/subreddit1",
      title: "Component analytics and insights for React",
      posted_at: "2022-01-01T00:00:00Z",
      text: "Text 1",
      url: "https://www.reddit.com/r/subreddit1",
      permalink: "https://www.reddit.com/r/subreddit1/comments/1",
      content_type: "Message",
      score: 1
    },
    {
      subreddit: "r/subreddit2",
      title: "What was your first PM salary and which year was it?",
      posted_at: "2022-01-02T00:00:00Z",
      text: "Text 2",
      url: "https://www.reddit.com/r/subreddit2",
      permalink: "https://www.reddit.com/r/subreddit2/comments/2",
      content_type: "Message",
      score: 2
    },
    {
      subreddit: "r/subreddit3",
      title: "Why do some believe UBI will be introduced , given that 650K homeless in USA not been solved ?",
      posted_at: "2022-01-03T00:00:00Z",
      text: "Text 3",
      url: "https://www.reddit.com/r/subreddit3",
      permalink: "https://www.reddit.com/r/subreddit3/comments/3",
      content_type: "Message",
      score: 3
    }
  ]
  const subreddits = await fetchSubreddits(user.id);
  
  return (
    <DataTable
      columns={columns}
      data={submissions}
      subreddits={subreddits.map((x) => x.name ?? '')}
    />
  );
}
