-- Migration: Add user profile fields
-- Add new columns to profiles table

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(15),
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS course VARCHAR(100),
ADD COLUMN IF NOT EXISTS class_name VARCHAR(100);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON profiles(phone);
CREATE INDEX IF NOT EXISTS idx_profiles_course ON profiles(course);
CREATE INDEX IF NOT EXISTS idx_profiles_class ON profiles(class_name);

-- Add comments for documentation
COMMENT ON COLUMN profiles.phone IS 'User phone number';
COMMENT ON COLUMN profiles.avatar_url IS 'User avatar image URL';
COMMENT ON COLUMN profiles.birth_date IS 'User date of birth';
COMMENT ON COLUMN profiles.course IS 'User course/program';
COMMENT ON COLUMN profiles.class_name IS 'User class name';