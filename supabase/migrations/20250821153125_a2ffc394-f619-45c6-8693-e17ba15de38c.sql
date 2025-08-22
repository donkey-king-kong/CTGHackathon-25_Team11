-- Create donors table
CREATE TABLE public.donors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  total_donated DECIMAL(10,2) DEFAULT 0,
  lives_impacted INTEGER DEFAULT 0,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  donation_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  region TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create impact_notes table
CREATE TABLE public.impact_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  donor_id UUID REFERENCES public.donors(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  author_name TEXT NOT NULL,
  region TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.impact_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (donors can see impact)
CREATE POLICY "Public can view donors" ON public.donors FOR SELECT USING (true);
CREATE POLICY "Public can view donations" ON public.donations FOR SELECT USING (true);
CREATE POLICY "Public can view impact notes" ON public.impact_notes FOR SELECT USING (true);

-- Admin policies for authenticated users (REACH staff)
CREATE POLICY "Authenticated users can insert donors" ON public.donors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update donors" ON public.donors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can insert donations" ON public.donations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can insert impact notes" ON public.impact_notes FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update impact notes" ON public.impact_notes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete impact notes" ON public.impact_notes FOR DELETE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_donors_updated_at
  BEFORE UPDATE ON public.donors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to calculate lives impacted (1 life per $100 donated)
CREATE OR REPLACE FUNCTION public.calculate_lives_impacted()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.donors 
  SET 
    total_donated = (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.donations 
      WHERE donor_id = NEW.donor_id
    ),
    lives_impacted = (
      SELECT FLOOR(COALESCE(SUM(amount), 0) / 100) 
      FROM public.donations 
      WHERE donor_id = NEW.donor_id
    )
  WHERE id = NEW.donor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update donor stats when donations are added
CREATE TRIGGER update_donor_stats_on_donation
  AFTER INSERT ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_lives_impacted();