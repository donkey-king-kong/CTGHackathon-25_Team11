-- Create Messages table for children's thank-you notes
CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  child_alias text NOT NULL,
  school text,
  region text,
  language text NOT NULL DEFAULT 'en',
  text text NOT NULL,
  media_urls jsonb DEFAULT '[]'::jsonb,
  media_types jsonb DEFAULT '[]'::jsonb,
  donor_tag text,
  status text CHECK (status IN ('pending','approved','rejected')) DEFAULT 'pending',
  consent jsonb NOT NULL DEFAULT '{"guardian":false,"school":false,"media_release":false}'::jsonb,
  moderation_note text
);

-- Enable RLS on messages table
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for messages
CREATE POLICY "messages_select_approved" 
ON public.messages 
FOR SELECT 
USING (status = 'approved');

CREATE POLICY "messages_insert_all" 
ON public.messages 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "messages_update_admin" 
ON public.messages 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "messages_delete_admin" 
ON public.messages 
FOR DELETE 
USING (auth.uid() IS NOT NULL);

-- Create storage bucket for message media
INSERT INTO storage.buckets (id, name, public) VALUES ('message-media', 'message-media', true);

-- Create storage policies for message media
CREATE POLICY "message_media_select_all" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'message-media');

CREATE POLICY "message_media_insert_all" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'message-media');

CREATE POLICY "message_media_update_admin" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'message-media' AND auth.uid() IS NOT NULL);

CREATE POLICY "message_media_delete_admin" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'message-media' AND auth.uid() IS NOT NULL);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_messages_updated_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();