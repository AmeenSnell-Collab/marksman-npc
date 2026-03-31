import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LogoutButton from './LogoutButton';

export default async function MemberDashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Get authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch the user's applications from the database
  const { data: applications } = await supabase
    .from('applications')
    .select('id, first_name, last_name, status, association_name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Fetch membership info
  const { data: membership } = await supabase
    .from('members')
    .select('member_number, join_date, status')
    .eq('user_id', user.id)
    .single();

  const hasApplication = applications && applications.length > 0;
  const latestApp = hasApplication ? applications[0] : null;

  const statusConfig: Record<string, { bg: string; text: string; border: string; label: string }> = {
    PENDING: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d', label: 'Pending Review' },
    APPROVED: { bg: '#d1fae5', text: '#047857', border: '#6ee7b7', label: 'Approved' },
    REJECTED: { bg: '#fee2e2', text: '#b91c1c', border: '#fca5a5', label: 'Rejected' },
    INFO_REQUESTED: { bg: '#e0f2fe', text: '#0369a1', border: '#7dd3fc', label: 'Info Requested' },
  };

  const currentStatus = latestApp ? statusConfig[latestApp.status] || statusConfig.PENDING : null;

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Member Portal</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Welcome back, {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Application Status Widget */}
        <div className="card border-primary">
          <h3 style={{ marginBottom: '1rem' }}>Application Status</h3>
          
          {latestApp && currentStatus ? (
            <div style={{ 
              padding: '1.5rem', 
              background: currentStatus.bg, 
              borderRadius: 'var(--radius-md)', 
              border: `1px solid ${currentStatus.border}` 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ color: currentStatus.text, fontSize: '1.1rem' }}>
                  {currentStatus.label.toUpperCase()}
                </strong>
                <span className={`status-badge status-${latestApp.status.toLowerCase().replace('_', '-')}`}>
                  {currentStatus.label}
                </span>
              </div>
              <p style={{ marginTop: '0.75rem', color: currentStatus.text, fontSize: '0.9rem' }}>
                Application for <strong>{latestApp.first_name} {latestApp.last_name}</strong> — {latestApp.association_name}
              </p>
              <p style={{ marginTop: '0.25rem', color: currentStatus.text, fontSize: '0.8rem', opacity: 0.7 }}>
                Submitted: {new Date(latestApp.created_at).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>

              {latestApp.status === 'APPROVED' && !membership && (
                <div style={{ 
                  marginTop: '1.5rem', 
                  background: '#ffffff', 
                  padding: '1.5rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>💳</span>
                    <h4 style={{ margin: 0, color: 'var(--text)' }}>Action Required: Complete Registration</h4>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Congratulations! Your application has been approved by our administrators. 
                    To instantly activate your membership and receive your official Member Number, please proceed to the secure payment portal.
                  </p>
                  <a 
                    href={`/payment?appId=${latestApp.id}`} 
                    className="btn btn-primary" 
                    style={{ display: 'inline-block', textDecoration: 'none', background: '#0f172a', fontWeight: 600 }}
                  >
                    Proceed to Payment Center →
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              padding: '2rem', 
              background: 'var(--background)', 
              borderRadius: 'var(--radius-md)', 
              border: '2px dashed var(--border)', 
              textAlign: 'center' 
            }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                You haven&apos;t submitted an application yet.
              </p>
              <a href="/apply" className="btn btn-primary">Start Application</a>
            </div>
          )}
        </div>

        {/* Membership Info Widget */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Membership Info</h3>
          {membership ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Member #</span>
                <strong>{membership.member_number}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Joined</span>
                <strong>{new Date(membership.join_date).toLocaleDateString('en-ZA')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--background)', borderRadius: 'var(--radius-sm)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Status</span>
                <span className="status-badge status-approved">{membership.status}</span>
              </div>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Membership details will appear here once your application is approved.
            </p>
          )}
        </div>

        {/* Quick Links Widget */}
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Account Actions</h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {!hasApplication && (
              <li>
                <a href="/apply" style={{ display: 'block', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
                  <strong style={{ display: 'block' }}>Submit Application</strong>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Apply for membership at Marksman NPC</span>
                </a>
              </li>
            )}
            <li>
              <a href="/apply" style={{ display: 'block', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', transition: 'border-color 0.2s' }}>
                <strong style={{ display: 'block' }}>Manage Documents</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Upload required proofs or ID</span>
              </a>
            </li>
          </ul>
        </div>
        
      </div>
    </div>
  );
}
