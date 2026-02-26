/*
  # Fix Users Table RLS Policies

  1. Security Updates
    - Drop existing policies that use incorrect `uid()` function
    - Create new policies using correct `auth.uid()` function
    - Add INSERT policy to allow user creation during signup
    - Update SELECT and UPDATE policies with correct syntax

  2. Policy Changes
    - "Users can read own data" - Allow authenticated users to read their own user record
    - "Users can update own data" - Allow authenticated users to update their own user record  
    - "Users can insert own data" - Allow authenticated users to create their own user record during signup
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;

-- Create new policies with correct auth.uid() function
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Add INSERT policy to allow user creation during signup
CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);