# 🎯 PROJECT SETUP & DEVELOPMENT GUIDE - EMERALD TECH SOLUTION

Complete guide untuk setup development environment dan development workflow.

---

## 📋 Prerequisites

Pastikan sudah install:

- **Node.js** v18.x atau lebih naru (https://nodejs.org/)
- **Git** (https://git-scm.com/)
- **npm** atau **yarn**
- **VS Code** recommended (https://code.visualstudio.com/)

---

## 🚀 Initial Setup (First Time Only)

### Step 1: Clone Repository

```bash
# Using HTTPS
git clone https://github.com/YOUR_ORG/Website-Emerald-Tech-Solution.git
cd Website-Emerald-Tech-Solution

# Or using SSH
git clone git@github.com:YOUR_ORG/Website-Emerald-Tech-Solution.git
cd Website-Emerald-Tech-Solution
```

### Step 2: Install Dependencies

```bash
# Install npm packages
npm install

# Or if using Yarn
yarn install
```

### Step 3: Setup Environment Variables

Create `.env.local` file in root directory:

```bash
# Copy template
cp .env.example .env.local

# Edit with your values
nano .env.local
```

**Required Variables:**

```env
# SUPABASE
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# GOOGLE OAUTH (from Google Console)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=xxxxxxxxx.apps.googleusercontent.com

# Admin configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@emeraldtech.com

# Server-side (keep secret in .env.local only)
SUPABASE_SERVICE_ROLE_KEY=eyJh...xxxxxxx
```

### Step 4: Get Values from Supabase

1. Go to [Supabase Dashboard](https://supabase.com)
2. Select your project
3. Go to **Settings** > **API**
4. Copy values:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Setup Database (First Time)

```bash
# Option A: Using Supabase CLI
npx supabase db push

# Option B: Manual (Supabase Dashboard)
# 1. Go to SQL Editor
# 2. Click "New SQL"
# 3. Copy entire content from: supabase/migrations/001_initial_schema.sql
# 4. Paste and click Run
```

---

## 💻 Development Server

### Start Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in browser.

**Hot reload enabled** - Changes appear instantly!

---

## 📁 Project Structure

```
Website-Emerald-Tech-Solution/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── api/                     # API routes
│   │   ├── projects/route.ts
│   │   ├── invoices/route.ts
│   │   ├── modules/route.ts
│   │   └── portfolio/route.ts
│   ├── dashboard/               # User dashboard
│   │   └── page.tsx
│   ├── docs/                    # Documentation
│   ├── estimator/               # Project estimator
│   ├── login/                   # Login page
│   ├── signup/                  # Signup page
│   └── portfolio/               # Portfolio showcase
│
├── components/                   # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── Card.tsx
│   ├── Button.tsx
│   ├── Input.tsx
│   └── AIChat.tsx
│
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts              # Authentication context
│   └── useEstimation.ts        # Estimation logic
│
├── lib/                          # Utilities & helpers
│   ├── supabaseClient.ts        # Client-side Supabase
│   ├── supabaseServer.ts        # Server-side functions
│   ├── geminiConfig.ts          # Google Gemini AI
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
│
├── types/                        # TypeScript types
│   └── index.ts
│
├── supabase/                     # Supabase migrations
│   └── migrations/
│       └── 001_initial_schema.sql
│
├── public/                       # Static assets
│   └── favicon.ico
│
├── .env.local                    # Local env variables (gitignored)
├── .env.example                  # Env template (committed)
├── .env.production.example       # Production env template
├── next.config.js               # Next.js config
├── tailwind.config.ts           # TailwindCSS config
├── tsconfig.json                # TypeScript config
├── package.json                 # Dependencies
└── README.md                    # Project README
```

---

## 🔧 Development Commands

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Run Type Checking
```bash
npm run type-check
# or
npx tsc --noEmit
```

### Format Code (Optional)
```bash
npm run format
# Requires prettier installed
```

### Lint Code
```bash
npm run lint
# or
npx eslint .
```

---

## 📝 Coding Conventions

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ProjectCard.tsx` |
| Pages | lowercase | `page.tsx` |
| API Routes | lowercase | `route.ts` |
| Hooks | camelCase, prefix `use` | `useAuth.ts` |
| Utilities | camelCase, descriptive | `formatDate.ts` |
| Types | PascalCase, suffix `Type` | `ProjectType.ts` |

### Component Structure

```typescript
// components/ProjectCard.tsx
import { FC, ReactNode } from 'react'

interface ProjectCardProps {
  id: string
  title: string
  status: 'draft' | 'in-progress' | 'completed'
  progress: number
}

export const ProjectCard: FC<ProjectCardProps> = ({
  id,
  title,
  status,
  progress
}) => {
  return (
    <div className="p-4 border rounded">
      <h3>{title}</h3>
      <p>Status: {status}</p>
      <div className="w-full bg-gray-200 rounded">
        <div 
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

export default ProjectCard
```

### API Route Structure

```typescript
// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getUserProjects, createProject } from '@/lib/supabaseServer'

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get('userId')
    if (!userId) {
      return NextResponse.json(
        { error: 'userId required' },
        { status: 400 }
      )
    }

    const projects = await getUserProjects(userId)
    return NextResponse.json({
      success: true,
      data: projects,
      count: projects.length
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Validate
    if (!body.userId || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const project = await createProject(body.userId, body)
    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## 🧪 Testing

### Manual Testing

**Test authentication:**
```bash
# Visit http://localhost:3000/login
# Try login with Google OAuth or email/password
```

**Test API:**
```bash
# Using curl
curl http://localhost:3000/api/projects?userId=test-id

# Using Postman
# Import Postman collection from /docs/postman-collection.json
```

**Test database:**
```bash
# Check Supabase dashboard
# Supabase > SQL Editor > Run queries
```

### Automated Testing (Optional)

```bash
# Install Jest
npm install --save-dev jest @testing-library/react

# Create test file
# components/__tests__/ProjectCard.test.tsx

# Run tests
npm test
```

---

## 🐛 Common Issues & Solutions

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not set"

**Solution:**
```bash
# 1. Check .env.local exists
ls -la .env.local

# 2. Verify contents
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL

# 3. Restart dev server
# Ctrl+C to stop, then run:
npm run dev
```

### Issue: "Database connection refused"

**Solution:**
```bash
# 1. Verify Supabase URL is correct
echo $NEXT_PUBLIC_SUPABASE_URL

# 2. Check internet connection
ping supabase.co

# 3. Verify database is running (check Supabase dashboard)

# 4. Check firewall rules in Supabase > Settings
```

### Issue: "OAuth redirect URI mismatch"

**Solution:**
```bash
# 1. Go to Supabase > Authentication > URL Configuration
# 2. Add local redirect:
    http://localhost:3000

# 2. Go to Google Cloud Console > OAuth Consent Screen
# 3. Add authorized redirect URI:
    http://localhost:3000/auth/callback
```

### Issue: "Module not found" errors

**Solution:**
```bash
# 1. Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# 2. Clear Next.js cache
rm -rf .next
npm run dev
```

---

## 📊 Database Management

### View Database Schema

```bash
# Option 1: Via Supabase Dashboard
# 1. Go to SQL Editor
# 2. Run: SELECT * FROM information_schema.tables WHERE table_schema = 'public';

# Option 2: Via CLI
npx supabase inspect api
```

### Run Database Queries

```bash
# Interactive via CLI
npx supabase db query

# Or use Supabase Dashboard > SQL Editor
```

### Check Database Logs

```bash
# Via Dashboard:
# Supabase > Logs > API
# Supabase > Logs > Realtime
# Supabase > Logs > Function Logs
```

---

## 🔐 Environment Variables Security

**IMPORTANT - Never commit `.env.local`!**

```bash
# Verify .gitignore includes
cat .gitignore | grep env

# Should show:
# .env.local
# .env.development.local
# .env.test.local
```

**Production variables in Vercel:**
1. DO NOT push to GitHub
2. Set in Vercel Dashboard > Settings > Environment Variables
3. Reference `.env.production.example` for what to set

---

## 📚 Documentation Structure

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [DATABASE_SETUP.md](./DATABASE_SETUP.md) | Database management |
| [BACKEND_API_DOCS.md](./BACKEND_API_DOCS.md) | API reference |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Production deployment |
| [PROJECT_SETUP.md](./PROJECT_SETUP.md) | This file - development setup |

---

## 🔗 Useful Resources

**Documentation:**
- [Next.js Docs](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)

**Tools:**
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Google Cloud Console](https://console.cloud.google.com)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub Repository](https://github.com/)

**Community:**
- [Next.js Discord](https://discord.gg/nextjs)
- [Supabase Discord](https://discord.supabase.com)
- [Stack Overflow](https://stackoverflow.com)

---

## ✅ Verification Checklist

Before starting development, verify:

- ✅ Node.js v18+ installed: `node --version`
- ✅ Dependencies installed: `npm list | head -20`
- ✅ Environment variables set: Check `.env.local`
- ✅ Development server running: `npm run dev`
- ✅ Database accessible: Check Supabase dashboard
- ✅ Frontend loads: http://localhost:3000
- ✅ Can login: Test Google OAuth or email signup
- ✅ API working: `curl http://localhost:3000/api/projects?userId=test`

---

**Ready to develop!** 🚀

For questions or issues, check the [Troubleshooting](#common-issues--solutions) section above.
