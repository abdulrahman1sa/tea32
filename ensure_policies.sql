-- Ensure users can delete their own posts
create policy "Users can delete own posts" on posts
  for delete using (auth.uid() = user_id);

-- Ensure users can insert posts (if not already set)
create policy "Users can insert own posts" on posts
  for insert with check (auth.uid() = user_id);

-- Ensure users can update their own posts (likes mainly, but rights to update own post is good)
create policy "Users can update own posts" on posts
  for update using (auth.uid() = user_id);
