# Modern SIEM Dashboard – Client Interface

A beautiful, modern **client (frontend) interface** for Wazuh and other SIEM integrations, built with Next.js, React, and TypeScript. This repository contains only the frontend layer for interacting with SIEM data and services.

## Features

This SIEM dashboard includes all the components from your requirements:

### Dashboard "At a Glance"
- **Purpose**: Executives need instant health check
- **Features**: 
  - Total alerts (all-time) & last 24h
  - Severity donut chart (Critical alerts highlighted)
  - System health indicators
  - Real-time metrics

### Live Alerts Table
- **Purpose**: Ops/SecOps wants to spot anything burning
- **Features**:
  - Last 100 alerts with auto-refresh
  - Columns: Severity, Time, Host/Agent, Rule title
  - Row actions: Create Ticket (if none exists)
  - Real-time updates every 30 seconds

### Ticket Pane
- **Purpose**: Traceability & accountability
- **Features**:
  - Ticket list with status chips (Open/In Progress/Closed)
  - Link out to Jira/ServiceNow
  - "Close ticket" button functionality
  - Assignment and due date tracking

### Scheduled PDF Reports
- **Purpose**: Stakeholders love e-mail summaries
- **Features**:
  - Toggle weekly PDF digest (alert counts, top hosts, SLA metrics) per tenant
  - Automated report generation
  - Email distribution lists
  - Custom report templates

### Compliance Snapshot
- **Purpose**: Auditors ask "Are we ISO 27001 OK?"
- **Features**:
  - Card showing % of mapped Wazuh rules triggered per control family
  - Button to export CSV evidence list
  - Multiple framework support (ISO 27001, SOC 2, PCI-DSS, HIPAA, GDPR)
  - Compliance status tracking

### User & Role Admin
- **Purpose**: Least-privilege self-service
- **Features**:
  - Invite users and assign roles (Admin/Analyst/Viewer)
  - Role-based permissions matrix
  - User activity tracking
  - Account management

### Branding & Theming
- **Purpose**: White-label requirement
- **Features**:
  - Customer logo upload
  - Light/dark toggle
  - "Powered by Codec Networks" footer
  - Custom color schemes
  - Company information customization

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

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Responsive Design

The dashboard is fully responsive and works beautifully on:
- Desktop computers
- Laptops
- Tablets
- Mobile devices

## Key Components

### Navigation
- **Sidebar**: Fixed navigation with system status indicators
- **Header**: Search, notifications, theme toggle, user profile
- **Responsive**: Collapsible on mobile devices

### Dashboard Pages
1. **Home** (`/`) - Main security dashboard overview
2. **Live Alerts** (`/alerts`) - Real-time alert monitoring
3. **Tickets** (`/tickets`) - Incident management
4. **Reports** (`/reports`) - Scheduled PDF reports
5. **Compliance** (`/compliance`) - Framework compliance tracking
6. **Users** (`/users`) - User and role administration
7. **Branding** (`/branding`) - White-label customization

### Design System
- **Colors**: Custom severity-based color palette
- **Typography**: Inter font for optimal readability
- **Components**: Consistent design patterns
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: WCAG compliant design

## Integration Ready

This frontend is designed to integrate with:
- **Wazuh**: Security monitoring and alerting
- **Elasticsearch**: Data storage and search
- **Kibana**: Data visualization
- **Ticketing Systems**: Jira, ServiceNow
- **Identity Providers**: SAML, OIDC, OAuth
- **Email Services**: Report distribution

## Customization

The dashboard supports extensive customization:
- **Branding**: Upload custom logos and set company information
- **Theming**: Choose from predefined themes or create custom color schemes
- **Content**: Customize dashboard titles, footer text, and labels
- **Features**: Enable/disable specific functionality based on requirements

## Mock Data

The current implementation uses realistic mock data to demonstrate functionality:
- Sample security alerts with various severities
- Example tickets with different statuses
- Compliance rules for multiple frameworks
- User accounts with different roles
- Report templates and schedules

## Next Steps

To make this production-ready:
1. **API Integration**: Connect to real Wazuh and other backend services
2. **Authentication**: Implement actual SSO/MFA integration
3. **Database**: Set up persistent storage for configurations
4. **Real-time Updates**: Implement WebSocket connections for live updates
5. **Testing**: Add comprehensive test coverage
6. **Deployment**: Set up CI/CD pipeline and hosting

## License

This project is part of the Codec Networks SIEM solution.

---

**Built with love for modern security operations centers** 