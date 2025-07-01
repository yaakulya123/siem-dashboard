'use client'

import { Dashboard } from '@/components/dashboard/dashboard'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { SeverityDonut } from '@/components/dashboard/severity-donut'
import { LiveAlertsTable } from '@/components/alerts/live-alerts-table'
import { RecentTickets } from '@/components/tickets/recent-tickets'

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Security Dashboard
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Real-time security monitoring and incident management overview
        </p>
      </div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Severity Donut Chart */}
        <div className="lg:col-span-1">
          <SeverityDonut />
        </div>
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Latest security events and system updates
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {[
                  { type: 'Critical Alert', message: 'Multiple failed login attempts detected', time: '2 minutes ago', severity: 'critical' },
                  { type: 'System Update', message: 'Wazuh agent updated on server-01', time: '15 minutes ago', severity: 'info' },
                  { type: 'Policy Violation', message: 'Unauthorized file access attempt', time: '1 hour ago', severity: 'high' },
                  { type: 'Compliance Check', message: 'ISO 27001 audit completed successfully', time: '2 hours ago', severity: 'info' },
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.severity === 'critical' ? 'bg-red-500' :
                      activity.severity === 'high' ? 'bg-orange-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.type}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {activity.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Alerts and Tickets */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <LiveAlertsTable />
        <RecentTickets />
      </div>
    </div>
  )
} 