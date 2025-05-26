/*
  # Initial schema setup for NannyConnect

  1. New Tables
    - profiles
      - id (uuid, references auth.users)
      - role (text) - 'parent' or 'nanny'
      - full_name (text)
      - phone (text)
      - avatar_url (text)
      - created_at (timestamp)
      
    - nanny_profiles
      - id (uuid, references profiles)
      - bio (text)
      - experience_years (int)
      - hourly_rate (numeric)
      - availability (text[])
      - specialties (text[])
      - background_check (boolean)
      - verified (boolean)
      
    - bookings
      - id (uuid)
      - parent_id (uuid, references profiles)
      - nanny_id (uuid, references nanny_profiles)
      - status (text)
      - start_date (date)
      - end_date (date)
      - created_at (timestamp)
      
    - reviews
      - id (uuid)
      - booking_id (uuid, references bookings)
      - parent_id (uuid, references profiles)
      - nanny_id (uuid, references nanny_profiles)
      - rating (int)
      - comment (text)
      - created_at (timestamp)
      
    - messages
      - id (uuid)
      - sender_id (uuid, references profiles)
      - receiver_id (uuid, references profiles)
      - content (text)
      - read (boolean)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid REFERENCES auth.users PRIMARY KEY,
  role text NOT NULL CHECK (role IN ('parent', 'nanny')),
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create nanny_profiles table
CREATE TABLE nanny_profiles (
  id uuid REFERENCES profiles PRIMARY KEY,
  bio text,
  experience_years integer,
  hourly_rate numeric,
  availability text[],
  specialties text[],
  background_check boolean DEFAULT false,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE nanny_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view nanny profiles"
  ON nanny_profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Nannies can update their own profile"
  ON nanny_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create bookings table
CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES profiles NOT NULL,
  nanny_id uuid REFERENCES nanny_profiles NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = parent_id OR 
    auth.uid() = nanny_id
  );

CREATE POLICY "Parents can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = parent_id AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'parent'
    )
  );

-- Create reviews table
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings NOT NULL,
  parent_id uuid REFERENCES profiles NOT NULL,
  nanny_id uuid REFERENCES nanny_profiles NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id, parent_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Parents can create reviews for completed bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = parent_id AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id 
      AND parent_id = auth.uid()
      AND status = 'completed'
    )
  );

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES profiles NOT NULL,
  receiver_id uuid REFERENCES profiles NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR 
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);