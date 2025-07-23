'use client'

import { useEffect, useState } from 'react'
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

interface IncomingAlert {
  agent_name: string
  alert_description: string
  host_name: string | null
  rule_groups: string
  severity: number
  time: string
}

interface LiveAlertsTableProps {
  alerts: IncomingAlert[]
}

const mockAlerts: Alert[] = []

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

const mapSeverity = (level: number): Alert['severity'] => {
  if (level >= 15) return 'critical'
  if (level >= 11) return 'major'
  if (level >= 7) return 'minor'
  return 'minor'
}

export function LiveAlertsTable({ alerts }: LiveAlertsTableProps) {
  const [mappedAlerts, setMappedAlerts] = useState<Alert[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'investigating' | 'resolved' | 'critical' | 'major' | 'minor'>('all')
  const [isClient, setIsClient] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const alertsPerPage = 10

  // Calculate status counts
  const openCount = mappedAlerts.filter(alert => alert.status === 'open').length
  const investigatingCount = mappedAlerts.filter(alert => alert.status === 'investigating').length
  const resolvedCount = mappedAlerts.filter(alert => alert.status === 'resolved').length
  const criticalCount = mappedAlerts.filter(alert => alert.severity === 'critical').length
  const majorCount = mappedAlerts.filter(alert => alert.severity === 'major').length
  const minorCount = mappedAlerts.filter(alert => alert.severity === 'minor').length

  // Filter alerts based on selected status
  const filteredAlerts =
    statusFilter === 'all'
      ? mappedAlerts
      : statusFilter === 'critical'
        ? mappedAlerts.filter(alert => alert.severity === 'critical')
        : statusFilter === 'major'
          ? mappedAlerts.filter(alert => alert.severity === 'major')
          : statusFilter === 'minor'
            ? mappedAlerts.filter(alert => alert.severity === 'minor')
            : mappedAlerts.filter(alert => alert.status === statusFilter)

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

  useEffect(() => {
    // Map backend alerts to frontend Alert type
    const formatted = alerts.map((a, idx) => ({
      id: 'LIVE-' + idx + '-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      severity: mapSeverity(a.severity),
      title: a.alert_description,
      timestamp: new Date(a.time).toLocaleString(),
      host: a.host_name ?? a.agent_name ?? 'N/A',
      agent: a.agent_name,
      rule: a.rule_groups,
      status: 'open' as 'open',
    }))
    setMappedAlerts(formatted)
    setLastRefresh(new Date())
  }, [alerts])

  const createTicket = (alertId: string) => {
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
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString() || '...'}
        </div>
      </div>
      {/* Status Counters with Filtering */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setStatusFilter(statusFilter === 'all' ? 'all' : 'all')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'all'
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
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'open'
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
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'investigating'
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
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'resolved'
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

        <button
          onClick={() => setStatusFilter(statusFilter === 'critical' ? 'all' : 'critical')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'critical'
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-400 shadow-sm'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/10 hover:border-red-200 dark:hover:border-red-800/30 hover:shadow-sm'
            }`}
        >
          <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          <span>Critical</span>
          <span className="bg-red-100 dark:bg-red-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
            {criticalCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'major' ? 'all' : 'major')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'major'
            ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400 shadow-sm'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-200 dark:hover:border-orange-800/30 hover:shadow-sm'
            }`}
        >
          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full"></div>
          <span>Major</span>
          <span className="bg-orange-100 dark:bg-orange-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
            {majorCount}
          </span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'minor' ? 'all' : 'minor')}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border ${statusFilter === 'minor'
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50 text-yellow-700 dark:text-yellow-400 shadow-sm'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10 hover:border-yellow-200 dark:hover:border-yellow-800/30 hover:shadow-sm'
            }`}
        >
          <div className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></div>
          <span>Minor</span>
          <span className="bg-yellow-100 dark:bg-yellow-900/30 px-1.5 py-0.5 rounded text-xs font-semibold">
            {minorCount}
          </span>
        </button>

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
                    {/* ID: {alert.id} */}
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