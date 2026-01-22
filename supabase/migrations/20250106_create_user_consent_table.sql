-- Create user_consent table for GDPR compliance
CREATE TABLE IF NOT EXISTS public.user_consent (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE, -- Clerk user ID
    preferences JSONB NOT NULL DEFAULT '{
        "essential": true,
        "functional": false,
        "analytics": false,
        "personalization": false
    }'::jsonb,
    version VARCHAR(10) NOT NULL DEFAULT '1.0.0',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_consent_user_id ON public.user_consent(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consent_updated_at ON public.user_consent(updated_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_consent ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only read/write their own consent records
CREATE POLICY "Users can view own consent" ON public.user_consent
    FOR SELECT USING (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can insert own consent" ON public.user_consent
    FOR INSERT WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can update own consent" ON public.user_consent
    FOR UPDATE USING (user_id = auth.jwt() ->> 'sub')
    WITH CHECK (user_id = auth.jwt() ->> 'sub');

CREATE POLICY "Users can delete own consent" ON public.user_consent
    FOR DELETE USING (user_id = auth.jwt() ->> 'sub');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_consent_updated_at
    BEFORE UPDATE ON public.user_consent
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_consent TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated; 