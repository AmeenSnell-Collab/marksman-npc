-- ============================================================
-- Marksman NPC: Schema V3 — Payment Flow & Audit Logs
-- ============================================================
-- Note: 'ALTER TYPE' cannot be executed in a transaction block, 
-- but when running this directly in the Supabase SQL editor it will work fine.

-- ────────────────────────────────────────────────────────────
-- 1. ADD 'AWAITING_PAYMENT' TO APPLICATION STATUS ENUM
-- ────────────────────────────────────────────────────────────
ALTER TYPE application_status ADD VALUE IF NOT EXISTS 'AWAITING_PAYMENT' AFTER 'PENDING';

-- ────────────────────────────────────────────────────────────
-- 2. CREATE AUDIT LOGS TABLE
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action_type VARCHAR(100) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for Audit Logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can view audit logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );

-- Admins can insert audit logs
CREATE POLICY "Admins can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'ADMIN'
    )
  );
