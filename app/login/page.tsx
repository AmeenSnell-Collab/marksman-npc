'use client';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    // Successful login — redirect to dashboard
    // Use the redirect param if present in URL
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '/dashboard';
    window.location.href = redirect;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '2rem' }}>
      <div className="card" style={{ maxWidth: '400px', width: '100%', animation: 'fadeIn 0.5s ease' }}>
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Member Login</h2>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input id="login-email" name="email" type="email" required placeholder="you@example.com" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input id="login-password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <button id="login-submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
        
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
          Need an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}
