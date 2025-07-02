'use client'

import { useState } from 'react'
import { LiveAlertsTable } from '@/components/alerts/live-alerts-table'
import { StatsOverview } from '@/components/dashboard/stats-overview'

export default function AlertsPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Live Alerts
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Monitor and manage security alerts in real-time
        </p>
      </div>

      {/* Quick Stats */}
      <StatsOverview />

      {/* Main Alerts Table */}
      <LiveAlertsTable />
    </div>
  )
} 