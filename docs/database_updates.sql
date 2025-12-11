-- QueueHive Manual Database Updates
-- Run these scripts if you are updating an existing database schema.

-- 1. Add 'description' column to 'service_type' table
-- This adds an optional description to each service.
ALTER TABLE service_type ADD COLUMN description VARCHAR(400);

-- 2. Add 'location' and 'category' columns to 'company' table
-- These fields are for storing company location and category.
-- They are added as nullable. You can add a NOT NULL constraint later
-- after populating existing rows.
ALTER TABLE company ADD COLUMN location VARCHAR(255);
ALTER TABLE company ADD COLUMN category VARCHAR(255);


-- 3. Create a SUPER_ADMIN user
-- This user has the highest level of permissions in the system.
--
-- IMPORTANT:
-- Replace 'YOUR_SECURE_HASHED_PASSWORD' with a securely hashed password.
-- Do NOT use a plain-text password here. You can generate a hash
-- using the same password encoder used in the application (e.g., BCrypt).
--
-- Example credentials:
-- Email: superadmin@queuehive.com
-- Password: admin (before hashing)
INSERT INTO app_user (full_name, phone, email, password_hash, role)
VALUES
('Super Admin', '0000000000', 'superadmin@queuehive.com', 'YOUR_SECURE_HASHED_PASSWORD', 'SUPER_ADMIN')
ON CONFLICT (email) DO NOTHING;

-- End of script.
