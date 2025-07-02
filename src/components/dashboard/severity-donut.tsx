'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

const data = [
  { name: 'Critical', value: 3, color: '#dc2626', gradient: 'url(#criticalGradient)' },
  { name: 'High', value: 12, color: '#ea580c', gradient: 'url(#highGradient)' },
  { name: 'Medium', value: 18, color: '#ca8a04', gradient: 'url(#mediumGradient)' },
  { name: 'Low', value: 8, color: '#3b82f6', gradient: 'url(#lowGradient)' },
  { name: 'Info', value: 6, color: '#6b7280', gradient: 'url(#infoGradient)' },
]

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, percent
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      fontSize="14"
      fontWeight="700"
      className="drop-shadow-lg"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white dark:bg-gray-800 px-4 py-3 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full ring-2 ring-white dark:ring-gray-800"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-gray-900 dark:text-white">
            {data.name}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">{data.value}</span> alerts
        </div>
      </div>
    )
  }
  return null
}

export function SeverityDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-2 h-2 bg-white rounded-full mr-3 animate-pulse"></div>
          Severity Distribution
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Last 24 hours • {total} total alerts
        </p>
      </div>
      
      <div className="p-6">
        <div className="h-80 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {/* Gradient definitions for each severity level */}
                <linearGradient id="criticalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#dc2626', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#991b1b', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ea580c', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#c2410c', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#ca8a04', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#a16207', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#1d4ed8', stopOpacity: 1 }} />
                </linearGradient>
                <linearGradient id="infoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#6b7280', stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: '#4b5563', stopOpacity: 1 }} />
                </linearGradient>
              </defs>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                innerRadius={50}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.gradient}
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth={1}
                    className="hover:brightness-110 transition-all duration-300 drop-shadow-md"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text with animation */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white animate-pulse">
                {total}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                Total Alerts
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Legend with hover effects */}
        <div className="mt-6 space-y-3">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1)
            return (
              <div 
                key={item.name} 
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 cursor-pointer group"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm group-hover:scale-110 transition-transform duration-200"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {percentage}%
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-800 px-2 py-1 rounded-md text-sm shadow-sm">
                    {item.value}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Status indicator */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Real-time monitoring active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 