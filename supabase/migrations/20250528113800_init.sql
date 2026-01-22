CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  cover_url VARCHAR(255) NOT NULL,
  short_description VARCHAR(255) NOT NULL,
  description TEXT,
  website_url VARCHAR(255) UNIQUE NOT NULL,
  address VARCHAR(255),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS event_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  name_translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create event table
CREATE TABLE IF NOT EXISTS event (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE RESTRICT,
  category_id UUID REFERENCES event_categories(id) ON DELETE RESTRICT,
  event_type VARCHAR(255) NOT NULL CHECK (event_type IN ('manual', 'webscraped')),
  cover_url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  start_date DATE,
  end_date DATE,
  start_time TIME,
  end_time TIME,
  price_type VARCHAR(255) NOT NULL CHECK (price_type IN ('free', 'paid')),
  price_amount VARCHAR(255),
  details JSONB DEFAULT '{}'::jsonb,
  hash VARCHAR(255),

  views INTEGER NOT NULL DEFAULT 0 CHECK (views >= 0),
  shares INTEGER NOT NULL DEFAULT 0 CHECK (shares >= 0),
  potential_participants INTEGER NOT NULL DEFAULT 0 CHECK (potential_participants >= 0),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(provider_id, hash)
);

-- Create users table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id VARCHAR(255) NOT NULL UNIQUE,
  interest_ids UUID[] DEFAULT ARRAY[]::UUID[] 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
  messages JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE content_hashes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(255) NOT NULL CHECK (source_type IN ('rss', 'api', 'web', 'file')),
  source_identifier VARCHAR(255) NOT NULL,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  icon VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL UNIQUE,
  name_translations JSONB DEFAULT '{}'::jsonb,
  category VARCHAR(255) NOT NULL,
  category_translations JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_source_hash
  ON content_hashes (source_type, source_identifier, content_hash);

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON event_categories
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON event
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON event_metrics
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON interests
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();
