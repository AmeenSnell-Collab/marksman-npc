import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import MasterListActions from './MasterListActions';

export default async function MasterListDetail({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Authenticate and verify role
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: dbUser } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (dbUser?.role !== 'ADMIN') redirect('/dashboard');

  // Fetch Application Data
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('*')
    .eq('id', params.id)
    .single();

  if (appError || !application) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <h2>Application Not Found</h2>
        <Link href="/admin/master-list" className="btn">Back to Master List</Link>
      </div>
    );
  }

  // Fetch Member record if it exists
  const { data: memberRecord } = await supabase
    .from('members')
    .select('member_number, status')
    .eq('application_id', application.id)
    .single();

  // Fetch Audit Logs
  const { data: auditLogs } = await supabase
    .from('audit_logs')
    .select('*, admin:admin_id(email)')
    .eq('application_id', application.id)
    .order('created_at', { ascending: false });

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/master-list" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'inline-block', fontWeight: 500 }}>
            ← Back to Master List
          </Link>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', margin: 0 }}>Inspect: {application.first_name} {application.last_name}</h2>
          {memberRecord && (
            <span style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.5rem', display: 'block' }}>
              Member No: {memberRecord.member_number} ({memberRecord.status})
            </span>
          )}
        </div>
        <span className={`status-badge status-${application.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {application.status.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
             <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Applicant Identity</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Full Legal Name</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{application.first_name} {application.last_name}</div>
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>National ID Number</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)', fontFamily: 'monospace' }}>{application.id_number}</div>
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Phone Contact</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{application.phone}</div>
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Association</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{application.association_name}</div>
               </div>
             </div>
          </div>
          
          <MasterListActions application={application} userId={user.id} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
             <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Audit Trail</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {!auditLogs || auditLogs.length === 0 ? (
                 <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>No audit logs recorded yet.</div>
               ) : (
                 auditLogs.map((log: any) => (
                   <div key={log.id} style={{ borderLeft: '3px solid var(--border)', paddingLeft: '1rem' }}>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                       {new Date(log.created_at).toLocaleString()} by {log.admin?.email || 'Unknown'}
                     </div>
                     <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{log.action_type.replace('_', ' ')}</div>
                     <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>" {log.reason} "</div>
                   </div>
                 ))
               )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
