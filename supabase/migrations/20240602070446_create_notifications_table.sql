/**
* notifications
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table notifications (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects,
  email_template text,
  metadata JSONB
);
alter table notifications enable row level security;
create policy "Allow public read-only access." on notifications for select using (true);