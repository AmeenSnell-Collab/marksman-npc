'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function PublicNavbar() {
  const pathname = usePathname();
  
  // Hide this navbar on secure routes that use the SidebarLayout
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/payment')) {
    return null;
  }

  return (
    <nav className="navbar glass">
      <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>
        <Link href="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>
          Marksman <span style={{ color: 'var(--primary)' }}>NPC</span>
        </Link>
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link href="/login" className="btn" style={{ color: 'var(--text-main)' }}>Login</Link>
        <Link href="/register" className="btn btn-primary">Join Now</Link>
      </div>
    </nav>
  );
}
