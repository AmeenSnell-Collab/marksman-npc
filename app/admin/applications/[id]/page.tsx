import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AdminActions from './AdminActions';

export default async function AdminApplicationDetail({ params }: { params: { id: string } }) {
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
        <Link href="/admin/applications" className="btn">Back to Applications</Link>
      </div>
    );
  }

  // Fetch Uploaded Documents
  const { data: documents } = await supabase
    .from('documents')
    .select('*')
    .eq('application_id', application.id);

  // Helper to generate public URLs for documents
  const getDocumentUrl = (path: string) => {
    return supabase.storage.from('marksman-uploads').getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/applications" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
            ← Back to All Applications
          </Link>
          <h2>Review Application: {application.first_name} {application.last_name}</h2>
        </div>
        <span className={`status-badge status-${application.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {application.status.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        {/* Left Col - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Applicant Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>First Name</strong> {application.first_name}</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Last Name</strong> {application.last_name}</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID Number</strong> {application.id_number}</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</strong> {application.phone}</div>
            </div>
          </div>

          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Association Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Primary Association</strong> {application.association_name}</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Member Number</strong> {application.association_number || 'N/A'}</div>
            </div>
          </div>

          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Uploaded Documents</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {documents && documents.length > 0 ? (
                documents.map(doc => (
                  <div key={doc.id} style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: 'var(--primary)' }}>📄</span>
                      <strong>{doc.file_name}</strong>
                    </div>
                    <a 
                      href={getDocumentUrl(doc.file_path)} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn" 
                      style={{ border: '1px solid var(--border)', fontSize: '0.875rem', textDecoration: 'none' }}
                    >
                      View Document
                    </a>
                  </div>
                ))
              ) : (
                <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No documents uploaded for this application.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Col - Admin Actions */}
        <AdminActions 
          applicationId={application.id} 
          initialStatus={application.status} 
          initialNotes={application.admin_notes || ''} 
        />
      </div>
    </div>
  );
}
