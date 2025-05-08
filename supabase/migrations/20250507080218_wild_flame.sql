/*
  # Initial Schema Setup

  1. New Tables
    - users (managed by Supabase Auth)
    - categories
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - color (text)
      - created_at (timestamp)
    - tasks
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - category_id (uuid, foreign key)
      - title (text)
      - description (text)
      - priority (text)
      - completed (boolean)
      - notes (text)
      - created_at (timestamp)
      - updated_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for user-based access
*/

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text DEFAULT '',
  priority text NOT NULL,
  completed boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can CRUD their own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can CRUD their own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);