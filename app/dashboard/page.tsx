import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function MemberDashboard() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch applications & membership
  const { data: applications } = await supabase
    .from('applications')
    .select('id, first_name, last_name, status, association_name, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: membership } = await supabase
    .from('members')
    .select('member_number, join_date, status')
    .eq('user_id', user.id)
    .single();

  const hasApplication = applications && applications.length > 0;
  const latestApp = hasApplication ? applications[0] : null;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Welcome Back</h2>
        <p style={{ color: 'var(--text-muted)' }}>Here is an overview of your membership status.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        
        {/* Profile / Membership Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Membership Profile
            </h3>
            {membership ? (
              <span className="status-badge status-approved">ACTIVE</span>
            ) : (
              <span className="status-badge status-pending">PENDING</span>
            )}
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ 
              width: '80px', height: '80px', borderRadius: '24px', 
              background: 'linear-gradient(135deg, var(--background) 0%, var(--border) 100%)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary)' 
            }}>
              👤
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
              {latestApp ? `${latestApp.first_name} ${latestApp.last_name}` : user.email}
            </h2>
            <p style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '1.1rem' }}>
              {membership ? membership.member_number : 'Awaiting Number'}
            </p>
          </div>
          
          {membership && (
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Join Date</span>
              <span style={{ fontWeight: 500 }}>{new Date(membership.join_date).toLocaleDateString('en-ZA')}</span>
            </div>
          )}
        </div>

        {/* Status Indicator Card */}
        <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem' }}>
            Application Status
          </h3>

          {!latestApp ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>No application history found.</p>
              <Link href="/apply" className="btn btn-primary" style={{ width: '100%' }}>
                Start New Application
              </Link>
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '1rem', background: 'var(--background)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Status</span>
                  <span className={`status-badge status-${latestApp.status.toLowerCase().replace('_', '-')}`}>
                    {latestApp.status.replace('_', ' ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Submitted</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{new Date(latestApp.created_at).toLocaleDateString('en-ZA')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Association</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{latestApp.association_name}</span>
                </div>
              </div>

              {latestApp.status === 'APPROVED' && !membership && (
                 <div style={{ marginTop: 'auto', background: 'var(--primary)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', color: 'white' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                     <span style={{ fontSize: '1.25rem' }}>💳</span>
                     <h4 style={{ margin: 0, color: 'white' }}>Final Step: Payment</h4>
                   </div>
                   <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.8)', marginBottom: '1.25rem' }}>
                     Your application is approved. Pay the registration fee to instantly activate your membership.
                   </p>
                   <Link href={`/payment?appId=${latestApp.id}`} className="btn" style={{ width: '100%', background: 'white', color: 'var(--primary)', fontWeight: 600 }}>
                     Proceed to Payment
                   </Link>
                 </div>
              )}
              
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Actions
          </h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          <Link href="/apply" className="btn" style={{ background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)', justifyContent: 'flex-start', padding: '1rem' }}>
             📄 Update Documents
          </Link>
          <button className="btn" style={{ background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)', justifyContent: 'flex-start', padding: '1rem', cursor: 'not-allowed' }}>
             ⚙️ Settings (Soon)
          </button>
        </div>
      </div>

    </div>
  );
}
