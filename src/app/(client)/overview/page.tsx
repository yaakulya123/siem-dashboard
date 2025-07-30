'use client';

import { useState } from 'react';
import { 
  BuildingOfficeIcon,
  EyeIcon,
  Cog6ToothIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TicketIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ShieldCheckIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

// Type definitions
interface ClientInstance {
  id: number;
  clientName: string;
  organization: string;
  industry: string;
  status: 'active' | 'warning' | 'maintenance';
  alerts: number;
  analysts: number;
  lastActivity: string;
  uptime: string;
  plan: 'starter' | 'professional' | 'enterprise';
  endpoints: number;
  monthlyAlerts: number;
}

export default function ClientOverview() {
  const [selectedClient, setSelectedClient] = useState<ClientInstance | null>(null);

  // Mock data for client instances
  const clientInstances: ClientInstance[] = [
    {
      id: 1,
      clientName: "TechCorp Solutions",
      organization: "TechCorp Inc.",
      industry: "Technology",
      status: "active",
      alerts: 347,
      analysts: 2,
      lastActivity: "2 minutes ago",
      uptime: "99.8%",
      plan: "enterprise",
      endpoints: 1250,
      monthlyAlerts: 8420
    },
    {
      id: 2,
      clientName: "FinanceSecure",
      organization: "Global Finance Corp",
      industry: "Financial Services",
      status: "active",
      alerts: 189,
      analysts: 3,
      lastActivity: "5 minutes ago",
      uptime: "99.9%",
      plan: "professional",
      endpoints: 890,
      monthlyAlerts: 5230
    },
    {
      id: 3,
      clientName: "HealthGuard Systems",
      organization: "MedTech Healthcare",
      industry: "Healthcare",
      status: "warning",
      alerts: 456,
      analysts: 1,
      lastActivity: "1 minute ago",
      uptime: "98.2%",
      plan: "enterprise",
      endpoints: 2100,
      monthlyAlerts: 12890
    },
    {
      id: 4,
      clientName: "RetailWatch",
      organization: "Global Retail Chain",
      industry: "Retail",
      status: "active",
      alerts: 123,
      analysts: 2,
      lastActivity: "8 minutes ago",
      uptime: "99.5%",
      plan: "professional",
      endpoints: 670,
      monthlyAlerts: 3450
    },
    {
      id: 5,
      clientName: "EduSecure",
      organization: "University Network",
      industry: "Education",
      status: "maintenance",
      alerts: 67,
      analysts: 1,
      lastActivity: "15 minutes ago",
      uptime: "97.8%",
      plan: "starter",
      endpoints: 320,
      monthlyAlerts: 1890
    }
  ];

  const totalClients = clientInstances.length;
  const totalAlerts = clientInstances.reduce((sum, client) => sum + client.alerts, 0);
  const totalAnalysts = clientInstances.reduce((sum, client) => sum + client.analysts, 0);
  const avgUptime = (clientInstances.reduce((sum, client) => sum + parseFloat(client.uptime), 0) / clientInstances.length).toFixed(1);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'maintenance': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 border-green-500/20';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'maintenance': return 'bg-red-500/10 border-red-500/20';
      default: return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'text-purple-400 bg-purple-500/10';
      case 'professional': return 'text-blue-400 bg-blue-500/10';
      case 'starter': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  if (selectedClient) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedClient(null)}
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← Back to Client Overview
        </button>

        {/* Client Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.clientName}</h1>
              <p className="text-gray-600 dark:text-gray-400">{selectedClient.organization} • {selectedClient.industry}</p>
            </div>
            <div className={clsx('px-3 py-1 rounded-full text-sm font-medium border', getStatusBg(selectedClient.status))}>
              <span className={getStatusColor(selectedClient.status)}>
                {selectedClient.status.charAt(0).toUpperCase() + selectedClient.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Client Management Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-left shadow-sm">
            <EyeIcon className="h-8 w-8 text-blue-500 mb-3" />
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">View Client Dashboard</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Access real-time security operations</p>
          </button>

          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 transition-colors text-left shadow-sm">
            <TicketIcon className="h-8 w-8 text-green-500 mb-3" />
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Manage Tickets</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Review and assign security incidents</p>
          </button>

          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors text-left shadow-sm">
            <ChartBarIcon className="h-8 w-8 text-purple-500 mb-3" />
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Analytics & Reports</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Generate security insights</p>
          </button>

          <button className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-500 transition-colors text-left shadow-sm">
            <Cog6ToothIcon className="h-8 w-8 text-yellow-500 mb-3" />
            <h3 className="text-gray-900 dark:text-white font-semibold mb-2">Configuration</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Manage client settings</p>
          </button>
        </div>

        {/* Client Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.alerts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Analysts Online</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.analysts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <ShieldCheckIcon className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Protected Endpoints</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.endpoints}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center gap-3">
              <ClockIcon className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Uptime</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{selectedClient.uptime}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Client Overview</h1>
        <p className="text-gray-600 dark:text-gray-400">Monitor and manage security operations for all clients</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <BuildingOfficeIcon className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Clients</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalClients}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Total Active Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <UserGroupIcon className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Active Analysts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalAnalysts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <CheckCircleIcon className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Average Uptime</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgUptime}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Instances Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Client Security Operations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {clientInstances.map((client) => (
            <div
              key={client.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer shadow-sm"
              onClick={() => setSelectedClient(client)}
            >
              {/* Client Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{client.clientName}</h3>
                  <div className={clsx('px-2 py-1 rounded text-xs font-medium border', getStatusBg(client.status))}>
                    <span className={getStatusColor(client.status)}>
                      {client.status}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{client.organization}</p>
                <p className="text-gray-500 dark:text-gray-500 text-xs">{client.industry}</p>
              </div>

              {/* Client Metrics */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Alerts</span>
                  <span className="text-gray-900 dark:text-white font-medium">{client.alerts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Analysts Online</span>
                  <span className="text-gray-900 dark:text-white font-medium">{client.analysts}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Protected Endpoints</span>
                  <span className="text-gray-900 dark:text-white font-medium">{client.endpoints}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Uptime</span>
                  <span className="text-gray-900 dark:text-white font-medium">{client.uptime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Service Plan</span>
                  <span className={clsx('px-2 py-1 rounded text-xs font-medium capitalize', getPlanColor(client.plan))}>
                    {client.plan}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Last Activity</span>
                  <span className="text-gray-900 dark:text-white font-medium">{client.lastActivity}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-b-lg">
                <div className="flex gap-2">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm transition-colors">
                    View Dashboard
                  </button>
                  <button className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-3 py-2 rounded text-sm transition-colors">
                    <Cog6ToothIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
