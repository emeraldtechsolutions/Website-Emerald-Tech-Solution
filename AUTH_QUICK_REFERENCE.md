# 🔐 Auth System - Quick Reference Card

## 1️⃣ Using Auth in Components

### Check if user is logged in
```tsx
'use client'
import { useAuthContext } from '@/contexts/AuthContext'

export function Component() {
  const { user } = useAuthContext()
  
  if (!user) return <p>Please login</p>
  return <p>Hello {user.name}</p>
}
```

### Get user information
```tsx
const { user } = useAuthContext()

// user properties:
// - id: string (Supabase user ID)
// - email: string
// - name: string
// - role: 'admin' | 'customer'
// - avatar?: string (Google profile pic)
// - createdAt?: string
```

### Check user role
```tsx
const { user } = useAuthContext()

if (user?.role === 'admin') {
  return <AdminPanel />
}

return <CustomerDashboard />
```

## 2️⃣ Protecting Pages

### Full page protection
```tsx
'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function SecretPage() {
  return (
    <ProtectedRoute>
      <h1>This page requires login</h1>
    </ProtectedRoute>
  )
}
```

### Admin-only page
```tsx
'use client'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <h1>Admin Only</h1>
    </ProtectedRoute>
  )
}
```

## 3️⃣ Login Functions

### Login with Google
```tsx
const { loginWithGoogle, isLoading } = useAuthContext()

<button onClick={loginWithGoogle} disabled={isLoading}>
  Sign in with Google
</button>
```

### Login with Email
```tsx
const { loginWithEmail, error } = useAuthContext()

const handleLogin = async () => {
  const success = await loginWithEmail(email, password)
  if (!success) {
    console.error('Login failed:', error)
  }
}
```

### Signup with Email
```tsx
const { signup, error } = useAuthContext()

const handleSignup = async () => {
  const success = await signup(email, password, fullName)
  if (success) {
    // Redirect to login or show success message
  }
}
```

### Reset Password
```tsx
const { resetPassword, error } = useAuthContext()

const handleReset = async () => {
  const success = await resetPassword(email)
  if (success) {
    // Show "Check your email" message
  }
}
```

### Logout
```tsx
const { logout, isLoading } = useAuthContext()

<button onClick={logout} disabled={isLoading}>
  Logout
</button>
```

## 4️⃣ State Management

### Auth states to handle
```tsx
const { 
  user,          // null | AuthUser - Current logged-in user
  isLoading,     // boolean - API call in progress
  isInitialized, // boolean - Initial auth check done
  error          // null | string - Last error message
} = useAuthContext()

// Handle each state
if (!isInitialized) return <Loading />      // Init phase
if (isLoading) return <Spinner />           // API loading
if (error) return <ErrorAlert>{error}</ErrorAlert>
if (!user) return <LoginPage />             // Not authenticated
return <DashboardContent />                 // Authenticated
```

## 5️⃣ Complete Example Component

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'

function DashboardContent() {
  const router = useRouter()
  const { user, logout, isLoading, error } = useAuthContext()

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      
      {user?.role === 'admin' && (
        <div className="admin-banner">Admin Access Granted</div>
      )}

      {error && (
        <div className="error-alert">{error}</div>
      )}

      <button 
        onClick={logout}
        disabled={isLoading}
      >
        {isLoading ? 'Logging out...' : 'Logout'}
      </button>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  )
}
```

## 6️⃣ Environment Variables

Add to `.env.local`:
```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx_key_xxx
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com

# Optional (server-side only)
SUPABASE_SERVICE_ROLE_KEY=xxx_service_key_xxx
```

## 7️⃣ File Locations

| Component | Location | Purpose |
|-----------|----------|---------|
| Login Page | `/app/login/page.tsx` | User login form |
| Signup Page | `/app/signup/page.tsx` | User registration |
| Dashboard | `/app/dashboard/page.tsx` | Main dashboard |
| Auth Callback | `/app/auth/callback/page.tsx` | Google OAuth redirect |
| Forgot Password | `/app/auth/forgot-password/page.tsx` | Password reset |
| Auth Hook | `/hooks/useAuth.ts` | Main auth logic |
| Auth Context | `/contexts/AuthContext.tsx` | Context provider |
| Protected Route | `/components/ProtectedRoute.tsx` | Route wrapper |
| Supabase Config | `/lib/supabaseClient.ts` | Supabase setup |

## 8️⃣ Common Patterns

### Conditional rendering based on auth
```tsx
{user ? (
  <div>Logged in as {user.email}</div>
) : (
  <div>Not logged in</div>
)}
```

### Role-based UI
```tsx
{user?.role === 'admin' && <AdminMenu />}
{user?.role === 'customer' && <CustomerMenu />}
```

### Loading state
```tsx
{isLoading ? (
  <Spinner />
) : user ? (
  <Dashboard />
) : (
  <Login />
)}
```

### Error handling
```tsx
{error && (
  <Alert severity="error">
    {error}
  </Alert>
)}
```

### Combining with form
```tsx
const [email, setEmail] = useState('')
const { loginWithEmail, isLoading, error } = useAuthContext()

const handleSubmit = async (e) => {
  e.preventDefault()
  const success = await loginWithEmail(email, password)
  if (success) router.push('/dashboard')
}

<input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  disabled={isLoading}
/>
<button type="submit" disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Login'}
</button>
{error && <p className="error">{error}</p>}
```

## ❓ FAQ

**Q: How do I check if user is admin?**
```tsx
user?.role === 'admin'
```

**Q: How do I get the current user?**
```tsx
const { user } = useAuthContext()
```

**Q: How do I logout?**
```tsx
const { logout } = useAuthContext()
logout()
```

**Q: How do I protect a page?**
```tsx
<ProtectedRoute requiredRole="admin">
  <Page />
</ProtectedRoute>
```

**Q: How do I show loading state?**
```tsx
const { isLoading } = useAuthContext()
if (isLoading) return <Spinner />
```

---

**Quick Links:**
- 📖 [Full Setup Guide](./SETUP_AUTH.md)
- 📋 [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- ✅ [Setup Checklist](./SETUP_CHECKLIST.md)
