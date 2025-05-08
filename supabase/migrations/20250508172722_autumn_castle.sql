/*
  # Initial Schema Setup

  1. New Tables
    - `users` table for user profiles
      - `id` (uuid, primary key) - References auth.users
      - `display_name` (text) - User's display name
      - `created_at` (timestamp) - When the user was created
      - `updated_at` (timestamp) - When the user was last updated

    - `categories` table for task categories
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `name` (text) - Category name
      - `color` (text) - Category color
      - `created_at` (timestamp) - When the category was created

    - `tasks` table for user tasks
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References users.id
      - `category_id` (uuid) - References categories.id
      - `title` (text) - Task title
      - `description` (text) - Task description
      - `priority` (text) - Task priority (LOW, MEDIUM, HIGH)
      - `completed` (boolean) - Task completion status
      - `notes` (text) - Additional notes
      - `created_at` (timestamp) - When the task was created
      - `updated_at` (timestamp) - When the task was last updated

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  display_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text DEFAULT '',
  priority text NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
  completed boolean DEFAULT false,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own profile"
  ON users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage their own categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tasks"
  ON tasks
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, display_name)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'displayName', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();