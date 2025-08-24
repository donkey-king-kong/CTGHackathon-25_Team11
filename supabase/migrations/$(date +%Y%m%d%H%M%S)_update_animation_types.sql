-- Update animation_type constraint to be more flexible
ALTER TABLE public.messages 
DROP CONSTRAINT IF EXISTS messages_animation_type_check;

ALTER TABLE public.messages 
ADD CONSTRAINT messages_animation_type_check 
CHECK (animation_type IN ('plane', 'candy', 'heart', 'balloon', 'letterbox', 'magic', 'rainbow', 'star'));
