# SOC-as-a-Service Dashboard

A beautiful, modern **SOC-as-a-Service platform** with separate interfaces for clients and SOC managers. Built with Next.js, React, and TypeScript, this solution provides a white-labeled frontend for Wazuh SIEM without exposing the underlying technology to clients.

## Architecture

This platform has two distinct interfaces:

### 1. Client Interface (`/`)
The client-facing dashboard where organizations can monitor their security posture without seeing that Wazuh powers the backend.

### 2. SOC Manager Interface (`/manager`)
A dedicated interface for SOC team members to manage multiple client instances, view analytics, and oversee operations.

## Features

### Client Interface Features

#### Dashboard "At a Glance"
- **Purpose**: Clients need instant health check
- **Features**: 
  - Total alerts (all-time) & last 24h
  - Severity donut chart (Critical alerts highlighted)
  - System health indicators
  - Real-time metrics

#### Live Alerts Table
- **Purpose**: Client security teams want to spot anything burning
- **Features**:
  - Last 100 alerts with auto-refresh
  - Columns: Severity, Time, Host/Agent, Rule title
  - Row actions: Create Ticket (if none exists)
  - Real-time updates every 30 seconds

#### Ticket Pane
- **Purpose**: Traceability & accountability
- **Features**:
  - Ticket list with status chips (Open/In Progress/Closed)
  - Link out to Jira/ServiceNow
  - "Close ticket" button functionality
  - Assignment and due date tracking

#### Scheduled PDF Reports
- **Purpose**: Stakeholders love e-mail summaries
- **Features**:
  - Toggle weekly PDF digest (alert counts, top hosts, SLA metrics)
  - Automated report generation
  - Email distribution lists
  - Custom report templates

#### Compliance Snapshot
- **Purpose**: Auditors ask "Are we ISO 27001 OK?"
- **Features**:
  - Card showing % of mapped rules triggered per control family
  - Button to export CSV evidence list
  - Multiple framework support (ISO 27001, SOC 2, PCI-DSS, HIPAA, GDPR)
  - Compliance status tracking

### SOC Manager Interface Features

#### Client Overview
- **Purpose**: Manage multiple client security operations
- **Features**:
  - Client organization cards with status indicators
  - Key metrics per client (alerts, endpoints, uptime)
  - Quick access to client-specific management
  - Service plan information

#### Analytics
- **Purpose**: Business and security intelligence
- **Features**:
  - Cross-client metrics and trends
  - Resource utilization tracking
  - Performance analytics
  - Business insights

#### Team Management
- **Purpose**: Manage SOC analysts and teams
- **Features**:
  - Analyst assignment and workload management
  - Team performance metrics
  - Skill tracking and specialization
  - Resource allocation

#### Billing & Plans
- **Purpose**: Service plan management
- **Features**:
  - Client subscription details
  - Service tier management
  - Usage tracking
  - Billing information

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts for data visualization
- **State Management**: Zustand (ready for integration)
- **Theme**: Custom dark/light mode support
- **Notifications**: React Hot Toast

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIEM_Data
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the interfaces**
   - Client Interface: [http://localhost:3000](http://localhost:3000)
   - SOC Manager Interface: [http://localhost:3000/manager](http://localhost:3000/manager)

## Project Structure

The project uses Next.js App Router with route groups for clean separation:

```
src/
  app/
    (client)/     # Client interface routes
      dashboard/
      alerts/
      tickets/
      reports/
      compliance/
      users/
      layout.tsx  # Client-specific layout with sidebar
    
    manager/      # SOC Manager interface routes
      layout.tsx  # Manager-specific layout
      page.tsx    # Client overview dashboard
  
  components/
    layout/
      sidebar.tsx         # Client sidebar
      manager-sidebar.tsx # Manager sidebar
      header.tsx          # Client header
      manager-header.tsx  # Manager header
```

## White-Labeling

This solution is designed as a white-labeled SOC-as-a-Service platform:
- Clients see only their branded interface
- No mention of Wazuh or backend SIEM technology
- Customizable branding per client
- Consistent user experience

## Integration Ready

This frontend is designed to integrate with:
- **Wazuh**: Security monitoring and alerting (hidden from clients)
- **Elasticsearch**: Data storage and search
- **Ticketing Systems**: Jira, ServiceNow
- **Identity Providers**: SAML, OIDC, OAuth
- **Email Services**: Report distribution

## Next Steps

To make this production-ready:
1. **API Integration**: Connect to real Wazuh and other backend services
2. **Authentication**: Implement user authentication system
3. **Database**: Set up persistent storage for client configurations
4. **Real-time Updates**: Implement WebSocket connections for live updates
5. **Multi-tenancy**: Enhance client isolation and data segregation
6. **Deployment**: Set up CI/CD pipeline and hosting

## License

This project is part of the Codec Networks SOC-as-a-Service solution.

---

**Built with love for modern security operations centers** 