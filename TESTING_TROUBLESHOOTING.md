# 🧪 TESTING, TROUBLESHOOTING & MAINTENANCE GUIDE

Complete guide para testing, debugging, troubleshooting, at maintenance ng project.

---

## 🧪 Testing Strategy

### 1. Manual Testing (Most Important)

#### Login Testing
```
Test Cases:
1. Login with Google OAuth
   - Click "Login with Google"
   - Select Google account
   - Verify redirect to dashboard
   - Check localStorage has token

2. Logout Testing
   - Click logout button
   - Verify token removed
   - Redirect to home page

3. Session Expiry
   - Wait 1+ hour (or logout/login)
   - Verify token refreshes silently
   - No interruption to user
```

#### API Testing (Using curl or Postman)

```bash
# 1. Get Projects
curl -X GET \
  "http://localhost:3000/api/projects?userId=USER_ID" \
  -H "Content-Type: application/json"

# 2. Create Project
curl -X POST \
  "http://localhost:3000/api/projects" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "name": "Test Project",
    "type": "pos",
    "budget_amount": 5000000,
    "due_date": "2026-03-31"
  }'

# 3. Create Invoice
curl -X POST \
  "http://localhost:3000/api/invoices" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "USER_ID",
    "projectId": "PROJECT_ID",
    "items": [
      {
        "description": "Development",
        "quantity": 1,
        "unit_price": 5000000
      }
    ],
    "due_date": "2026-03-31"
  }'

# 4. Get Portfolio (Public)
curl -X GET \
  "http://localhost:3000/api/portfolio?limit=10&offset=0"
```

#### Database Testing

**In Supabase Dashboard SQL Editor:**

```sql
-- Check users connected
SELECT COUNT(*) as total_users FROM users;

-- Check projects
SELECT id, name, status, progress FROM projects 
ORDER BY created_at DESC LIMIT 5;

-- Check invoices
SELECT id, invoice_number, status, total_amount 
FROM invoices 
ORDER BY created_at DESC LIMIT 5;

-- Check RLS is working
-- (Use service role to see all, anon key to see only own)
SELECT * FROM projects WHERE user_id = 'USER_ID';

-- Check triggers are working
SELECT COUNT(*) as total_logs FROM activity_logs;
```

#### Frontend Testing Checklist

```
□ Test all pages load without errors
  - http://localhost:3000 (home)
  - http://localhost:3000/login
  - http://localhost:3000/signup
  - http://localhost:3000/dashboard
  - http://localhost:3000/estimator
  - http://localhost:3000/portfolio
  - http://localhost:3000/docs

□ Test responsive design
  - Desktop (1920px)
  - Tablet (768px)
  - Mobile (375px)
  - Use Chrome DevTools Ctrl+Shift+M

□ Test form submissions
  - Login form
  - Signup form
  - Contact form
  - Create project form
  - Create invoice form

□ Test navigation
  - All menu links work
  - Redirects work correctly
  - Back button works

□ Test authentication
  - Can login
  - Can logout
  - Can refresh and stay logged in
  - Cannot access protected pages without auth
```

---

### 2. Automated Testing (Optional)

#### Setup Jest + React Testing Library

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
```

#### Example Test File

```typescript
// components/__tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '../Button'

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    const button = screen.getByText('Click me')
    await userEvent.click(button)
    
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

#### Run Tests

```bash
npm test                    # Run all tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

---

## 🐛 Troubleshooting Guide

### Issue: "Cannot find module" errors

**Symptoms:**
```
Error: Cannot find module '@/lib/supabaseClient'
Error: Module not found: Can't resolve 'react'
```

**Solutions:**
```bash
# 1. Clear cache and reinstall
rm -rf node_modules .next package-lock.json
npm install

# 2. Check file exists
ls -la lib/supabaseClient.ts

# 3. Check path alias in tsconfig.json
cat tsconfig.json | grep compilerOptions -A 5

# 4. Restart dev server
# Ctrl+C to stop
npm run dev
```

---

### Issue: "NEXT_PUBLIC_SUPABASE_URL is not set"

**Symptoms:**
```
Error: NEXT_PUBLIC_SUPABASE_URL is not set
Supabase client initialization failed
```

**Solutions:**
```bash
# 1. Verify .env.local exists
ls -la .env.local

# 2. Check content
cat .env.local | grep NEXT_PUBLIC_SUPABASE_URL

# 3. If missing, copy from template
cp .env.example .env.local
# Then edit with actual values

# 4. Restart dev server (it reads .env at startup)
npm run dev

# 5. Verify in browser console
open http://localhost:3000
Check Developer Tools > Console
```

---

### Issue: Database Connection Error

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Supabase connection timeout
```

