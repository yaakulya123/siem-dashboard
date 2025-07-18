'use client'

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, ClockIcon, UserIcon, ChevronLeftIcon, ChevronRightIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import CreateTicketModal from '@/components/tickets/CreateTicketModal';


interface Alert {
  id: string
  severity: 'critical' | 'major' | 'minor'
  title: string
  timestamp: string
  host: string
  agent: string
  rule: string
  status: 'open' | 'investigating' | 'resolved'
}


const mockAlerts: Alert[] = [
  {
    id: 'ALR-001',
    severity: 'critical',
    title: 'Multiple failed login attempts detected',
    timestamp: '2 minutes ago',
    host: 'server-01',
    agent: 'wazuh-agent-01',
    rule: 'Authentication failure',
    status: 'open'
  },
  {
    id: 'ALR-002',
    severity: 'major',
    title: 'Suspicious file modification in /etc',
    timestamp: '5 minutes ago',
    host: 'web-server-03',
    agent: 'wazuh-agent-03',
    rule: 'File integrity monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-003',
    severity: 'minor',
    title: 'High CPU usage detected',
    timestamp: '12 minutes ago',
    host: 'db-server-02',
    agent: 'wazuh-agent-02',
    rule: 'System monitoring',
    status: 'open'
  },
  {
    id: 'ALR-004',
    severity: 'minor',
    title: 'User logged in from new location',
    timestamp: '25 minutes ago',
    host: 'app-server-01',
    agent: 'wazuh-agent-01',
    rule: 'Geographic anomaly',
    status: 'resolved'
  },
  {
    id: 'ALR-005',
    severity: 'minor',
    title: 'System backup completed successfully',
    timestamp: '1 hour ago',
    host: 'backup-server',
    agent: 'wazuh-agent-04',
    rule: 'System events',
    status: 'resolved'
  },
  {
    id: 'ALR-006',
    severity: 'critical',
    title: 'SQL injection attempt detected',
    timestamp: '1 hour ago',
    host: 'web-server-01',
    agent: 'wazuh-agent-01',
    rule: 'Web application attack',
    status: 'open'
  },
  {
    id: 'ALR-007',
    severity: 'major',
    title: 'Malware detected on workstation',
    timestamp: '1.5 hours ago',
    host: 'workstation-15',
    agent: 'wazuh-agent-15',
    rule: 'Malware detection',
    status: 'investigating'
  },
  {
    id: 'ALR-008',
    severity: 'critical',
    title: 'Privilege escalation attempt',
    timestamp: '2 hours ago',
    host: 'server-05',
    agent: 'wazuh-agent-05',
    rule: 'Privilege escalation',
    status: 'open'
  },
  {
    id: 'ALR-009',
    severity: 'major',
    title: 'Unusual network traffic detected',
    timestamp: '2.5 hours ago',
    host: 'firewall-01',
    agent: 'wazuh-agent-fw01',
    rule: 'Network anomaly',
    status: 'investigating'
  },
  {
    id: 'ALR-010',
    severity: 'minor',
    title: 'Disk space warning',
    timestamp: '3 hours ago',
    host: 'storage-server-01',
    agent: 'wazuh-agent-storage01',
    rule: 'System resource monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-011',
    severity: 'critical',
    title: 'Brute force attack detected',
    timestamp: '3.5 hours ago',
    host: 'ssh-server-02',
    agent: 'wazuh-agent-ssh02',
    rule: 'Brute force attack',
    status: 'open'
  },
  {
    id: 'ALR-012',
    severity: 'major',
    title: 'Unauthorized process execution',
    timestamp: '4 hours ago',
    host: 'workstation-07',
    agent: 'wazuh-agent-07',
    rule: 'Process monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-013',
    severity: 'minor',
    title: 'Service restart notification',
    timestamp: '4.5 hours ago',
    host: 'app-server-03',
    agent: 'wazuh-agent-03',
    rule: 'Service monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-014',
    severity: 'critical',
    title: 'Data exfiltration attempt',
    timestamp: '5 hours ago',
    host: 'file-server-01',
    agent: 'wazuh-agent-fs01',
    rule: 'Data loss prevention',
    status: 'open'
  },
  {
    id: 'ALR-015',
    severity: 'major',
    title: 'Registry modification detected',
    timestamp: '5.5 hours ago',
    host: 'workstation-12',
    agent: 'wazuh-agent-12',
    rule: 'Registry monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-016',
    severity: 'minor',
    title: 'Patch installation completed',
    timestamp: '6 hours ago',
    host: 'server-08',
    agent: 'wazuh-agent-08',
    rule: 'System updates',
    status: 'resolved'
  },
  {
    id: 'ALR-017',
    severity: 'critical',
    title: 'Ransomware signature detected',
    timestamp: '6.5 hours ago',
    host: 'workstation-09',
    agent: 'wazuh-agent-09',
    rule: 'Ransomware detection',
    status: 'open'
  },
  {
    id: 'ALR-018',
    severity: 'major',
    title: 'Suspicious PowerShell execution',
    timestamp: '7 hours ago',
    host: 'server-04',
    agent: 'wazuh-agent-04',
    rule: 'PowerShell monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-019',
    severity: 'minor',
    title: 'Antivirus definition update',
    timestamp: '7.5 hours ago',
    host: 'workstation-20',
    agent: 'wazuh-agent-20',
    rule: 'Antivirus monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-020',
    severity: 'critical',
    title: 'Remote access trojan detected',
    timestamp: '8 hours ago',
    host: 'server-06',
    agent: 'wazuh-agent-06',
    rule: 'Trojan detection',
    status: 'open'
  },
  {
    id: 'ALR-021',
    severity: 'major',
    title: 'Firewall rule bypass attempt',
    timestamp: '8.5 hours ago',
    host: 'firewall-02',
    agent: 'wazuh-agent-fw02',
    rule: 'Firewall monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-022',
    severity: 'minor',
    title: 'Scheduled task execution',
    timestamp: '9 hours ago',
    host: 'app-server-02',
    agent: 'wazuh-agent-02',
    rule: 'Scheduled task monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-023',
    severity: 'critical',
    title: 'Buffer overflow attempt',
    timestamp: '9.5 hours ago',
    host: 'web-server-02',
    agent: 'wazuh-agent-02',
    rule: 'Buffer overflow detection',
    status: 'open'
  },
  {
    id: 'ALR-024',
    severity: 'major',
    title: 'Unusual user behavior detected',
    timestamp: '10 hours ago',
    host: 'workstation-05',
    agent: 'wazuh-agent-05',
    rule: 'User behavior analysis',
    status: 'investigating'
  },
  {
    id: 'ALR-025',
    severity: 'minor',
    title: 'Log rotation completed',
    timestamp: '10.5 hours ago',
    host: 'log-server-01',
    agent: 'wazuh-agent-log01',
    rule: 'Log management',
    status: 'resolved'
  },
  {
    id: 'ALR-026',
    severity: 'critical',
    title: 'Cryptomining activity detected',
    timestamp: '11 hours ago',
    host: 'workstation-18',
    agent: 'wazuh-agent-18',
    rule: 'Cryptomining detection',
    status: 'open'
  },
  {
    id: 'ALR-027',
    severity: 'major',
    title: 'DDoS attack detected',
    timestamp: '11.5 hours ago',
    host: 'web-server-04',
    agent: 'wazuh-agent-04',
    rule: 'DDoS protection',
    status: 'investigating'
  },
  {
    id: 'ALR-028',
    severity: 'minor',
    title: 'Certificate renewal reminder',
    timestamp: '12 hours ago',
    host: 'certificate-server',
    agent: 'wazuh-agent-cert01',
    rule: 'Certificate monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-029',
    severity: 'critical',
    title: 'Lateral movement detected',
    timestamp: '12.5 hours ago',
    host: 'server-07',
    agent: 'wazuh-agent-07',
    rule: 'Lateral movement detection',
    status: 'open'
  },
  {
    id: 'ALR-030',
    severity: 'major',
    title: 'Configuration drift detected',
    timestamp: '13 hours ago',
    host: 'config-server-01',
    agent: 'wazuh-agent-config01',
    rule: 'Configuration monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-031',
    severity: 'minor',
    title: 'Database backup completed',
    timestamp: '13.5 hours ago',
    host: 'db-server-03',
    agent: 'wazuh-agent-db03',
    rule: 'Database monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-032',
    severity: 'critical',
    title: 'Zero-day exploit attempt',
    timestamp: '14 hours ago',
    host: 'web-server-05',
    agent: 'wazuh-agent-05',
    rule: 'Zero-day detection',
    status: 'open'
  },
  {
    id: 'ALR-033',
    severity: 'major',
    title: 'Insider threat indicators',
    timestamp: '14.5 hours ago',
    host: 'workstation-22',
    agent: 'wazuh-agent-22',
    rule: 'Insider threat detection',
    status: 'investigating'
  },
  {
    id: 'ALR-034',
    severity: 'minor',
    title: 'System health check passed',
    timestamp: '15 hours ago',
    host: 'monitoring-server',
    agent: 'wazuh-agent-mon01',
    rule: 'Health monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-035',
    severity: 'critical',
    title: 'Advanced persistent threat detected',
    timestamp: '15.5 hours ago',
    host: 'server-09',
    agent: 'wazuh-agent-09',
    rule: 'APT detection',
    status: 'open'
  },
  {
    id: 'ALR-036',
    severity: 'major',
    title: 'Phishing email detected',
    timestamp: '16 hours ago',
    host: 'mail-server-01',
    agent: 'wazuh-agent-mail01',
    rule: 'Email security',
    status: 'investigating'
  },
  {
    id: 'ALR-037',
    severity: 'minor',
    title: 'Backup verification completed',
    timestamp: '16.5 hours ago',
    host: 'backup-server-02',
    agent: 'wazuh-agent-backup02',
    rule: 'Backup monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-038',
    severity: 'critical',
    title: 'Command injection detected',
    timestamp: '17 hours ago',
    host: 'web-server-06',
    agent: 'wazuh-agent-06',
    rule: 'Command injection detection',
    status: 'open'
  },
  {
    id: 'ALR-039',
    severity: 'major',
    title: 'Suspicious DNS queries',
    timestamp: '17.5 hours ago',
    host: 'dns-server-01',
    agent: 'wazuh-agent-dns01',
    rule: 'DNS monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-040',
    severity: 'minor',
    title: 'Software update installed',
    timestamp: '18 hours ago',
    host: 'workstation-25',
    agent: 'wazuh-agent-25',
    rule: 'Software monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-041',
    severity: 'critical',
    title: 'Rootkit activity detected',
    timestamp: '18.5 hours ago',
    host: 'server-10',
    agent: 'wazuh-agent-10',
    rule: 'Rootkit detection',
    status: 'open'
  },
  {
    id: 'ALR-042',
    severity: 'major',
    title: 'Memory corruption detected',
    timestamp: '19 hours ago',
    host: 'workstation-30',
    agent: 'wazuh-agent-30',
    rule: 'Memory protection',
    status: 'investigating'
  },
  {
    id: 'ALR-043',
    severity: 'minor',
    title: 'License compliance check',
    timestamp: '19.5 hours ago',
    host: 'license-server',
    agent: 'wazuh-agent-license01',
    rule: 'License monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-044',
    severity: 'critical',
    title: 'Keylogger detected',
    timestamp: '20 hours ago',
    host: 'workstation-33',
    agent: 'wazuh-agent-33',
    rule: 'Keylogger detection',
    status: 'open'
  },
  {
    id: 'ALR-045',
    severity: 'major',
    title: 'VPN anomaly detected',
    timestamp: '20.5 hours ago',
    host: 'vpn-server-01',
    agent: 'wazuh-agent-vpn01',
    rule: 'VPN monitoring',
    status: 'investigating'
  },
  {
    id: 'ALR-046',
    severity: 'minor',
    title: 'Maintenance window completed',
    timestamp: '21 hours ago',
    host: 'maintenance-server',
    agent: 'wazuh-agent-maint01',
    rule: 'Maintenance monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-047',
    severity: 'critical',
    title: 'Fileless malware detected',
    timestamp: '21.5 hours ago',
    host: 'workstation-35',
    agent: 'wazuh-agent-35',
    rule: 'Fileless malware detection',
    status: 'open'
  },
  {
    id: 'ALR-048',
    severity: 'major',
    title: 'API abuse detected',
    timestamp: '22 hours ago',
    host: 'api-server-01',
    agent: 'wazuh-agent-api01',
    rule: 'API security',
    status: 'investigating'
  },
  {
    id: 'ALR-049',
    severity: 'minor',
    title: 'Performance baseline updated',
    timestamp: '22.5 hours ago',
    host: 'perf-server-01',
    agent: 'wazuh-agent-perf01',
    rule: 'Performance monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-050',
    severity: 'critical',
    title: 'Data breach indicators',
    timestamp: '23 hours ago',
    host: 'data-server-01',
    agent: 'wazuh-agent-data01',
    rule: 'Data breach detection',
    status: 'open'
  },
  {
    id: 'ALR-051',
    severity: 'major',
    title: 'Container escape attempt',
    timestamp: '23.5 hours ago',
    host: 'container-host-01',
    agent: 'wazuh-agent-container01',
    rule: 'Container security',
    status: 'investigating'
  },
  {
    id: 'ALR-052',
    severity: 'minor',
    title: 'Compliance audit passed',
    timestamp: '1 day ago',
    host: 'audit-server',
    agent: 'wazuh-agent-audit01',
    rule: 'Compliance monitoring',
    status: 'resolved'
  },
  {
    id: 'ALR-053',
    severity: 'critical',
    title: 'Supply chain attack detected',
    timestamp: '1 day ago',
    host: 'build-server-01',
    agent: 'wazuh-agent-build01',
    rule: 'Supply chain security',
    status: 'open'
  },
  {
    id: 'ALR-054',
    severity: 'major',
    title: 'Cloud misconfiguration detected',
    timestamp: '1 day ago',
    host: 'cloud-gateway-01',
    agent: 'wazuh-agent-cloud01',
    rule: 'Cloud security',
    status: 'investigating'
  },
  {
    id: 'ALR-055',
    severity: 'minor',
    title: 'Security training completed',
    timestamp: '1 day ago',
    host: 'training-server',
    agent: 'wazuh-agent-training01',
    rule: 'Training monitoring',
    status: 'resolved'
  }
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'severity-critical'
    case 'major': return 'severity-major'
    case 'minor': return 'severity-minor'
    default: return 'severity-minor'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'severity-critical'
    case 'investigating': return 'severity-major'
    case 'resolved': return 'severity-minor'
    default: return 'severity-minor'
  }
}

