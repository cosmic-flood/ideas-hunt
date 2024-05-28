/**
* subreddit
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table subreddit (
  id uuid default uuid_generate_v4() primary key,
  name text,
  scanned_at timestamptz,
  created_at timestamptz default now()
);
alter table subreddit enable row level security;
create policy "Allow public read-only access." on subreddit for select using (true);