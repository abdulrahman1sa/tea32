-- 1. Create Follows Table
create table if not exists follows (
  follower_id uuid references auth.users not null,
  following_id uuid references auth.users not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (follower_id, following_id)
);

-- 2. Add extra fields to profiles if they don't exist
alter table profiles add column if not exists bio text;
alter table profiles add column if not exists cover_url text;

-- 3. RLS Policies for Follows
alter table follows enable row level security;

create policy "Anyone can read follows" on follows
  for select using (true);

create policy "Users can follow others" on follows
  for insert with check (auth.uid() = follower_id);

create policy "Users can unfollow" on follows
  for delete using (auth.uid() = follower_id);

-- 4. Helper View for counts (Optional but useful)
create or replace view profile_stats as
select 
  p.id,
  (select count(*) from follows where following_id = p.id) as followers_count,
  (select count(*) from follows where follower_id = p.id) as following_count,
  (select count(*) from posts where user_id = p.id) as posts_count
from profiles p;
