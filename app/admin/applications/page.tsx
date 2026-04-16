import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminApplicationsPage() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Authenticate and verify role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  // Fetch only active applications in the pipeline
  const { data: applications, error } = await supabase
    .from('applications')
    .select('id, first_name, last_name, association_name, status, created_at')
    .in('status', ['PENDING', 'AWAITING_PAYMENT', 'INFO_REQUESTED'])
    .order('created_at', { ascending: false });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Application Pipeline</h2>
          <p style={{ color: 'var(--text-muted)' }}>Review and manage active applications requiring attention.</p>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
        {error ? (
          <div style={{ padding: '3rem', color: 'var(--error)', textAlign: 'center' }}>
            Error loading applications: {error.message}
          </div>
        ) : !applications || applications.length === 0 ? (
          <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📥</div>
            No pending applications in the pipeline.
          </div>
        ) : (
          <table className="table-modern">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Association</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      {app.first_name} {app.last_name}
                    </div>
                  </td>
                  <td>{app.association_name}</td>
                  <td>{new Date(app.created_at).toLocaleDateString('en-ZA', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                  <td>
                    <span 
                      className={`status-badge status-${app.status.toLowerCase().replace('_', '-')}`}
                      style={app.status === 'AWAITING_PAYMENT' ? { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' } : {}}
                    >
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link href={`/admin/applications/${app.id}`} className="btn" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: 'var(--background)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)' }}>
                      Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
