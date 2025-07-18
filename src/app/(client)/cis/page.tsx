'use client'

import React, { useState } from 'react'
import {
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface BenchmarkCheck {
  id: string
  title: string
  target: string
  result: 'Passed' | 'Failed' | 'Not applicable'
  description?: string
  category?: string
  severity?: 'critical' | 'major' | 'minor'
}

// CIS Benchmark data
const cisBenchmarkData: BenchmarkCheck[] = [
  {
    id: '36000',
    title: 'Ensure mounting of cramfs filesystems is disabled.',
    target: 'Command: modprobe -n -v cramfs.ismod',
    result: 'Passed',
    description: 'The cramfs filesystem type is a compressed read-only Linux filesystem embedded in small footprint systems.',

  },
  {
    id: '36001',
    title: 'Ensure mounting of freevxfs filesystems is disabled.',
    target: 'Command: modprobe -n -v freevxfs',
    result: 'Failed',
    description: 'The freevxfs filesystem type is a free version of the Veritas type filesystem.',
  
  },
  {
    id: '36002',
    title: 'Ensure mounting of jffs2 filesystems is disabled.',
    target: 'Command: modprobe -n -v jffs2',
    result: 'Failed',
    description: 'The jffs2 (journaling flash filesystem 2) filesystem type is a log-structured filesystem.',
 
  },
  {
    id: '36003',
    title: 'Ensure mounting of hfs filesystems is disabled.',
    target: 'Command: modprobe -n -v hfs',
    result: 'Failed',
    description: 'The hfs filesystem type is a hierarchical filesystem developed by Apple.',
   
  },
  {
    id: '36004',
    title: 'Ensure mounting of hfsplus filesystems is disabled.',
    target: 'Command: modprobe -n -v hfsplus',
    result: 'Failed',
    description: 'The hfsplus filesystem type is a hierarchical filesystem designed to replace hfs.',
 
  },
  {
    id: '36005',
    title: 'Ensure mounting of squashfs filesystems is disabled.',
    target: 'Command: modprobe -n -v squashfs',
    result: 'Failed',
    description: 'The squashfs filesystem type is a compressed read-only Linux filesystem.',

  },
  {
    id: '36006',
    title: 'Ensure mounting of udf filesystems is disabled.',
    target: 'Command: /sbin/modprobe -n -v udf',
    result: 'Failed',
    description: 'The udf filesystem type is the universal disk format used to implement ISO/IEC 13346.',
  
  },
  {
    id: '36007',
    title: 'Ensure mounting of FAT filesystems is disabled.',
    target: 'Command: modprobe -n -v fat',
    result: 'Failed',
    description: 'The FAT filesystem format is primarily used on older windows systems.',
   
  },
  {
    id: '36008',
    title: 'Ensure /tmp is configured.',
    target: 'Command: mount | grep -E "\\s/tmp\\s"',
    result: 'Passed',
    description: 'The /tmp directory is a world-writable directory used for temporary storage.',

  },
  {
    id: '36009',
    title: 'Ensure nodev option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*nodev"',
    result: 'Passed',
    description: 'The nodev mount option specifies that the filesystem cannot contain special devices.',
  
  },
  {
    id: '36010',
    title: 'Ensure nosuid option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*nosuid"',
    result: 'Failed',
    description: 'The nosuid mount option specifies that the filesystem cannot contain setuid files.',
    
  },
  {
    id: '36011',
    title: 'Ensure noexec option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*noexec"',
    result: 'Failed',
    description: 'The noexec mount option specifies that the filesystem cannot contain executable binaries.',
    
  },
  {
    id: '36012',
    title: 'Ensure /var is configured.',
    target: 'Command: mount | grep -E "\\s/var\\s"',
    result: 'Passed',
    description: 'The /var directory is used by daemons and other system services to store frequently-changing data.',
   
  },
  {
    id: '36013',
    title: 'Ensure /var/tmp is configured.',
    target: 'Command: mount | grep -E "\\s/var/tmp\\s"',
    result: 'Not applicable',
    description: 'The /var/tmp directory is a world-writable directory used for temporary storage.',
    
  },
  {
    id: '36014',
    title: 'Ensure nodev option set on /var/tmp partition.',
    target: 'Command: mount | grep -E "\\s/var/tmp\\s.*nodev"',
    result: 'Not applicable',
    description: 'The nodev mount option specifies that the filesystem cannot contain special devices.',
   
  },
  {
    id: '36015',
    title: 'Ensure nosuid option set on /var/tmp partition.',
    target: 'Command: mount | grep -E "\\s/var/tmp\\s.*nosuid"',
    result: 'Not applicable',
    description: 'The nosuid mount option specifies that the filesystem cannot contain setuid files.',
   
  },
  {
    id: '36016',
    title: 'Ensure noexec option set on /var/tmp partition.',
    target: 'Command: mount | grep -E "\\s/var/tmp\\s.*noexec"',
    result: 'Not applicable',
    description: 'The noexec mount option specifies that the filesystem cannot contain executable binaries.',
    
  },
  {
    id: '36017',
    title: 'Ensure /var/log is configured.',
    target: 'Command: mount | grep -E "\\s/var/log\\s"',
    result: 'Passed',
    description: 'The /var/log directory is used by system services to store log files.',
    
  },
  {
    id: '36018',
    title: 'Ensure /var/log/audit is configured.',
    target: 'Command: mount | grep -E "\\s/var/log/audit\\s"',
    result: 'Failed',
    description: 'The /var/log/audit directory contains audit log files.',
    
  },
  {
    id: '36019',
    title: 'Ensure /home is configured.',
    target: 'Command: mount | grep -E "\\s/home\\s"',
    result: 'Passed',
    description: 'The /home directory is used to support users home directories.',
   
  },
  {
    id: '36020',
    title: 'Ensure nodev option set on /home partition.',
    target: 'Command: mount | grep -E "\\s/home\\s.*nodev"',
    result: 'Failed',
    description: 'The nodev mount option specifies that the filesystem cannot contain special devices.',
    
  }
]

const getResultIcon = (result: string) => {
  switch (result) {
    case 'Passed':
      return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'Failed':
      return <XCircleIcon className="w-5 h-5 text-red-500" />
    case 'Not applicable':
      return <ExclamationTriangleIcon className="w-5 h-5 text-gray-500" />
    default:
      return <InformationCircleIcon className="w-5 h-5 text-gray-500" />
  }
}

const getResultColor = (result: string) => {
  switch (result) {
    case 'Passed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'Failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'Not applicable':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'major':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'minor':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  }
}

export default function CISPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedResult, setSelectedResult] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredChecks = cisBenchmarkData.filter(check => {
    const matchesSearch = check.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesResult = selectedResult === 'all' || check.result === selectedResult
    const matchesCategory = selectedCategory === 'all' || check.category === selectedCategory
    return matchesSearch && matchesResult && matchesCategory
  })

  const totalChecks = cisBenchmarkData.length
  const passedChecks = cisBenchmarkData.filter(check => check.result === 'Passed').length
  const failedChecks = cisBenchmarkData.filter(check => check.result === 'Failed').length
  const notApplicableChecks = cisBenchmarkData.filter(check => check.result === 'Not applicable').length
  const complianceScore = Math.round((passedChecks / totalChecks) * 100)

  const categories = Array.from(new Set(cisBenchmarkData.map(check => check.category).filter(Boolean)))

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            CIS Benchmarks
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            CIS Distribution Independent Linux Benchmark v2.0.0
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Compliance Score
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {complianceScore}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Passed
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {passedChecks}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Failed
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {failedChecks}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Not Applicable
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {notApplicableChecks}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Checks
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalChecks}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search benchmark checks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedResult}
              onChange={(e) => setSelectedResult(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Results</option>
              <option value="Passed">Passed</option>
              <option value="Failed">Failed</option>
              <option value="Not applicable">Not Applicable</option>
            </select>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* CIS Benchmark Checks Table */}
      {/* CIS Benchmark Checks Table */}
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
      Benchmark Checks ({filteredChecks.length})
    </h3>
  </div>
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-900/50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Check ID
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Title
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Result
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Target
          </th>
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
        {filteredChecks.map((check) => (
          <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {check.id}
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900 dark:text-white max-w-md">
                {check.title}
              </div>
              {check.description && (
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {check.description.slice(0, 100)}...
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                {getResultIcon(check.result)}
                <span className={clsx(
                  'ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                  getResultColor(check.result)
                )}>
                  {check.result}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono max-w-xs truncate">
                {check.target}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {filteredChecks.length === 0 && (
    <div className="text-center py-12">
      <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No checks found</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Try adjusting your search criteria.
      </p>
    </div>
  )}

  <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div className="text-sm text-gray-500 dark:text-gray-400">
      Showing {filteredChecks.length} of {totalChecks} checks
    </div>
    <div className="flex items-center space-x-2">
      <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span>Refresh</span>
      </button>
      <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2">
        <ArrowDownTrayIcon className="w-4 h-4" />
        <span>Export</span>
      </button>
    </div>
  </div>
</div>

    </div>
  )
} 