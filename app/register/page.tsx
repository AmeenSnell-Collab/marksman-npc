'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    setSuccess('Account created! Check your email to verify before logging in.');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', animation: 'fadeIn 0.5s ease' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>
        
        {success ? (
          <div style={{ background: 'var(--success)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
            {success} <br/><br/>
            <a href="/login" style={{ color: 'white', textDecoration: 'underline' }}>Go to login</a>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}
            <div className="form-group">
              <label>Email Address</label>
              <input id="register-email" name="email" type="email" required placeholder="you@example.com" />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input id="register-password" name="password" type="password" required placeholder="••••••••" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input id="register-confirm" name="confirmPassword" type="password" required placeholder="••••••••" />
            </div>
            <button id="register-submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </button>
          </form>
        )}
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}
