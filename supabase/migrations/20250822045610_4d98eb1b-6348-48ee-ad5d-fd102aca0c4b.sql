-- Insert sample messages to demonstrate the donor letterbox experience
INSERT INTO public.messages (child_alias, school, region, language, text, media_urls, media_types, donor_tag, animation_type, status, consent) VALUES
(
  'Little Emma', 
  'Happy Valley Kindergarten', 
  'Wan Chai', 
  'en', 
  'Dear kind donor, thank you so much for helping me learn English! Before your help, I was scared to speak in class. Now I can read my favorite stories and even write letters like this one! My teacher says I am getting so much better. I hope one day I can meet you and say thank you in person. You are like a superhero to me!', 
  '[]'::jsonb, 
  '[]'::jsonb, 
  null, 
  'heart', 
  'approved',
  '{"guardian": true, "school": true, "media_release": true}'::jsonb
),
(
  'Sunshine Boy', 
  'Rainbow Children Center', 
  'Sham Shui Po', 
  'mixed', 
  'Hello! My name is 陽光 and I want to say 多謝! Thank you for the English books and games. I love the storybooks about animals. My favorite is about the little elephant who learns to be brave. Just like me learning English! I draw you a picture but teacher says I can write letter instead. You make my dreams come true!', 
  '[]'::jsonb, 
  '[]'::jsonb, 
  null, 
  'plane', 
  'approved',
  '{"guardian": true, "school": true, "media_release": true}'::jsonb
),
(
  'Cookie Monster', 
  'Bright Stars Nursery', 
  'Central & Western', 
  'en', 
  'Hi there! I am 5 years old and I love cookies AND learning English now! Before I was very shy and would hide when teacher asked questions. But now I raise my hand every day! Yesterday I read a whole book by myself - it was about a cat who bakes cookies! Thank you for believing in me. My mommy says you are an angel!', 
  '[]'::jsonb, 
  '[]'::jsonb, 
  null, 
  'balloon', 
  'approved',
  '{"guardian": true, "school": true, "media_release": true}'::jsonb
);