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
import { authenticate, setAuthSession, getAuthSession } from '@/lib/auth'
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

    // Authenticate user - role is automatically determined by credentials
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background with Animations */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NGgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 animate-pulse"></div>
        
        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400 rounded-full animate-float opacity-60"></div>
        <div className="absolute top-3/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-float opacity-40" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-300 rounded-full animate-float opacity-80" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-float opacity-50" style={{animationDelay: '0.5s'}}></div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-radial from-blue-600/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-radial from-indigo-600/20 to-transparent rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        
        {/* Moving Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent skew-y-12 -translate-x-full animate-pulse"></div>
      </div>

      {/* Login Form Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-blue-600/20 rounded-full backdrop-blur-sm border border-blue-400/30">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">SIEM Dashboard</h1>
              <p className="text-blue-200/80 text-sm">Secure Access Portal</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg backdrop-blur-sm">
                  <ExclamationCircleIcon className="w-5 h-5 text-red-400" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-blue-400/60" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-blue-400/60" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm transition-all"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 backdrop-blur-sm"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* RBAC Info */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-blue-200/60 text-xs mb-4">
                Role-Based Access Control (RBAC) - Single unified login
              </p>
              
              {/* Demo Accounts */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h4 className="text-sm font-medium text-blue-200 mb-3">Demo Accounts:</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-blue-200/80">
                    <span>Client Access:</span>
                    <code className="bg-white/10 px-2 py-1 rounded text-blue-300">codec / codec</code>
                  </div>
                  <div className="flex justify-between items-center text-blue-200/80">
                    <span>Manager Access:</span>
                    <code className="bg-white/10 px-2 py-1 rounded text-blue-300">manager / manager</code>
                  </div>
                  <div className="flex justify-between items-center text-blue-200/80">
                    <span>Admin Access:</span>
                    <code className="bg-white/10 px-2 py-1 rounded text-blue-300">admin / admin</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 