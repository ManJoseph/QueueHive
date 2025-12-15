-- Fix created_at for admin user
UPDATE app_user 
SET created_at = CURRENT_TIMESTAMP 
WHERE email = 'admin@que.com' AND created_at IS NULL;

-- Verify the fix
SELECT id, email, full_name, created_at 
FROM app_user 
WHERE email = 'admin@que.com';
