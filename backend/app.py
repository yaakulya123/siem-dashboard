from flask import Flask, jsonify
from flask_cors import CORS
import os
import requests
import base64
import time
from datetime import datetime, timedelta
from dotenv import load_dotenv
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Load environment variables
load_dotenv()

# Suppress warnings for self-signed certs
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# Flask setup
app = Flask(__name__)
CORS(app)

# Configuration
PORT = int(os.getenv("PORT", 4000))
WAZUH_HOST = os.getenv("WAZUH_HOST")
WAZUH_USER = os.getenv("WAZUH_USER")
WAZUH_PASS = os.getenv("WAZUH_PASS")
INDEXER_HOST = os.getenv("INDEXER_HOST")
INDEXER_USER = os.getenv("INDEXER_USER")
INDEXER_PASS = os.getenv("INDEXER_PASS")

# Token cache
cached_token = None
token_expiry_time = 0

def get_wazuh_token():
    global cached_token, token_expiry_time

    current_time = time.time()
    if not cached_token or current_time >= token_expiry_time - 30:
        print("[i] Renewing Wazuh token...")

        auth_string = f"{WAZUH_USER}:{WAZUH_PASS}"
        auth_encoded = base64.b64encode(auth_string.encode()).decode()

        headers = {
            "Authorization": f"Basic {auth_encoded}",
            "Accept": "application/json"
        }

        response = requests.post(f"{WAZUH_HOST}/security/user/authenticate", headers=headers, verify=False)
        data = response.json()

        if data.get("error") != 0 or not data.get("data", {}).get("token"):
            raise Exception("Wazuh authentication failed")

        cached_token = data["data"]["token"]
        token_expiry_time = current_time + 900
        print("[✓] Token acquired")

    return cached_token

