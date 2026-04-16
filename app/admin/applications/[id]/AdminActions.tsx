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

  // Verification Checklist State
  const [chkId, setChkId] = useState(false);
  const [chkAddress, setChkAddress] = useState(false);
  const [chkMembership, setChkMembership] = useState(false);

  // All must be true to approve
  const canApprove = chkId && chkAddress && chkMembership;

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
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {!['APPROVED', 'AWAITING_PAYMENT'].includes(status) && (
          <div style={{ flex: '1 1 250px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem' }}>
              Document Verification Checklist
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={chkId} onChange={(e) => setChkId(e.target.checked)} />
                <span>Copy of ID</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={chkAddress} onChange={(e) => setChkAddress(e.target.checked)} />
                <span>Proof of Address</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={chkMembership} onChange={(e) => setChkMembership(e.target.checked)} />
                <span>Proof of membership to professional body</span>
              </label>
            </div>
          </div>
        )}

        <div style={{ flex: '1 1 300px' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Administrator Notes (Optional)
          </label>
          <textarea 
            rows={!['APPROVED', 'AWAITING_PAYMENT'].includes(status) ? 4 : 2} 
            placeholder="Feedback saved for internal review, or sent to user if info is requested."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ resize: 'none', background: 'var(--background)' }}
            disabled={loading}
          ></textarea>
        </div>

        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.75rem', justifyContent: 'center' }}>
          {!['APPROVED', 'AWAITING_PAYMENT'].includes(status) && (
            <button 
              className="btn btn-primary" 
              style={{ 
                background: canApprove ? 'var(--success)' : '#cbd5e1', 
                border: 'none', 
                width: '100%',
                cursor: canApprove ? 'pointer' : 'not-allowed'
              }}
              onClick={() => {
                // Here we would also trigger the email sending process to the user
                console.log('TODO: Send Payment Link Email to User');
                updateStatus('AWAITING_PAYMENT');
              }}
              disabled={loading || !canApprove}
              title={!canApprove ? 'Please verify all documents in the checklist first' : ''}
            >
              Approve & Request Payment
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
