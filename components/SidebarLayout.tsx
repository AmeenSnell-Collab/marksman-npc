import Link from 'next/link';
import LogoutNavButton from './LogoutNavButton';

interface SidebarLayoutProps {
  children: React.ReactNode;
  userEmail: string;
  memberNumber?: string;
  isAdmin?: boolean;
}

export default function SidebarLayout({ children, userEmail, memberNumber, isAdmin }: SidebarLayoutProps) {
  return (
    <div className="saas-layout">
      {/* Sidebar */}
      <aside className="saas-sidebar">
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{ fontSize: '1.25rem', color: 'var(--text-main)', letterSpacing: '-0.025em' }}>
            Marksman <span style={{ color: 'var(--primary)' }}>NPC</span>
          </h1>
        </div>

        {/* Profile Card Mini */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '50%', 
            background: 'linear-gradient(135deg, var(--primary) 0%, #1e1b4b 100%)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            color: 'white', fontWeight: 'bold' 
          }}>
            {userEmail.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {userEmail}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {memberNumber ? `Member: ${memberNumber}` : 'Pending Member'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem', paddingLeft: '0.5rem', fontWeight: 600 }}>
            Main Menu
          </div>
          
          <Link href="/dashboard" className="sidebar-link">
            Dashboard
          </Link>
          
          <Link href="#" className="sidebar-link disabled">
            Calendar <span className="nav-badge">Soon</span>
          </Link>
          
          <Link href="#" className="sidebar-link disabled">
            Attendance History
          </Link>

          <Link href="#" className="sidebar-link disabled">
            FireArm Management
          </Link>

          {isAdmin && (
            <>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginTop: '1.5rem', marginBottom: '0.5rem', paddingLeft: '0.5rem', fontWeight: 600 }}>
                Administration
              </div>
              <Link href="/admin/applications" className="sidebar-link">
                Applications
              </Link>
              <Link href="/admin/master-list" className="sidebar-link">
                Master List (All Users)
              </Link>
            </>
          )}
        </nav>
        
        {/* Bottom logout */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <LogoutNavButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="saas-main">
        <header className="saas-header">
           <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
             Portal Access / Secure Dashboard
           </div>
        </header>
        <div className="saas-content">
          {children}
        </div>
      </main>

      <style data-jsx>{`
        .sidebar-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.6rem 0.75rem;
          color: var(--text-main);
          border-radius: var(--radius-sm);
          font-size: 0.9rem;
          font-weight: 500;
          transition: background 0.2s;
        }
        .sidebar-link:hover {
          background: rgba(0,0,0,0.03);
          color: var(--primary);
        }
        .sidebar-link.disabled {
          color: var(--text-muted);
          opacity: 0.7;
          cursor: not-allowed;
        }
        .sidebar-link.disabled:hover {
          background: transparent;
          color: var(--text-muted);
        }
        .nav-badge {
          background: var(--info-bg);
          color: var(--info);
          font-size: 0.65rem;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
