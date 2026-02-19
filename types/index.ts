// User Types
export interface User {
  id: string
  email: string
  name: string
  company?: string
  role: 'admin' | 'customer'
  avatar?: string
  createdAt?: Date
}

// Project Types
export interface Project {
  id: string
  name: string
  type: 'pos' | 'erp' | 'fnb'
  description: string
  progress: number
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold'
  startDate: Date
  dueDate: Date
  budget: number
  spent: number
  modules: Module[]
}

export interface Module {
  id: string
  name: string
  status: 'completed' | 'in-progress' | 'pending'
  progress: number
}

// Invoice Types
export interface Invoice {
  id: string
  number: string
  projectId: string
  amount: number
  date: Date
  dueDate: Date
  status: 'pending' | 'paid' | 'overdue'
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

// Estimation Types
export interface EstimationRequest {
  modules: string[]
  basePrice: number
  additionalPrice: number
  estimatedDuration: number
}

// AI Chatbot Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Portfolio Types
export interface PortfolioProject {
  id: string
  title: string
  description: string
  image: string
  category: 'pos' | 'erp' | 'fnb'
  features: string[]
  technologies: string[]
}
