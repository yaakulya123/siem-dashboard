'use client'

import { 
  ExclamationTriangleIcon, 
  TicketIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ChartBarIcon,
  ServerIcon
} from '@heroicons/react/24/outline'

const stats = [
  { 
    name: 'Total Alerts (All-time)', 
    value: '12,847', 
    change: '+12%', 
    changeType: 'increase',
    icon: ExclamationTriangleIcon,
    color: 'text-blue-600 dark:text-blue-400'
  },
  { 
    name: 'Alerts Last 24h', 
    value: '47', 
    change: '-8%', 
    changeType: 'decrease',
    icon: ClockIcon,
    color: 'text-green-600 dark:text-green-400'
  },
  { 
    name: 'Critical Alerts', 
    value: '3', 
    change: '+2', 
    changeType: 'increase',
    icon: ExclamationTriangleIcon,
    color: 'text-red-600 dark:text-red-400'
  },
  { 
    name: 'Open Tickets', 
    value: '15', 
    change: '-3', 
    changeType: 'decrease',
    icon: TicketIcon,
    color: 'text-orange-600 dark:text-orange-400'
  },
  { 
    name: 'Resolved Today', 
    value: '8', 
    change: '+5', 
    changeType: 'increase',
    icon: ShieldCheckIcon,
    color: 'text-green-600 dark:text-green-400'
  },
  { 
    name: 'Avg Response Time', 
    value: '4.2m', 
    change: '-1.3m', 
    changeType: 'decrease',
    icon: ChartBarIcon,
    color: 'text-purple-600 dark:text-purple-400'
  },
  { 
    name: 'Compliance Score', 
    value: '94%', 
    change: '+2%', 
    changeType: 'increase',
    icon: ShieldCheckIcon,
    color: 'text-green-600 dark:text-green-400'
  },
  { 
    name: 'Active Agents', 
    value: '127', 
    change: '+3', 
    changeType: 'increase',
    icon: ServerIcon,
    color: 'text-blue-600 dark:text-blue-400'
  },
]

export function StatsOverview() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item) => (
        <div
          key={item.name}
          className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 px-4 pb-12 pt-5 shadow-sm border border-gray-200 dark:border-gray-700 sm:px-6 sm:pt-6 hover:shadow-md transition-shadow"
        >
          <dt>
            <div className={`absolute rounded-md p-3 ${item.color} bg-opacity-10`}>
              <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.name}
            </p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {item.value}
            </p>
            <p
              className={`ml-2 flex items-baseline text-sm font-semibold ${
                item.changeType === 'increase'
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
            <div className="absolute inset-x-0 bottom-0 bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
              <div className="text-sm">
                <a href="#" className={`font-medium ${item.color} hover:opacity-80`}>
                  View details<span className="sr-only"> for {item.name}</span>
                </a>
              </div>
            </div>
          </dd>
        </div>
      ))}
    </div>
  )
} 