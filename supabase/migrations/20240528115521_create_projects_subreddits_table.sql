create table projects_subreddits (
  project_id uuid references projects,
  subreddit_id uuid references subreddits,
  scanned_at timestamptz,
  primary key (project_id, subreddit_id)
);
alter table projects_subreddits enable row level security;
create policy "Allow public read-only access." on projects_subreddits for select using (true);