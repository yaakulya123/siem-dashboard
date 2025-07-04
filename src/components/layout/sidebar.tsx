'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  ExclamationTriangleIcon,
  DocumentChartBarIcon,
  ShieldCheckIcon,
  UsersIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import { clsx } from 'clsx'

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon, badge: null },
  { name: 'Live Alerts', href: '/alerts', icon: ExclamationTriangleIcon, badge: 12 },
  { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, badge: null },
  { name: 'Compliance', href: '/compliance', icon: ShieldCheckIcon, badge: null },
  { name: 'Users & Roles', href: '/users', icon: UsersIcon, badge: null },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, badge: null },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-6 pb-4 shadow-xl border-r border-gray-200/70 dark:border-gray-800/50">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 animate-float">
              <ShieldCheckIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300">
                Codec Net
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                AI Based SIEM Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1.5">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group flex gap-x-3 rounded-xl p-2.5 text-sm leading-6 font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/30 dark:to-blue-800/20 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-800/30'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            'h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110',
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          )}
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto w-6 h-6 text-xs font-medium bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/40 dark:to-red-800/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center shadow-sm border border-red-200/50 dark:border-red-800/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>

            {/* Status indicators */}
            <li className="mt-auto">
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                System Status
              </div>
              <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-3 border border-gray-100 dark:border-gray-700/30 shadow-sm">
                <ul role="list" className="space-y-2.5">
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Wazuh Manager</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="status-dot active"></div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium">Online</span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">AI Engine</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="status-dot active"></div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium">Active</span>
                    </div>
                  </li>
                  <li className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Elasticsearch</span>
                    <div className="flex items-center space-x-1.5">
                      <div className="status-dot active"></div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-medium">Healthy</span>
                    </div>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 