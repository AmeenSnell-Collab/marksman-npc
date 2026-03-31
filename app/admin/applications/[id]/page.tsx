'use client';
import { useState } from 'react';

export default function AdminApplicationDetail({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('PENDING');

  const updateStatus = (newStatus: string) => {
    setLoading(true);
    setTimeout(() => {
      setStatus(newStatus);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <a href="/admin/applications" style={{ fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>← Back to All Applications</a>
          <h2>Review Application: {params.id}</h2>
        </div>
        <span className={`status-badge status-${status.toLowerCase().replace('_', '-')}`} style={{ fontSize: '1rem', padding: '0.5rem 1rem' }}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Left Col - Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Applicant Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Full Name</strong> John Doe</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID Number</strong> 8501015024080</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Email</strong> john.doe@example.com</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</strong> 082 123 4567</div>
            </div>
          </div>

          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Association Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Primary Association</strong> Natshoot (NHSA)</div>
              <div><strong style={{ display: 'block', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Member Number</strong> NHT-12345</div>
            </div>
          </div>

          <div className="card shadow-sm">
            <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1rem' }}>Uploaded Documents</h3>
            <div style={{ padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--primary)' }}>📄</span>
                <strong>nhsa_membership_cert.pdf</strong>
              </div>
              <button className="btn" style={{ border: '1px solid var(--border)', fontSize: '0.875rem' }}>View Document</button>
            </div>
          </div>
        </div>

        {/* Right Col - Admin Actions */}
        <div className="card" style={{ background: 'var(--background)', alignSelf: 'start', position: 'sticky', top: '100px' }}>
          <h3 style={{ marginBottom: '1rem' }}>Admin Actions</h3>
          
          <div className="form-group">
            <label>Admin Notes (Will be sent in email if rejected/info requested)</label>
            <textarea rows={4} placeholder="Enter reason for rejection or details for missing information..."></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button 
              className="btn btn-primary" 
              style={{ background: 'var(--success)' }}
              onClick={() => updateStatus('APPROVED')}
              disabled={loading || status === 'APPROVED'}
            >
              ✓ Approve Application
            </button>
            
            <button 
              className="btn btn-primary" 
              style={{ background: 'var(--info)' }}
              onClick={() => updateStatus('INFO_REQUESTED')}
              disabled={loading}
            >
              ℹ Request More Info
            </button>
            
            <button 
              className="btn" 
              style={{ border: '1px solid var(--error)', color: 'var(--error)' }}
              onClick={() => updateStatus('REJECTED')}
              disabled={loading || status === 'REJECTED'}
            >
              ✗ Reject Application
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
