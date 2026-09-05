-- Run this in Supabase SQL Editor to add profile fields & health conditions support

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age INT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS location_name TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS medical_conditions TEXT[];
