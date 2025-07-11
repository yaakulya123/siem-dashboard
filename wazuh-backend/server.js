const express = require('express');
const fetch = require('node-fetch');
const https = require('https');
const cors = require('cors');
const btoa = require('btoa'); // Add at top if not in Node 18+
require('dotenv').config();

const app = express();
app.use(cors()); // Allow frontend to call this backend

const PORT = process.env.PORT || 4000;
const WAZUH_HOST = process.env.WAZUH_HOST;
const WAZUH_USER = process.env.WAZUH_USER;
const WAZUH_PASS = process.env.WAZUH_PASS;

let cachedToken = '';
let tokenExpiryTime = 0;

// Ignore self-signed certificate errors
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

async function getWazuhToken() {
  if (!cachedToken || Date.now() >= tokenExpiryTime - 30000) {
    console.log('[i] Renewing Wazuh token...');

    const authHeader = 'Basic ' + btoa(`${WAZUH_USER}:${WAZUH_PASS}`);

    const res = await fetch(`${WAZUH_HOST}/security/user/authenticate`, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
      agent: httpsAgent,
    });

    const data = await res.json();

    if (data.error !== 0 || !data.data?.token) {
      throw new Error('Wazuh authentication failed');
    }

    cachedToken = data.data.token;
    tokenExpiryTime = Date.now() + 900 * 1000;
    console.log('[✓] Wazuh token acquired');
  }

  return cachedToken;
}

// Route to fetch manager stats
app.get('/manager-stats', async (req, res) => {
  try {
    const token = await getWazuhToken();

    const statsRes = await fetch(`${WAZUH_HOST}/manager/stats`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      agent: httpsAgent,
    });

    if (!statsRes.ok) {
      return res.status(statsRes.status).json({ error: statsRes.statusText });
    }

    const stats = await statsRes.json();
    res.json(stats);
  } catch (error) {
    console.error('[✗] Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`[✓] Server running at http://localhost:${PORT}`);
});


