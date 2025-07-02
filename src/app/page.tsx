'use client'

import { Dashboard } from '@/components/dashboard/dashboard'
import { StatsOverview } from '@/components/dashboard/stats-overview'
import { SeverityDonut } from '@/components/dashboard/severity-donut'
import { LiveAlertsTable } from '@/components/alerts/live-alerts-table'
import { RecentTickets } from '@/components/tickets/recent-tickets'
import { AttackMap } from '@/components/dashboard/attack-map'
import { ShieldExclamationIcon, GlobeAltIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

const threatIntelligence = [
  {
    id: '1',
    title: 'APT29 Campaign Detected',
    severity: 'critical',
    description: 'Advanced persistent threat targeting government infrastructure',
    indicators: ['185.159.158.xxx', 'malware.exe', 'C2-domain.com'],
    timestamp: '2 minutes ago',
    countries: ['Russia', 'United States', 'Germany'],
  },
  {
    id: '2',
    title: 'Ransomware Family: BlackCat',
    severity: 'high',
    description: 'New variant detected with improved encryption methods',
    indicators: ['SHA256: abc123...', 'Port 445 exploitation'],
    timestamp: '15 minutes ago',
    countries: ['Ukraine', 'Poland', 'Czech Republic'],
  },
  {
    id: '3',
    title: 'Phishing Campaign Wave',
    severity: 'medium',
    description: 'Large-scale phishing targeting financial institutions',
    indicators: ['fake-bank-login.com', 'credential harvesting'],
    timestamp: '1 hour ago',
    countries: ['China', 'United Kingdom', 'Australia'],
  },
]

const geopoliticalThreats = [
  {
    region: 'Eastern Europe',
    level: 'High',
    activities: ['State-sponsored attacks', 'Infrastructure targeting'],
    color: 'red',
  },
  {
    region: 'Southeast Asia',
    level: 'Medium',
    activities: ['Financial fraud', 'Cryptocurrency theft'],
    color: 'yellow',
  },
  {
    region: 'North America',
    level: 'Low',
    activities: ['Routine scanning', 'Bot activity'],
    color: 'blue',
  },
]

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

      {/* Global Threat Intelligence Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Global Threat Intelligence
            </h2>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              Real-time monitoring of global cyber threats and attack patterns
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Live monitoring active
            </span>
          </div>
        </div>

        {/* Attack Map */}
        <AttackMap />

        {/* Threat Intelligence Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Threat Intelligence */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Active Threat Intelligence
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {threatIntelligence.map((threat) => (
                <div
                  key={threat.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {threat.title}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      threat.severity === 'critical' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      threat.severity === 'high' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {threat.description}
                  </p>
                  
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Indicators of Compromise:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {threat.indicators.map((indicator, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded font-mono"
                        >
                          {indicator}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <GlobeAltIcon className="h-3 w-3 mr-1" />
                      {threat.countries.join(', ')}
                    </div>
                    <span className="text-gray-500 dark:text-gray-400">
                      {threat.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Geopolitical Threat Assessment */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <ShieldExclamationIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Geopolitical Threat Assessment
                </h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {geopoliticalThreats.map((threat, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {threat.region}
                    </h4>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      threat.color === 'red' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      threat.color === 'yellow' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {threat.level} Risk
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {threat.activities.map((activity, actIndex) => (
                      <div key={actIndex} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                        <div className={`w-2 h-2 rounded-full mr-2 ${
                          threat.color === 'red' ? 'bg-red-500' :
                          threat.color === 'yellow' ? 'bg-yellow-500' :
                          'bg-blue-500'
                        }`}></div>
                        {activity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mx-6 mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Intelligence Update:</strong> Threat landscape shows increased 
                state-sponsored activity in Eastern Europe with focus on critical 
                infrastructure targeting.
              </p>
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