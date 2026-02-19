# 🏗️ TECHNICAL ARCHITECTURE - EMERALD TECH SOLUTION

Complete technical overview, system design, dan architecture documentation.

---

## 🎯 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React 18 Components (Next.js 14 + TypeScript + TailwindCSS)    │
│  - Landing Page, Auth Pages, Dashboard, Estimator, Portfolio    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│  Next.js API Routes + Server Components + React Hooks           │
│  - /api/projects, /api/invoices, /api/modules, /api/portfolio   │
│  - Custom hooks: useAuth, useEstimation                         │
│  - Server utilities for typed database operations               │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                                │
│  Supabase Client (JS SDK) + Server-side Utilities               │
│  - Authentication (Google OAuth, Email/Password)                │
│  - Database operations via supabaseServer.ts                    │
│  - Google Gemini AI integration                                 │
│  - External API integrations                                    │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DATA & INFRASTRUCTURE                          │
│                    SUPABASE (PostgreSQL)                        │
│  - Tables: users, projects, modules, invoices, portfolio...    │
│  - Row Level Security (RLS) with role-based policies           │
│  - Triggers for automations (timestamps, profile creation...)  │
│  - Views for aggregated data                                   │
│  - Cloud storage for files                                     │
└─────────────────────────────────────────────────────────────────┘

                        DEPLOYMENT
        ┌──────────────────────────────────────┐
        │  Vercel (Frontend + API Routes)      │
        │  Custom Domain + HTTPS + CDN         │
        └──────────────────────────────────────┘

        ┌──────────────────────────────────────┐
        │  Supabase Cloud (Database)           │
        │  PostgreSQL + Auth + Storage         │
        └──────────────────────────────────────┘
```

---

## 📊 Technology Stack

### Frontend
| Component | Technology |
|-----------|-----------|
| **Framework** | Next.js 14 (React 18) |
| **Language** | TypeScript |
| **Styling** | TailwindCSS |
| **State Management** | React Context + Hooks |
| **UI Components** | Custom + shadcn/ui (optional) |

### Backend
| Component | Technology |
|-----------|-----------|
| **Runtime** | Node.js (v18+) |
| **HTTP Framework** | Next.js API Routes |
| **Database** | PostgreSQL (Supabase) |
| **Authentication** | Supabase Auth (Google + Email) |
| **ORM** | Supabase Client (typed) |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| **Hosting** | Vercel (Edge + Serverless) |
| **Database** | Supabase Cloud |
| **Storage** | Supabase Storage (S3-compatible) |
| **CDN** | Vercel Edge Network |
| **Domain** | Custom domain + auto-HTTPS |

### Integration
| Service | Purpose |
|---------|---------|
| **Google OAuth** | Social authentication |
| **Google Gemini API** | AI-powered features |
| **SendGrid or Supabase Email** | Email notifications |

---

## 📁 Application Layers

### 1. Presentation Layer (Frontend)

**Components:**
```
components/
├── Navbar.tsx          # Navigation header
├── Footer.tsx          # Footer with links
├── Card.tsx            # Reusable card component
├── Button.tsx          # Styled button
├── Input.tsx           # Form input
└── AIChat.tsx          # AI chat interface
```

**Pages:**
```
app/
├── page.tsx            # Home/landing
├── login/page.tsx      # Login page
├── signup/page.tsx     # Registration
├── dashboard/page.tsx  # User dashboard
├── estimator/page.tsx  # Project estimator
├── portfolio/page.tsx  # Portfolio showcase
└── docs/page.tsx       # Documentation
```

**Key Features:**
- Server Components for optimal performance
- Client Components for interactivity
- Responsive design (mobile-first)
- Dark mode support (implement with theme provider)

---

### 2. Application Layer

**API Routes:**
```
app/api/
├── projects/route.ts  # GET: fetch projects, POST: create
├── invoices/route.ts  # GET: list invoices, POST: create
├── modules/route.ts   # GET: fetch modules, POST: create
└── portfolio/route.ts # GET: public list, POST: admin create
```

**Custom Hooks:**
```
hooks/
├── useAuth.ts         # Authentication context + methods
└── useEstimation.ts   # Estimation calculation logic
```

**Key Features:**
- TypeScript for type safety
- Error handling and validation
- Request logging
- Rate limiting ready

---

### 3. Service Layer

**Server Utilities:**
```typescript
// lib/supabaseServer.ts - 20+ functions:

