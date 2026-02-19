# 📚 BACKEND API DOCUMENTATION - EMERALD TECH SOLUTION

Complete API reference untuk backend operations.

---

## 🔗 Base URL

```
Development:  http://localhost:3000/api
Production:   https://your-domain.com/api
```

---

## 🔐 Authentication

Semua API requests harus include authorization header:

```bash
Authorization: Bearer {access_token}
```

Get access token dari Supabase auth:

```javascript
const { data, error } = await supabase.auth.getSession()
const token = data.session?.access_token
```

---

## 📦 Response Format

Semua responses menggunakan format standard:

```json
{
  "success": true,
  "data": { /* response data */ },
  "error": null,
  "count": 10,
  "timestamp": "2026-02-19T10:30:00Z"
}
```

---

## 🚀 API Endpoints

### PROJECTS

#### GET /api/projects

Get semua projects untuk user saat ini

**Query Parameters:**
- `userId` (required) - User ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "name": "Aplikasi POS",
      "type": "pos",
      "status": "in-progress",
      "progress": 75,
      "budget_amount": 10000000,
      "spent_amount": 7500000,
      "start_date": "2026-01-01",
      "due_date": "2026-03-31",
      "created_at": "2026-02-01T10:00:00Z",
      "updated_at": "2026-02-19T10:00:00Z"
    }
  ],
  "count": 5
}
```

**Example Usage:**
```typescript
const response = await fetch(
  `/api/projects?userId=${user.id}`
)
const { data: projects } = await response.json()
```

---

#### POST /api/projects

Create project baru

**Request Body:**
```json
{
  "userId": "uuid",
  "name": "Aplikasi POS Toko A",
  "type": "pos",
  "description": "Sistem point of sale untuk toko retail",
  "budget_amount": 10000000,
  "due_date": "2026-03-31"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Aplikasi POS Toko A",
    ...
  }
}
```

**Example Usage:**
```typescript
const response = await fetch('/api/projects', {
  method: 'POST',
  body: JSON.stringify({
    userId: user.id,
    name: 'Aplikasi POS',
    type: 'pos',
    budget_amount: 10000000,
    due_date: '2026-03-31'
  })
})
const { data: project } = await response.json()
```

---

### INVOICES

#### GET /api/invoices

Get semua invoices untuk user

**Query Parameters:**
- `userId` (required) - User ID
- `status` (optional) - Filter by status (draft, sent, pending, paid, overdue)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "invoice_number": "INV-260219-00001",
      "user_id": "uuid",
      "project_id": "uuid",
      "invoice_date": "2026-02-19",
      "due_date": "2026-03-19",
      "subtotal": 10000000,
      "tax": 1000000,
      "total_amount": 11000000,
      "status": "pending",
      "invoice_items": [
        {
          "id": "uuid",
          "description": "Development - Module 1",
          "quantity": 1,
          "unit_price": 5000000,
          "total_price": 5000000
        }
      ]
    }
  ],
  "count": 3
}
```

---

#### POST /api/invoices

Create invoice baru dengan items

**Request Body:**
```json
{
  "userId": "uuid",
  "projectId": "uuid",
  "items": [
    {
      "description": "Development - Module 1",
      "quantity": 1,
      "unit_price": 5000000
    },
    {
      "description": "Testing & QA",
      "quantity": 2,
      "unit_price": 2500000
    }
  ],
  "due_date": "2026-03-19",
  "description": "Invoice untuk Aplikasi POS"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "invoice_number": "INV-260219-00001",
    "total_amount": 11000000,
    "status": "draft",
    "invoice_items": [...]
  },
  "invoiceNumber": "INV-260219-00001"
}
```

---

### MODULES

#### GET /api/modules

Get semua modules untuk project

**Query Parameters:**
- `projectId` (required) - Project ID

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "name": "Authentication Module",
      "slug": "authentication-module",
      "status": "in-progress",
      "progress": 60,
      "estimated_duration": 10,
      "due_date": "2026-02-28",
      "created_at": "2026-02-01T10:00:00Z"
    }
  ],
  "count": 5
}
```

---

#### POST /api/modules

Create module baru

**Request Body:**
```json
{
  "projectId": "uuid",
  "name": "Payment Integration",
  "description": "Integrate payment gateway",
  "estimatedDuration": 5,
  "dueDate": "2026-03-10"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "project_id": "uuid",
    "name": "Payment Integration",
    ...
  }
}
```

---

### PORTFOLIO

#### GET /api/portfolio

Get published portfolio projects (public)

**Query Parameters:**
- `category` (optional) - Filter by category (pos, erp, fnb)
- `featured` (optional) - true untuk hanya featured projects
- `limit` (optional) - Default 12
- `offset` (optional) - Default 0

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "POS untuk Retail Store",
      "slug": "pos-untuk-retail-store",
      "description": "Sistem point of sale modern...",
      "category": "pos",
      "featured": true,
      "client_name": "Toko ABC",
      "features": ["Inventory", "Sales", "Reports"],
      "technologies": ["Next.js", "React", "PostgreSQL"],
      "views_count": 234,
      "created_at": "2026-01-15T10:00:00Z"
    }
  ],
  "count": 45,
  "limit": 12,
  "offset": 0
}
```

---

