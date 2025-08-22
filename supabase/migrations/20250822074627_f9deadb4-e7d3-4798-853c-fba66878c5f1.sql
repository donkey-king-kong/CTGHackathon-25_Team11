-- Create donations table for tracking donation payments
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT NOT NULL,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'hkd',
  stripe_session_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending', -- pending, completed, failed
  lives_impacted INTEGER DEFAULT 0,
  region_id UUID,
  donor_id TEXT,
  message TEXT, -- Optional donor message
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create policies for donations
CREATE POLICY "donations_select_all" ON public.donations
  FOR SELECT USING (true);

CREATE POLICY "donations_insert_all" ON public.donations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "donations_update_admin" ON public.donations
  FOR UPDATE USING (auth.uid() IS NOT NULL);

-- Create function to calculate lives impacted based on amount and currency
CREATE OR REPLACE FUNCTION calculate_lives_impacted(amount_cents INTEGER, currency_code TEXT)
RETURNS INTEGER AS $$
BEGIN
  CASE 
    WHEN currency_code = 'hkd' THEN
      -- $250 HKD provides a "Reading Starter Kit" for one child
      RETURN FLOOR(amount_cents / 25000); -- 25000 cents = $250 HKD
    WHEN currency_code = 'sgd' THEN
      -- $50 SGD provides essential school supplies and English storybook for one child
      RETURN FLOOR(amount_cents / 5000); -- 5000 cents = $50 SGD
    ELSE
      -- Default to HKD calculation
      RETURN FLOOR(amount_cents / 25000);
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically calculate lives impacted
CREATE OR REPLACE FUNCTION update_lives_impacted()
RETURNS TRIGGER AS $$
BEGIN
  NEW.lives_impacted = calculate_lives_impacted(NEW.amount, NEW.currency);
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER donations_update_lives_impacted
  BEFORE INSERT OR UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION update_lives_impacted();