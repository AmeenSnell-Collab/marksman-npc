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

  const { data: dbUser } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (dbUser?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch all applications
  const { data: applications, error } = await supabase
    .from('applications')
    .select('id, first_name, last_name, association_name, status, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="container animate-fade-in" style={{ padding: '3rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Application Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Review pending memberships and manage statuses.
          </p>
        </div>
      </div>

      <div className="card shadow-sm" style={{ padding: 0, overflow: 'hidden' }}>
        {error ? (
          <div style={{ padding: '2rem', color: 'var(--error)' }}>
            Error loading applications: {error.message}
          </div>
        ) : !applications || applications.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No applications found in the system.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--background)' }}>
              <tr>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Applicant Name</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Association</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {new Date(app.created_at).toLocaleDateString('en-ZA')}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>
                    {app.first_name} {app.last_name}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.association_name}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`status-badge status-${app.status.toLowerCase().replace('_', '-')}`}>
                      {app.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Link href={`/admin/applications/${app.id}`} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem', border: '1px solid var(--border)' }}>
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
