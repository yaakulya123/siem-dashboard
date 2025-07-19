'use client'

import { useState } from 'react'
import { ArrowTopRightOnSquareIcon, UserIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface Ticket {
  id: string
  title: string
  status: 'open' | 'in-progress' | 'closed'
  priority: 'critical' | 'major' | 'minor'
  assignee: string
  reporter: string
  createdAt: string
  dueDate?: string
  externalUrl?: string
}

const mockTickets: Ticket[] = [
  {
    id: 'SIEM-2024-001',
    title: 'Investigate failed authentication alerts',
    status: 'in-progress',
    priority: 'critical',
    assignee: 'Sarah Chen',
    reporter: 'John Anderson',
    createdAt: '2 hours ago',
    dueDate: 'Today',
    externalUrl: 'https://company.atlassian.net/browse/SIEM-2024-001'
  },
  {
    id: 'SIEM-2024-002',
    title: 'Review suspicious file modifications',
    status: 'open',
    priority: 'major',
    assignee: 'Mike Rodriguez',
    reporter: 'Security Bot',
    createdAt: '4 hours ago',
    dueDate: 'Tomorrow',
    externalUrl: 'https://company.service-now.com/nav_to.do?uri=incident.do?sys_id=abc123'
  },
  {
    id: 'SIEM-2024-003',
    title: 'System performance monitoring alert',
    status: 'open',
    priority: 'minor',
    assignee: 'Alex Johnson',
    reporter: 'Monitoring System',
    createdAt: '6 hours ago',
    dueDate: 'This week'
  },
  {
    id: 'SIEM-2023-999',
    title: 'Monthly compliance report generation',
    status: 'closed',
    priority: 'minor',
    assignee: 'Lisa Park',
    reporter: 'Compliance Team',
    createdAt: '1 day ago',
    dueDate: 'Last week'
  }
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'major': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'minor': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'in-progress': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'closed': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function RecentTickets() {
  const [tickets] = useState<Ticket[]>(mockTickets)

  const closeTicket = (ticketId: string) => {
    // In a real app, this would update the ticket status
    console.log(`Closing ticket ${ticketId}`)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Tickets
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Incident tracking and accountability
            </p>
          </div>
          <div className="flex space-x-2">
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
            )}>
              {tickets.filter(t => t.status === 'open').length} Open
            </span>
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
            )}>
              {tickets.filter(t => t.status === 'in-progress').length} In Progress
            </span>
            <span className={clsx(
              'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
              'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
            )}>
              {tickets.filter(t => t.status === 'closed').length} Closed
            </span>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {ticket.title}
                  </h4>
                  {ticket.externalUrl && (
                    <a
                      href={ticket.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    >
                                             <ArrowTopRightOnSquareIcon className="w-4 h-4" />
                    </a>
                  )}
                </div>
                
                <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-mono">{ticket.id}</span>
                  <span>•</span>
                  <span>Created {ticket.createdAt}</span>
                  {ticket.dueDate && (
                    <>
                      <span>•</span>
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        Due {ticket.dueDate}
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-2 flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <UserIcon className="w-4 h-4 mr-1 text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Assigned to {ticket.assignee}
                    </span>
                  </div>
                  <span className="text-gray-300 dark:text-gray-600">•</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Reported by {ticket.reporter}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 items-end">
                <div className="flex space-x-2">
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                    getPriorityColor(ticket.priority)
                  )}>
                    {ticket.priority}
                  </span>
                  <span className={clsx(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                    getStatusColor(ticket.status)
                  )}>
                    {ticket.status.replace('-', ' ')}
                  </span>
                </div>

                {ticket.status !== 'closed' && (
                  <button
                    onClick={() => closeTicket(ticket.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40"
                  >
                    Close Ticket
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Showing {tickets.length} recent tickets
          </span>
          <a
            href="/tickets"
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
          >
            View all tickets →
          </a>
        </div>
      </div>
    </div>
  )
} 