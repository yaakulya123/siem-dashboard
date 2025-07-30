'use client'

import { FC } from 'react'
import {
  ExclamationTriangleIcon,
  ClockIcon,
  ShieldCheckIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

// 1. Add your type definition at the top
export type DashboardMetrics = {
  active_agents: number
  alerts_last_24hr: number
  avg_response_time: string
  compliance_score: number
  critical_alerts: number
  open_tickets: number
  resolved_today: number
  total_alerts: number
}

// 2. Accept `data` as props and use it in your cards
type StatsOverviewProps = {
  data: DashboardMetrics | null
}

export const StatsOverview: FC<StatsOverviewProps> = ({ data }) => {

  if (!data) {
    return <div className="text-sm text-gray-500">Loading stats...</div>
  }

  const stats = [
    {
      name: 'Total Alerts (All-time)',
      value: data.total_alerts,
      change: '+12%',
      changeType: 'increase',
      icon: ExclamationTriangleIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      gradientFrom: 'from-blue-50 dark:from-blue-900/20',
      gradientTo: 'to-blue-100/50 dark:to-blue-800/10',
      borderColor: 'border-blue-200/50 dark:border-blue-800/30',
      viewDetailsLink: '/alerts'
    },
    {
      name: 'Alerts Last 24h',
      value: data.alerts_last_24hr,
      change: '-8%',
      changeType: 'decrease',
      icon: ClockIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      gradientFrom: 'from-orange-50 dark:from-orange-900/20',
      gradientTo: 'to-orange-100/50 dark:to-orange-800/10',
      borderColor: 'border-orange-200/50 dark:border-orange-800/30',
      viewDetailsLink: '/alerts'
    },
    {
      name: 'Compliance Score',
      value: data.compliance_score,
      change: '+2%',
      changeType: 'increase',
      icon: ShieldCheckIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      gradientFrom: 'from-purple-50 dark:from-purple-900/20',
      gradientTo: 'to-purple-100/50 dark:to-purple-800/10',
      borderColor: 'border-purple-200/50 dark:border-purple-800/30',
      viewDetailsLink: '/compliance'
    },
    {
      name: 'Active Agents',
      value: data.active_agents,
      change: '+3',
      changeType: 'increase',
      icon: ServerIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      gradientFrom: 'from-green-50 dark:from-green-900/20',
      gradientTo: 'to-green-100/50 dark:to-green-800/10',
      borderColor: 'border-green-200/50 dark:border-green-800/30',
      viewDetailsLink: '/users'
    },
  ]

  // export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className={`relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 px-5 pb-12 pt-5 shadow-md border ${item.borderColor} hover:shadow-lg transition-all duration-200 sm:px-6 sm:pt-6 backdrop-blur-sm`}
        >
          <dt>
            <div className={`absolute rounded-xl p-3 ${item.bgColor} bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} shadow-sm border ${item.borderColor}`}>
              <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${item.changeType === 'increase'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
                }`}
            >
              {item.changeType === 'increase' ? (
                <svg
                  className="h-5 w-5 flex-shrink-0 self-center text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04L10.75 5.612V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5 flex-shrink-0 self-center text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04L9.25 14.388V3.75A.75.75 0 0110 3z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className="sr-only"> {item.changeType === 'increase' ? 'Increased' : 'Decreased'} by </span>
              {item.change}
            </p>
            <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} px-5 py-3 sm:px-6 border-t ${item.borderColor}`}>
              <div className="text-sm">
                <a href={item.viewDetailsLink} className={`font-medium ${item.color} hover:opacity-80 flex items-center justify-between`}>
                  <span>View details</span>
                  <svg className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                  <span className="sr-only"> for {item.name}</span>
                </a>
              </div>
            </div>
          </dd>
        </div>
      ))}
    </div>
  )
} 