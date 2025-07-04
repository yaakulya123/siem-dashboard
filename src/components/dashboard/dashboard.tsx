'use client'

import { StatsOverview } from './stats-overview'
import { SeverityDonut } from './severity-donut'
import { AttackMap } from './attack-map'

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
        <div className="card-gradient p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Severity Distribution</h2>
          <SeverityDonut />
        </div>
        <div className="card-gradient p-6 rounded-xl">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            System Health
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="status-dot active"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Wazuh Manager</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-400 border border-green-200/50 dark:border-green-800/30 shadow-sm">
                Healthy
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="status-dot active"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Elasticsearch</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 text-green-800 dark:text-green-400 border border-green-200/50 dark:border-green-800/30 shadow-sm">
                Running
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="status-dot warning"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kibana</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-100 to-yellow-50 dark:from-yellow-900/30 dark:to-yellow-800/20 text-yellow-800 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-800/30 shadow-sm">
                Warning
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700/30">
              <div className="flex items-center space-x-3">
                <div className="status-dot active"></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Engine</span>
              </div>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-800 dark:text-blue-400 border border-blue-200/50 dark:border-blue-800/30 shadow-sm">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 