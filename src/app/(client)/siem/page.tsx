'use client'

import { useEffect } from 'react'
import { CpuChipIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export default function SIEMPage() {
  const handleRedirect = () => {
    // Redirect to Wazuh Portal - you can replace this URL with your actual Wazuh instance
    window.open('https://wazuh.com', '_blank')
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            SIEM Portal
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Access the Wazuh SIEM platform for advanced security monitoring
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portal Access Card */}
        <div className="card-gradient p-6 rounded-xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md">
              <CpuChipIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Wazuh SIEM Platform
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Full-featured security monitoring
              </p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Real-time security monitoring</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Advanced threat detection</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Comprehensive log analysis</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700 dark:text-gray-300">Incident response tools</span>
            </div>
          </div>

          <button
            onClick={handleRedirect}
            className="w-full inline-flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <CpuChipIcon className="w-5 h-5 mr-2" />
            Access Wazuh Portal
            <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          <div className="card-gradient p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Platform Status</p>
                <p className="text-lg font-semibold text-green-600 dark:text-green-400">Online</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className="card-gradient p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Agents</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">247</p>
              </div>
              <CpuChipIcon className="w-6 h-6 text-blue-500" />
            </div>
          </div>

          <div className="card-gradient p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Events/Second</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">1,247</p>
              </div>
              <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">▲</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="card-gradient p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          About Wazuh SIEM
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Wazuh is a free, open source and enterprise-ready security monitoring solution for threat detection, 
          integrity monitoring, incident response and compliance. It provides unified XDR and SIEM protection 
          for endpoints and cloud workloads.
        </p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
          <span>• Open Source</span>
          <span>• Enterprise Ready</span>
          <span>• Cloud Native</span>
          <span>• Scalable</span>
        </div>
      </div>
    </div>
  )
}
