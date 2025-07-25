'use client'

// Demo users with different roles for RBAC demonstration
const USERS = [
  {
    username: 'codec',
    password: 'codec', 
    role: 'client' as const,
    fullName: 'John Anderson',
    department: 'Security Operations'
  },
  {
    username: 'manager',
    password: 'manager',
    role: 'manager' as const, 
    fullName: 'Alex Thompson',
    department: 'SOC Management'
  },
  {
    username: 'admin',
    password: 'admin',
    role: 'manager' as const,
    fullName: 'Sarah Chen', 
    department: 'Executive Team'
  }
]

export interface User {
  username: string
  role: 'client' | 'manager'
  fullName: string
  department: string
}

export const authenticate = (username: string, password: string): User | null => {
  const user = USERS.find(u => u.username === username && u.password === password)
  if (user) {
    return {
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      department: user.department
    }
  }
  return null
}

export const setAuthSession = (user: User) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_user', JSON.stringify(user))
  }
}

export const getAuthSession = (): User | null => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  }
  return null
}

export const clearAuthSession = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_user')
  }
}

export const isAuthenticated = (requiredRole?: 'client' | 'manager'): boolean => {
  const user = getAuthSession()
  if (!user) return false
  if (requiredRole && user.role !== requiredRole) return false
  return true
}

// Helper function to check if user has specific permissions
export const hasPermission = (permission: string): boolean => {
  const user = getAuthSession()
  if (!user) return false
  
  // Define role-based permissions
  const permissions = {
    client: ['view_dashboard', 'view_alerts', 'create_tickets', 'view_reports'],
    manager: ['view_dashboard', 'view_alerts', 'create_tickets', 'view_reports', 'manage_users', 'view_analytics', 'system_config']
  }
  
  return permissions[user.role]?.includes(permission) || false
}
