'use client'

import { useState } from 'react'
import { BellIcon } from '@heroicons/react/24/outline'
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { clsx } from 'clsx'

export function Header() {
  const [notifications] = useState([
    { id: 1, message: 'Critical alert: Unusual login activity detected', time: '2 min ago', read: false },
    { id: 2, message: 'Weekly security report is ready', time: '1 hour ago', read: false },
    { id: 3, message: 'System maintenance scheduled for tonight', time: '3 hours ago', read: true },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200/70 dark:border-gray-800/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        {/* Spacer to push content to the right */}
        <div className="flex-1"></div>
        
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Notifications */}
          <Menu as="div" className="relative">
            <Menu.Button className="relative rounded-full p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/80 dark:bg-gray-800/80 shadow-sm border border-gray-100/50 dark:border-gray-700/30 transition-all duration-200 hover:scale-105">
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none border border-gray-100 dark:border-gray-700/50">
                <div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-700/50">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <Menu.Item key={notification.id}>
                      {({ active }) => (
                        <div
                          className={clsx(
                            active ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                            'px-4 py-3 cursor-pointer border-b border-gray-50 dark:border-gray-700/30 last:border-0'
                          )}
                        >
                          <p className={clsx(
                            'text-sm',
                            notification.read 
                              ? 'text-gray-600 dark:text-gray-400' 
                              : 'text-gray-900 dark:text-white font-medium'
                          )}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700/50">
                  <a href="#" className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                    View all notifications
                  </a>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          {/* Profile dropdown */}
          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-x-4 text-sm leading-6 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full">
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-gray-50 overflow-hidden ring-2 ring-white dark:ring-gray-700 shadow-md">
                <img
                  className="h-full w-full object-cover"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User profile"
                />
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-medium leading-6" aria-hidden="true">
                  John Anderson
                </span>
              </span>
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-150"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-xl bg-white dark:bg-gray-800 py-1 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none border border-gray-100 dark:border-gray-700/50">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">john.anderson@codecnet.io</p>
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={clsx(
                        active ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                        'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                      )}
                    >
                      Your profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={clsx(
                        active ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                        'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300'
                      )}
                    >
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="#"
                      className={clsx(
                        active ? 'bg-gray-50 dark:bg-gray-700/50' : '',
                        'block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700/50'
                      )}
                    >
                      Sign out
                    </a>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </div>
  )
} 