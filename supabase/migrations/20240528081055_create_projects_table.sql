/**
* projects
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table projects (
  id uuid default uuid_generate_v4() primary key,
  -- UUID from auth.users
  user_id uuid default uuid_generate_v4(),
  name text,
  description text,
  created_at timestamptz default now()
);
alter table projects enable row level security;
create policy "Allow public read-only access." on projects for select using (true);