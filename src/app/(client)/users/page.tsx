'use client'

import React, { useState, useEffect } from 'react'
import {
  ComputerDesktopIcon,
  PlusIcon,
  ServerIcon,
  GlobeAltIcon,
  CpuChipIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  XMarkIcon,
  InformationCircleIcon,
  ChartBarIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface Agent {
  id: string
  name: string
  ipAddress: string
  operatingSystem: string
  status: 'active' | 'inactive' | 'warning' | 'quarantined'
  lastSeen: string
  version: string
  location: string
  pass?: number
  fail?: number
  invalid?: number
  score?: number
  cis_checks?: BenchmarkCheck[]
  vulnerabilities?: {
    name: string
    id: string
    severity: number
  }[]
}

interface BenchmarkCheck {
  id: string
  title: string
  target: string
  result: 'Passed' | 'Failed' | 'Not applicable'
  description?: string
  category?: string
  severity?: 'critical' | 'major' | 'minor'
}

interface NISTRequirement {
  id: string
  name: string
  count: number
  color: string
  description?: string
  controls?: string[]
  category?: 'AC' | 'AU' | 'CA' | 'CM' | 'IA' | 'SA' | 'SC' | 'SI'
}

// CIS Benchmark data for agents
const cisBenchmarkData: BenchmarkCheck[] = [
  {
    id: '36000',
    title: 'Ensure mounting of cramfs filesystems is disabled.',
    target: 'Command: modprobe -n -v cramfs.ismod',
    result: 'Passed',
    description: 'The cramfs filesystem type is a compressed read-only Linux filesystem embedded in small footprint systems.'
  },
  {
    id: '36001',
    title: 'Ensure mounting of freevxfs filesystems is disabled.',
    target: 'Command: modprobe -n -v freevxfs',
    result: 'Failed',
    description: 'The freevxfs filesystem type is a free version of the Veritas type filesystem.'
  },
  {
    id: '36002',
    title: 'Ensure mounting of jffs2 filesystems is disabled.',
    target: 'Command: modprobe -n -v jffs2',
    result: 'Failed',
    description: 'The jffs2 (journaling flash filesystem 2) filesystem type is a log-structured filesystem.'
  },
  {
    id: '36010',
    title: 'Ensure nosuid option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*nosuid"',
    result: 'Failed',
    description: 'The nosuid mount option specifies that the filesystem cannot contain setuid files.'
  },
  {
    id: '36011',
    title: 'Ensure noexec option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*noexec"',
    result: 'Failed',
    description: 'The noexec mount option specifies that the filesystem cannot contain executable binaries.'
  },
  {
    id: '36018',
    title: 'Ensure /var/log/audit is configured.',
    target: 'Command: mount | grep -E "\\s/var/log/audit\\s"',
    result: 'Failed',
    description: 'The /var/log/audit directory contains audit log files.'
  }
]

// NIST 800-53 Requirements data for agents
// const nistRequirements: NISTRequirement[] = [
//   {
//     id: 'CM',
//     name: 'CONFIGURATION MANAGEMENT',
//     count: 192,
//     color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
//     description: 'Controls for establishing and maintaining baseline configurations and inventories',
//     controls: ['CM-1', 'CM-2', 'CM-3', 'CM-4', 'CM-5', 'CM-6', 'CM-7', 'CM-8'],
//     category: 'CM'
//   },
//   {
//     id: 'AC',
//     name: 'ACCESS CONTROL',
//     count: 8,
//     color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
//     description: 'Controls for limiting information system access to authorized users',
//     controls: ['AC-1', 'AC-2', 'AC-3', 'AC-4', 'AC-5', 'AC-6', 'AC-7', 'AC-8'],
//     category: 'AC'
//   },
//   {
//     id: 'AU',
//     name: 'AUDIT AND ACCOUNTABILITY',
//     count: 5,
//     color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
//     description: 'Controls for creating, protecting, and retaining audit records',
//     controls: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5'],
//     category: 'AU'
//   },
//   {
//     id: 'CA',
//     name: 'ASSESSMENT, AUTHORIZATION, AND MONITORING',
//     count: 0,
//     color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     description: 'Controls for assessing, authorizing, and monitoring security controls',
//     controls: [],
//     category: 'CA'
//   },
//   {
//     id: 'IA',
//     name: 'IDENTIFICATION AND AUTHENTICATION',
//     count: 0,
//     color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     description: 'Controls for identifying and authenticating users and devices',
//     controls: [],
//     category: 'IA'
//   },
//   {
//     id: 'SA',
//     name: 'SYSTEM AND SERVICES ACQUISITION',
//     count: 0,
//     color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     description: 'Controls for acquiring, developing, and maintaining systems and services',
//     controls: [],
//     category: 'SA'
//   },
//   {
//     id: 'SC',
//     name: 'SYSTEM AND COMMUNICATIONS PROTECTION',
//     count: 0,
//     color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     description: 'Controls for protecting system and communications at the application and network levels',
//     controls: [],
//     category: 'SC'
//   },
//   {
//     id: 'SI',
//     name: 'SYSTEM AND INFORMATION INTEGRITY',
//     count: 0,
//     color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
//     description: 'Controls for identifying, reporting, and correcting information system flaws',
//     controls: [],
//     category: 'SI'
//   }
// ]

const mockAgents: Agent[] = []

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    case 'quarantined': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircleIcon className="w-5 h-5 text-green-500" />
    case 'inactive': return <XCircleIcon className="w-5 h-5 text-red-500" />
    case 'warning': return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
    case 'quarantined': return <ShieldExclamationIcon className="w-5 h-5 text-orange-500" />
    default: return <XCircleIcon className="w-5 h-5 text-gray-500" />
  }
}

