'use client'

import { StatsOverview } from './stats-overview'
import { SeverityDonut } from './severity-donut'
import { AttackMap } from './attack-map'

export function Dashboard() {
  return (
    <div className="space-y-8">
      <StatsOverview />
      
      {/* Global Threat Map - Full Width */}
      <AttackMap />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SeverityDonut />
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Wazuh Manager</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Elasticsearch</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                Running
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Kibana</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                Warning
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 