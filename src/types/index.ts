// Alert types
export interface Alert {
  id: string
  severity: 'critical' | 'major' | 'minor'
  title: string
  description: string
  timestamp: Date
  host: string
  agent: string
  rule: string
  status: 'open' | 'investigating' | 'resolved'
  assignee?: string
}

// Ticket types
export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in-progress' | 'closed'
  priority: 'critical' | 'major' | 'minor'
  assignee: string
  reporter: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
  alerts: string[] // Alert IDs
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'analyst' | 'viewer'
  avatar?: string
  isActive: boolean
  lastLogin?: Date
  createdAt: Date
}

// Dashboard stats
export interface DashboardStats {
  totalAlerts: number
  alertsLast24h: number
  criticalAlerts: number
  openTickets: number
  resolvedToday: number
  averageResponseTime: string
  complianceScore: number
  activeAgents: number
}

// Severity distribution
export interface SeverityData {
  severity: 'critical' | 'major' | 'minor'
  count: number
  percentage: number
}

// Report types
export interface Report {
  id: string
  name: string
  description: string
  type: 'weekly' | 'monthly' | 'quarterly'
  recipients: string[]
  lastGenerated?: Date
  nextScheduled: Date
  isActive: boolean
  template: string
}

// Compliance types
export interface ComplianceRule {
  id: string
  name: string
  description: string
  framework: 'ISO27001' | 'SOC2' | 'PCI-DSS' | 'HIPAA' | 'GDPR' | 'NIST' | 'CIS'
  status: 'compliant' | 'non-compliant' | 'pending'
  lastChecked: Date
  evidence?: string[]
  controlFamily?: string
  benchmarkVersion?: string
  category?: string
}

// Attack/Threat types
export interface Attack {
  id: string
  sourceCountry: string
  sourceCode: string
  targetCountry: string
  targetCode: string
  severity: 'critical' | 'major' | 'minor'
  attackType: string
  timestamp: Date
  sourceCoords: [number, number] // [lat, lng]
  targetCoords: [number, number] // [lat, lng]
  active: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Navigation types
export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<any>
  current?: boolean
  badge?: number
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Filter types
export interface AlertFilters {
  severity?: string[]
  status?: string[]
  timeRange?: string
  search?: string
  host?: string[]
  rule?: string[]
}

// Table column types
export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  width?: string
  render?: (value: any, row: T) => React.ReactNode
}

// CIS Benchmark types
export interface BenchmarkCheck {
  id: string
  title: string
  target: string
  result: 'Passed' | 'Failed' | 'Not applicable'
  description?: string
  framework?: 'CIS' | 'NIST'
  category?: string
  severity?: 'critical' | 'major' | 'minor'
}

// NIST 800-53 types
export interface NISTRequirement {
  id: string
  name: string
  count: number
  color: string
  description?: string
  controls?: string[]
  category?: 'AC' | 'AU' | 'CA' | 'CM' | 'IA' | 'SA' | 'SC' | 'SI'
}

// Security Agent types
export interface SecurityAgent {
  id: string
  name: string
  ipAddress: string
  operatingSystem: string
  status: 'active' | 'inactive' | 'warning'
  lastSeen: string
  version: string
  location: string
  benchmarkChecks?: BenchmarkCheck[]
  nistRequirements?: NISTRequirement[]
  complianceScore?: number
}