'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getAuthSession } from '@/lib/auth'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'client' | 'manager'
  fallbackUrl?: string
}

export default function AuthGuard({ children, requiredRole, fallbackUrl }: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const authenticated = isAuthenticated(requiredRole)
        const user = getAuthSession()
        
        if (!authenticated) {
          // Redirect to appropriate login page
          if (requiredRole === 'manager') {
            router.push('/manager-login')
          } else {
            router.push('/login')
          }
          return
        }

        // Check if user has the correct role
        if (requiredRole && user?.role !== requiredRole) {
          // Redirect to their appropriate dashboard
          if (user?.role === 'manager') {
            router.push('/manager')
          } else {
            router.push('/')
          }
          return
        }

        setIsAuthorized(true)
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push(fallbackUrl || '/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredRole, fallbackUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/20 animate-float mx-auto mb-4">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
              Verifying authentication...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null // Router will handle redirect
  }

  return <>{children}</>
}
