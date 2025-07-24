const express = require('express');
const fetch = require('node-fetch'); // If using Node 18+, you can use global fetch
const redis = require('redis');

const app = express();
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redisClient.connect().catch(console.error);

// Example: Cache for /agents-summary
app.get('/cache/agents-summary', async (req, res) => {
  const cacheKey = 'agents-summary';
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const apiRes = await fetch('http://localhost:4000/agents-summary');
    const data = await apiRes.json();
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 }); // Cache for 60 seconds
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Cache for /dashboard-metrics
app.get('/cache/dashboard-metrics', async (req, res) => {
  const cacheKey = 'dashboard-metrics';
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const apiRes = await fetch('http://localhost:4000/dashboard-metrics');
    const data = await apiRes.json();
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example: Cache for /alerts
app.get('/cache/alerts', async (req, res) => {
  const cacheKey = 'alerts';
  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }
    const apiRes = await fetch('http://localhost:4000/alerts');
    const data = await apiRes.json();
    await redisClient.set(cacheKey, JSON.stringify(data), { EX: 60 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the proxy server on a different port (e.g., 5000)
const PORT = process.env.CACHE_PROXY_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Cache proxy server running on port ${PORT}`);
});