export function LiveAlertsTable() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved'>('all')
  const [isClient, setIsClient] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const alertsPerPage = 10

  // Calculate status counts
  const openCount = alerts.filter(alert => alert.status === 'open').length
  const investigatingCount = alerts.filter(alert => alert.status === 'investigating').length
  const resolvedCount = alerts.filter(alert => alert.status === 'resolved').length

  // Filter alerts based on selected status
  const filteredAlerts = statusFilter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === statusFilter)

  // Pagination calculations
  const totalPages = Math.ceil(filteredAlerts.length / alertsPerPage)
  const startIndex = (currentPage - 1) * alertsPerPage
  const endIndex = startIndex + alertsPerPage
  const currentAlerts = filteredAlerts.slice(startIndex, endIndex)

  const [showModal, setShowModal] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [statusFilter])

  // Set client-side flag and auto-refresh
  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setLastRefresh(new Date())
      // In a real app, this would fetch fresh data
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const createTicket = (alertId: string) => {
    // In a real app, this would create a ticket in the ticketing system
    console.log(`Creating ticket for alert ${alertId}`)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="status-dot active"></div>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">Live monitoring</span>
          </div>
          
          {/* Status Counters with Filtering */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setStatusFilter(statusFilter === 'all' ? 'all' : 'all')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                statusFilter === 'all' 
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-700 dark:text-blue-400 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
              <span>All</span>
              <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs font-semibold">
                {alerts.length}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter(statusFilter === 'open' ? 'all' : 'open')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                statusFilter === 'open' 
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800/30 hover:shadow-sm'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
              <span>Open</span>
              <span className="bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
                {openCount}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter(statusFilter === 'investigating' ? 'all' : 'investigating')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                statusFilter === 'investigating' 
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:border-yellow-200 dark:hover:border-yellow-800/30 hover:shadow-sm'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
              <span>Investigating</span>
              <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
                {investigatingCount}
              </span>
            </button>
            
            <button
              onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                statusFilter === 'resolved' 
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-400 shadow-sm' 
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-green-50 dark:hover:bg-green-900/10 hover:border-green-200 dark:hover:border-green-800/30 hover:shadow-sm'
              }`}
            >
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
              <span>Resolved</span>
              <span className="bg-green-100 dark:bg-green-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
                {resolvedCount}
              </span>
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {isClient ? lastRefresh.toLocaleTimeString() : '--:--:--'}
        </div>
      </div>

      <div className="overflow-x-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-100 dark:border-gray-700/50 shadow-md">
        <table className="min-w-full divide-y divide-gray-200/70 dark:divide-gray-700/30">
          <thead className="bg-gray-50/80 dark:bg-gray-900/50">
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Alert
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Host/Agent
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rule
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 dark:divide-gray-700/30">
            {currentAlerts.map((alert) => (
              <tr key={alert.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    getSeverityColor(alert.severity)
                  )}>
                    {alert.severity}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white font-medium">
                    {alert.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    ID: {alert.id}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <ClockIcon className="w-4 h-4 mr-1.5 text-gray-400" />
                    {alert.timestamp}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="font-medium">{alert.host}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{alert.agent}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {alert.rule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                    getStatusColor(alert.status)
                  )}>
                    {alert.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {alert.status === 'open' && (
                   <button
  onClick={() => {
    setSelectedAlertId(alert.id);
    setShowModal(true);
  }}
  className="inline-flex items-center px-3 py-1.5 border border-blue-200 dark:border-blue-800/50 text-xs font-medium rounded-lg text-blue-700 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors duration-150 shadow-sm"
>
  <UserIcon className="w-3.5 h-3.5 mr-1.5" />
  Create Ticket
</button>


                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAlerts.length)} of {filteredAlerts.length} alerts
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={clsx(
              "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors duration-150",
              currentPage === 1
                ? "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            <ChevronLeftIcon className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={clsx(
                  "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-150",
                  page === currentPage
                    ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50"
                    : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                )}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={clsx(
              "inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg border transition-colors duration-150",
              currentPage === totalPages
                ? "text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700/50 cursor-not-allowed"
                : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            )}
          >
            Next
            <ChevronRightIcon className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
      {showModal && selectedAlertId && (
  <CreateTicketModal alertId={selectedAlertId} onClose={() => {
    setShowModal(false);
    setSelectedAlertId(null);
  }} />
)}

    </div>
    
  )
} 