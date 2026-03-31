'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface FormData {
  first_name: string;
  last_name: string;
  phone: string;
  id_number: string;
  association_name: string;
  association_number: string;
}

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    first_name: '',
    last_name: '',
    phone: '',
    id_number: '',
    association_name: '',
    association_number: '',
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to submit application');
      }

      // Success! Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '3rem 1rem', maxWidth: '800px' }}>
      <div className="card shadow-md">
        <h2 style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>Membership Application</h2>
        
        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: '0.5rem', margin: '2rem 0' }}>
          <div style={{ flex: 1, height: '4px', background: 'var(--primary)', borderRadius: '4px', transition: 'background 0.3s' }}></div>
          <div style={{ flex: 1, height: '4px', background: step > 1 ? 'var(--primary)' : 'var(--border)', borderRadius: '4px', transition: 'background 0.3s' }}></div>
          <div style={{ flex: 1, height: '4px', background: step > 2 ? 'var(--primary)' : 'var(--border)', borderRadius: '4px', transition: 'background 0.3s' }}></div>
        </div>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={step === 3 ? submitApp : (e) => { e.preventDefault(); setStep(step + 1); }}>
          {step === 1 && (
            <div className="animate-fade-in">
              <h3>Part 1: Personal Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                <div className="form-group">
                  <label>First Name</label>
                  <input id="apply-firstname" required type="text" value={formData.first_name} onChange={e => updateField('first_name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input id="apply-lastname" required type="text" value={formData.last_name} onChange={e => updateField('last_name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input id="apply-phone" required type="tel" value={formData.phone} onChange={e => updateField('phone', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>ID Number</label>
                  <input id="apply-idnumber" required type="text" value={formData.id_number} onChange={e => updateField('id_number', e.target.value)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem', float: 'right' }}>Next Step</button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h3>Part 2: Association & Shooting Club Affiliations</h3>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Primary Association Name</label>
                <select id="apply-association" required value={formData.association_name} onChange={e => updateField('association_name', e.target.value)}>
                  <option value="">Select an Association...</option>
                  <option value="Natshoot">Natshoot (NHSA)</option>
                  <option value="SADPA">SADPA</option>
                  <option value="IDPA">IDPA</option>
                  <option value="WPPSA">WPPSA</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Association Member Number</label>
                <input id="apply-assocnumber" required type="text" placeholder="e.g. NHT-12345" value={formData.association_number} onChange={e => updateField('association_number', e.target.value)} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" className="btn" onClick={() => setStep(1)} style={{ border: '1px solid var(--border)' }}>Back</button>
                <button type="submit" className="btn btn-primary">Next Step</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h3>Part 3: Review & Submit</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                Please review your details below before submitting your application.
              </p>
              
              {/* Review Summary */}
              <div style={{ background: 'var(--background)', borderRadius: 'var(--radius-md)', padding: '1.5rem', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Full Name</span>
                    <strong>{formData.first_name} {formData.last_name}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Phone</span>
                    <strong>{formData.phone}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>ID Number</span>
                    <strong>{formData.id_number}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.8rem' }}>Association</span>
                    <strong>{formData.association_name} — {formData.association_number}</strong>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
                <button type="button" className="btn" onClick={() => setStep(2)} style={{ border: '1px solid var(--border)' }}>Back</button>
                <button id="apply-submit" type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
