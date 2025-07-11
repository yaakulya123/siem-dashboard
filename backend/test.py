import requests
import json

# Configuration
WAZUH_API_URL = "https://192.168.29.187:55000"
USERNAME = "wazuh"
PASSWORD = "*XZSX+JC.Ag3Ii*J45pC43GOsyXhFSkr"

# Get authentication token
auth_response = requests.get(
    f"{WAZUH_API_URL}/security/user/authenticate?raw=true",
    auth=(USERNAME, PASSWORD),
    verify=False
)
token = auth_response.text

# Get SCA compliance for an agent
headers = {"Authorization": f"Bearer {token}"}
agent_id = "001"  # Replace with your agent ID

sca_response = requests.get(
    f"{WAZUH_API_URL}/sca/{agent_id}",
    headers=headers,
    verify=False
)

compliance_data = sca_response.json()

# Calculate compliance score
for policy in compliance_data['data']['affected_items']:
    total_checks = policy['pass'] + policy['fail'] + policy['invalid']
    compliance_score = (policy['pass'] / total_checks) * 100 if total_checks > 0 else 0
    print(f"Policy: {policy['name']}")
    print(f"Compliance Score: {compliance_score:.2f}%")
    print(f"Pass: {policy['pass']}, Fail: {policy['fail']}, Invalid: {policy['invalid']}")
    print("-" * 50)