/*
  # Add insert policy for profiles table
  
  1. Changes
    - Add policy to allow authenticated users to insert their own profile
  
  2. Security
    - Only allows users to insert a profile with their own auth.uid()
    - Maintains existing RLS policies
*/

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);