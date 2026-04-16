'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentForm({ applicationId }: { applicationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const simulatePayment = async () => {
    setLoading(true);
    setError('');

    try {
      // Simulate network delay for payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch(`/api/payment/${applicationId}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Payment failed');
      }

      // Success
      router.refresh(); // This will trigger the server component to render the "Payment Complete!" state
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
      
      <button 
        className="btn btn-primary" 
        style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
        onClick={simulatePayment}
        disabled={loading}
      >
        {loading ? (
          <>
            <span style={{ animation: 'spin 1s linear infinite' }}>↻</span> Processing Payment...
          </>
        ) : (
          <>
            💳 Pay R 1,200.00 Now
          </>
        )}
      </button>
    </div>
  );
}
