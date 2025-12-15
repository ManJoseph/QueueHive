-- Step 1: Add created_at column as nullable
ALTER TABLE app_user ADD COLUMN IF NOT EXISTS created_at TIMESTAMP(6);

-- Step 2: Set default value for existing rows
UPDATE app_user SET created_at = CURRENT_TIMESTAMP WHERE created_at IS NULL;

-- Step 3: Make the column NOT NULL
ALTER TABLE app_user ALTER COLUMN created_at SET NOT NULL;

-- Verify the changes
SELECT id, email, full_name, created_at FROM app_user;
