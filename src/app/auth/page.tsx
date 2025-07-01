'use client'

import { useState } from 'react'
import { KeyIcon, ShieldCheckIcon, CogIcon } from '@heroicons/react/24/outline'

export default function AuthPage() {
  const [ssoEnabled, setSsoEnabled] = useState(true)
  const [mfaEnabled, setMfaEnabled] = useState(true)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          SSO & MFA Configuration
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Frictionless yet secure login with client's IdP and optional TOTP MFA fallback
        </p>
      </div>

      {/* SSO Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <KeyIcon className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Single Sign-On (SSO)
            </h3>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={ssoEnabled}
              onChange={(e) => setSsoEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {ssoEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>

        {ssoEnabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Identity Provider
                </label>
                <select className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-white">
                  <option>SAML 2.0</option>
                  <option>OpenID Connect</option>
                  <option>OAuth 2.0</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Entity ID
                </label>
                <input
                  type="text"
                  className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                  placeholder="https://company.auth0.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SSO URL
              </label>
              <input
                type="url"
                className="block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:text-white"
                placeholder="https://company.auth0.com/saml/login"
              />
            </div>
          </div>
        )}
      </div>

      {/* MFA Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShieldCheckIcon className="w-6 h-6 text-green-600 dark:text-green-400 mr-3" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Multi-Factor Authentication (MFA)
            </h3>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={mfaEnabled}
              onChange={(e) => setMfaEnabled(e.target.checked)}
              className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {mfaEnabled ? 'Enabled' : 'Disabled'}
            </label>
          </div>
        </div>

        {mfaEnabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                MFA Methods
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" defaultChecked className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">TOTP (Google Authenticator, Authy)</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">SMS</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Email</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Current Sessions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Active Sessions
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { user: 'john.anderson@company.com', location: 'San Francisco, CA', device: 'Chrome on macOS', loginTime: '2 hours ago' },
              { user: 'sarah.chen@company.com', location: 'New York, NY', device: 'Firefox on Windows', loginTime: '5 minutes ago' },
              { user: 'mike.rodriguez@company.com', location: 'Austin, TX', device: 'Safari on iOS', loginTime: '1 day ago' },
            ].map((session, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{session.location} • {session.device}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Logged in {session.loginTime}</p>
                </div>
                <button className="text-red-600 dark:text-red-400 hover:text-red-500 text-sm font-medium">
                  Revoke
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 