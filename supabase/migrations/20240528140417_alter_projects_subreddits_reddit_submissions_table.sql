ALTER TABLE projects_subreddits_reddit_submissions
DROP COLUMN updated_at;

alter table projects_subreddits_reddit_submissions
add column created_at timestamptz default now() not null;

alter table projects_subreddits_reddit_submissions
add column score int;