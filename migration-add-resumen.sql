-- Migration to add resumen field to all content tables
-- Run this in your Supabase SQL Editor

-- Add resumen column to recetas
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS resumen TEXT;

-- Add resumen column to salud
ALTER TABLE salud ADD COLUMN IF NOT EXISTS resumen TEXT;

-- Add resumen column to notas_de_mar
ALTER TABLE notas_de_mar ADD COLUMN IF NOT EXISTS resumen TEXT;

-- Add published column if it doesn't exist (for backward compatibility)
ALTER TABLE recetas ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE salud ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
ALTER TABLE notas_de_mar ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;
