import React, { useState, useEffect } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  // Fetch users list from backend
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Failed to load users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setStatusMsg('Could not fetch existing records.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;

    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) throw new Error('Submission failed');

      setName('');
      setEmail('');
      setStatusMsg('Record successfully added to Cloud SQL!');
      fetchUsers();
    } catch (err) {
      console.error(err);
      setStatusMsg('Error submitting record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: '0 20px' }}>
      <h2 style={{ textAlign: 'center', color: '#1a202c' }}>User Directory </h2>
      
      <form onSubmit={handleSubmit} style={{ background: '#f7fafc', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Full Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="John Doe"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Email Address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="john@example.com"
            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '12px', background: '#3182ce', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', cursor: 'pointer' }}
        >
          {loading ? 'Saving...' : 'Submit to Database'}
        </button>

        {statusMsg && (
          <p style={{ marginTop: '12px', textAlign: 'center', color: statusMsg.includes('Error') ? '#e53e3e' : '#38a169', fontWeight: '500' }}>
            {statusMsg}
          </p>
        )}
      </form>

      <h3 style={{ borderBottom: '2px solid #edf2f7', paddingBottom: '8px' }}>Registered Entries</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginTop: '10px' }}>
        <thead>
          <tr style={{ background: '#edf2f7' }}>
            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #e2e8f0' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '15px', border: '1px solid #e2e8f0', color: '#718096' }}>
                No records found in Cloud SQL yet.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{u.id}</td>
                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{u.name}</td>
                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{u.email}</td>
                <td style={{ padding: '10px', border: '1px solid #e2e8f0' }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
