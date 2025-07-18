'use client'

import React, { useState } from 'react'
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
    description: 'The cramfs filesystem type is a compressed read-only Linux filesystem embedded in small footprint systems.',
    category: 'Filesystem',
    severity: 'minor'
  },
  {
    id: '36001',
    title: 'Ensure mounting of freevxfs filesystems is disabled.',
    target: 'Command: modprobe -n -v freevxfs',
    result: 'Failed',
    description: 'The freevxfs filesystem type is a free version of the Veritas type filesystem.',
    category: 'Filesystem',
    severity: 'minor'
  },
  {
    id: '36002',
    title: 'Ensure mounting of jffs2 filesystems is disabled.',
    target: 'Command: modprobe -n -v jffs2',
    result: 'Failed',
    description: 'The jffs2 (journaling flash filesystem 2) filesystem type is a log-structured filesystem.',
    category: 'Filesystem',
    severity: 'minor'
  },
  {
    id: '36010',
    title: 'Ensure nosuid option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*nosuid"',
    result: 'Failed',
    description: 'The nosuid mount option specifies that the filesystem cannot contain setuid files.',
    category: 'Filesystem',
    severity: 'critical'
  },
  {
    id: '36011',
    title: 'Ensure noexec option set on /tmp partition.',
    target: 'Command: mount | grep -E "\\s/tmp\\s.*noexec"',
    result: 'Failed',
    description: 'The noexec mount option specifies that the filesystem cannot contain executable binaries.',
    category: 'Filesystem',
    severity: 'critical'
  },
  {
    id: '36018',
    title: 'Ensure /var/log/audit is configured.',
    target: 'Command: mount | grep -E "\\s/var/log/audit\\s"',
    result: 'Failed',
    description: 'The /var/log/audit directory contains audit log files.',
    category: 'Logging',
    severity: 'critical'
  }
]

// NIST 800-53 Requirements data for agents
const nistRequirements: NISTRequirement[] = [
  { 
    id: 'CM', 
    name: 'CONFIGURATION MANAGEMENT', 
    count: 192, 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    description: 'Controls for establishing and maintaining baseline configurations and inventories',
    controls: ['CM-1', 'CM-2', 'CM-3', 'CM-4', 'CM-5', 'CM-6', 'CM-7', 'CM-8'],
    category: 'CM'
  },
  { 
    id: 'AC', 
    name: 'ACCESS CONTROL', 
    count: 8, 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    description: 'Controls for limiting information system access to authorized users',
    controls: ['AC-1', 'AC-2', 'AC-3', 'AC-4', 'AC-5', 'AC-6', 'AC-7', 'AC-8'],
    category: 'AC'
  },
  { 
    id: 'AU', 
    name: 'AUDIT AND ACCOUNTABILITY', 
    count: 5, 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    description: 'Controls for creating, protecting, and retaining audit records',
    controls: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5'],
    category: 'AU'
  },
  { 
    id: 'CA', 
    name: 'ASSESSMENT, AUTHORIZATION, AND MONITORING', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for assessing, authorizing, and monitoring security controls',
    controls: [],
    category: 'CA'
  },
  { 
    id: 'IA', 
    name: 'IDENTIFICATION AND AUTHENTICATION', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for identifying and authenticating users and devices',
    controls: [],
    category: 'IA'
  },
  { 
    id: 'SA', 
    name: 'SYSTEM AND SERVICES ACQUISITION', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for acquiring, developing, and maintaining systems and services',
    controls: [],
    category: 'SA'
  },
  { 
    id: 'SC', 
    name: 'SYSTEM AND COMMUNICATIONS PROTECTION', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for protecting system and communications at the application and network levels',
    controls: [],
    category: 'SC'
  },
  { 
    id: 'SI', 
    name: 'SYSTEM AND INFORMATION INTEGRITY', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for identifying, reporting, and correcting information system flaws',
    controls: [],
    category: 'SI'
  }
]

