'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { clearAuthSession } from '@/lib/auth'

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear the authentication session
    clearAuthSession()
    // Redirect to login page
    router.replace('/login')
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Logging out...</h1>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  )
} 