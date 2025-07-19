'use client'

import React, { useState } from 'react'
import {
  ShieldCheckIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

interface NISTRequirement {
  id: string
  name: string
  count: number
  color: string
  description?: string
  controls?: string[]
  category?: 'AC' | 'AU' | 'CA' | 'CM' | 'IA' | 'SA' | 'SC' | 'SI'
}

// NIST 800-53 Requirements data
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
    count: 8, 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    description: 'Controls for creating, protecting, and retaining audit records',
    controls: ['AU-1', 'AU-2', 'AU-3', 'AU-4', 'AU-5', 'AU-6', 'AU-7', 'AU-8'],
    category: 'AU'
  },
  { 
    id: 'CA', 
    name: 'ASSESSMENT, AUTHORIZATION, AND MONITORING', 
    count: 0, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    description: 'Controls for assessing, authorizing, and monitoring security controls',
    controls: ['CA-1', 'CA-2', 'CA-3', 'CA-4', 'CA-5', 'CA-6', 'CA-7', 'CA-8'],
    category: 'CA'
  },
  { 
    id: 'IA', 
    name: 'IDENTIFICATION AND AUTHENTICATION', 
    count: 0, 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    description: 'Controls for identifying and authenticating users and devices',
    controls: ['IA-1', 'IA-2', 'IA-3', 'IA-4', 'IA-5', 'IA-6', 'IA-7', 'IA-8'],
    category: 'IA'
  },
  { 
    id: 'SA', 
    name: 'SYSTEM AND SERVICES ACQUISITION', 
    count: 0, 
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
    description: 'Controls for acquiring, developing, and maintaining systems and services',
    controls: ['SA-1', 'SA-2', 'SA-3', 'SA-4', 'SA-5', 'SA-6', 'SA-7', 'SA-8'],
    category: 'SA'
  },
  { 
    id: 'SC', 
    name: 'SYSTEM AND COMMUNICATIONS PROTECTION', 
    count: 0, 
    color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400',
    description: 'Controls for protecting system and communications at the application and network levels',
    controls: ['SC-1', 'SC-2', 'SC-3', 'SC-4', 'SC-5', 'SC-6', 'SC-7', 'SC-8'],
    category: 'SC'
  },
  { 
    id: 'SI', 
    name: 'SYSTEM AND INFORMATION INTEGRITY', 
    count: 0, 
    color: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400',
    description: 'Controls for identifying, reporting, and correcting information system flaws',
    controls: ['SI-1', 'SI-2', 'SI-3', 'SI-4', 'SI-5', 'SI-6', 'SI-7', 'SI-8'],
    category: 'SI'
  }
]

export default function NISTPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const filteredRequirements = nistRequirements.filter(requirement => {
    const matchesSearch = requirement.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         requirement.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || requirement.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalControls = nistRequirements.reduce((sum, req) => sum + req.count, 0)
  const implementedControls = nistRequirements.filter(req => req.count > 0).reduce((sum, req) => sum + req.count, 0)
  const compliancePercentage = totalControls > 0 ? Math.round((implementedControls / totalControls) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            NIST 800-53 Controls
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Security and Privacy Controls for Federal Information Systems and Organizations
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Overall Compliance
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {compliancePercentage}%
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Implemented Controls
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {implementedControls}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Total Controls
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {totalControls}
                </dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                  Control Families
                </dt>
                <dd className="text-2xl font-bold text-gray-900 dark:text-white">
                  {nistRequirements.length}
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
                placeholder="Search control families..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              {nistRequirements.map(req => (
                <option key={req.category} value={req.category}>
                  {req.id} - {req.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* NIST Control Families Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequirements.map((requirement) => (
          <div key={requirement.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {requirement.id}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {requirement.id}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {requirement.name}
                  </p>
                </div>
              </div>
              <span className={clsx(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                requirement.color
              )}>
                {requirement.count} controls
              </span>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {requirement.description}
              </p>
            </div>

            {requirement.controls && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Sample Controls:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {requirement.controls.slice(0, 4).map((control) => (
                    <span
                      key={control}
                      className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    >
                      {control}
                    </span>
                  ))}
                  {requirement.controls.length > 4 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500">
                      +{requirement.controls.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    requirement.count > 0 ? 'bg-green-500' : 'bg-red-500'
                  )}></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {requirement.count > 0 ? 'Implemented' : 'Not Implemented'}
                  </span>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRequirements.length === 0 && (
        <div className="text-center py-12">
          <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No control families found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria.
          </p>
        </div>
      )}
    </div>
  )
} 