-- Fix the trigger function to handle all new columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, phone, organization_name, region)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'full_name', new.email),
    COALESCE((new.raw_user_meta_data ->> 'role')::app_role, 'donor'::app_role),
    new.raw_user_meta_data ->> 'phone',
    new.raw_user_meta_data ->> 'organization_name',
    new.raw_user_meta_data ->> 'region'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    phone = EXCLUDED.phone,
    organization_name = EXCLUDED.organization_name,
    region = EXCLUDED.region;

  RETURN new;
END;
$$;