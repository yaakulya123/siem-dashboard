'use client'

interface SystemStatus {
  name: string;
  status: 'Healthy' | 'Running' | 'Warning' | 'Active' | 'Critical';
}

const systemStatuses: SystemStatus[] = [
  { name: 'Wazuh Manager', status: 'Healthy' },
  { name: 'Elasticsearch', status: 'Running' },
  { name: 'Kibana', status: 'Warning' },
  { name: 'AI Engine', status: 'Active' },
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

export function SystemHealth() {
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
            className="flex items-center justify-between py-3 px-4 rounded-lg bg-gray-800/50 border border-gray-700/30"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 ${getStatusBgColor(system.status)} rounded-full`}></div>
              <span className="text-sm text-gray-300">{system.name}</span>
            </div>
            <span className={`text-xs font-medium ${getStatusColor(system.status)}`}>
              {system.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 