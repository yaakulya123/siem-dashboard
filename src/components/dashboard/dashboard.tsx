'use client'

import { useEffect, useState } from 'react'
import { StatsOverview } from './stats-overview'
import { SeverityDonut } from './severity-donut'
import { AttackMap } from './attack-map'
import { SystemHealth } from './system-health'


export function Dashboard() {
  const [isClient, setIsClient] = useState(false)
  useEffect(() => {
    setIsClient(true);
  }, [])

  const [statsData, setStatsData] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {

      try {
        const res = await fetch('http://localhost:4000/dashboard-metrics')
        const data = await res.json()
        setStatsData(data)
        // console.log(data)
      } catch (err) {
        console.error('[✗] Error fetching dashboard metrics:', err)
      }
    }

    fetchStats() // initial fetch
    const interval = setInterval(fetchStats, 3000) // fetch every 3s

    return () => clearInterval(interval) // cleanup
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
        </div>
      </div>

      {isClient && <StatsOverview data={statsData} />}
      {/* <StatsOverview data={statsData} /> */}

      <div className="card-gradient p-6 rounded-xl">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Threat Map</h2>
        <AttackMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card-gradient p-0 rounded-xl overflow-hidden">
          <SeverityDonut data={prepareSeverityData(statsData)} />
        </div>
        <div className="card-gradient p-0 rounded-xl overflow-hidden">
          <SystemHealth />
        </div>
      </div>
    </div>
  )

}

function prepareSeverityData(metrics: any) {
  if (!metrics) return []

  const total = metrics.alerts_last_24hr || 1
  return [
    {
      name: 'Critical',
      value: metrics.critical_alerts,
      color: '#dc2626',
      percentage: parseFloat(((metrics.critical_alerts / total) * 100).toFixed(1)),
    },
    {
      name: 'High',
      value: metrics.high_alerts,
      color: '#ea580c',
      percentage: parseFloat(((metrics.high_alerts / total) * 100).toFixed(1)),
    },
    {
      name: 'Medium',
      value: metrics.medium_alerts,
      color: '#ca8a04',
      percentage: parseFloat(((metrics.medium_alerts / total) * 100).toFixed(1)),
    },
    {
      name: 'Low',
      value: metrics.low_alerts,
      color: '#3b82f6',
      percentage: parseFloat(((metrics.low_alerts / total) * 100).toFixed(1)),
    }
  ]
}



// 'use client'

// import { StatsOverview } from './stats-overview'
// import { SeverityDonut } from './severity-donut'
// import { AttackMap } from './attack-map'
// import { SystemHealth } from './system-health'


// export function Dashboard() {
//   return (
//     <div className="space-y-8">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Security Dashboard</h1>
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-500 dark:text-gray-400">Last updated:</span>
//           <span className="text-sm font-medium text-gray-900 dark:text-white">Just now</span>
//         </div>
//       </div>
      
//       <StatsOverview />
      
//       {/* Global Threat Map - Full Width */}
//       <div className="card-gradient p-6 rounded-xl">
//         <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Global Threat Map</h2>
//         <AttackMap />
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//         <div className="card-gradient p-0 rounded-xl overflow-hidden">
//           <SeverityDonut />
//         </div>
//         <div className="card-gradient p-0 rounded-xl overflow-hidden">
//           <SystemHealth />
//         </div>
//       </div>
//     </div>
//   )
// } 