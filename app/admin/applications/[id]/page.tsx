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

  const getDocumentUrl = (path: string) => {
    return supabase.storage.from('marksman-uploads').getPublicUrl(path).data.publicUrl;
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1400px' }}>
      
      {/* Header Context */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href="/admin/applications" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'inline-block', fontWeight: 500 }}>
            ← Back to Pipeline
          </Link>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-main)', margin: 0 }}>Review: {application.first_name} {application.last_name}</h2>
        </div>
        <span className={`status-badge status-${application.status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
          {application.status.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Left Col - Applicant Data Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '80px' }}>
          
          <div className="card">
             <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Applicant Identity</h3>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Full Legal Name</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{application.first_name} {application.last_name}</div>
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>National ID Number</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)', fontFamily: 'monospace', fontSize: '0.95rem' }}>{application.id_number}</div>
               </div>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Phone Contact</label>
                 <div style={{ fontWeight: 500, color: 'var(--text-main)' }}>{application.phone}</div>
               </div>
             </div>
          </div>

          <div className="card">
             <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Association Status</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div>
                 <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Primary Club/Association</label>
                 <div style={{ fontWeight: 500, color: 'var(--primary)' }}>{application.association_name}</div>
               </div>
               {application.association_number && (
                 <div>
                   <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Association Member No.</label>
                   <div style={{ fontWeight: 500, color: 'var(--text-main)', fontFamily: 'monospace' }}>{application.association_number}</div>
                 </div>
               )}
             </div>
          </div>

        </div>

        {/* Right Col - Visual Document Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           <h3 style={{ fontSize: '1.1rem', color: 'var(--text-main)', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border)', margin: 0 }}>
             Document Verification
           </h3>

           {documents && documents.length > 0 ? (
             documents.map(doc => {
               const docUrl = getDocumentUrl(doc.file_path);
               const isImage = docUrl.match(/\.(jpeg|jpg|gif|png)$/i) != null;
               
               return (
                 <div key={doc.id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                   <div style={{ background: 'var(--background)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <strong style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <span style={{ color: 'var(--primary)' }}>📄</span> {doc.file_name}
                     </strong>
                     <a href={docUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem', background: 'white', border: '1px solid var(--border)' }}>
                       Open New Tab
                     </a>
                   </div>
                   
                   <div style={{ background: '#e2e8f0', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                     {isImage ? (
                       // eslint-disable-next-line @next/next/no-img-element
                       <img src={docUrl} alt={doc.file_name} style={{ width: '100%', height: 'auto', maxHeight: '800px', objectFit: 'contain' }} />
                     ) : (
                       <iframe 
                         src={`${docUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
                         style={{ width: '100%', height: '800px', border: 'none', background: 'white' }} 
                         title={doc.file_name} 
                       />
                     )}
                   </div>
                 </div>
               );
             })
           ) : (
             <div className="card" style={{ textAlign: 'center', padding: '4rem', background: 'var(--background)' }}>
               <span style={{ fontSize: '3rem', opacity: 0.2 }}>📂</span>
               <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>No supporting documentation uploaded.</p>
             </div>
           )}

           {/* Floating Action Bar */}
           <AdminActions 
             applicationId={application.id} 
             initialStatus={application.status} 
             initialNotes={application.admin_notes || ''} 
           />
        </div>

      </div>
    </div>
  );
}
