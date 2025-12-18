-- Schema for Ambassadors program
-- Run this in your Supabase SQL editor

-- Create ambassadors table
CREATE TABLE IF NOT EXISTS ambassadors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    city VARCHAR(100) NOT NULL,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    children_ages VARCHAR(255) NOT NULL,
    motivation TEXT NOT NULL,
    social_followers VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    notes TEXT,
    product_sent BOOLEAN DEFAULT FALSE,
    content_received BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ambassadors_status ON ambassadors(status);
CREATE INDEX IF NOT EXISTS idx_ambassadors_email ON ambassadors(email);
CREATE INDEX IF NOT EXISTS idx_ambassadors_created_at ON ambassadors(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;

-- Create policy for service role (full access)
CREATE POLICY "Service role can do everything" ON ambassadors
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create policy for anon to insert (for the form)
CREATE POLICY "Anyone can submit application" ON ambassadors
    FOR INSERT
    WITH CHECK (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ambassadors_updated_at
    BEFORE UPDATE ON ambassadors
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
