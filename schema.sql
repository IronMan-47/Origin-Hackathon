-- ====================================================================
-- WeatherWise Master Supabase SQL Setup Script
-- Run this complete script in your Supabase Dashboard -> SQL Editor
-- ====================================================================

-- 1. Create or Update the public.profiles Table with all columns
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL DEFAULT 'User',
    age INT,
    gender TEXT DEFAULT 'unspecified',
    location_name TEXT DEFAULT 'Raipur, Chhattisgarh',
    latitude DOUBLE PRECISION DEFAULT 21.25,
    longitude DOUBLE PRECISION DEFAULT 81.63,
    medical_conditions TEXT[] DEFAULT '{}',
    occupation TEXT DEFAULT 'indoor_office',
    age_group TEXT DEFAULT 'adult',
    onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist if table was created previously
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS age INT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS location_name TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS medical_conditions TEXT[],
ADD COLUMN IF NOT EXISTS occupation TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Drop existing policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON public.profiles;

-- 4. Create comprehensive RLS Policies for full CRUD access
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT TO authenticated
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE TO authenticated
    USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT TO authenticated
    WITH CHECK (id = auth.uid());

-- 5. Trigger Function for Automatic Profile Row Initialization on Auth Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id, 
        display_name, 
        onboarding_completed
    )
    VALUES (
        NEW.id, 
        COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1), 'User'),
        false
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
