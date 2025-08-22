-- Update some existing messages to include child drawings
UPDATE messages 
SET media_urls = '["message-images/child-drawing-1.jpg"]',
    media_types = '["image"]'
WHERE child_alias = 'Little Emma' 
AND created_at = (SELECT MAX(created_at) FROM messages WHERE child_alias = 'Little Emma');

UPDATE messages 
SET media_urls = '["message-images/child-drawing-2.jpg"]',
    media_types = '["image"]'
WHERE child_alias = 'Sunshine Boy' 
AND created_at = (SELECT MAX(created_at) FROM messages WHERE child_alias = 'Sunshine Boy');

UPDATE messages 
SET media_urls = '["message-images/child-drawing-3.jpg"]',
    media_types = '["image"]'
WHERE child_alias = 'Cookie Monster' 
AND created_at = (SELECT MAX(created_at) FROM messages WHERE child_alias = 'Cookie Monster');