// Authentication
getSupabaseServerClient()     // Service role client
getUser(userId)               // Get user profile
getUserProfile(userId)        // Get detailed profile

// Projects
getProject(projectId)         // Get single project
getUserProjects(userId)       // Get all user projects
createProject(userId, data)   // Create new project
updateProject(projectId, data) // Update project

// Invoices
getInvoices(userId, status)   // Get invoices with filter
getInvoice(invoiceId)         // Get single invoice
createInvoice(userId, data)   // Create invoice + items

// Modules
getModules(projectId)         // Get project modules
createModule(projectId, data) // Create module

// Portfolio
getPortfolioProjects(filters) // Get published portfolio

// Dashboard
getDashboardStats(userId)     // Aggregated user stats
logActivity(userId, action)   // Log user action
```

**Key Features:**
- Full TypeScript typing
- Automatic timestamp handling
- Invoice number generation
- User context validation

---

### 4. Data Layer

**Database Tables:**
```
users              # Extended Supabase auth profiles
├── id (FK → auth.users.id)
├── email, name, phone, company
├── role: admin | user
├── subscription_plan
└── created_at, updated_at

projects           # User projects/clients
├── id, user_id (FK)
├── name, slug, type, status
├── budget_amount, spent_amount
├── progress, description
├── start_date, due_date
├── modules (1-to-many)
└── invoices (1-to-many)

modules            # Project components
├── id, project_id (FK)
├── name, slug, status
├── progress, estimated_duration
├── order_index (for sorting)
└── description

invoices           # Project invoices
├── id, user_id, project_id (FK)
├── invoice_number (auto-generated)
├── invoice_date, due_date
├── subtotal, tax, total_amount
├── status
└── invoice_items (1-to-many)

invoice_items      # Invoice line items
├── id, invoice_id (FK)
├── description, quantity
├── unit_price, total_price

portfolio_projects # Public portfolio showcase
├── id, user_id (FK)
├── title, slug, category
├── description, featured
├── client_name, technologies
├── views_count, published_at

activity_logs      # Audit trail
├── id, user_id (FK)
├── action, resource_type
├── details (JSONB)
├── ip_address
└── created_at

contact_messages   # Contact form submissions
├── id
├── name, email, message
├── read, archived
└── created_at

settings           # Global app settings
├── id
├── setting_key, setting_value
└── updated_at
```

**RLS Policies (Row Level Security):**
- Users can only see their own data
- Admins can see/modify all users' data
- Public portfolio visible to everyone
- Activity logs only visible to user + admin

**Indexes:**
- user_id (all tables) - for filtering
- invoice_number - unique, for lookups
- project_id, module names - for searching
- published_at - for portfolio sorting

---

## 🔄 Data Flow

### Authentication Flow

```
User clicks "Login with Google"
            ↓
Google OAuth popup
            ↓
User authorizes app
            ↓
Google returns code
            ↓
Supabase exchanges code for token
            ↓
Auth context saves token
            ↓
Middleware checks token
            ↓
Redirect to dashboard
            ↓
Fetch user profile (server)
            ↓
Display dashboard
```

### Project Creation Flow

```
User submits form (frontend)
            ↓
Validate input (client)
            ↓
Call POST /api/projects (browser)
            ↓
API validates (server)
            ↓
Check user auth
            ↓
Generate slug
            ↓
INSERT into projects table
            ↓
