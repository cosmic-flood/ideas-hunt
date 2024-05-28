/**
* reddit_submission
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table reddit_submission (
  id uuid default uuid_generate_v4() primary key,
  reddit_id text,
  title text,
  text text,
  url text,
  subreddit text,
  created_at timestamptz default now()
);
alter table users enable row level security;
create policy "Allow public read-only access." on reddit_submission for select using (true);