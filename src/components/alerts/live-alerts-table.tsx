'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface Alert {
  id: string
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info'
  title: string
  timestamp: string
  host: string
  agent: string
  rule: string
  status: 'open' | 'investigating' | 'resolved'
}

const mockAlerts: Alert[] = [
  {
    id: 'ALR-001',
    severity: 'critical',
    title: 'Multiple failed login attempts detected',
    timestamp: '2 minutes ago',
    host: 'server-01',
    agent: 'wazuh-agent-01',
    rule: 'Authentication failure',
    status: 'open'
  },
  {
    id: 'ALR-002',
    severity: 'high',
    title: 'Suspicious file modification in /etc',
    timestamp: '5 minutes ago',
    host: 'web-server-03',
    agent: 'wazuh-agent-03',
    rule: 'File integrity monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-003',
    severity: 'medium',
    title: 'High CPU usage detected',
    timestamp: '12 minutes ago',
    host: 'db-server-02',
    agent: 'wazuh-agent-02',
    rule: 'System monitoring',
    status: 'open'
  },
  {
    id: 'ALR-004',
    severity: 'low',
    title: 'User logged in from new location',
    timestamp: '25 minutes ago',
    host: 'app-server-01',
    agent: 'wazuh-agent-01',
    rule: 'Geographic anomaly',
    status: 'resolved'
  },
  {
    id: 'ALR-005',
    severity: 'info',
    title: 'System backup completed successfully',
    timestamp: '1 hour ago',
    host: 'backup-server',
    agent: 'wazuh-agent-04',
    rule: 'System events',
    status: 'resolved'
  }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'severity-critical'
    case 'high': return 'severity-high'
    case 'medium': return 'severity-medium'
    case 'low': return 'severity-low'
    case 'info': return 'severity-info'
    default: return 'severity-info'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'severity-critical'
    case 'investigating': return 'severity-medium'
    case 'resolved': return 'severity-low'
    default: return 'severity-info'
  }
}

export function LiveAlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date())
      // In a real app, this would fetch fresh data
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const createTicket = (alertId: string) => {
    // In a real app, this would create a ticket in the ticketing system
    console.log(`Creating ticket for alert ${alertId}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="status-dot active"></div>
          <span className="text-sm font-medium text-green-600 dark:text-green-400">Live monitoring</span>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      </div>

      <div className="overflow-x-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-md">
        <table className="min-w-full divide-y divide-gray-200/70 dark:divide-gray-700/30">
          <thead className="bg-gray-50/80 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Alert
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Host/Agent
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rule
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 dark:divide-gray-700/30">
            {alerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    getSeverityColor(alert.severity)
                  )}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {alert.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ID: {alert.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {alert.timestamp}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="font-medium">{alert.host}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{alert.agent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {alert.rule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    getStatusColor(alert.status)
                  )}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {alert.status === 'open' && (
                    <button
                      onClick={() => createTicket(alert.id)}
                      className="inline-flex items-center px-3 py-1.5 border border-blue-200 dark:border-blue-800/50 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors duration-150 shadow-sm"
                    >
                      <UserIcon className="w-3.5 h-3.5 mr-1.5" />
                      Create Ticket
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 