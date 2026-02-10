-- Add user_id to posts table to enable ownership actions (delete)
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Add user_id to comments table
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Update RLS to allow users to delete their own posts
CREATE POLICY "Users can delete own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- Create a notifications view or just query comments for now is fine
