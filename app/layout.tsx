import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marksman NPC | Members Portal',
  description: 'Manage your Marksman NPC membership application, status, and documents securely.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar glass">
          <div style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em' }}>
            <a href="/" style={{ color: 'var(--text-main)', textDecoration: 'none' }}>Marksman <span style={{ color: 'var(--primary)' }}>NPC</span></a>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/login" className="btn" style={{ color: 'var(--text-main)' }}>Login</a>
            <a href="/register" className="btn btn-primary">Join Now</a>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
