-- Create profiles table (for user data)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create songs table
CREATE TABLE IF NOT EXISTS songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  album TEXT,
  duration INTEGER, -- in seconds
  preview_url TEXT,
  cover_image_url TEXT,
  mood_tags TEXT[], -- ['calm', 'energetic', 'lifting', 'studious', 'dreamy']
  is_indie_spotlight BOOLEAN DEFAULT FALSE,
  play_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  mood_tag TEXT,
  cover_color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create playlist_songs junction table
CREATE TABLE IF NOT EXISTS playlist_songs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID REFERENCES playlists(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, song_id)
);

-- Create listening_history table
CREATE TABLE IF NOT EXISTS listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  song_id UUID REFERENCES songs(id) ON DELETE CASCADE,
  mood_tag TEXT,
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE listening_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for songs (everyone can read)
CREATE POLICY "Songs are viewable by everyone"
  ON songs FOR SELECT
  USING (true);

-- RLS Policies for playlists
CREATE POLICY "Playlists are viewable by owner"
  ON playlists FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own playlists"
  ON playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own playlists"
  ON playlists FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own playlists"
  ON playlists FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for playlist_songs
CREATE POLICY "Playlist songs are viewable by playlist owner"
  ON playlist_songs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM playlists WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can add songs to own playlists"
  ON playlist_songs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM playlists WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete songs from own playlists"
  ON playlist_songs FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM playlists WHERE playlists.id = playlist_id AND playlists.user_id = auth.uid()
  ));

-- RLS Policies for listening_history
CREATE POLICY "Users can view own listening history"
  ON listening_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own listening history"
  ON listening_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample songs
INSERT INTO songs (title, artist_name, album, duration, mood_tags, is_indie_spotlight, cover_image_url) VALUES
  ('Midnight Dreams', 'Luna Echo', 'Nocturnal', 245, ARRAY['dreamy', 'calm'], true, '/placeholder.svg?height=300&width=300'),
  ('Morning Energy', 'Rise Collective', 'Dawn', 198, ARRAY['energetic', 'lifting'], false, '/placeholder.svg?height=300&width=300'),
  ('Focus Flow', 'Study Vibes', 'Concentration', 312, ARRAY['studious', 'calm'], false, '/placeholder.svg?height=300&width=300'),
  ('Upward Motion', 'Sky Dancers', 'Elevation', 223, ARRAY['lifting', 'energetic'], true, '/placeholder.svg?height=300&width=300'),
  ('Ocean Waves', 'Coastal Dreams', 'Serenity', 276, ARRAY['calm', 'dreamy'], false, '/placeholder.svg?height=300&width=300'),
  ('Beat Drop', 'Pulse Masters', 'Rhythm', 189, ARRAY['energetic'], true, '/placeholder.svg?height=300&width=300'),
  ('Starlight Sonata', 'Nebula Sounds', 'Cosmos', 304, ARRAY['dreamy', 'calm'], true, '/placeholder.svg?height=300&width=300'),
  ('Productivity Peak', 'Focus Force', 'Work Mode', 267, ARRAY['studious'], false, '/placeholder.svg?height=300&width=300'),
  ('Victory March', 'Champion Sound', 'Triumph', 201, ARRAY['lifting', 'energetic'], false, '/placeholder.svg?height=300&width=300'),
  ('Cloud Nine', 'Float Away', 'Weightless', 255, ARRAY['dreamy', 'lifting'], true, '/placeholder.svg?height=300&width=300')
ON CONFLICT DO NOTHING;
