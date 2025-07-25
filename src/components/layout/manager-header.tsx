'use client';

import { 
  BellIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon, 
  ShieldCheckIcon, 
  ChartBarIcon 
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthSession } from '@/lib/auth';
import toast from 'react-hot-toast';

export default function ManagerHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const router = useRouter();

  const handleSignOut = () => {
    clearAuthSession()
    toast.success('Successfully signed out', {
      duration: 2000,
    })
    router.push('/login')
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Side - Quick Stats */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-400" />
            <div>
              <div className="text-sm font-medium text-white">System Status</div>
              <div className="text-xs text-green-400">All Systems Operational</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="w-5 h-5 text-blue-400" />
            <div>
              <div className="text-sm font-medium text-white">SOC Efficiency</div>
              <div className="text-xs text-blue-400">94.2% (+2.1%)</div>
            </div>
          </div>
        </div>

        {/* Right Side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                3
              </span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-sm font-medium text-white">Executive Notifications</h3>
                </div>
                <div className="py-2">
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <div className="font-medium text-white">Quarterly Security Review Due</div>
                    <div className="text-xs text-gray-400">Compliance report needs approval</div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <div className="font-medium text-white">Team Performance Alert</div>
                    <div className="text-xs text-gray-400">Sarah Chen exceeded 100% efficiency</div>
                  </div>
                  <div className="px-4 py-3 hover:bg-gray-700 cursor-pointer">
                    <div className="font-medium text-white">Integration Issue</div>
                    <div className="text-xs text-gray-400">Microsoft Sentinel sync delayed</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-2 p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-white">Alex Thompson</div>
                <div className="text-xs text-gray-400">SOC Manager</div>
              </div>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="p-2 border-b border-gray-700">
                  <div className="text-sm font-medium text-white">Manager Account</div>
                </div>
                <div className="py-2">
                  <Link
                    href="/manager/profile"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <UserIcon className="mr-3 h-4 w-4" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/manager/preferences"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <Cog6ToothIcon className="mr-3 h-4 w-4" />
                    Preferences
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link
                    href="/"
                    className="flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700"
                  >
                    <ShieldCheckIcon className="mr-3 h-4 w-4" />
                    Switch to Operator View
                  </Link>
                  <button 
                    onClick={handleSignOut}
                    className="flex items-center px-4 py-2 text-sm text-red-400 hover:bg-gray-700 w-full text-left"
                  >
                    <ArrowRightOnRectangleIcon className="mr-3 h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 