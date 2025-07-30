const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const dotenv = require('dotenv');
const redis = require('redis');

dotenv.config(); // load environment variables from .env

const app = express();

app.use(cors());
app.use(express.json());

// Configuration
const PORT = process.env.PORT || 4000;
const WAZUH_HOST = process.env.WAZUH_HOST;
const WAZUH_USER = process.env.WAZUH_USER;
const WAZUH_PASS = process.env.WAZUH_PASS;
const INDEXER_HOST = process.env.INDEXER_HOST;
const INDEXER_USER = process.env.INDEXER_USER;
const INDEXER_PASS = process.env.INDEXER_PASS;

// Redis client setup
const redisClient = redis.createClient({
  url: process.env.REDIS_URL // e.g., redis://localhost:6379
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

// Axios instance with SSL verification disabled
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
});

// Redis cache helpers
async function setCache(key, data, ttl = 60) {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error('Redis SET error', err);
  }
}

async function getCache(key) {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Redis GET error', err);
    return null;
  }
}

// Wazuh token cache (in-memory)
let cachedToken = null;
let tokenExpiryTime = 0;

/**
 * Get Wazuh authentication token
 */
async function getWazuhToken() {
  const currentTime = Date.now() / 1000;

  if (!cachedToken || currentTime >= tokenExpiryTime - 30) {
    console.log('[i] Renewing Wazuh token...');

    const authString = `${WAZUH_USER}:${WAZUH_PASS}`;
    const authEncoded = Buffer.from(authString).toString('base64');

    const headers = {
      'Authorization': `Basic ${authEncoded}`,
      'Accept': 'application/json'
    };

    try {
      const response = await axiosInstance.post(
        `${WAZUH_HOST}/security/user/authenticate`,
        {},
        { headers }
      );

      const data = response.data;

      if (data.error !== 0 || !data.data?.token) {
        throw new Error('Wazuh authentication failed');
      }

      cachedToken = data.data.token;
      tokenExpiryTime = currentTime + 900; // 15 minutes
      console.log('[✓] Token acquired');
    } catch (error) {
      throw new Error(`Wazuh authentication failed: ${error.message}`);
    }
  }

  return cachedToken;
}

/**
 * Fetch all active agent IDs
 */
async function getActiveAgentIds(token) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  try {
    const response = await axiosInstance.get(
      `${WAZUH_HOST}/agents?status=active`,
      { headers }
    );

    const data = response.data;
    const agents = data.data?.affected_items || [];
    return agents.map(agent => agent.id);
  } catch (error) {
    throw new Error(`Failed to fetch active agents: ${error.message}`);
  }
}

/**
 * Fetch SCA score for a single agent
 */
