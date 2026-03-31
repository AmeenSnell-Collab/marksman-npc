'use client';

import { createClient } from '@/utils/supabase/client';

export default function LogoutButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button
      id="logout-button"
      onClick={handleLogout}
      className="btn"
      style={{ border: '1px solid var(--border)', color: 'var(--text-main)' }}
    >
      Sign Out
    </button>
  );
}
