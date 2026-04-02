'use client';

import { createClient } from '@/utils/supabase/client';

export default function LogoutNavButton() {
  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <button
      onClick={handleLogout}
      className="btn"
      style={{ 
        width: '100%', 
        justifyContent: 'flex-start', 
        color: 'var(--error)',
        background: 'transparent',
        border: 'none',
        padding: '0.6rem 0.75rem',
        fontSize: '0.9rem',
        fontWeight: 500,
        textAlign: 'left'
      }}
    >
      Log Out
    </button>
  );
}
