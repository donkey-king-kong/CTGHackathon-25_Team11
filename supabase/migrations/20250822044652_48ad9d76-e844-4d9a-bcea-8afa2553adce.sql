-- Add animation_type field to messages table
ALTER TABLE public.messages 
ADD COLUMN animation_type text CHECK (animation_type IN ('plane', 'candy', 'heart', 'balloon', 'letterbox')) DEFAULT 'letterbox';