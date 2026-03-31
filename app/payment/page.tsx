import { Suspense } from 'react';
import PaymentClient from './PaymentClient';

// Ensure the page acts as a true server component wrapper
export const dynamic = 'force-dynamic';

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b' }}>Loading secure payment portal...</p>
      </div>
    }>
      <PaymentClient />
    </Suspense>
  );
}