**Solutions:**
```bash
# 1. Verify Supabase is running
# Go to Supabase Dashboard > Databases
# Should show "Your project is active"

# 2. Check URL is correct
echo $NEXT_PUBLIC_SUPABASE_URL
# Should be: https://xxxxx.supabase.co

# 3. Check internet connection
ping supabase.com

# 4. Verify API keys are correct
# Supabase > Settings > API
# Copy correct anon key and service role key

# 5. Check firewall
# Supabase > Settings > Network
# Add your IP if needed
```

---

### Issue: OAuth Redirect URI Mismatch

**Symptoms:**
```
Error: redirect_uri_mismatch
The provided redirect_uri doesn't match registered URIs
```

**Solutions:**

**Step 1: Fix Supabase**
```
1. Go to Supabase Dashboard
2. Authentication > URL Configuration
3. Add Redirect URL: http://localhost:3000
4. Save
```

**Step 2: Fix Google OAuth**
```
1. Go to Google Cloud Console
2. Credentials > OAuth 2.0 Client IDs
3. Edit your Web Application
4. Add Authorized Redirect URI:
   http://localhost:3000/auth/callback
5. Save
```

---

### Issue: Login Not Working

**Symptoms:**
```
Login button doesn't work
"Invalid credentials" error
Auth state not updating
```

**Solutions:**
```bash
# 1. Check Supabase connection
curl https://YOUR_SUPABASE_URL/rest/v1/

# 2. Check Google OAuth keys
echo $NEXT_PUBLIC_GOOGLE_CLIENT_ID

# 3. Check auth context
// In browser console:
localStorage.getItem('sb-xxxxx-auth-token')
// Should have token if logged in

# 4. Check browser console for errors
// Developer Tools > Console > Red errors
// Copy full error message

# 5. Clear browser data
// Developer Tools > Application > Clear Site Data
// Then try logging in again
```

---

### Issue: API Routes Returning 404

**Symptoms:**
```
404 Not Found on /api/projects
API routes not working
```

**Solutions:**
```bash
# 1. Check file exists
ls -la app/api/projects/route.ts

# 2. Verify file has correct exports
grep "export async function" app/api/projects/route.ts

# 3. Check filename is exactly "route.ts"
# NOT "routes.ts" or "Route.ts"

# 4. Restart dev server
npm run dev

# 5. Check URL is correct
curl http://localhost:3000/api/projects?userId=test
# NOT /api/projects.json or /api/projects/
```

---

### Issue: Database Triggers Not Firing

**Symptoms:**
```
updated_at not changing
activity_logs not recording
New user profiles not created
```

**Solutions:**
```sql
-- Check triggers exist
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_schema = 'public';

-- Check trigger function
\df update_updated_at_column

-- Test trigger manually
UPDATE projects SET name = 'test' WHERE id = '...';
SELECT updated_at FROM projects WHERE id = '...';
-- Should show current time

-- Check functions exist
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public';

-- If missing, re-run SQL schema:
-- Copy entire content from 001_initial_schema.sql
-- Paste in SQL Editor and Run
```

---

### Issue: RLS Policies Not Working

**Symptoms:**
```
Users can see other users' data
Admin access not restricted
```

**Solutions:**
```sql
-- Enable RLS on table
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Check RLS is enabled
SELECT * FROM information_schema.tables
WHERE table_name = 'projects'
AND is_insertable_into = 'YES';

-- List policies
SELECT * FROM pg_policies
WHERE schemaname = 'public'
AND tablename = 'projects';

-- Test policy
-- As user A: Should only see own projects
-- As admin: Should see all projects

-- Debug by checking user context
SELECT current_user_id();
SELECT is_admin(auth.uid());
```

---

### Issue: Type Errors in TypeScript

**Symptoms:**
```
Property 'id' does not exist on type 'User'
Cannot find name 'FC'
```

**Solutions:**
```bash
# 1. Check tsconfig.json
cat tsconfig.json

# 2. Install types
npm install --save-dev @types/react @types/node

# 3. Run type check
npm run type-check

# 4. Check imports
# Make sure you're importing types correctly
import { FC } from 'react'
import type { Project } from '@/types'

# 5. Regenerate types from Supabase (if using)
npm install -g supabase
supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

---

## 🔧 Common Tweaks & Fixes

### Fix: Port Already in Use

```bash
# If 3000 is already in use:
# Option 1: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001

# Option 3: Check what's using it
netstat -tunlp | grep 3000
```

---

### Fix: Out of Memory

```bash
# If Node runs out of memory:

# Increase heap size
NODE_OPTIONS=--max_old_space_size=4096 npm run build

