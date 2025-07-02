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
      <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-900 px-6 pb-4 shadow-xl border-r border-gray-200 dark:border-gray-800">
        {/* Logo */}
        <div className="flex h-16 shrink-0 items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
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
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={clsx(
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors',
                          isActive
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                        )}
                      >
                        <item.icon
                          className={clsx(
                            'h-6 w-6 shrink-0',
                            isActive
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                          )}
                        />
                        {item.name}
                        {item.badge && (
                          <span className="ml-auto w-6 h-6 text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center">
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
              <div className="text-xs font-semibold leading-6 text-gray-400 dark:text-gray-500">
                System Status
              </div>
              <ul role="list" className="mt-2 space-y-1">
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Wazuh Manager</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400">Online</span>
                  </div>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">AI Engine</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400">Active</span>
                  </div>
                </li>
                <li className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Elasticsearch</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-600 dark:text-green-400">Healthy</span>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
} 