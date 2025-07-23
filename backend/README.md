# Wazuh SIEM Dashboard Backend

## Setup Instructions

1. **Create an `.env` file**

   In the `backend` folder, create a file named `.env` and fill in the following details:

   ```
   PORT=4000

   # Wazuh Manager API
   WAZUH_HOST=https://<wazuh-ip>:55000
   WAZUH_USER=wazuh
   WAZUH_PASS=<Manager-password>

   # Wazuh Indexer (Elasticsearch)
   INDEXER_HOST=https://<wazuh-ip>:9200
   INDEXER_USER=admin
   INDEXER_PASS=<Indexer-password>
   ```

   Replace `<wazuh-ip>`, `<Manager-password>`, and `<Indexer-password>` with your actual Wazuh server and indexer credentials.

2. **Install dependencies**

   Run the following command in the `backend` directory:

   ```
   npm install
   ```

3. **Start the backend server**

   ```
   node server.js
   ```

   The backend will run on the port specified in your `.env` file (default: 4000).

---

**Note:**

- Keep your `.env` file secure and do not commit it to version control.
- Make sure your Wazuh Manager and Indexer are accessible from the machine running this backend.

---
