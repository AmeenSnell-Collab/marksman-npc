import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import PaymentForm from './PaymentForm';

export default async function PaymentPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  // Fetch Application Data
  const { data: application, error: appError } = await supabase
    .from('applications')
    .select('id, first_name, last_name, status, association_name')
    .eq('id', params.id)
    .single();

  if (appError || !application) {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--error)' }}>Application Not Found</h2>
        <p style={{ color: 'var(--text-muted)' }}>We could not find a pending application with this tracker ID.</p>
      </div>
    );
  }

  // Ensure they are actually awaiting payment
  if (application.status === 'APPROVED') {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--success)' }}>Payment Complete!</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your application has already been paid for and approved. Welcome to Marksman NPC!</p>
      </div>
    );
  }

  if (application.status !== 'AWAITING_PAYMENT') {
    return (
      <div className="container" style={{ padding: '4rem', textAlign: 'center' }}>
        <h2>Payment Not Available</h2>
        <p style={{ color: 'var(--text-muted)' }}>Your application is currently marked as: <strong>{application.status}</strong>. Payments can only be made when awaiting payment.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '4rem auto' }}>
      <div className="card shadow-float" style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--text-main)', marginBottom: '0.5rem' }}>Membership Payment</h1>
          <p style={{ color: 'var(--text-muted)' }}>Complete your registration for {application.association_name}.</p>
        </div>

        <div style={{ 
          background: 'var(--background)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)', 
          marginBottom: '2rem',
          border: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Applicant Name:</span>
            <span style={{ fontWeight: 600 }}>{application.first_name} {application.last_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px dashed var(--border)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Annual Association Dues:</span>
            <span style={{ fontWeight: 600 }}>R 1,200.00</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Total Due:</span>
            <span style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>R 1,200.00</span>
          </div>
        </div>

        <PaymentForm applicationId={application.id} />
        
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          Secure Checkout • This is a mock payment screen for testing purposes.
        </p>
      </div>
    </div>
  );
}
