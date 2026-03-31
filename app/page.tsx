export default function LandingPage() {
  return (
    <div className="hero-gradient" style={{ height: 'calc(100vh - 70px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="container animate-fade-in" style={{ textAlign: 'center', color: '#fff', maxWidth: '800px' }}>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800 }}>Welcome to Marksman NPC</h1>
        <p style={{ fontSize: '1.25rem', marginBottom: '2.5rem', color: '#e5e7eb' }}>
          The premier portal for association tracking, membership management, and secure document verification. 
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
            New Application
          </a>
          <a href="/login" className="btn glass" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem', color: '#fff' }}>
            Member Portal
          </a>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginTop: '4rem' }}>
          <div className="card glass">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>1. Register</h3>
            <p style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>Create a secure account with your email and password.</p>
          </div>
          <div className="card glass">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>2. Apply</h3>
            <p style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>Submit required documents and association credentials.</p>
          </div>
          <div className="card glass">
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.2rem' }}>3. Approval</h3>
            <p style={{ fontSize: '0.9rem', color: '#e5e7eb' }}>Admin verification and secure status updates.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
