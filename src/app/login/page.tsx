'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ShieldCheckIcon, 
  EyeIcon, 
  EyeSlashIcon,
  UserIcon,
  LockClosedIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'
import { authenticate, setAuthSession, isAuthenticated, getAuthSession } from '@/lib/auth'
import toast from 'react-hot-toast'

export default function UnifiedLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Redirect if already authenticated based on role
    const user = getAuthSession()
    if (user) {
      if (user.role === 'manager') {
        router.push('/manager')
      } else {
        router.push('/dashboard')
      }
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Authenticate user - role is determined by the user's credentials
    const user = authenticate(username, password)
    
    if (user) {
      setAuthSession(user)
      
      // Role-based success messages and redirects
      if (user.role === 'manager') {
        toast.success(`Welcome ${user.fullName}! Accessing SOC Management Console...`, {
          duration: 2000,
        })
        router.push('/manager')
      } else {
        toast.success(`Welcome ${user.fullName}! Accessing SIEM Dashboard...`, {
          duration: 2000,
        })
        router.push('/dashboard')
      }
    } else {
      setError('Invalid credentials. Please try again.')
      toast.error('Login failed. Please check your credentials.')
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50 animate-pulse delay-2000"></div>
        
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-radial from-blue-600/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-radial from-purple-600/10 to-transparent rounded-full blur-3xl"></div>
        
        {/* Moving background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 -left-24 w-48 h-48 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-1/3 -right-24 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-xl animate-float delay-1000"></div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Main Login Card */}
        <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-600/50 rounded-2xl shadow-2xl p-8 relative">
          {/* Subtle inner glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <ShieldCheckIcon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-lg"></div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                Codec Networks
              </h1>
              <p className="text-gray-400 text-base font-medium">
                Security Operations Center
              </p>
              <p className="text-gray-500 text-sm mt-2">
                Please sign in to access your dashboard
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-14 py-4 bg-gray-700/50 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-3 text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl p-4 backdrop-blur-sm animate-fade-in">
                  <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-4 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/10 to-purple-600/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <ShieldCheckIcon className="w-5 h-5" />
                    <span>Sign In</span>
                  </div>
                )}
              </button>

              {/* Info Text */}
              <div className="text-center pt-4 border-t border-gray-600/50">
                <p className="text-gray-500 text-xs mb-3">
                  Access level determined by user role and permissions
                </p>
                
                {/* Demo Accounts Info */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                  <p className="text-xs text-blue-300 font-medium mb-2">Demo Accounts:</p>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>👤 <code className="text-blue-300">codec/codec</code> - Client Access</div>
                    <div>👑 <code className="text-purple-300">manager/manager</code> - Manager Access</div>
                    <div>⚡ <code className="text-cyan-300">admin/admin</code> - Admin Access</div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 