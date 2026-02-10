-- Function to increment likes safely
create or replace function increment_likes(p_id uuid)
returns void as $$
begin
  update posts
  set likes_count = likes_count + 1
  where id = p_id;
end;
$$ language plpgsql security definer;
