const express = require('express');
const cors = require('cors');
const axios = require('axios');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
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

// Create axios instance with SSL verification disabled
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
});

// Token cache
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

/**
 * Dashboard metrics endpoint
 */
app.get('/dashboard-metrics', async (req, res) => {
    try {
        const token = await getWazuhToken();
        
        // === 1. Agent Summary ===
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
        
        // === 2. Total Alerts (All-time) ===
        const totalAlertQuery = {
            size: 0,
            aggs: {
                severity: {
                    range: {
                        field: 'rule.level',
                        ranges: [
                            { key: 'Info', to: 6 },
                            { key: 'Minor', from: 7, to: 11 },
                            { key: 'Major', from: 11, to: 13 },
                            { key: 'Critical', from: 13 }
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
        
        // === 3. Compliance Score ===
        const complianceScore = await computeAverageComplianceScore();
        
        // === 4. Wazuh Health ===
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
        
        // === 5. Recent Alerts ===
        const alertsQuery = {
            size: 5,
            sort: [
                { '@timestamp': { order: 'desc' } }
            ],
            _source: [
                'rule.level',
                'rule.description',
                'rule.id',
                'rule.groups',
                '@timestamp',
                'predecoder.hostname',
                'agent.name',
                'agent.id',
                'full_log',
                'location'
            ]
        };
        
        const authString = `${INDEXER_USER}:${INDEXER_PASS}`;
        const authEncoded = Buffer.from(authString).toString('base64');
        
        const alertsResponse = await axiosInstance.post(
            `${INDEXER_HOST}/wazuh-alerts*/_search`,
            alertsQuery,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Basic ${authEncoded}`
                }
            }
        );
        
        const alertsData = alertsResponse.data;
        const hits = alertsData.hits?.hits || [];
        
        const alerts = hits.map(hit => {
            const source = hit._source || {};
            return {
                severity: source.rule?.level,
                alert_description: source.rule?.description,
                time: source['@timestamp'],
                host_name: source.predecoder?.hostname,
                agent_name: source.agent?.name,
                rule_groups: (source.rule?.groups || []).join(', ')
            };
        });
        
        // === 6. Last 24hr Alerts ===
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
                            { key: 'Info', to: 7 },
                            { key: 'Minor', from: 7, to: 11 },
                            { key: 'Major', from: 11, to: 13 },
                            { key: 'Critical', from: 13 }
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
        
        const recent24hrData = recent24hrResponse.data;
        const severityBuckets = recent24hrData.aggregations?.severity?.buckets || [];
        const alertsLast24hr = severityBuckets.reduce((sum, bucket) => sum + bucket.doc_count, 0);
        
        const criticalAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Critical')?.doc_count || 0;
        const highAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Major')?.doc_count || 0;
        const mediumAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Minor')?.doc_count || 0;
        const lowAlertsLast24hr = severityBuckets.find(bucket => bucket.key === 'Info')?.doc_count || 0;
        
        const activeAgents = agentSummary.data?.connection?.active || 0;
        const wazuhHealth = wazuhHealthData.data?.affected_items?.[0]?.status;
        
        res.json({
            total_alerts: totalAlerts,
            alerts_last_24hr: alertsLast24hr,
            critical_alerts: criticalAlertsLast24hr,
            high_alerts: highAlertsLast24hr,
            medium_alerts: mediumAlertsLast24hr,
            low_alerts: lowAlertsLast24hr,
            open_tickets: 0,  // Placeholder
            resolved_today: 0,  // Placeholder
            avg_response_time: '0s',  // Placeholder
            compliance_score: `${complianceScore}%`,
            active_agents: activeAgents,
            wazuh_health: wazuhHealth,
            alerts: alerts
        });
        
    } catch (error) {
        console.error('Dashboard metrics error:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});