-- Create an Admin User manually (Bypasses email validation and rate limits)
-- Password will be: Admin@12345
DO $$
DECLARE
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- 1. Insert into Supabase Auth table
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token)
  VALUES (
    new_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@marksman-npc.co.za',
    crypt('Admin@12345', gen_salt('bf')),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"role":"ADMIN"}',
    now(),
    now(),
    ''
  );

  -- 2. Create the identity for the user (required for login to work)
  INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
  VALUES (
    new_user_id,
    new_user_id,
    format('{"sub":"%s","email":"admin@marksman-npc.co.za"}', new_user_id)::jsonb,
    'email',
    now(),
    now(),
    now()
  );

  -- 3. Update public.users role to ADMIN
  -- Note: The trigger 'on_auth_user_created' handles the insertion into public.users.
  -- We just need to ensure the role is set correctly.
  UPDATE public.users SET role = 'ADMIN' WHERE id = new_user_id;

END $$;
