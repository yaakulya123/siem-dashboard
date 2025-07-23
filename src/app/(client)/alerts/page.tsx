'use client'

import { useState, useEffect } from 'react'
import { LiveAlertsTable } from '@/components/alerts/live-alerts-table'
// import { StatsOverview } from '@/components/dashboard/stats-overview'
import { ArrowPathIcon } from '@heroicons/react/24/outline'


export default function AlertsPage() {
  const [isClient, setIsClient] = useState(false)
  const [statsData, setStatsData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:4000/alerts')
      const data = await res.json()
      setStatsData(data)
    } catch (err) {
      console.error('[✗] Error fetching alerts:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setIsClient(true)
    fetchStats() // initial fetch
  }, [])

  // Fetch on browser refresh
  useEffect(() => {
    const handleRefresh = () => fetchStats()
    window.addEventListener('beforeunload', handleRefresh)
    return () => window.removeEventListener('beforeunload', handleRefresh)
  }, [])

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
          {/* <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span> */}
          <button
            onClick={fetchStats}
            className="inline-flex ml-4 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            disabled={loading}
          >
            <ArrowPathIcon className="w-4 h-4 mr-2" />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Main Alerts Table */}
      <div className="card-gradient p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Activity</h2>
        {isClient && statsData?.alerts && <LiveAlertsTable alerts={statsData.alerts} />}
      </div>
    </div>
  )
}