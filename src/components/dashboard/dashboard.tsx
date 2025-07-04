'use client'

import { StatsOverview } from './stats-overview'
import { SeverityDonut } from './severity-donut'
import { AttackMap } from './attack-map'
import { SystemHealth } from './system-health'

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
        </div>
      </div>
      
      <StatsOverview />
      
      {/* Global Threat Map - Full Width */}
      <div className="card-gradient p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Threat Map</h2>
        <AttackMap />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-gradient p-0 rounded-xl overflow-hidden">
          <SeverityDonut />
        </div>
        <div className="card-gradient p-0 rounded-xl overflow-hidden">
          <SystemHealth />
        </div>
      </div>
    </div>
  )
} 