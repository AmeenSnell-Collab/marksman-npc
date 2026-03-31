-- ============================================================
-- Marksman NPC: Schema V2 — Supabase Auth Integration & RLS
-- ============================================================
-- Run this AFTER schema.sql in Supabase SQL Editor.
-- This script bridges your public tables with Supabase's
-- managed auth.users table and enables Row Level Security.
-- ============================================================

-- ────────────────────────────────────────────────────────────
-- 1. CLEAN UP: Remove columns now managed by Supabase Auth
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.users DROP COLUMN IF EXISTS password_hash;
ALTER TABLE public.users DROP COLUMN IF EXISTS email_verified;

-- ────────────────────────────────────────────────────────────
-- 2. FOREIGN KEY: Link public.users.id → auth.users.id
-- ────────────────────────────────────────────────────────────
-- This ensures every row in public.users MUST correspond
-- to a valid Supabase Auth user.
ALTER TABLE public.users
  ADD CONSTRAINT users_id_fk_auth
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- ────────────────────────────────────────────────────────────
-- 3. TRIGGER: Auto-create public.users on signup
-- ────────────────────────────────────────────────────────────
-- When a new user signs up via supabase.auth.signUp(), this
-- trigger automatically inserts a matching row into
-- public.users so your FK relationships just work.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    'USER',
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Drop the trigger if it already exists to make this idempotent
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ────────────────────────────────────────────────────────────
-- 4. ROW LEVEL SECURITY: Enable on all public tables
-- ────────────────────────────────────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────
-- 5. SECURITY POLICIES: Users can only access their own data
-- ────────────────────────────────────────────────────────────

-- === USERS TABLE ===
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- === APPLICATIONS TABLE ===
-- Users can view their own applications
CREATE POLICY "Users can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create new applications
CREATE POLICY "Users can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view ALL applications
CREATE POLICY "Admins can view all applications"
  ON public.applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can update any application (status changes, notes)
CREATE POLICY "Admins can update all applications"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- === DOCUMENTS TABLE ===
-- Users can view documents on their own applications
CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = documents.application_id
        AND applications.user_id = auth.uid()
    )
  );

-- Users can upload documents to their own applications
CREATE POLICY "Users can upload own documents"
  ON public.documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applications
      WHERE applications.id = application_id
        AND applications.user_id = auth.uid()
    )
  );

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- === MEMBERS TABLE ===
-- Users can view their own membership
CREATE POLICY "Users can view own membership"
  ON public.members FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view and manage all memberships
CREATE POLICY "Admins can view all members"
  ON public.members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can insert members"
  ON public.members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- ============================================================
-- DONE! Your database is now fully integrated with Supabase
-- Auth and secured with Row Level Security.
-- ============================================================
