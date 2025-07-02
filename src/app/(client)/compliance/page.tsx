'use client'

import { useState } from 'react'
import { ShieldCheckIcon, ArrowDownTrayIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface ComplianceRule {
  id: string
  name: string
  description: string
  framework: 'ISO27001' | 'SOC2' | 'PCI-DSS' | 'HIPAA' | 'GDPR'
  status: 'compliant' | 'non-compliant' | 'pending'
  lastChecked: string
  evidence?: string[]
  controlFamily: string
}

const mockRules: ComplianceRule[] = [
  {
    id: 'ISO-A.12.6.1',
    name: 'Management of technical vulnerabilities',
    description: 'Information about technical vulnerabilities of information systems being used shall be obtained in a timely fashion.',
    framework: 'ISO27001',
    status: 'compliant',
    lastChecked: '2 days ago',
    evidence: ['Vulnerability scan reports', 'Patch management logs'],
    controlFamily: 'A.12 Operations Security'
  },
  {
    id: 'ISO-A.9.2.1',
    name: 'User registration and de-registration',
    description: 'A formal user registration and de-registration process shall be implemented.',
    framework: 'ISO27001',
    status: 'compliant',
    lastChecked: '1 week ago',
    evidence: ['User access logs', 'HR onboarding/offboarding procedures'],
    controlFamily: 'A.9 Access Control'
  },
  {
    id: 'ISO-A.12.4.1',
    name: 'Event logging',
    description: 'Event logs recording user activities, exceptions, faults and information security events shall be produced.',
    framework: 'ISO27001',
    status: 'non-compliant',
    lastChecked: '3 days ago',
    evidence: [],
    controlFamily: 'A.12 Operations Security'
  },
  {
    id: 'SOC2-CC6.1',
    name: 'Logical and Physical Access Controls',
    description: 'The entity implements logical and physical access controls to protect against threats from sources outside its system boundaries.',
    framework: 'SOC2',
    status: 'pending',
    lastChecked: '1 day ago',
    evidence: ['Access control matrix', 'Physical security procedures'],
    controlFamily: 'Common Criteria'
  },
  {
    id: 'PCI-DSS-2.1',
    name: 'Default passwords and security parameters',
    description: 'Always change vendor-supplied defaults and remove or disable unnecessary default accounts.',
    framework: 'PCI-DSS',
    status: 'compliant',
    lastChecked: '5 days ago',
    evidence: ['System configuration audits', 'Default account reports'],
    controlFamily: 'Requirement 2'
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'non-compliant': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getFrameworkColor = (framework: string) => {
  switch (framework) {
    case 'ISO27001': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
    case 'SOC2': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    case 'PCI-DSS': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    case 'HIPAA': return 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400'
    case 'GDPR': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export default function CompliancePage() {
  const [rules] = useState<ComplianceRule[]>(mockRules)
  const [selectedFramework, setSelectedFramework] = useState<string>('all')

  const filteredRules = selectedFramework === 'all' 
    ? rules 
    : rules.filter(rule => rule.framework === selectedFramework)

  const compliantCount = rules.filter(rule => rule.status === 'compliant').length
  const nonCompliantCount = rules.filter(rule => rule.status === 'non-compliant').length
  const pendingCount = rules.filter(rule => rule.status === 'pending').length
  const totalRules = rules.length
  const compliancePercentage = Math.round((compliantCount / totalRules) * 100)

  const exportEvidence = (ruleId: string) => {
    console.log(`Exporting evidence for rule ${ruleId}`)
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Compliance Snapshot
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Security framework compliance monitoring and evidence management
        </p>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShieldCheckIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Overall Compliance
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {compliancePercentage}%
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 font-semibold">✓</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Compliant
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {compliantCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Non-Compliant
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {nonCompliantCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 font-semibold">⏳</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    Pending Review
                  </dt>
                  <dd className="text-lg font-medium text-gray-900 dark:text-white">
                    {pendingCount}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter by Framework:
          </label>
          <select
            value={selectedFramework}
            onChange={(e) => setSelectedFramework(e.target.value)}
            className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All Frameworks</option>
            <option value="ISO27001">ISO 27001</option>
            <option value="SOC2">SOC 2</option>
            <option value="PCI-DSS">PCI-DSS</option>
            <option value="HIPAA">HIPAA</option>
            <option value="GDPR">GDPR</option>
          </select>
          <div className="flex-1" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded transition-colors">
            Export All Evidence
          </button>
        </div>
      </div>

      {/* Compliance Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Compliance Rules ({filteredRules.length})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Security framework controls and evidence mapping
          </p>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      {rule.name}
                    </h4>
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      getFrameworkColor(rule.framework)
                    )}>
                      {rule.framework}
                    </span>
                    <span className={clsx(
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
                      getStatusColor(rule.status)
                    )}>
                      {rule.status.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {rule.description}
                  </p>
                  
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-mono">{rule.id}</span>
                    <span>•</span>
                    <span>{rule.controlFamily}</span>
                    <span>•</span>
                    <span>Last checked: {rule.lastChecked}</span>
                  </div>

                  {rule.evidence && rule.evidence.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Evidence
                      </p>
                      <div className="mt-1 space-y-1">
                        {rule.evidence.map((evidence, index) => (
                          <span
                            key={index}
                            className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs px-2 py-1 rounded mr-2"
                          >
                            {evidence}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-2 items-end">
                  {rule.evidence && rule.evidence.length > 0 && (
                    <button
                      onClick={() => exportEvidence(rule.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                                             <ArrowDownTrayIcon className="w-3 h-3 mr-1" />
                      Export CSV
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 