const mockAgents: Agent[] = [
  {
    id: '1',
    name: 'Kali_Docker',
    ipAddress: '192.68.1.44',
    operatingSystem: 'Kali GNU/Linux 2025.2',
    status: 'active',
    lastSeen: '2 minutes ago',
    version: '4.8.0',
    location: 'Data Center 1'
  },
  {
    id: '2',
    name: 'Ubuntu_Server_01',
    ipAddress: '10.0.1.15',
    operatingSystem: 'Ubuntu 22.04.3 LTS',
    status: 'active',
    lastSeen: '1 minute ago',
    version: '4.8.0',
    location: 'Data Center 2'
  },
  {
    id: '3',
    name: 'Windows_DC_01',
    ipAddress: '192.168.1.100',
    operatingSystem: 'Windows Server 2022',
    status: 'active',
    lastSeen: '5 minutes ago',
    version: '4.7.2',
    location: 'Corporate HQ'
  },
  {
    id: '4',
    name: 'CentOS_Web_01',
    ipAddress: '172.16.0.50',
    operatingSystem: 'CentOS 9 Stream',
    status: 'warning',
    lastSeen: '15 minutes ago',
    version: '4.8.0',
    location: 'Data Center 1'
  },
  {
    id: '5',
    name: 'MacOS_Workstation',
    ipAddress: '10.0.2.25',
    operatingSystem: 'macOS Sonoma 14.2',
    status: 'inactive',
    lastSeen: '2 hours ago',
    version: '4.7.1',
    location: 'Office Floor 3'
  },
  {
    id: '6',
    name: 'RedHat_DB_01',
    ipAddress: '192.168.2.200',
    operatingSystem: 'Red Hat Enterprise Linux 9',
    status: 'active',
    lastSeen: '30 seconds ago',
    version: '4.8.0',
    location: 'Data Center 2'
  }
]

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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'cis' | 'nist' | 'vulnerabilities'>('dashboard')
  const [cisSearchTerm, setCisSearchTerm] = useState('')
  const [nistSearchTerm, setNistSearchTerm] = useState('')
  const [showQuarantineModal, setShowQuarantineModal] = useState(false)
  const [agentToQuarantine, setAgentToQuarantine] = useState<Agent | null>(null)

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
  const nistStats = {
    totalControls: nistRequirements.reduce((sum, req) => sum + req.count, 0),
    implementedControls: nistRequirements.filter(req => req.count > 0).reduce((sum, req) => sum + req.count, 0),
    families: nistRequirements.length,
    compliance: 0
  }
  nistStats.compliance = nistStats.totalControls > 0 ? Math.round((nistStats.implementedControls / nistStats.totalControls) * 100) : 0

  // Filter functions
  const filteredCisChecks = cisBenchmarkData.filter(check =>
    check.title.toLowerCase().includes(cisSearchTerm.toLowerCase()) ||
    check.id.toLowerCase().includes(cisSearchTerm.toLowerCase())
  )

  const filteredNistRequirements = nistRequirements.filter(req =>
    req.name.toLowerCase().includes(nistSearchTerm.toLowerCase()) ||
    req.id.toLowerCase().includes(nistSearchTerm.toLowerCase())
  )

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
              {agents.map((agent) => (
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
                  onClick={() => setActiveTab('nist')}
                  className={clsx(
                    'py-2 px-1 border-b-2 font-medium text-sm',
                    activeTab === 'nist'
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                >
                  NIST 800-53
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
                              NIST Compliance
                            </dt>
                            <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                              {nistStats.compliance}%
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
                        {cisStats.passed}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Passed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {cisStats.failed}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Failed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                        {cisStats.notApplicable}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Not applicable</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {cisStats.score}%
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
                        {filteredCisChecks.map((check) => (
                          <tr key={check.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{check.id}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{check.target}</div>
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

              {activeTab === 'nist' && (
                <div className="space-y-4">
                  {/* NIST Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        NIST 800-53 Requirements
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <input type="checkbox" className="mr-2" />
                        Hide requirements with no alerts
                      </label>
                    </div>
                  </div>

                  <div className="flex space-x-6 h-[600px]">
                    {/* Left Sidebar - Requirement Categories */}
                    <div className="w-64 flex-shrink-0">
                      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 h-full">
                        <div className="space-y-2">
                          {[
                            { id: 'CM', name: 'Requirement CM', count: 192, color: 'bg-pink-500' },
                            { id: 'AC', name: 'Requirement AC', count: 8, color: 'bg-pink-500' },
                            { id: 'AU', name: 'Requirement AU', count: 5, color: 'bg-pink-500' },
                            { id: 'CA', name: 'Requirement CA', count: 0, color: 'bg-gray-400' },
                            { id: 'IA', name: 'Requirement IA', count: 0, color: 'bg-gray-400' },
                            { id: 'SA', name: 'Requirement SA', count: 0, color: 'bg-gray-400' },
                            { id: 'SC', name: 'Requirement SC', count: 0, color: 'bg-gray-400' },
                            { id: 'SI', name: 'Requirement SI', count: 0, color: 'bg-pink-500' },
                          ].map((req) => (
                            <div key={req.id} className="flex items-center justify-between p-2 text-sm">
                              <span className="text-gray-700 dark:text-gray-300">{req.name}</span>
                              <span className={clsx(
                                'inline-flex items-center justify-center w-8 h-6 rounded text-white text-xs font-medium',
                                req.color
                              )}>
                                {req.count}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Requirements Grid */}
                    <div className="flex-1 space-y-4">
                      {/* Search Bar */}
                      <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                          type="text"
                          placeholder="Filter requirements"
                          value={nistSearchTerm}
                          onChange={(e) => setNistSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      {/* Requirements Cards Grid */}
                      <div className="overflow-y-auto h-[520px] pr-2">
                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                          {/* CM Requirements */}
                          {[
                            { id: 'CM.1', name: 'CONFIGURATION MANAGEMENT', desc: 'Establish and maintain baseline configurations and inventories of organizational systems...', alerts: 192 },
                            { id: 'AC.7', name: 'UNSUCCESSFUL LOGON ATTEMPTS', desc: 'Enforce a limit of consecutive invalid logon attempts by a user during organization-defined time period...', alerts: 8 },
                            { id: 'AU.6', name: 'AUDIT REVIEW, ANALYSIS, AND REPORTING', desc: 'Review and analyze information system audit records for indications of inappropriate or unusual activity...', alerts: 4 },
                            { id: 'AU.5', name: 'RESPONSE TO AUDIT PROCESSING FAILURES', desc: 'Alert organization-defined personnel or roles in the event of an audit processing failure...', alerts: 1 },
                            { id: 'AC.2', name: 'ACCOUNT MANAGEMENT', desc: 'Identify and select account types; assign account managers; require organization approval...', alerts: 0 },
                            { id: 'AC.6', name: 'LEAST PRIVILEGE', desc: 'Employ the principle of least privilege, allowing only authorized accesses for users...', alerts: 0 },
                            { id: 'AC.12', name: 'SESSION TERMINATION', desc: 'Automatically terminate user sessions after an organization-defined time period...', alerts: 0 },
                            { id: 'AU.8', name: 'TIME STAMPS', desc: 'Use internal system clocks to generate time stamps for audit records...', alerts: 0 },
                            { id: 'AU.9', name: 'PROTECTION OF AUDIT INFORMATION', desc: 'Protect audit information and audit tools from unauthorized access, modification, and deletion...', alerts: 0 },
                            { id: 'AU.12', name: 'AUDIT GENERATION', desc: 'Provide audit record generation capability for the auditable events...', alerts: 0 },
                            { id: 'CA.3', name: 'SYSTEM INTERCONNECTIONS', desc: 'Authorize connections from the information system to other information systems...', alerts: 0 },
                            { id: 'CM.3', name: 'CONFIGURATION CHANGE CONTROL', desc: 'Determine configuration change control elements to the information system...', alerts: 0 },
                            { id: 'CM.5', name: 'ACCESS RESTRICTIONS FOR CHANGE', desc: 'Define, document, approve, and enforce physical and logical access restrictions...', alerts: 0 },
                            { id: 'IA.4', name: 'IDENTIFIER MANAGEMENT', desc: 'Manage information system identifiers for users and devices...', alerts: 0 },
                            { id: 'IA.5', name: 'AUTHENTICATOR MANAGEMENT', desc: 'Manage information system authenticators for users and devices...', alerts: 0 },
                            { id: 'IA.10', name: 'ADAPTIVE IDENTIFICATION AND AUTHENTICATION', desc: 'Require individuals accessing the information system to employ supplemental authentication...', alerts: 0 },
                            { id: 'SA.11', name: 'DEVELOPER SECURITY TESTING', desc: 'Require the developer of the information system, system component, or information system service...', alerts: 0 },
                            { id: 'SC.2', name: 'APPLICATION PARTITIONING', desc: 'Separate user functionality from information system management functionality...', alerts: 0 },
                            { id: 'SC.7', name: 'BOUNDARY PROTECTION', desc: 'Monitor and control communications at the external boundary of the system...', alerts: 0 },
                            { id: 'SC.8', name: 'TRANSMISSION CONFIDENTIALITY', desc: 'Protect the confidentiality of transmitted information...', alerts: 0 },
                            { id: 'SI.2', name: 'FLAW REMEDIATION', desc: 'Identify, report, and correct information system flaws...', alerts: 0 },
                            { id: 'SI.3', name: 'MALICIOUS CODE PROTECTION', desc: 'Implement malicious code protection mechanisms at information system entry and exit points...', alerts: 0 },
                            { id: 'SI.7', name: 'SOFTWARE, FIRMWARE, AND INFORMATION INTEGRITY', desc: 'Employ integrity verification tools to detect unauthorized changes to software, firmware, and information...', alerts: 0 },
                          ].filter(req => 
                            req.id.toLowerCase().includes(nistSearchTerm.toLowerCase()) ||
                            req.name.toLowerCase().includes(nistSearchTerm.toLowerCase()) ||
                            req.desc.toLowerCase().includes(nistSearchTerm.toLowerCase())
                          ).map((requirement) => (
                            <div key={requirement.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                  <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                    {requirement.id}
                                  </span>
                                  <span className="text-xs text-gray-500">-</span>
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                                    {requirement.name.slice(0, 25)}...
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="text-xs text-gray-500 dark:text-gray-400">{requirement.alerts}</span>
                                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              
                              <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                {requirement.desc}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
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

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">9</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-red-600 dark:text-red-400">1</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Critical</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">3</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">High</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">5</div>
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
                          {/* SVG Donut Chart */}
                          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                            {/* Background circle */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="currentColor"
                              strokeWidth="8"
                              fill="transparent"
                              className="text-gray-200 dark:text-gray-700"
                            />
                            
                            {/* Critical - 11.1% (1/9) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#dc2626"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="27.6 224.4"
                              strokeDashoffset="0"
                              className="transition-all duration-500"
                            />
                            
                            {/* High - 33.3% (3/9) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#ea580c"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="83.7 168.3"
                              strokeDashoffset="-27.6"
                              className="transition-all duration-500"
                            />
                            
                            {/* Medium - 44.4% (4/9) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#d97706"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="111.3 140.7"
                              strokeDashoffset="-111.3"
                              className="transition-all duration-500"
                            />
                            
                            {/* Low - 11.1% (1/9) */}
                            <circle
                              cx="50"
                              cy="50"
                              r="40"
                              stroke="#16a34a"
                              strokeWidth="8"
                              fill="transparent"
                              strokeDasharray="27.6 224.4"
                              strokeDashoffset="-222.6"
                              className="transition-all duration-500"
                            />
                          </svg>
                          
                          {/* Center text */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-900 dark:text-white">9</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Critical</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">1 (11.1%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-orange-600 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">High</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">3 (33.3%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Medium</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">4 (44.4%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">Low</span>
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">1 (11.1%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Top Packages Bar Chart */}
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Top Vulnerable Packages
                        </h4>
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                      </div>

                      {/* Bar Chart */}
                      <div className="space-y-4">
                        {[
                          { name: 'urllib3', count: 2, percentage: 100 },
                          { name: 'Django', count: 1, percentage: 50 },
                          { name: 'Flask', count: 1, percentage: 50 },
                          { name: 'cryptography', count: 1, percentage: 50 },
                          { name: 'h11', count: 1, percentage: 50 },
                        ].map((pkg, index) => (
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
                            <div className="text-lg font-bold text-gray-900 dark:text-white">5</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">Affected Packages</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 dark:text-white">6</div>
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
                      {[
                        { date: '2024-01-15', severity: 'Critical', cve: 'CVE-2024-0001', package: 'urllib3', status: 'Open' },
                        { date: '2024-01-10', severity: 'High', cve: 'CVE-2024-0002', package: 'Django', status: 'Open' },
                        { date: '2024-01-08', severity: 'High', cve: 'CVE-2024-0003', package: 'Flask', status: 'Patched' },
                        { date: '2024-01-05', severity: 'Medium', cve: 'CVE-2024-0004', package: 'cryptography', status: 'Open' },
                        { date: '2024-01-03', severity: 'Low', cve: 'CVE-2024-0005', package: 'h11', status: 'Open' },
                      ].map((vuln, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                          <div className="flex-shrink-0">
                            <div className={`w-3 h-3 rounded-full ${
                              vuln.severity === 'Critical' ? 'bg-red-600' :
                              vuln.severity === 'High' ? 'bg-orange-600' :
                              vuln.severity === 'Medium' ? 'bg-yellow-600' : 'bg-green-600'
                            }`}></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {vuln.cve} - {vuln.package}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {vuln.date} • {vuln.severity}
                                </p>
                              </div>
                              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                vuln.status === 'Open' 
                                  ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              }`}>
                                {vuln.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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
                    <span className="text-sm font-mono text-gray-900 dark:text-white">{agentToQuarantine.ipAddress}</span>
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
