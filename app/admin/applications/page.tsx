export default function AdminApplicationsPage() {
  const mockApplications = [
    { id: 'app-001', name: 'John Doe', assn: 'Natshoot', status: 'PENDING', date: '2026-03-29' },
    { id: 'app-002', name: 'Jane Smith', assn: 'SADPA', status: 'INFO_REQUESTED', date: '2026-03-28' },
    { id: 'app-003', name: 'Barry Allen', assn: 'WPPSA', status: 'APPROVED', date: '2026-03-27' }
  ];

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Application Management</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select style={{ padding: '0.5rem', width: 'auto' }}>
            <option>All Statuses</option>
            <option>Pending</option>
            <option>Approved</option>
          </select>
          <input type="text" placeholder="Search ID or Name" style={{ width: '250px' }} />
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'var(--background)' }}>
            <tr>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>ID</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Applicant Name</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Association</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Date Submitted</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Status</th>
              <th style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '1rem' }}>{app.id}</td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{app.name}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.assn}</td>
                <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{app.date}</td>
                <td style={{ padding: '1rem' }}>
                  <span className={`status-badge status-${app.status.toLowerCase().replace('_', '-')}`}>
                    {app.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <a href={`/admin/applications/${app.id}`} className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.875rem', border: '1px solid var(--border)' }}>Review</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
