-- Migration: Add images column to announcements
-- Created: 2025
-- Description: Allows storing multiple image URLs per announcement

ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS images TEXT[];


