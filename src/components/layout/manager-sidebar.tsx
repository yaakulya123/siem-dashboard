'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BuildingOfficeIcon,
  ChartBarIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

export default function ManagerSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { 
      name: 'Client Overview', 
      href: '/manager', 
      icon: BuildingOfficeIcon,
      description: 'Manage client security operations'
    },
    { 
      name: 'Analytics', 
      href: '/manager/analytics', 
      icon: ChartBarIcon,
      description: 'Business metrics and insights'
    },
    { 
      name: 'Team Management', 
      href: '/manager/team', 
      icon: UserGroupIcon,
      description: 'Manage SOC analysts and teams'
    },
    { 
      name: 'Billing & Plans', 
      href: '/manager/billing', 
      icon: CurrencyDollarIcon,
      description: 'Client billing and service plans'
    },
    { 
      name: 'Settings', 
      href: '/manager/settings', 
      icon: Cog6ToothIcon,
      description: 'Manager configuration'
    }
  ];

  return (
    <div className={clsx(
      'bg-gray-900 border-r border-gray-700 flex flex-col transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold text-white">SOC Manager</h1>
              <p className="text-sm text-gray-400">Client Management Portal</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4" />
            ) : (
              <ChevronLeftIcon className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
              title={isCollapsed ? item.name : ''}
            >
              <item.icon className={clsx('w-5 h-5', !isCollapsed && 'mr-3')} />
              {!isCollapsed && (
                <div>
                  <div>{item.name}</div>
                  <div className="text-xs text-gray-400">{item.description}</div>
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link
          href="/"
          className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={isCollapsed ? 'Switch to Operator View' : ''}
        >
          <EyeIcon className={clsx('w-5 h-5', !isCollapsed && 'mr-3')} />
          {!isCollapsed && 'Switch to Operator View'}
        </Link>
        <button className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
          <ArrowRightOnRectangleIcon className={clsx('w-5 h-5', !isCollapsed && 'mr-3')} />
          {!isCollapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
} 