async function getAgentScore(token, agentId) {
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Accept': 'application/json'
  };

  try {
    const response = await axiosInstance.get(
      `${WAZUH_HOST}/sca/${agentId}`,
      { headers }
    );

    const data = response.data;
    const items = data.data?.affected_items || [];

    if (items.length > 0 && 'score' in items[0]) {
      return items[0].score;
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Compute average compliance score across all agents
 */
async function computeAverageComplianceScore() {
  try {
    const token = await getWazuhToken();
    const agentIds = await getActiveAgentIds(token);

    const scores = [];

    for (const agentId of agentIds) {
      const score = await getAgentScore(token, agentId);
      if (score !== null) {
        scores.push(score);
      }
    }

    if (scores.length > 0) {
      const avgScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      return Math.round(avgScore * 100) / 100;
    } else {
      return 0;
    }
  } catch (error) {
    console.error(`[✗] Error computing compliance score: ${error.message}`);
    return 0;
  }
}

// ------------------- Routes -------------------

app.get('/agents-summary', async (req, res) => {
  try {
    const cachedData = await getCache('agents-summary');
    if (cachedData) {
      return res.json(cachedData);
    }


    const token = await getWazuhToken();

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    };

    const agentsResponse = await axiosInstance.get(`${WAZUH_HOST}/agents`, { headers });
    const agents = agentsResponse.data.data?.affected_items || [];

    const summary = {};

    for (const agent of agents) {
      const agentId = agent.id;
      if (agentId === '000') continue;
      const os = agent.os || {};
      const agentName = agent.name || 'Unknown Agent';

      const agentData = {
        name: agentName,
        ip: agent.ip,
        os_name: os.name,
        status: agent.status,
        os_version: os.version,
        last_keepalive: agent.lastKeepAlive || 'N/A',
        nodename: agent.node_name || 'N/A',
      };

      try {
        const scaMetaResponse = await axiosInstance.get(`${WAZUH_HOST}/sca/${agentId}`, { headers });
        const scaItem = scaMetaResponse.data.data?.affected_items?.[0];

        if (scaItem?.policy_id) {
          const policyId = scaItem.policy_id;

          agentData.policy_id = policyId;
          agentData.score = scaItem.score;
          agentData.total_checks = scaItem.total_checks;
          agentData.pass = scaItem.pass;
          agentData.invalid = scaItem.invalid;
          agentData.fail = scaItem.fail;

          const checksResponse = await axiosInstance.get(`${WAZUH_HOST}/sca/${agentId}/checks/${policyId}`, { headers });
          const checks = checksResponse.data.data?.affected_items || [];

          agentData.cis_checks = checks.map(check => ({
            id: check.id,
            command: check.command,
            title: check.title,
            description: check.description,
            result: check.result
          }));
        }
      } catch (err) {
        console.warn(`[!] Could not fetch SCA info for agent ${agentId}: ${err.message}`);
      }

      try {
        const elasticAuth = Buffer.from(`${INDEXER_USER}:${INDEXER_PASS}`).toString('base64');
        const elasticResponse = await axiosInstance.get(
          `${INDEXER_HOST}/wazuh-states-vulnerabilities-*/_search?q=agent.id:${agentId}`,
          {
            headers: {
              'Authorization': `Basic ${elasticAuth}`,
              'Accept': 'application/json'
            }
          }
        );

        const vulnHits = elasticResponse.data?.hits?.hits || [];

        agentData.vulnerabilities = vulnHits.map(hit => {
          const source = hit._source || {};
          return {
            name: source.package?.name,
            id: source.vulnerability?.id,
            severity: source.vulnerability?.severity
          };
        });
      } catch (err) {
        console.warn(`[!] Could not fetch vulnerabilities for agent ${agentId}: ${err.message}`);
        agentData.vulnerabilities = [];
      }

      summary[agentId] = agentData;
    }

    const agentsData = { agents: summary };

    await setCache('agents-summary', agentsData, 60);

    res.json(agentsData);

  } catch (err) {
    console.error('[✗] Error in /agents-summary:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/dashboard-metrics', async (req, res) => {
  try {
    const cachedData = await getCache('dashboard-metrics');
    if (cachedData) {
      return res.json(cachedData);
    }

    const token = await getWazuhToken();

    const agentSummaryResponse = await axiosInstance.get(
      `${WAZUH_HOST}/agents/summary/status`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );
    const agentSummary = agentSummaryResponse.data;

    const totalAlertQuery = {
      size: 0,
      aggs: {
        severity: {
          range: {
            field: 'rule.level',
            ranges: [
              { key: 'Info', to: 6 },
              { key: 'Minor', from: 7, to: 11 },
              { key: 'Major', from: 11, to: 14 },
              { key: 'Critical', from: 14 }
            ]
          }
        }
      }
    };

    const totalAlertsResponse = await axiosInstance.post(
      `${INDEXER_HOST}/wazuh-alerts-4.x-*/_search`,
      totalAlertQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        auth: {
          username: INDEXER_USER,
          password: INDEXER_PASS
        }
      }
    );

    const totalAlertsData = totalAlertsResponse.data;
    const buckets = totalAlertsData.aggregations?.severity?.buckets || [];
    const totalAlerts = buckets.reduce((sum, bucket) => sum + (bucket.doc_count || 0), 0);

    const complianceScore = await computeAverageComplianceScore();

    const wazuhHealthResponse = await axiosInstance.get(
      `${WAZUH_HOST}/manager/configuration/validation`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );
    const wazuhHealthData = wazuhHealthResponse.data;

    const now = new Date();
    const timeFilter = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

    const last24hrQuery = {
      size: 0,
      query: {
        range: {
          timestamp: {
            gte: timeFilter,
            lte: now.toISOString()
          }
        }
      },
      aggs: {
        severity: {
          range: {
            field: 'rule.level',
            ranges: [
              { key: 'Minor', from: 7, to: 11 },
              { key: 'Major', from: 11, to: 14 },
              { key: 'Critical', from: 14 }
            ]
          }
        }
      }
    };

    const recent24hrResponse = await axiosInstance.post(
      `${INDEXER_HOST}/wazuh-alerts-4.x-*/_search`,
      last24hrQuery,
      {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        auth: {
          username: INDEXER_USER,
          password: INDEXER_PASS
        }
      }
    );

    const severityBuckets = recent24hrResponse.data.aggregations?.severity?.buckets || [];
    const alertsLast24hr = severityBuckets.reduce((sum, bucket) => sum + bucket.doc_count, 0);

    const criticalAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Critical')?.doc_count || 0;
    const majorAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Major')?.doc_count || 0;
    const minorAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Minor')?.doc_count || 0;

    const activeAgents = agentSummary.data?.connection?.active || 0;
    const wazuhHealth = wazuhHealthData.data?.affected_items?.[0]?.status;

    const responseData = {
      total_alerts: totalAlerts,
      alerts_last_24hr: alertsLast24hr,
      critical_alerts: criticalAlertsLast24hr,
      major_alerts: majorAlertsLast24hr,
      minor_alerts: minorAlertsLast24hr,
      open_tickets: 0,
      resolved_today: 0,
      avg_response_time: '0s',
      compliance_score: `${complianceScore}%`,
      active_agents: activeAgents,
      wazuh_health: wazuhHealth
    };

    await setCache('dashboard-metrics', responseData, 60);

    res.json(responseData);

  } catch (error) {
    console.error('Dashboard metrics error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/alerts', async (req, res) => {
  try {
    const cachedData = await getCache('alerts');
    if (cachedData) {
      return res.json(cachedData);
    }

    const authString = `${INDEXER_USER}:${INDEXER_PASS}`;
    const authEncoded = Buffer.from(authString).toString("base64");

    const alertsQuery = {
      query: {
        range: {
          "rule.level": {
            gte: 8
          }
        }
      },
      sort: [
        { "@timestamp": { order: "desc" } }
      ],
      _source: [
        "rule.level",
        "rule.description",
        "rule.id",
        "rule.groups",
        "@timestamp",
        "predecoder.hostname",
        "agent.name",
        "agent.id",
        "full_log",
        "location"
      ],
      size: 500
    };

    const alertsResponse = await axiosInstance.post(
      `${INDEXER_HOST}/wazuh-alerts*/_search`,
      alertsQuery,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Basic ${authEncoded}`
        }
      }
    );

    const hits = alertsResponse.data.hits?.hits || [];

    const alerts = hits.map(hit => {
      const source = hit._source || {};
      return {
        severity: source.rule?.level,
        alert_description: source.rule?.description,
        time: source["@timestamp"],
        host_name: source.predecoder?.hostname,
        agent_name: source.agent?.name,
        rule_groups: (source.rule?.groups || []).join(", ")
      };
    });

    await setCache('alerts', { alerts }, 60);

    res.json({ alerts });
  } catch (error) {
    console.error('Alerts route error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * Periodically refresh a given endpoint to keep Redis cache updated.
 * @param {string} endpoint - The Express route to trigger.
 * @param {number} interval - Interval in milliseconds.
 */
function refreshCachePeriodically(endpoint, interval) {
  setInterval(async () => {
    try {
      console.log(`[CRON] Refreshing ${endpoint} cache...`);
      await axios.get(`http://localhost:${PORT}${endpoint}`);
      console.log(`[✓] ${endpoint} cache refreshed`);
    } catch (err) {
      console.error(`[CRON] Failed to refresh ${endpoint} cache:`, err.message);
    }
  }, interval);
}

// Setup automatic refreshes for all caches
refreshCachePeriodically('/alerts', 10 * 1000);             // every 10 sec
refreshCachePeriodically('/dashboard-metrics', 10 * 1000);  // every 10 sec
refreshCachePeriodically('/agents-summary', 10 * 1000);     // every 10 sec



// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});