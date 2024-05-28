/**
* job_schedules
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table job_schedules (
  id uuid default uuid_generate_v4() primary key,
  name text,
  start_time timestamptz default now(),
  created_at timestamptz default now()
);
alter table job_schedules enable row level security;
create policy "Allow public read-only access." on job_schedules for select using (true);