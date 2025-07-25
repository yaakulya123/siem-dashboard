'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getAuthSession } from '@/lib/auth';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    const user = getAuthSession();
    
    // Use replace instead of push for cleaner history
    if (!user) {
      // Not authenticated, redirect to login
      router.replace('/login');
    } else if (user.role === 'manager') {
      // Manager user, redirect to manager dashboard
      router.replace('/manager');
    } else {
      // Client user, redirect to client dashboard
      router.replace('/dashboard');
    }
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Redirecting...</h1>
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-400 text-sm mt-4">
          Taking you to the login page...
        </p>
      </div>
    </div>
  );
} 