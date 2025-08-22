-- Create enum for user roles if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('donor', 'recipient', 'organisation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update profiles table to include role and additional fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'donor',
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS organization_name text,
ADD COLUMN IF NOT EXISTS region text;

-- Create function to check user roles (simplified)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id
      AND role::text = _role
  );
END;
$$;

-- Create trigger to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'donor'::app_role)
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

  RETURN new;
END;
$$;

-- Create trigger for new users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();