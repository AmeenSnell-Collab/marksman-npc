'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MasterListActions({ applicationId, currentStatus, userId }: { applicationId: string, currentStatus: string, userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [actionType, setActionType] = useState<'CANCEL' | 'CHANGE' | null>(null);
  const [reason, setReason] = useState('');

  const submitAction = async () => {
    if (!reason.trim()) {
      alert('You must provide a reason for this audit log.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/master-list/${applicationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionType,
          reason: reason
        })
      });

      if (!res.ok) throw new Error('Action failed');

      setActionType(null);
      setReason('');
      router.refresh();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card shadow-float" style={{ background: 'rgba(255, 255, 255, 0.95)', border: '1px solid var(--border)' }}>
      <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>Administrative Actions</h3>
      
      {!actionType ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            className="btn" 
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--text-main)', 
              color: 'var(--text-main)', 
              width: '100%', 
              textAlign: 'left',
              padding: '0.75rem 1rem'
            }}
            onClick={() => setActionType('CHANGE')}
          >
            ✏️ Modify Application Details Status
          </button>
          
          <button 
            className="btn" 
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--error)', 
              color: 'var(--error)', 
              width: '100%', 
              textAlign: 'left',
              padding: '0.75rem 1rem'
            }}
            onClick={() => setActionType('CANCEL')}
            disabled={currentStatus === 'REJECTED'}
          >
            🛑 Cancel Membership / Reject Application
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: actionType === 'CANCEL' ? 'var(--error)' : 'var(--text-main)' }}>
              {actionType === 'CANCEL' ? 'Cancelling Membership' : 'Modifying Status'}
            </span>
          </div>
          
          <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            Reason required for audit logging *
          </label>
          <textarea 
            rows={3} 
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{ background: 'var(--background)', resize: 'none', marginBottom: '1rem' }}
            placeholder="Document why this action is being taken..."
            disabled={loading}
          ></textarea>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="btn" 
              style={{ flex: 1, background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
              onClick={() => setActionType(null)}
              disabled={loading}
            >
              Back
            </button>
             <button 
              className="btn btn-primary" 
              style={{ flex: 1 }}
              onClick={submitAction}
              disabled={loading || reason.trim() === ''}
            >
              {loading ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
