'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminActionsProps {
  applicationId: string;
  initialStatus: string;
  initialNotes: string;
}

export default function AdminActions({ applicationId, initialStatus, initialNotes }: AdminActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(initialStatus);
  const [notes, setNotes] = useState(initialNotes || '');

  const updateStatus = async (newStatus: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus,
          admin_notes: notes
        })
      });

      if (!res.ok) {
        throw new Error('Failed to update application');
      }

      setStatus(newStatus);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('Error updating application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ background: 'var(--background)', alignSelf: 'start', position: 'sticky', top: '100px' }}>
      <h3 style={{ marginBottom: '1rem' }}>Admin Actions</h3>

      <div className="form-group">
        <label>Admin Notes (Will be sent in email if rejected/info requested)</label>
        <textarea 
          rows={4} 
          placeholder="Enter reason for rejection or details for missing information..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
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
  );
}
