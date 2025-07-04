'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Critical', value: 3, color: '#dc2626', percentage: 6.4 },
  { name: 'High', value: 12, color: '#ea580c', percentage: 25.5 },
  { name: 'Medium', value: 18, color: '#ca8a04', percentage: 38.3 },
  { name: 'Low', value: 8, color: '#3b82f6', percentage: 17.0 },
  { name: 'Info', value: 6, color: '#6b7280', percentage: 12.8 },
]

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-gray-800/90 backdrop-blur-sm px-4 py-3 rounded-lg shadow-xl border border-gray-700/50">
        <div className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="font-semibold text-white">
            {data.name}
          </span>
        </div>
        <div className="mt-1 text-sm text-gray-300">
          <span className="font-medium">{data.value}</span> alerts ({data.percentage}%)
        </div>
      </div>
    )
  }
  return null
}

export function SeverityDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-sm px-4 py-3 rounded-t-xl">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <h3 className="text-base font-medium text-white">Severity Distribution</h3>
        </div>
        <p className="text-xs text-blue-100/80">
          Last 24 hours • {total} total alerts
        </p>
      </div>
      
      <div className="flex-1 flex flex-col p-4">
        <div className="flex-1 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={55}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="rgba(0,0,0,0.3)"
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">
                {total}
              </div>
              <div className="text-xs text-gray-400">
                Total Alerts
              </div>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 space-y-1">
          {data.map((item) => (
            <div key={item.name} className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-300">{item.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-400">{item.percentage}%</span>
                <span className="text-sm font-medium text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Status indicator */}
        <div className="mt-4 border-t border-gray-700/50 pt-3">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-xs text-green-400">
              Real-time monitoring active
            </span>
          </div>
        </div>
      </div>
    </div>
  )
} 