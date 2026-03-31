'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PaymentClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const appId = searchParams.get('appId');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handlePayment = async () => {
    if (!appId) {
      alert('Invalid Application ID. Please return to the dashboard.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Artificial delay to make it feel like a real payment gateway
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId })
      });
      
      if (!res.ok) {
        throw new Error('Payment processing failed');
      }
      
      setSuccess(true);
      
      // Redirect back to dashboard after showing success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 3000);
      
    } catch (error) {
      console.error(error);
      alert('Payment Simulation Failed. Please Try Again.');
      setLoading(false);
    }
  };

  if (!appId) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center' }}>
        <h2>Invalid Session</h2>
        <p>No application specified. Please return to your dashboard.</p>
        <button onClick={() => router.push('/dashboard')} className="btn" style={{ marginTop: '1rem' }}>Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="card shadow-md animate-fade-in" style={{ maxWidth: '450px', width: '100%', padding: '2.5rem', background: '#ffffff', borderRadius: '1rem' }}>
        
        {success ? (
          <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ 
              width: '80px', height: '80px', background: '#d1fae5', color: '#059669', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
              fontSize: '2.5rem', margin: '0 auto 1.5rem auto' 
            }}>
              ✓
            </div>
            <h2 style={{ marginBottom: '0.5rem', color: '#065f46' }}>Payment Successful!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your membership has been activated. Redirecting you to your new dashboard...
            </p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.5rem' }}>🔒</span>
              </div>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Secure Checkout</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Marksman NPC Annual Membership</p>
            </div>

            <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Registration Fee</span>
                <strong>ZAR 250.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Annual Membership</span>
                <strong>ZAR 750.00</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem' }}>
                <strong>Total Due</strong>
                <strong>ZAR 1,000.00</strong>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label>Card Information (Simulated)</label>
              <input type="text" placeholder="•••• •••• •••• ••••" disabled style={{ background: '#f8fafc', opacity: 0.7 }} title="This is a simulated gateway. Just click Pay Now." />
            </div>

            <button 
              className="btn btn-primary" 
              onClick={handlePayment} 
              disabled={loading}
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', background: '#0f172a' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <span className="spinner" style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></span>
                  Processing...
                </span>
              ) : (
                'Pay ZAR 1,000.00'
              )}
            </button>
            <style jsx>{`
              @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
            
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.75rem', marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <span>🔒 256-bit SSL Encryption Simulated</span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
