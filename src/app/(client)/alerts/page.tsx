'use client'

import { useState } from 'react'
import { LiveAlertsTable } from '@/components/alerts/live-alerts-table'
import { StatsOverview } from '@/components/dashboard/stats-overview'

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Live Alerts
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Monitor and manage security alerts in real-time
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
        </div>
      </div>

      {/* Quick Stats */}
      <StatsOverview />

      {/* Main Alerts Table */}
      <div className="card-gradient p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Activity</h2>
        <LiveAlertsTable />
      </div>
    </div>
  )
} 