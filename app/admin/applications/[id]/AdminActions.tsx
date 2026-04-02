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
    <div className="card shadow-float" style={{ 
      position: 'sticky', 
      bottom: '2rem', 
      marginTop: '2rem',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--border)',
      zIndex: 20
    }}>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        <div style={{ flex: 2 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Administrator Notes (Optional)
          </label>
          <textarea 
            rows={2} 
            placeholder="Feedback saved for internal review, or sent to user if info is requested."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: 'none', background: 'var(--background)' }}
          ></textarea>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'flex-end', paddingTop: '1.75rem' }}>
          {status !== 'APPROVED' && (
            <button 
              className="btn btn-primary" 
              style={{ background: 'var(--success)', border: 'none', width: '100%' }}
              onClick={() => updateStatus('APPROVED')}
              disabled={loading}
            >
              Approve Application
            </button>
          )}

          {status !== 'REJECTED' && (
            <button 
              className="btn" 
              style={{ border: '1px solid var(--error)', color: 'var(--error)', width: '100%', background: 'transparent' }}
              onClick={() => updateStatus('REJECTED')}
              disabled={loading}
            >
              Reject Application
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
