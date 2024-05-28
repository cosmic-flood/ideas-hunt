create table projects_subreddits_reddit_submissions (
  project_id uuid references projects,
  subreddit_id uuid references subreddits,
  reddit_submission_id uuid references reddit_submissions,
  updated_at timestamptz,
  primary key (project_id, subreddit_id, reddit_submission_id)
);
alter table projects_subreddits_reddit_submissions enable row level security;
create policy "Allow public read-only access." on projects_subreddits_reddit_submissions for select using (true);