import React, { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState("Loading...");

  useEffect(() => {
    fetch('/api/message')
      .then((res) => res.json())
      .then((json) => setData(json.message))
      .catch((err) => setData("Failed to reach API"));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Three-Tier Production App on GKE</h1>
      <p>Backend Status: <strong>{data}</strong></p>
    </div>
  );
}

export default App;