'use client'

interface SystemStatusItem {
  name: string;
  status: 'Online' | 'Active' | 'Healthy';
}

const statusItems: SystemStatusItem[] = [
  { name: 'Wazuh Manager', status: 'Online' },
  { name: 'AI Engine', status: 'Active' },
  { name: 'Elasticsearch', status: 'Healthy' }
];

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Online':
      return 'bg-green-500';
    case 'Active':
      return 'bg-blue-500';
    case 'Healthy':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export function SystemStatus() {
  return (
    <div>
      <div className="text-xs font-semibold leading-6 text-gray-400 uppercase tracking-wider mb-2">
        System Status
      </div>
      <div className="space-y-2">
        {statusItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between text-sm">
            <span className="text-gray-300">{item.name}</span>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 ${getStatusColor(item.status)} rounded-full`}></div>
              <span className="text-xs text-gray-400">{item.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 