def get_active_agent_ids(token):
    """Fetch all active agent IDs."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    res = requests.get(
        f"{WAZUH_HOST}/agents?status=active",
        headers=headers,
        verify=False
    )

    data = res.json()
    agents = data.get("data", {}).get("affected_items", [])
    return [agent["id"] for agent in agents]

def get_agent_score(token, agent_id):
    """Fetch SCA score for a single agent."""
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json"
    }

    res = requests.get(
        f"{WAZUH_HOST}/sca/{agent_id}",
        headers=headers,
        verify=False
    )

    data = res.json()
    items = data.get("data", {}).get("affected_items", [])

    if items and "score" in items[0]:
        return items[0]["score"]
    return None

def compute_average_compliance_score():
    try:
        token = get_wazuh_token()
        agent_ids = get_active_agent_ids(token)

        # print(f"[✓] Found {len(agent_ids)} active agents")

        scores = []
        for agent_id in agent_ids:
            score = get_agent_score(token, agent_id)
            if score is not None:
                # print(f"Agent {agent_id}: score = {score}")
                scores.append(score)
            else:
                pass
                # print(f"Agent {agent_id}: no score available")

        if scores:
            avg_score = sum(scores) / len(scores)
            return round(avg_score, 2)
        else:
            return (0)

    except Exception as e:
        return f"[✗] Error: {e}"


@app.route('/dashboard-metrics')
def dashboard_metrics():
    try:
        token = get_wazuh_token()

        # === 1. Agent Summary ===
        agent_summary = requests.get(
            f"{WAZUH_HOST}/agents/summary/status",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json"
            },
            verify=False
        ).json()

        # === 2. Total Alerts (All-time) ===
        total_alert_query = {
            "size": 0,
            "aggs": {
                "severity": {
                    "range": {
                        "field": "rule.level",
                        "ranges": [
                            {"key": "Info", "to": 6},
                            {"key": "Minor", "from": 7, "to": 11},
                            {"key": "Major", "from": 11, "to": 13},
                            {"key": "Critical", "from": 13}
                        ]
                    }
                }
            }
        }

        total_res = requests.post(
            f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            auth=(INDEXER_USER, INDEXER_PASS),
            verify=False,
            json=total_alert_query
        ).json()
        # total_alerts = total_res.get("hits", {}).get("total", {}).get("value", 0)
        buckets = total_res.get("aggregations", {}).get("severity", {}).get("buckets", [])
        total_alerts = sum(bucket.get("doc_count", 0) for bucket in buckets)



        # Compliance Score
        compliance_score = compute_average_compliance_score()

        #Wazuh health
        wazuh_health_res = requests.get(
            f"{WAZUH_HOST}/manager/configuration/validation",
            headers={
                "Authorization": f"Bearer {token}",
                "Accept": "application/json"
            },
            verify=False
        ).json()

        #alerts
        alerts_header = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

        auth_string = f"{INDEXER_USER}:{INDEXER_PASS}"
        auth_encoded = base64.b64encode(auth_string.encode()).decode()
        alerts_header["Authorization"] = f"Basic {auth_encoded}"

        query = {
            "size": 5,
            "sort": [
                {"@timestamp": {"order": "desc"}}
            ],
            "_source": [
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
            ]
        }

        res = requests.post(
            f"{INDEXER_HOST}/wazuh-alerts*/_search",
            headers=alerts_header,
            json=query,
            verify=False
        )

        res.raise_for_status()
        data = res.json()

        # alerts = [hit.get("_source", {}) for hit in data.get("hits", {}).get("hits", [])]
        # hit = data.get("hits", {}).get("hits", [])[0].get("_source", {})

        # alert_data = {
        #     "severity": hit.get("rule", {}).get("level"),
        #     "alert_description": hit.get("rule", {}).get("description"),
        #     "time": hit.get("@timestamp"),
        #     "host_name": hit.get("predecoder", {}).get("hostname"),
        #     "agent_name": hit.get("agent", {}).get("name"),
        #     # "rule_id": hit.get("rule", {}).get("id"),
        #     # "rule_groups": hit.get("rule", {}).get("groups")
        #     "rule_groups": ", ".join(hit.get("rule", {}).get("groups", []))
        # }


        # hits = data.get("hits", {}).get("hits", [])

        # alerts = {}

        # for index, hit in enumerate(hits, start=1):
        #     source = hit.get("_source", {})
        #     alert_key = f"alert_{index}"
        #     alerts[alert_key] = {
        #         "severity": source.get("rule", {}).get("level"),
        #         "alert_description": source.get("rule", {}).get("description"),
        #         "time": source.get("@timestamp"),
        #         "host_name": source.get("predecoder", {}).get("hostname"),
        #         "agent_name": source.get("agent", {}).get("name"),
        #         "rule_groups": ", ".join(source.get("rule", {}).get("groups", []))
        #     }
        hits = data.get("hits", {}).get("hits", [])

        alerts = []

        for hit in hits:
            source = hit.get("_source", {})
            alert = {
                "severity": source.get("rule", {}).get("level"),
                "alert_description": source.get("rule", {}).get("description"),
                "time": source.get("@timestamp"),
                "host_name": source.get("predecoder", {}).get("hostname"),
                "agent_name": source.get("agent", {}).get("name"),
                "rule_groups": ", ".join(source.get("rule", {}).get("groups", []))
            }
            alerts.append(alert)
        # === 3. Last 24hr Alerts ===
        now = datetime.utcnow()
        time_filter = (now - timedelta(hours=24)).isoformat() + "Z"

        last_24hr_query = {
            "size": 0,
            "query": {
                "range": {
                    "timestamp": {
                        "gte": time_filter,
                        "lte": now.isoformat() + "Z"
                    }
                }
            },
            "aggs": {
                "severity": {
                    "range": {
                        "field": "rule.level",
                        "ranges": [
                            {"key": "Info", "to": 7},
                            {"key": "Minor", "from": 7, "to": 11},
                            {"key": "Major", "from": 11, "to": 13},
                            {"key": "Critical", "from": 13}
                        ]
                    }
                }
            }
        }

        recent_res = requests.post(
            f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
            auth=(INDEXER_USER, INDEXER_PASS),
            verify=False,
            json=last_24hr_query
        ).json()

        # Last 24hr severity aggregation
        severity_buckets = recent_res.get("aggregations", {}).get("severity", {}).get("buckets", [])
        alerts_last_24hr = sum(bucket["doc_count"] for bucket in severity_buckets)
        critical_alerts_last_24hr = next((bucket["doc_count"] for bucket in severity_buckets if bucket["key"] == "Critical"),0)
        High_alerts_last_24hr = next((bucket["doc_count"] for bucket in severity_buckets if bucket["key"] == "Major"),0)
        Medium_alerts_last_24hr = next((bucket["doc_count"] for bucket in severity_buckets if bucket["key"] == "Minor"),0)
        Low_alerts_last_24hr = next((bucket["doc_count"] for bucket in severity_buckets if bucket["key"] == "Info"),0)
        active_agents = agent_summary.get("data", {}).get("connection", {}).get("active", 0)
        wazuh_health = wazuh_health_res.get("data", {}).get("affected_items", [{}])[0].get("status")
        


        return jsonify({
            "total_alerts": total_alerts,
            "alerts_last_24hr": alerts_last_24hr,
            "critical_alerts": critical_alerts_last_24hr,
            "high_alerts": High_alerts_last_24hr,
            "medium_alerts": Medium_alerts_last_24hr,
            "low_alerts": Low_alerts_last_24hr,
            "open_tickets": 0,  # Placeholder
            "resolved_today": 0,  # Placeholder
            "avg_response_time": "0s",  # Placeholder
            "compliance_score": str(compliance_score)+"%",
            "active_agents": active_agents,
            "wazuh_health": wazuh_health,
            "alerts" : alerts
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/severity-summary", methods=["GET"])
def severity_summary():
    try:
        query = {
            "size": 0,
            "aggs": {
                "severity": {
                    "range": {
                        "field": "rule.level",
                        "ranges": [
                            {"key": "Low", "to": 6},
                            {"key": "Medium", "from": 6, "to": 12},
                            {"key": "High", "from": 12, "to": 15},
                            {"key": "Critical", "from": 15}
                        ]
                    }
                }
            }
        }


        headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

        res = requests.post(
            f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search",
            headers=headers,
            json=query,
            verify=False,
            auth=(INDEXER_USER, INDEXER_PASS)
        )
        res.raise_for_status()
        return jsonify(res.json())

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)

# from flask import Flask, jsonify
# from flask_cors import CORS
# import os
# import requests
# import base64
# import time
# from datetime import datetime, timedelta
# from dotenv import load_dotenv
# from requests.packages.urllib3.exceptions import InsecureRequestWarning
# import json

# # Load environment variables
# load_dotenv()

# # Suppress warnings for self-signed certs
# requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

# # Flask setup
# app = Flask(__name__)
# CORS(app)

# # Configuration
# PORT = int(os.getenv("PORT", 4000))
# WAZUH_HOST = os.getenv("WAZUH_HOST")  # e.g., https://192.168.1.12:55000
# WAZUH_USER = os.getenv("WAZUH_USER")
# WAZUH_PASS = os.getenv("WAZUH_PASS")
# INDEXER_HOST = os.getenv("INDEXER_HOST")  # e.g., https://192.168.1.12:9200
# INDEXER_USER = os.getenv("INDEXER_USER")
# INDEXER_PASS = os.getenv("INDEXER_PASS")

# # Token cache
# cached_token = None
# token_expiry_time = 0

# # Function: Get Wazuh Token
# def get_wazuh_token():
#     global cached_token, token_expiry_time

#     current_time = time.time()
#     if not cached_token or current_time >= token_expiry_time - 30:
#         print("[i] Renewing Wazuh token...")

#         auth_string = f"{WAZUH_USER}:{WAZUH_PASS}"
#         auth_encoded = base64.b64encode(auth_string.encode()).decode()

#         headers = {
#             "Authorization": f"Basic {auth_encoded}",
#             "Accept": "application/json"
#         }

#         response = requests.post(f"{WAZUH_HOST}/security/user/authenticate", headers=headers, verify=False)
#         data = response.json()

#         if data.get("error") != 0 or not data.get("data", {}).get("token"):
#             raise Exception("Wazuh authentication failed")

#         cached_token = data["data"]["token"]
#         token_expiry_time = current_time + 900
#         print("[✓] Token acquired")

#     return cached_token

# # @app.route("/manager-stats", methods=["GET"])
# # def manager_stats():
# #     try:
# #         token = get_wazuh_token()
# #         headers = {"Authorization": f"Bearer {token}", "Accept": "application/json"}

# #         res = requests.get(f"{WAZUH_HOST}/manager/stats", headers=headers, verify=False)
# #         res.raise_for_status()
# #         return jsonify(res.json())
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # @app.route("/agent-summary", methods=["GET"])
# # def agent_summary():
# #     try:
# #         token = get_wazuh_token()
# #         headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# #         res = requests.get(f"{WAZUH_HOST}/agents/summary/status?pretty=true", headers=headers, verify=False)
# #         res.raise_for_status()
# #         return jsonify(res.json())
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # @app.route("/agent-overview", methods=["GET"])
# # def agent_overview():
# #     try:
# #         token = get_wazuh_token()
# #         headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# #         res = requests.get(f"{WAZUH_HOST}/overview/agents", headers=headers, verify=False)
# #         res.raise_for_status()
# #         return jsonify(res.json())
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # @app.route("/api-info", methods=["GET"])
# # def api_info():
# #     try:
# #         token = get_wazuh_token()
# #         headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# #         res = requests.get(f"{WAZUH_HOST}/", headers=headers, verify=False)
# #         res.raise_for_status()
# #         return jsonify(res.json())
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # @app.route("/agents", methods=["GET"])
# # def agents():
# #     try:
# #         token = get_wazuh_token()
# #         headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

# #         res = requests.get(f"{WAZUH_HOST}/agents", headers=headers, verify=False)
# #         res.raise_for_status()
# #         return jsonify(res.json())
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # @app.route("/alerts", methods=["GET"])
# # def alerts():
# #     try:
# #         query = {
# #             "size": 10000,
# #             "query": {"match_all": {}},
# #             "sort": [{"timestamp": {"order": "desc"}}]
# #         }

# #         headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

# #         res = requests.post(
# #             f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search?scroll=5m",
# #             headers=headers,
# #             json=query,
# #             verify=False,
# #             auth=(INDEXER_USER, INDEXER_PASS)
# #         )
# #         res.raise_for_status()
# #         data = res.json()

# #         with open("alerts.log", "w") as f:
# #             json.dump(data, f, indent=4)

# #         return jsonify({"message": "Alerts saved to alerts.log"})

# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# @app.route("/severity-summary", methods=["GET"])
# def severity_summary():
#     try:
#         now = datetime.utcnow()
#         time_filter = (now - timedelta(hours=24)).isoformat() + "Z"

#         query = {
#             "size": 0,
#             "query": {
#                 "range": {
#                     "timestamp": {
#                         "gte": time_filter,
#                         "lte": now.isoformat() + "Z"
#                     }
#                 }
#             },
#             "aggs": {
#                 "severity": {
#                     "range": {
#                         "field": "rule.level",
#                         "ranges": [
#                             {"key": "Low", "to": 6},
#                             {"key": "Medium", "from": 6, "to": 12},
#                             {"key": "High", "from": 12, "to": 14},
#                             {"key": "Critical", "from": 14}
#                         ]
#                     }
#                 }
#             }
#         }


#         headers = {'Content-Type': 'application/json', 'Accept': 'application/json'}

#         res = requests.post(
#             f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search",
#             headers=headers,
#             json=query,
#             verify=False,
#             auth=(INDEXER_USER, INDEXER_PASS)
#         )
#         res.raise_for_status()
#         return jsonify(res.json())

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# @app.route('/dashboard-metrics')
# def dashboard_metrics():
#     try:
#         token = get_wazuh_token()

#         # Fetch agent-summary
#         agent_summary = requests.get(f"{WAZUH_HOST}/agents/summary/status", headers={
#             "Authorization": f"Bearer {token}",
#             "Accept": "application/json"
#         }, verify=False).json()

#         # Fetch severity summary
#         severity_summary = requests.post(
#             f"{INDEXER_HOST}/wazuh-alerts-4.x-*/_search",
#             headers={"Content-Type": "application/json", "Accept": "application/json"},
#             auth=(os.getenv('INDEXER_USER'), os.getenv('INDEXER_PASS')),
#             verify=False,
#             json={
#                 "size": 0,
#                 "query": {
#                     "range": {
#                         "timestamp": {
#                             "gte": (datetime.utcnow() - timedelta(hours=24)).isoformat() + "Z",
#                             "lte": datetime.utcnow().isoformat() + "Z"
#                         }
#                     }
#                 },
#                 "aggs": {
#                     "severity": {
#                         "range": {
#                             "field": "rule.level",
#                             "ranges": [
#                                 {"key": "Low", "to": 6},
#                                 {"key": "Medium", "from": 6, "to": 12},
#                                 {"key": "High", "from": 12, "to": 14},
#                                 {"key": "Critical", "from": 14}
#                             ]
#                         }
#                     }
#                 }
#             }
#         ).json()

#         # Compose dashboard metrics
#         severity_buckets = severity_summary.get("aggregations", {}).get("severity", {}).get("buckets", [])
#         total_alerts = severity_summary.get("hits", {}).get("total", {}).get("value", 0)
#         alerts_last_24hr = sum(bucket["doc_count"] for bucket in severity_buckets)
#         critical_alerts = next((b["doc_count"] for b in severity_buckets if b["key"] == "Critical"), 0)
#         active_agents = agent_summary.get("data", {}).get("connection", {}).get("active", 0)

#         return jsonify({
#             "total_alerts": total_alerts,
#             "alerts_last_24hr": alerts_last_24hr,
#             "critical_alerts": critical_alerts,
#             "open_tickets": 0,  # Placeholder
#             "resolved_today": 0,  # Placeholder
#             "avg_response_time": "0s",  # Placeholder
#             "compliance_score": "100%",  # Static/default
#             "active_agents": active_agents
#         })

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=PORT)
