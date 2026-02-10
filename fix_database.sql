-- 1. Ensure 'posts' table has 'user_id' and 'likes_count'
alter table posts add column if not exists user_id uuid references auth.users;
alter table posts add column if not exists likes_count int default 0;

-- 2. Create the 'increment_likes' function for the Heart button
create or replace function increment_likes(p_id uuid)
returns void as $$
begin
  update posts
  set likes_count = likes_count + 1
  where id = p_id;
end;
$$ language plpgsql security definer;

-- 3. Create the 'profiles' table if you haven't yet
create table if not exists profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  updated_at timestamp with time zone
);

-- 4. Enable RLS and Policies
alter table posts enable row level security;
alter table comments enable row level security;
alter table profiles enable row level security;

-- Policies for Profiles
create policy "Anyone can view profiles" on profiles for select using (true);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Policies for Posts
create policy "Anyone can view posts" on posts for select using (true);
create policy "Users can insert own posts" on posts for insert with check (auth.uid() = user_id);
create policy "Users can delete own posts" on posts for delete using (auth.uid() = user_id);

-- Policies for Comments
create policy "Anyone can view comments" on comments for select using (true);
create policy "Users can insert comments" on comments for insert with check (true);
