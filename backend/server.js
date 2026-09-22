const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-service',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'ChangeMeInSecret123!',
  database: process.env.DB_NAME || 'appdb',
  port: process.env.DB_PORT || 5432,
});

// Liveness / Readiness health probe endpoint
app.get('/health', (req, res) => res.status(200).send('OK'));

// Sample API endpoint
app.get('/api/message', async (req, res) => {
  try {
    res.json({ message: "Hello from private GKE Node.js backend!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));