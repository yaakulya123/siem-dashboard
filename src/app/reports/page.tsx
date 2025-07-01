'use client'

import { useState } from 'react'
import { DocumentTextIcon, ArrowDownTrayIcon, CalendarIcon } from '@heroicons/react/24/outline'

interface Report {
  id: string
  name: string
  description: string
  type: 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  lastGenerated?: string
  nextScheduled: string
  isActive: boolean
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Weekly Security Digest',
    description: 'Alert counts, top hosts, SLA metrics per tenant',
    type: 'weekly',
    recipients: ['executives@company.com', 'security-team@company.com'],
    lastGenerated: '2 days ago',
    nextScheduled: 'Friday 9:00 AM',
    isActive: true
  },
  {
    id: 'RPT-002',
    name: 'Monthly Compliance Report',
    description: 'ISO 27001 compliance status and evidence collection',
    type: 'monthly',
    recipients: ['compliance@company.com', 'audit@company.com'],
    lastGenerated: '1 week ago',
    nextScheduled: 'Last Friday of month',
    isActive: true
  },
  {
    id: 'RPT-003',
    name: 'Quarterly Security Review',
    description: 'Comprehensive security posture assessment',
    type: 'quarterly',
    recipients: ['board@company.com', 'ciso@company.com'],
    lastGenerated: '2 months ago',
    nextScheduled: 'Next quarter',
    isActive: true
  }
]

export default function ReportsPage() {
  const [reports] = useState<Report[]>(mockReports)

  const generateReport = (reportId: string) => {
    console.log(`Generating report ${reportId}`)
  }

  const toggleReportStatus = (reportId: string) => {
    console.log(`Toggling status for report ${reportId}`)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Scheduled PDF Reports
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Automated stakeholder summaries and compliance reports
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {report.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                    {report.type} report
                  </p>
                </div>
              </div>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                report.isActive 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {report.isActive ? 'Active' : 'Inactive'}
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              {report.description}
            </p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Next: {report.nextScheduled}
              </div>
              {report.lastGenerated && (
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Last generated: {report.lastGenerated}
                </div>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Recipients
              </p>
              <div className="mt-1 space-y-1">
                {report.recipients.map((recipient, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded mr-2"
                  >
                    {recipient}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => generateReport(report.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded transition-colors"
              >
                Generate Now
              </button>
              <button
                onClick={() => toggleReportStatus(report.id)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-300 text-sm font-medium py-2 px-3 rounded transition-colors"
              >
                {report.isActive ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Report */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Create New Report
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Custom Security Report"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Frequency
            </label>
            <select className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
            </select>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipients (comma-separated)
          </label>
          <input
            type="text"
            className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            placeholder="email1@company.com, email2@company.com"
          />
        </div>
        <div className="mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors">
            Create Report
          </button>
        </div>
      </div>
    </div>
  )
} 