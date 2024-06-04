alter table reddit_submissions add column created_at timestamptz default now();
alter table notifications add column created_at timestamptz default now();
alter table projects_subreddits add column created_at timestamptz default now();