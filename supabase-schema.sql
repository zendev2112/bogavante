-- Bogavante Content Management System
-- Database Schema for Supabase

-- Create tables for different content types
-- All tables share the same structure

-- 1. RECETAS (Recipes)
CREATE TABLE IF NOT EXISTS recetas (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    resumen TEXT,
    quality_score INTEGER DEFAULT 0,
    image_url TEXT,
    featured_species JSONB DEFAULT '[]'::jsonb,
    source_book TEXT,
    source_authors TEXT[],
    source_publisher TEXT,
    source_year TEXT,
    source_page INTEGER,
    language TEXT DEFAULT 'es',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SALUD (Health & Nutrition)
CREATE TABLE IF NOT EXISTS salud (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    resumen TEXT,
    quality_score INTEGER DEFAULT 0,
    image_url TEXT,
    featured_species JSONB DEFAULT '[]'::jsonb,
    source_book TEXT,
    source_authors TEXT[],
    source_publisher TEXT,
    source_year TEXT,
    source_page INTEGER,
    language TEXT DEFAULT 'es',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. NOTAS_DE_MAR (Sea Notes / Marine Culture)
CREATE TABLE IF NOT EXISTS notas_de_mar (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    resumen TEXT,
    quality_score INTEGER DEFAULT 0,
    image_url TEXT,
    featured_species JSONB DEFAULT '[]'::jsonb,
    source_book TEXT,
    source_authors TEXT[],
    source_publisher TEXT,
    source_year TEXT,
    source_page INTEGER,
    language TEXT DEFAULT 'es',
    published BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_recetas_slug ON recetas(slug);
CREATE INDEX IF NOT EXISTS idx_recetas_quality ON recetas(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_recetas_created ON recetas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recetas_published ON recetas(published);

CREATE INDEX IF NOT EXISTS idx_salud_slug ON salud(slug);
CREATE INDEX IF NOT EXISTS idx_salud_quality ON salud(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_salud_created ON salud(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_salud_published ON salud(published);

CREATE INDEX IF NOT EXISTS idx_notas_slug ON notas_de_mar(slug);
CREATE INDEX IF NOT EXISTS idx_notas_quality ON notas_de_mar(quality_score DESC);
CREATE INDEX IF NOT EXISTS idx_notas_created ON notas_de_mar(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notas_published ON notas_de_mar(published);

-- Create full-text search indexes
CREATE INDEX IF NOT EXISTS idx_recetas_title_search ON recetas USING GIN (to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_recetas_content_search ON recetas USING GIN (to_tsvector('spanish', content));

CREATE INDEX IF NOT EXISTS idx_salud_title_search ON salud USING GIN (to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_salud_content_search ON salud USING GIN (to_tsvector('spanish', content));

CREATE INDEX IF NOT EXISTS idx_notas_title_search ON notas_de_mar USING GIN (to_tsvector('spanish', title));
CREATE INDEX IF NOT EXISTS idx_notas_content_search ON notas_de_mar USING GIN (to_tsvector('spanish', content));

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update timestamps
CREATE TRIGGER update_recetas_updated_at
    BEFORE UPDATE ON recetas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_salud_updated_at
    BEFORE UPDATE ON salud
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notas_updated_at
    BEFORE UPDATE ON notas_de_mar
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE recetas ENABLE ROW LEVEL SECURITY;
ALTER TABLE salud ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_de_mar ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public read access for recetas"
    ON recetas FOR SELECT
    USING (published = true);

CREATE POLICY "Public read access for salud"
    ON salud FOR SELECT
    USING (published = true);

CREATE POLICY "Public read access for notas_de_mar"
    ON notas_de_mar FOR SELECT
    USING (published = true);

-- Create policies for admin access (requires service role key)
-- These will be used by the CMS admin interface
CREATE POLICY "Service role full access to recetas"
    ON recetas FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to salud"
    ON salud FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access to notas_de_mar"
    ON notas_de_mar FOR ALL
    USING (auth.role() = 'service_role');
