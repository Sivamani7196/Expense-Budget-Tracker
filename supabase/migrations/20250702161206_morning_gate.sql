/*
  # Fix Users Table RLS Policies - Final Fix

  1. Security Updates
    - Drop all existing policies on users table
    - Create proper policies that work with Supabase Auth
    - Allow public access for user creation during signup
    - Ensure authenticated users can read/update their own data

  2. Changes Made
    - Use proper auth.uid() function
    - Add INSERT policy for signup process
    - Fix policy conditions for better compatibility
*/

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;

-- Create new policies with proper auth handling
CREATE POLICY "Enable read access for users based on user_id"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only"
  ON users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id"
  ON users
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Ensure RLS is enabled
ALTER TABLE users ENABLE ROW LEVEL SECURITY;