const getOSIcon = (os: string) => {
  if (os.toLowerCase().includes('linux') || os.toLowerCase().includes('ubuntu') || os.toLowerCase().includes('centos') || os.toLowerCase().includes('kali') || os.toLowerCase().includes('red hat')) {
    return <ServerIcon className="w-5 h-5 text-blue-500" />
  } else if (os.toLowerCase().includes('windows')) {
    return <ComputerDesktopIcon className="w-5 h-5 text-blue-600" />
  } else if (os.toLowerCase().includes('macos')) {
    return <ComputerDesktopIcon className="w-5 h-5 text-gray-600" />
  }
  return <CpuChipIcon className="w-5 h-5 text-gray-500" />
}

const getResultIcon = (result: string) => {
  switch (result) {
    case 'Passed':
      return <CheckCircleIcon className="w-4 h-4 text-green-500" />
    case 'Failed':
      return <XCircleIcon className="w-4 h-4 text-red-500" />
    case 'Not applicable':
      return <ExclamationTriangleIcon className="w-4 h-4 text-gray-500" />
    default:
      return <InformationCircleIcon className="w-4 h-4 text-gray-500" />
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [showAgentModal, setShowAgentModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cis' | 'vulnerabilities'>('dashboard')
  const [cisSearchTerm, setCisSearchTerm] = useState('')
  const [nistSearchTerm, setNistSearchTerm] = useState('')
  const [showQuarantineModal, setShowQuarantineModal] = useState(false)
  const [agentToQuarantine, setAgentToQuarantine] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const toggleAgentStatus = (agentId: string) => {
    setAgents(agents.map(agent =>
      agent.id === agentId ? {
        ...agent,
        status: agent.status === 'active' ? 'inactive' : 'active'
      } : agent
    ))
  }

  const deleteAgent = (agentId: string) => {
    setAgents(agents.filter(agent => agent.id !== agentId))
  }

  const openQuarantineModal = (agent: Agent) => {
    setAgentToQuarantine(agent)
    setShowQuarantineModal(true)
  }

  const confirmQuarantine = () => {
    if (agentToQuarantine) {
      setAgents(agents.map(agent =>
        agent.id === agentToQuarantine.id ? {
          ...agent,
          status: 'quarantined' as any
        } : agent
      ))
      setShowQuarantineModal(false)
      setAgentToQuarantine(null)
    }
  }

  const cancelQuarantine = () => {
    setShowQuarantineModal(false)
    setAgentToQuarantine(null)
  }

  const openAgentModal = (agent: Agent) => {
    setSelectedAgent(agent)
    setShowAgentModal(true)
    setActiveTab('dashboard')
  }

  const closeAgentModal = () => {
    setShowAgentModal(false)
    setSelectedAgent(null)
    setActiveTab('dashboard')
    setCisSearchTerm('')
    setNistSearchTerm('')
  }

  // CIS Benchmark calculations
  const cisStats = {
    total: cisBenchmarkData.length,
    passed: cisBenchmarkData.filter(check => check.result === 'Passed').length,
    failed: cisBenchmarkData.filter(check => check.result === 'Failed').length,
    notApplicable: cisBenchmarkData.filter(check => check.result === 'Not applicable').length,
    score: 0
  }
  cisStats.score = Math.round((cisStats.passed / cisStats.total) * 100)

  // NIST calculations
  // const nistStats = {
  //   totalControls: nistRequirements.reduce((sum, req) => sum + req.count, 0),
  //   implementedControls: nistRequirements.filter(req => req.count > 0).reduce((sum, req) => sum + req.count, 0),
  //   families: nistRequirements.length,
  //   compliance: 0
  // }
  // nistStats.compliance = nistStats.totalControls > 0 ? Math.round((nistStats.implementedControls / nistStats.totalControls) * 100) : 0

  // Filter functions
  const filteredCisChecks =
    activeTab === 'cis' && selectedAgent && Array.isArray(selectedAgent.cis_checks)
      ? selectedAgent.cis_checks.filter((check: any) =>
        (check.title?.toLowerCase() || '').includes(cisSearchTerm.toLowerCase()) ||
        (String(check.id) || '').toLowerCase().includes(cisSearchTerm.toLowerCase())
      )
      : []

  // const filteredNistRequirements = nistRequirements.filter(req =>
  //   req.name.toLowerCase().includes(nistSearchTerm.toLowerCase()) ||
  //   req.id.toLowerCase().includes(nistSearchTerm.toLowerCase())
  // )

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/agents-summary")
      .then(res => {
        if (!res.ok) throw new Error("Agent fetch failed");
        return res.json();
      })
      .then(data => {
        if (data && typeof data.agents === 'object' && data.agents !== null) {
          const agentsArray = Object.entries(data.agents).map(([id, agentObj]) => {
            const agent = agentObj as Record<string, any>;
            return {
              id,
              name: agent.name || 'Unknown',
              ipAddress: agent.ip || '',
              operatingSystem: agent.os_name + (agent.os_version ? ' ' + agent.os_version : ''),
              status: agent.status || 'inactive',
              lastSeen: 'Unknown',
              version: agent.os_version || '',
              location: agent.location || 'location',
              cis_checks: agent.cis_checks || [],
              pass: agent.pass ?? 0,
              fail: agent.fail ?? 0,
              invalid: agent.invalid ?? 0,
              score: agent.score ?? 0,
              vulnerabilities: agent.vulnerabilities,
            };
          });
          setAgents(agentsArray);
        } else if (Array.isArray(data)) {
          setAgents(data);
        } else if (data && Array.isArray(data.agents)) {
          setAgents(data.agents);
        } else {
          setAgents([]);
        }
        setLoading(false);
      })
      .catch(err => {
        setFetchError(String(err));
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading agent data...</div>;
  if (fetchError) return <div style={{ color: "red" }}>Error: {fetchError}</div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Agents Overview
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Monitor and manage security agents across your infrastructure
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Agent
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Security Agents ({agents.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Operating System
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Seen
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {(Array.isArray(agents) ? agents : []).map((agent) => (
                <tr
                  key={agent.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  onClick={() => openAgentModal(agent)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{agent.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="mr-3">{getOSIcon(agent.operatingSystem)}</div>
                      <div>
                        <div className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          {agent.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{agent.location}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <GlobeAltIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm font-mono text-gray-900 dark:text-white">{agent.ipAddress}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{agent.operatingSystem}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Version {agent.version}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(agent.status)}
                      <span className={clsx('ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full', getStatusColor(agent.status))}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.lastSeen}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 items-center">
                      {agent.status !== 'quarantined' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            openQuarantineModal(agent)
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-orange-50 hover:border-orange-300 hover:text-orange-700 dark:hover:bg-orange-900/20 dark:hover:border-orange-600 dark:hover:text-orange-400 transition-colors"
                        >
                          <ShieldExclamationIcon className="w-4 h-4 mr-1" />
                          Quarantine
                        </button>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-orange-800 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 rounded-md">
                          <ShieldExclamationIcon className="w-4 h-4 mr-1" />
                          Quarantined
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent Details Modal */}
      {showAgentModal && selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  {getOSIcon(selectedAgent.operatingSystem)}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedAgent.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedAgent.operatingSystem} • {selectedAgent.ipAddress}
                  </p>
                </div>
              </div>
              <button
                onClick={closeAgentModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="px-6 py-2 border-b border-gray-200 dark:border-gray-700">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'dashboard'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('cis')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'cis'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  CIS Benchmarks
                </button>
                <button
                  onClick={() => setActiveTab('vulnerabilities')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'vulnerabilities'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  Vulnerability Detection
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* Agent Overview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ChartBarIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div className="ml-5">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              CIS Compliance
                            </dt>
                            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                              {cisStats.score}%
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <ChartBarIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Total Vulnerability
                            </dt>
                            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                              {(selectedAgent.vulnerabilities && selectedAgent.vulnerabilities.length) || 0}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <CheckCircleIcon className="h-8 w-8 text-green-600" />
                        </div>
                        <div className="ml-5">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                              Agent Status
                            </dt>
                            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                              {selectedAgent.status.charAt(0).toUpperCase() + selectedAgent.status.slice(1)}
                            </dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Agent Details */}
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Agent Information</h3>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Agent ID</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedAgent.id}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedAgent.version}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedAgent.location}</dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Seen</dt>
                        <dd className="text-sm text-gray-900 dark:text-white">{selectedAgent.lastSeen}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === 'cis' && (
                <div className="space-y-6">
                  {/* CIS Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      CIS Distribution Independent Linux Benchmark v2.0.0
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      End scan: Jul 9, 2025 @ 17:23:10.000
                    </p>
                  </div>

                  {/* CIS Stats */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {selectedAgent.pass ?? 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Passed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {selectedAgent.fail ?? 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {selectedAgent.invalid ?? 0}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Not applicable</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {selectedAgent.score ?? 0}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Score</div>
                    </div>
                  </div>

                  {/* CIS Search */}
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Filter requirements"
                      value={cisSearchTerm}
                      onChange={(e) => setCisSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* CIS Checks Table */}
                  <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Check</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Result</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredCisChecks.map((check: any) => (
                          <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{check.id}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{check.command}</div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="text-sm text-gray-900 dark:text-white">{check.title}</div>
                              {check.description && (
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {check.description.slice(0, 100)}...
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3">
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'vulnerabilities' && (
                <div className="space-y-6">
                  {/* Vulnerability Detection Header */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Vulnerability Detection
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Security vulnerabilities found on this agent
                    </p>
                  </div>

                  {/* --- Calculate stats from selectedAgent.vulnerabilities --- */}
                  {(() => {
                    const vulns = selectedAgent.vulnerabilities || [];
                    const total = vulns.length;
                    const critical = vulns.filter(v => v.severity >= 9).length;
                    const high = vulns.filter(v => v.severity >= 7 && v.severity < 9).length;
                    const medium = vulns.filter(v => v.severity >= 4 && v.severity < 7).length;
                    const low = vulns.filter(v => v.severity >= 0 && v.severity < 4).length;
                    const unknown = vulns.filter(v => v.severity < 0).length;

                    // For donut chart
                    const donutData = [
                      { label: 'Critical', value: critical, color: '#dc2626' },
                      { label: 'High', value: high, color: '#ea580c' },
                      { label: 'Medium', value: medium, color: '#d97706' },
                      { label: 'Low', value: low, color: '#16a34a' },
                    ];
                    const donutTotal = donutData.reduce((sum, d) => sum + d.value, 0) || 1;
                    let offset = 0;

                    // Top vulnerable packages
                    const pkgMap: Record<string, number> = {};
                    vulns.forEach(v => {
                      if (v.name) pkgMap[v.name] = (pkgMap[v.name] || 0) + 1;
                    });
                    const topPkgs = Object.entries(pkgMap)
                      .sort((a, b) => b[1] - a[1])
                      .map(([name, count]) => ({
                        name,
                        count,
                        percentage: Math.round((count / total) * 100)
                      }))
                      .slice(0, 5);

                    return (
                      <>
                        {/* Summary Stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{critical}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{high}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
                          </div>
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{medium + low}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Med+Low</div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Left Side - Severity Distribution Chart */}
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                              Severity Distribution
                            </h4>
                            {/* Donut Chart */}
                            <div className="flex items-center justify-center mb-6">
                              <div className="relative w-48 h-48">
                                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="transparent"
                                    className="text-gray-200 dark:text-gray-700"
                                  />
                                  {donutData.map((d, i) => {
                                    const percent = (d.value / donutTotal) * 100;
                                    const dash = (percent / 100) * 251.2;
                                    const circle = (
                                      <circle
                                        key={d.label}
                                        cx="50"
                                        cy="50"
                                        r="40"
                                        stroke={d.color}
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={`${dash} ${251.2 - dash}`}
                                        strokeDashoffset={-offset}
                                        className="transition-all duration-500"
                                      />
                                    );
                                    offset += dash;
                                    return circle;
                                  })}
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="text-center">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{total}</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Legend */}
                            <div className="space-y-3">
                              {donutData.map(d => (
                                <div key={d.label} className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }}></div>
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{d.label}</span>
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {d.value} ({((d.value / donutTotal) * 100).toFixed(1)}%)
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                          {/* Right Side - Top Packages Bar Chart */}
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                                Top Vulnerable Packages
                              </h4>
                            </div>
                            <div className="space-y-4">
                              {topPkgs.map((pkg, index) => (
                                <div key={index} className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                                      {pkg.name}
                                    </button>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                      {pkg.count}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${pkg.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            {/* Additional Stats */}
                            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                              <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                  <div className="text-lg font-bold text-gray-900 dark:text-white">{topPkgs.length}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Affected Packages</div>
                                </div>
                                <div>
                                  <div className="text-lg font-bold text-gray-900 dark:text-white">{total}</div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400">Total CVEs</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Detailed Vulnerability Timeline */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Vulnerability Timeline
                          </h4>
                          <div className="space-y-4">
                            {vulns.map((vuln: any, index: number) => (
                              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <div className="flex-shrink-0">
                                  <div className={`w-3 h-3 rounded-full ${vuln.severity >= 9 ? 'bg-red-600' :
                                    vuln.severity >= 7 ? 'bg-orange-600' :
                                      vuln.severity >= 4 ? 'bg-yellow-600' :
                                        vuln.severity >= 0 ? 'bg-green-600' : 'bg-gray-400'
                                    }`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {vuln.id} - {vuln.name}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Severity: {vuln.severity}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            {vulns.length === 0 && (
                              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                                No vulnerabilities found for this agent.
                              </div>
                            )}
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quarantine Confirmation Modal */}
      {showQuarantineModal && agentToQuarantine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ShieldExclamationIcon className="w-8 h-8 text-orange-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Quarantine Agent
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action will isolate the agent from the network
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                        Warning: This action cannot be undone
                      </h4>
                      <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                        The agent will be immediately isolated and require manual intervention to restore connectivity.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Agent Name:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{agentToQuarantine.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">IP Address:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{agentToQuarantine.ipAddress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Operating System:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{agentToQuarantine.operatingSystem}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button
                onClick={cancelQuarantine}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmQuarantine}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <ShieldExclamationIcon className="w-4 h-4 mr-2 inline" />
                Quarantine Agent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}