#### POST /api/portfolio

Create portfolio project (admin only)

**Request Body:**
```json
{
  "title": "POS untuk Retail Store",
  "description": "Sistem point of sale modern untuk toko retail",
  "category": "pos",
  "featuredImageUrl": "https://...",
  "clientName": "Toko ABC",
  "features": ["Inventory", "Sales", "Reports"],
  "technologies": ["Next.js", "React", "PostgreSQL"]
}
```

---

## 🛠️ Backend Helper Functions

### Using Server Functions

```typescript
// In API routes atau server actions
import { 
  getUser, 
  getUserProjects, 
  createProject,
  createInvoice,
  getInvoices 
} from '@/lib/supabaseServer'

// Get user profile
const user = await getUser(userId)

// Get projects
const projects = await getUserProjects(userId)

// Create project
const newProject = await createProject(userId, {
  name: 'New Project',
  type: 'pos',
  budget_amount: 10000000,
  due_date: '2026-03-31'
})

// Create invoice
const newInvoice = await createInvoice(userId, {
  projectId: projectId,
  items: [
    {
      description: 'Service A',
      quantity: 1,
      unit_price: 5000000
    }
  ],
  due_date: '2026-03-31'
})

// Get invoices
const invoices = await getInvoices(userId, 'pending')
```

---

## 🔄 Data Flow

### Project Creation Flow

```
User submits form
    ↓
POST /api/projects
    ↓
Server: createProject()
    ↓
Supabase: INSERT into projects
    ↓
Generate slug & IDs
    ↓
Return project data
    ↓
Client: Update dashboard
    ↓
Show success notification
```

### Invoice Creation Flow

```
User adds invoice items
    ↓
POST /api/invoices
    ↓
Server: createInvoice()
    ↓
Generate invoice number
    ↓
Calculate totals
    ↓
BEGIN TRANSACTION
    ├─ INSERT invoice
    ├─ INSERT items
    └─ COMMIT
    ↓
Return created invoice
    ↓
Show invoice preview
```

---

## ⚡ Performance Tips

### 1. Use Pagination

```javascript
// Don't fetch all records at once
const limit = 20
const offset = (page - 1) * limit

const response = await fetch(
  `/api/projects?userId=${userId}&limit=${limit}&offset=${offset}`
)
```

### 2. Filter on Server

```javascript
// Filter at API level, not client
fetch(`/api/invoices?userId=${userId}&status=pending`)

// Not like this (inefficient)
fetch(`/api/invoices?userId=${userId}`)
  .then(data => data.filter(i => i.status === 'pending'))
```

### 3. Cache Results

```javascript
// Client-side caching
const cache = new Map()

async function getProjects(userId) {
  if (cache.has(userId)) {
    return cache.get(userId)
  }
  
  const data = await fetch(`/api/projects?userId=${userId}`)
  cache.set(userId, data)
  return data
}
```

---

## 🚨 Error Handling

### Common Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Missing required fields: userId, name, type"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "error": "Unauthorized"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

### Error Handling in Client

```typescript
try {
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    console.error('Error:', error.error)
    showErrorAlert(error.error)
    return
  }
  
  const { data: project } = await response.json()
  console.log('Success:', project)
} catch (error) {
  console.error('Network error:', error)
  showErrorAlert('Network error')
}
```

---

## 📊 Rate Limiting

API limits (Vercel + Supabase):

- Authenticated requests: 1000 requests/minute
- Unauthenticated: 100 requests/minute
- Database connections: 100 concurrent

---

## 🔐 Security Notes

1. **Never expose service keys in client code**
   - Only use in API routes (/app/api/*)
   - Environment variable: SUPABASE_SERVICE_ROLE_KEY

2. **Always validate input**
   - Check required fields
   - Sanitize strings
   - Validate data types

3. **Check user ownership**
   - Verify user can access resource
   - Use user context from auth

4. **Log sensitive actions**
   - All changes logged to activity_logs
   - Accessible for audit

---

## 📝 Request/Response Examples

### Complete Example: Create Invoice

**Client Code:**
```typescript
async function createInvoiceHandler(formData) {
  const response = await fetch('/api/invoices', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      userId: user.id,
      projectId: selectedProject.id,
      items: [
        {
          description: 'Development',
          quantity: 1,
          unit_price: 5000000
        }
      ],
      due_date: '2026-03-31'
    })
  })

  if (!response.ok) {
    const error = await response.json()
    alert('Error: ' + error.error)
    return
  }

  const { data: invoice } = await response.json()
  console.log('Invoice created:', invoice.invoiceNumber)
  router.push(`/dashboard/invoices/${invoice.id}`)
}
```

**Server Code (API Route):**
```typescript
// /app/api/invoices/route.ts
import { createInvoice } from '@/lib/supabaseServer'

export async function POST(request: NextRequest) {
  const body = await request.json()
  
  try {
    const invoice = await createInvoice(body.userId, {
      projectId: body.projectId,
      items: body.items,
      due_date: body.due_date
    })
    
    return NextResponse.json({ success: true, data: invoice })
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

---

**Documentation Complete!** 🎉

For more information, refer to:
- [Database Setup](./DATABASE_SETUP.md)
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md)
- [Supabase Documentation](https://supabase.com/docs)