# Or in npm command
node --max-old-space-size=4096 node_modules/next/dist/bin/next build
```

---

### Fix: Slow Build Times

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check build time
time npm run build

# Optimize: Remove unused dependencies
npm prune
```

---

## 📊 Performance Testing

### Check Page Load Time

```bash
# Using curl + timing
curl -w "Total time: %{time_total}s\n" \
  http://localhost:3000

# Using Lighthouse in Chrome
1. Open DevTools Ctrl+Shift+I
2. Click Lighthouse tab
3. Click "Analyze page load"
```

### Database Query Performance

```sql
-- Check slow queries
SELECT query, mean_time, calls
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;

-- Analyze query plan
EXPLAIN ANALYZE
SELECT * FROM projects
WHERE user_id = 'xxxxx'
ORDER BY created_at DESC;

-- Check missing indexes
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 🛡️ Security Testing

### Check Sensitive Data

```bash
# Make sure no secrets in client code
grep -r "SUPABASE_SERVICE_ROLE_KEY" app/  # Should be empty!
grep -r "GOOGLE_CLIENT_SECRET" app/       # Should be empty!

# Keys should only be in:
.env.local (development)
Vercel dashboard > Settings > Environment (production)

# Check .gitignore
cat .gitignore | grep -E ".env|secrets"
```

### Test RLS

```bash
# 1. Get anon token (client key)
# 2. Get service role token (server key)
# 3. Test with each:

# As anon (limited access)
curl -H "Authorization: Bearer ANON_KEY" \
  https://project.supabase.co/rest/v1/projects

# As service role (full access)
curl -H "Authorization: Bearer SERVICE_ROLE_KEY" \
  https://project.supabase.co/rest/v1/projects
```

---

## 🚀 Pre-Deployment Checklist

Before deploying to production:

```
□ Run type check
  npm run type-check

□ Run linter
  npm run lint

□ Build succeeds
  npm run build

□ No console errors
  npm run dev > check browser console

□ API routes work
  curl http://localhost:3000/api/projects?userId=test

□ Database accessible
  Check Supabase dashboard

□ Environment variables set
  cat .env.production.example

□ Images optimized
  Check Next/Image usage

□ Remove console.log calls
  grep -r "console.log" app/

□ Update package-lock.json
  npm install

□ All tests pass
  npm test

□ README is updated
  cat README.md

□ Documentation complete
  Check all .md files

□ Git status clean
  git status
  git log --oneline | head -5
```

---

## 📚 Logging Best Practices

### Server-Side Logging (API Routes)

```typescript
// app/api/projects/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json()
  
  console.log('[API] POST /api/projects', {
    userId: body.userId,
    projectName: body.name,
    timestamp: new Date().toISOString()
  })
  
  try {
    const project = await createProject(body.userId, body)
    console.log('[API] Project created:', project.id)
    return NextResponse.json({ success: true, data: project })
  } catch (error) {
    console.error('[API] Error creating project:', {
      error: error.message,
      userId: body.userId
    })
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
```

### Client-Side Logging

```typescript
// In components
try {
  const response = await fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  if (!response.ok) {
    const error = await response.json()
    console.error('[Client] API error:', error)
    return
  }
  
  const { data: project } = await response.json()
  console.log('[Client] Project created:', project.id)
} catch (error) {
  console.error('[Client] Network error:', error)
}
```

---

## 🔄 Regular Maintenance Tasks

### Daily
- [ ] Monitor Supabase dashboard for errors
- [ ] Check error logs in Vercel
- [ ] Review user activity logs

### Weekly
- [ ] Backup database (check Supabase auto-backups)
- [ ] Review code changes
- [ ] Update dependencies if security patches
- [ ] Check disk usage

### Monthly
- [ ] Update all dependencies: `npm update`
- [ ] Review performance metrics
- [ ] Test disaster recovery
- [ ] Update documentation
- [ ] Security audit

### Quarterly
- [ ] Update Node.js version
- [ ] Review architecture
- [ ] Plan infrastructure scaling
- [ ] Security penetration testing

---

## 📞 Getting Help

### Resources
- **Next.js Docs:** https://nextjs.org/docs
- **Supabase Docs:** https://supabase.com/docs
- **TypeScript Docs:** https://www.typescriptlang.org/docs/
- **Stack Overflow:** https://stackoverflow.com

### Debugging Tools
- **Browser DevTools:** Ctrl+Shift+I (Chrome/Firefox)
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Issues:** Check repository issues

### Contact
- **Your Team:** Slack or Email
- **Support:** support@emeraldtech.com
- **Issues:** GitHub Issues tab

---

**Happy Debugging!** 🐛✨

remember: Most issues have simple solutions. Read error messages carefully!
