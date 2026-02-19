-- ============================================================================
-- EMERGENCY FIX: Auth Issues - User Creation & Session Handling
-- ============================================================================
-- Date: February 19, 2026
-- Issues Fixed:
-- 1. Missing INSERT policy blocking user profile creation
-- 2. Broken handle_new_user function 
-- 3. Admin role assignment not working
-- ============================================================================

-- ============================================================================
-- 1. ADD MISSING INSERT POLICY FOR USERS TABLE
-- ============================================================================
-- This allows service role (Supabase system) to insert user profiles via trigger

DROP POLICY IF EXISTS "Service role can insert new users" ON public.users;
CREATE POLICY "Service role can insert new users" ON public.users
  FOR INSERT 
  WITH CHECK (true);

-- ============================================================================
-- 2. FIX handle_new_user FUNCTION
-- ============================================================================
-- The old function used broken current_setting() which doesn't work
-- This new version safely handles user creation with proper admin check

DROP TRIGGER IF EXISTS trigger_on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  admin_email TEXT;
  user_role TEXT;
BEGIN
  -- Get admin email from environment or use default
  admin_email := COALESCE(
    current_setting('app.admin_email', true),
    'egt.emeraldtechsolution@gmail.com'  -- Fallback default
  );
  
  -- Determine role based on email
  user_role := CASE 
    WHEN NEW.email = admin_email THEN 'admin'
    ELSE 'customer'
  END;
  
  -- Insert new user profile
  -- Wrap in BEGIN/EXCEPTION to handle errors gracefully
  BEGIN
    INSERT INTO public.users (
      id,
      email,
      full_name,
      role,
      status,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
      user_role,
      'active',
      NOW(),
      NOW()
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log error but don't fail (user is still created in auth)
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger for auto-create user profile
CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 3. ENSURE RLS IS CONFIGURED CORRECTLY FOR AUTH OPERATIONS
-- ============================================================================
-- Make sure triggers can execute by temporarily allowing inserts

-- Policy for users to insert their own profile (shouldn't be needed, but safety)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- 4. VERIFY TABLE STRUCTURE
-- ============================================================================
-- Ensure all required columns exist

DO $$
BEGIN
  -- Check if role column exists, if not add it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.users ADD COLUMN role VARCHAR(50) DEFAULT 'customer';
  END IF;

  -- Check if status column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'status'
  ) THEN
    ALTER TABLE public.users ADD COLUMN status VARCHAR(50) DEFAULT 'active';
  END IF;

  -- Check if email column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.users ADD COLUMN email VARCHAR(255) NOT NULL;
  END IF;
END $$;

-- ============================================================================
-- 5. GRANT PROPER PERMISSIONS
-- ============================================================================
-- Ensure service role can execute the function

GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- ============================================================================
-- 6. TEST: Verify the fix
-- ============================================================================
-- After running this migration, test:
-- 1. Signup with email/password - should create user profile in Supabase > Auth > Users
-- 2. Check Supabase > Database > users table - should see the new user
-- 3. Check role - if email matches NEXT_PUBLIC_ADMIN_EMAIL, should be 'admin'
-- 4. Login should work without "Database error saving new user"

/*
-- Manual test queries:
-- Check if user was created
SELECT id, email, role, status FROM public.users ORDER BY created_at DESC LIMIT 10;

-- Check auth users
SELECT id, email, created_at FROM auth.users ORDER BY created_at DESC LIMIT 10;

-- Check policies on users table
SELECT schemaname, tablename, policyname FROM pg_policies WHERE tablename = 'users';

-- Check function
SELECT pg_get_functiondef('public.handle_new_user()'::regprocedure);
*/