Trigger: Create activity log
            ↓
Return created project
            ↓
Client: Update state
            ↓
Show success message
            ↓
Refresh projects list
```

### Invoice Generation Flow

```
User selects items
            ↓
Sets due date
            ↓
Calls POST /api/invoices
            ↓
Server validates items
            ↓
BEGIN TRANSACTION
    ├─ Generate invoice_number (INV-260219-00001)
    ├─ Calculate subtotal, tax, total
    ├─ INSERT invoice
    ├─ INSERT invoice_items
    ├─ UPDATE project spent_amount
    └─ COMMIT TRANSACTION
            ↓
Trigger: Update timestamps
            ↓
Trigger: Log activity
            ↓
Return new invoice
            ↓
Client: Show invoice preview
            ↓
Option to download PDF
```

---

## 🔐 Security Architecture

### Authentication
- **Method:** Supabase Auth with JWT tokens
- **Providers:** Google OAuth, Email/Password
- **Token Storage:** Secure HTTP-only cookies
- **Expiration:** 1 hour access token, 7 day refresh token

### Authorization
- **RLS:** Row Level Security on all tables
- **Roles:** user, admin, service (API)
- **Policies:** User sees own data, admin sees all, public sees published

### Data Protection
```typescript
// Example RLS Policy
create policy "Users can see own projects"
  on projects for select
  using (auth.uid() = user_id or 
         is_admin(auth.uid()));

create policy "Users can only update own projects"
  on projects for update
  using (auth.uid() = user_id);
```

### API Security
- ✅ Request validation (check types)
- ✅ User ownership checks
- ✅ Rate limiting (via Vercel)
- ✅ CORS configured
- ✅ No sensitive data in responses
- ✅ Activity logging for audit trail
- ✅ Service role key in env variables only

### Encryption
- ✅ SSL/TLS (HTTPS everywhere)
- ✅ Database connections encrypted
- ✅ Supabase handles password hashing
- ✅ Optional: encrypt sensitive fields in DB

---

## 🚀 Deployment Architecture

### Development Environment
```
Local Machine
├── VS Code + Dev Server
├── localhost:3000 (frontend)
├── API routes (same server)
└── Supabase CLI (optional)
```

### Production Environment
```
Vercel (Edge Network)
├── Serverless Functions (API routes + Next.js)
├── Static Assets (pages, images)
├── Environment Variables (secrets)
├── CI/CD Pipeline (GitHub integration)
├── Automatic Deployments
├── Zero-downtime Updates
└── Global CDN Distribution

Supabase Cloud
├── PostgreSQL Database
├── Managed Backups
├── Automatic Scaling
├── SSL Certificates
└── DDoS Protection
```

### Deployment Pipeline
```
Developer pushes to GitHub main branch
            ↓
GitHub webhook triggers Vercel
            ↓
Vercel pulls latest code
            ↓
Install dependencies (npm install)
            ↓
Run build (npm run build)
            ↓
Type checking (tsc --noEmit)
            ↓
If build succeeds:
    ├─ Generate preview URL
    └─ Deploy to production
            ↓
If build fails:
    └─ Notify developer
            ↓
Update DNS to new deployment
            ↓
Propagate to CDN (minutes)
            ↓
Live globally 🎉
```

---

## 📈 Performance Optimization

### Frontend Performance
| Optimization | Method |
|--------------|--------|
| **Code Splitting** | Next.js automatic with route-based |
| **Image Optimization** | Next/Image with lazy loading |
| **Caching** | SWR or React Query for data fetching |
| **CSS** | TailwindCSS with purge (unused styles removed) |
| **Minification** | Automatic in production build |

### Backend Performance
| Optimization | Method |
|--------------|--------|
| **Database Indexes** | Created on foreign keys, frequently filtered columns |
| **Query Optimization** | Select only needed fields, use RLS filters |
| **Connection Pooling** | Supabase handles automatically |
| **Caching** | Browser caching, API response caching |
| **Pagination** | Limit 20-50 items per request |

### Infrastructure Performance
| Optimization | Method |
|--------------|--------|
| **CDN** | Vercel edge network caches production assets |
| **Compression** | Gzip/Brotli by default |
| **HTTP/2** | Automatic with HTTPS |
| **Serverless** | Auto-scale with demand |

---

## 🔄 Integration Points

### External Services

```
┌──────────────────┐
│ Google OAuth     │
│ ├─ ID: client_id │
│ └─ Redirect: app │
└────────┬─────────┘
         │ login token
         ▼
    Supabase Auth
         │
         ▼
