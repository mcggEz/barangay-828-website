-- Created: 2025
-- Description: Creates the default admin user for initial login

INSERT INTO public.admins (username, password_hash, email, full_name, is_active)
VALUES (
  'skadmin',
  '$2b$10$IJCf2KY9L1EwCrLjLhpyK..lVxnuk.kXyKhsGAvyr3SFcE1V8HvnK', -- bcrypt hash of your chosen password
  'admin@barangay828.com',
  'Administrator',
  true
)
ON CONFLICT (username) DO NOTHING;

-- Note: Store the actual password securely and share it only with authorized admins.
