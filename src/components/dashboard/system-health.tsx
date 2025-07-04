'use client'

import { useState } from 'react'

interface SystemStatus {
  name: string;
  status: 'Healthy' | 'Running' | 'Warning' | 'Active' | 'Critical';
  performance?: number; // Performance percentage 0-100
  details?: string;
}

const systemStatuses: SystemStatus[] = [
  { 
    name: 'Wazuh Manager', 
    status: 'Healthy', 
    performance: 96,
    details: 'All services running optimally'
  },
  { 
    name: 'Elasticsearch', 
    status: 'Running', 
    performance: 87,
    details: 'Cluster status green, 3/3 nodes'
  },
  { 
    name: 'Kibana', 
    status: 'Warning', 
    performance: 62,
    details: 'High memory usage detected'
  },
  { 
    name: 'AI Engine', 
    status: 'Active', 
    performance: 78,
    details: 'Processing threat intelligence'
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Healthy':
      return 'text-green-400';
    case 'Running':
      return 'text-green-400';
    case 'Warning':
      return 'text-yellow-400';
    case 'Active':
      return 'text-blue-400';
    case 'Critical':
      return 'text-red-400';
    default:
      return 'text-gray-400';
  }
};

const getStatusBgColor = (status: string) => {
  switch (status) {
    case 'Healthy':
      return 'bg-green-400';
    case 'Running':
      return 'bg-green-400';
    case 'Warning':
      return 'bg-yellow-400';
    case 'Active':
      return 'bg-blue-400';
    case 'Critical':
      return 'bg-red-400';
    default:
      return 'bg-gray-400';
  }
};

const getStatusGradient = (status: string) => {
  switch (status) {
    case 'Healthy':
      return 'from-green-500/20 to-green-500/5';
    case 'Running':
      return 'from-green-500/20 to-green-500/5';
    case 'Warning':
      return 'from-yellow-500/20 to-yellow-500/5';
    case 'Active':
      return 'from-blue-500/20 to-blue-500/5';
    case 'Critical':
      return 'from-red-500/20 to-red-500/5';
    default:
      return 'from-gray-500/20 to-gray-500/5';
  }
};

export function SystemHealth() {
  const [expandedSystem, setExpandedSystem] = useState<string | null>(null);

  const toggleSystem = (systemName: string) => {
    if (expandedSystem === systemName) {
      setExpandedSystem(null);
    } else {
      setExpandedSystem(systemName);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/30 backdrop-blur-sm px-4 py-3 rounded-t-xl">
        <h3 className="text-base font-medium text-white">System Health</h3>
      </div>
      
      <div className="flex-1 flex flex-col p-4 space-y-4">
        {systemStatuses.map((system) => (
          <div 
            key={system.name}
            className={`rounded-lg overflow-hidden transition-all duration-300 border border-gray-700/30 ${
              expandedSystem === system.name 
                ? 'bg-gradient-to-b from-gray-800/80 to-gray-900/80' 
                : 'bg-gray-800/50 hover:bg-gray-800/80'
            }`}
          >
            <div 
              className="flex items-center justify-between py-3 px-4 cursor-pointer"
              onClick={() => toggleSystem(system.name)}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 ${getStatusBgColor(system.status)} rounded-full ${
                  system.status === 'Warning' ? 'animate-pulse' : ''
                }`}></div>
                <span className="text-sm text-gray-300">{system.name}</span>
              </div>
              <span className={`text-xs font-medium ${getStatusColor(system.status)}`}>
                {system.status}
              </span>
            </div>

            {/* Performance bar */}
            <div className="px-4 pb-3">
              <div className="h-1.5 w-full bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getStatusBgColor(system.status)} bg-opacity-80`} 
                  style={{ width: `${system.performance}%` }}
                ></div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedSystem === system.name && (
              <div className={`px-4 pb-3 pt-1 bg-gradient-to-b ${getStatusGradient(system.status)} animate-fade-in`}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-400">Performance</span>
                  <span className="text-xs font-medium text-white">{system.performance}%</span>
                </div>
                <p className="text-xs text-gray-300 mt-2">{system.details}</p>
                <div className="flex justify-end mt-2">
                  <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                    View details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="mt-auto pt-2 flex justify-between items-center text-xs text-gray-400">
          <span>Last checked: 2 minutes ago</span>
          <button className="text-blue-400 hover:text-blue-300 transition-colors">
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
} 