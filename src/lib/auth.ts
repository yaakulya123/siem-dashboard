'use client'

// Hardcoded credentials
const CREDENTIALS = {
  username: 'codec',
  password: 'codec'
}

export interface User {
  username: string
  role: 'client' | 'manager'
}

export const authenticate = (username: string, password: string, role: 'client' | 'manager'): User | null => {
  if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
    return { username, role }
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