┌──────────────────────────┐
│ Emerald Tech App         │
│ ├─ API Routes            │
│ ├─ React Components      │
│ └─ Database Access       │
└────────┬─────────────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
    ┌─────────────┐    ┌──────────────┐
    │ Supabase DB │    │ Google Gemini│
    │ PostgreSQL  │    │ AI API       │
    └─────────────┘    └──────────────┘
         │
         ▼
    ┌─────────────────────────┐
    │ Vercel Deployment       │
    │ └─ Your Custom Domain   │
    └─────────────────────────┘
```

---

## 🧪 Testing Strategy

### Unit Tests
```
Components: Test props, rendering, user interactions
Hooks: Test state, side effects
Utils: Test functions with various inputs
```

### Integration Tests
```
API Routes: Test endpoint behavior with DB
Auth Flow: Test login, logout, profile
Forms: Test submission, validation, error handling
```

### E2E Tests (Optional)
```
Cypress/Playwright tests for critical user flows:
- Login with Google
- Create project
- Generate invoice
- View portfolio
```

---

## 📊 Monitoring & Logging

### Frontend Logging
```typescript
// Track errors
console.error('Error fetching projects:', error)

// Track user actions
logActivity(userId, 'viewed_dashboard')
```

### Backend Logging
```
Supabase > Logs > API
- Request logs
- Error logs
- Performance metrics
```

### Performance Monitoring
```
Vercel Analytics:
- Page load times
- Core Web Vitals
- Error rates

Supabase Metrics:
- Database query times
- Connection count
- Storage usage
```

---

## 🛠️ Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Create `.env.local` with API keys
4. Start dev server: `npm run dev`
5. Make changes (hot reload)
6. Test manually in browser
7. Commit to GitHub

### Code Review
1. Create feature branch
2. Make changes
3. Push to GitHub
4. Create Pull Request
5. Peer review
6. CI checks (type check, build)
7. Merge to main

### Production Deployment
1. Merge PR to main
2. GitHub webhook triggers Vercel
3. Vercel builds and deploys
4. Automatic DNS update
5. CDN cache invalidation
6. Live on production! 🎉

---

## 📚 Quick References

### Key Files
- Database Schema: `/supabase/migrations/001_initial_schema.sql`
- API Routes: `/app/api/`
- Server Utils: `/lib/supabaseServer.ts`
- Auth Hook: `/hooks/useAuth.ts`
- Supabase Client: `/lib/supabaseClient.ts`

### Key Commands
```bash
npm run dev        # Start development
npm run build      # Build for production
npm run type-check # Check TypeScript
npm run lint       # Run linter
```

### Key Endpoints
```
GET  /api/projects?userId=...     # Get projects
POST /api/projects                # Create project
GET  /api/invoices?userId=...     # Get invoices
POST /api/invoices                # Create invoice
GET  /api/modules?projectId=...   # Get modules
GET  /api/portfolio               # Get portfolio (public)
```

---

**Architecture Complete!** 🎉

For specific implementation details, refer to:
- [Backend API Docs](./BACKEND_API_DOCS.md)
- [Database Setup](./DATABASE_SETUP.md)
- [Project Setup](./PROJECT_SETUP.md)
- [Deployment Guide](./VERCEL_DEPLOYMENT.md)
