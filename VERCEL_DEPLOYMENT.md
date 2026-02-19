# 🚀 VERCEL DEPLOYMENT GUIDE - EMERALD TECH SOLUTION

Panduan lengkap untuk deploy aplikasi ke Vercel dengan Supabase backend.

---

## 📋 Prerequisites

Pastikan Anda sudah memiliki:
- ✅ Akun Vercel (https://vercel.com)
- ✅ Repository di GitHub (fork/push project)
- ✅ Supabase project sudah jalan
- ✅ Environment variables siap

---

## 🔧 Step-by-Step Deployment

### Step 1: Prepare GitHub Repository

```bash
# 1. Push code ke GitHub
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Pastikan .env.local dan .env.production.example tidak di-commit
# (sudah ada di .gitignore)

# 3. Verify production environment variables di .env.production.example
# sudah benar formatnya
```

### Step 2: Connect GitHub to Vercel

1. Buka https://vercel.com/new
2. Klik "Import Project"
3. Pilih "GitHub"
4. Authorize Vercel dengan GitHub account
5. Pilih repository "Website-Emerald-Tech-Solution"
6. Klik "Import"

### Step 3: Configure Project Settings

**Basic Settings:**
- Project Name: `emerald-tech-solution` (atau nama yang Anda inginkan)
- Framework: Next.js (otomatis terdeteksi)
- Root Directory: `.` (root)

**Build Settings:**
```
Build Command:     npm run build
Output Directory:  .next
Install Command:   npm install
```

Vercel biasanya sudah auto-detect ini, tapi verify untuk memastikan.

### Step 4: Set Environment Variables

**SANGAT PENTING:** Environment variables harus di-set di Vercel dashboard

1. Di Vercel project dashboard, buka **Settings > Environment Variables**

2. Add environment variables berikut:

   **Development & Preview:**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_ADMIN_EMAIL
   SUPABASE_SERVICE_ROLE_KEY
   ```

   **Production:**
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   NEXT_PUBLIC_ADMIN_EMAIL
   SUPABASE_SERVICE_ROLE_KEY
   ```

3. Untuk setiap variable, set environment ke:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

4. Copy values dari:
   - Supabase Dashboard > Settings > API

5. Klik "Save"

### Step 5: Configure Custom Domain (Optional)

1. Pada project dashboard, buka **Settings > Domains**
2. Klik "Add"
3. Enter domain Anda (e.g., `emeraldtech.com`)
4. Follow DNS configuration instructions
5. Wait 24-48 hours for DNS propagation

---

## 🔐 Environment Variables Explained

| Variable | Value From | Required | Notes |
|----------|-----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Settings > API | ✅ | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Settings > API | ✅ | `anon public` key |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Your choice | ✅ | Email untuk admin role |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Settings > API | ✅ | Service role (sensitive!) |

**PENTING:**
- Variables dengan prefix `NEXT_PUBLIC_` akan visible di client
- `SUPABASE_SERVICE_ROLE_KEY` HARUS server-side only
- Jangan commit `.env` files ke Git

---

## 📝 Vercel Configuration File

File `vercel.json` sudah included dengan config:

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "nodeVersion": "18.x"
}
```

Jika perlu customize, edit file ini.

---

## 🌍 Redirect URLs Configuration

Setelah deploy ke Vercel, update redirect URLs di Supabase & Google:

### A. Update Supabase Redirect URIs

1. Buka Supabase Dashboard
2. Project > Authentication > URL Configuration
3. Set Site URL:
   ```
   https://your-production-domain.vercel.app
   ```
4. Add Redirect URLs:
   ```
   https://your-production-domain.vercel.app/auth/callback
   https://your-production-domain.vercel.app/login
   ```
5. Save

### B. Update Google OAuth Redirect URIs

1. Buka Google Cloud Console
2. APIs & Services > Credentials
3. Edit OAuth 2.0 Client
4. Add Authorized Redirect URIs:
   ```
   https://your-production-domain.supabase.co/auth/v1/callback
   https://your-production-domain.vercel.app/auth/callback
   ```
5. Save

---

## ✅ Post-Deployment Verification

Setelah deployment berhasil, test ini:

### 1. Basic Functionality
- [ ] Website bisa diakses dari production URL
- [ ] Homepage bisa dimuat
- [ ] Navigation bekerja
- [ ] No console errors (F12)

### 2. Authentication
- [ ] Signup dengan email/password
- [ ] Login dengan email/password
- [ ] Login dengan Google
- [ ] Logout berfungsi
- [ ] Session persist after page refresh

### 3. Protected Routes
- [ ] Dashboard dapat diakses saat login
- [ ] Dashboard redirect ke /login saat logout
- [ ] Admin features visible untuk admin email

### 4. API & Database
- [ ] Projects dapat dibuat
- [ ] Invoices dapat dibuat dan disimpan
- [ ] Data muncul di dashboard
- [ ] No database connection errors

### 5. Performance
- [ ] Page load time < 3 seconds
- [ ] No 404 errors for assets
- [ ] Images load correctly
- [ ] Responsive di mobile

---

## 🐛 Common Deployment Issues & Fixes

### ❌ "Build failed"

**Solution:**
```bash
# Local test build dulu
npm run build

# Check untuk TypeScript errors
npx tsc --noEmit

# Push fixes
git push origin main
```

### ❌ "Environment variables not found"

**Solution:**
1. Re-check environment variables di Vercel dashboard
2. Verify variable names exactly match your code
3. Redeploy: Dashboard > Deployments > [Latest] > Redeploy
4. Wait 2-3 minutes untuk rebuild

### ❌ "Supabase connection failed"

**Solution:**
1. Verify API URL dan Key di Vercel env vars
2. Check Supabase project status
3. Test Supabase connection locally
4. Verify IP allowlist di Supabase (if any)

### ❌ "Google OAuth not working"

**Solution:**
1. Verify Google redirect URI includes Vercel domain
2. Check NEXT_PUBLIC_SUPABASE_URL matches Supabase URL
3. Test with localhost first
4. Check browser console untuk error messages

### ❌ "Database queries timeout"

**Solution:**
1. Check Supabase database status
2. Verify RLS policies tidak blocking queries
3. Add indexes untuk slow queries
4. Check query complexity

---

## 📊 Monitoring & Logs

### View Deployment Logs

1. Vercel Dashboard > [Project] > Deployments
2. Click pada deployment date
3. View Build Logs & Runtime Logs

### View Runtime Errors

1. Vercel Dashboard > [Project] > Function Logs
2. Filter by deployment
3. Check untuk errors

### Supabase Logs

1. Supabase Dashboard > Project > Logs
2. View database queries & API calls
3. Check untuk slow queries

---

## 🔄 Continuous Deployment

Setelah initial deployment, setiap push ke `main` branch otomatis:

1. ✅ Trigger Vercel build
2. ✅ Run tests (if configured)
3. ✅ Build application
4. ✅ Deploy ke production (setelah preview approved)

**Preview Deployments:**
- Generate untuk setiap pull request
- Vercel automatically creates temporary URLs
- Share untuk code review

**Production Deployments:**
- Otomatis saat merge ke `main`
- Custom domain langsung active
- Automatic rollback jika error

---

## 🔒 Security Best Practices

### 1. Environment Variables
- ✅ Set di Vercel dashboard (NOT in files)
- ✅ Use Vercel's built-in secrets
- ✅ Rotate keys regularly
- ✅ Never commit .env files

### 2. Database Security
- ✅ Enable RLS policies (sudah included)
- ✅ Regular backups (Supabase auto-backup)
- ✅ Monitor access logs
- ✅ Limit data exposure

### 3. API Security
- ✅ Validate input di semua routes
- ✅ Rate limiting (configure di Vercel)
- ✅ CORS properly configured
- ✅ Error messages tidak expose data

### 4. SSL/HTTPS
- ✅ Otomatis provided oleh Vercel
- ✅ HTTP redirect ke HTTPS
- ✅ Force HTTPS in production

---

## 📈 Scaling & Performance

### Database
- Supabase PostgreSQL scale otomatis
- Monitor connection count
- Add read replicas jika needed

### Frontend
- Vercel CDN caches static assets
- Edge functions untuk dynamic content
- Automatic image optimization

### Monitoring
- Setup alerts di Vercel
- Monitor database performance
- Track API response times

---

## 🚀 Deployment Checklist

Sebelum production deployment:

- [ ] Environment variables configured di Vercel
- [ ] GitHub repository updated
- [ ] All tests passing locally
- [ ] No console errors
- [ ] Database migrations ran
- [ ] Email is configured (if using email features)
- [ ] Backup strategy in place
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Monitoring setup

---

## 📞 Support & Help

### Vercel Issues
- 📖 https://vercel.com/docs
- 🆘 https://vercel.com/support
- 💬 Vercel Community Discord

### Supabase Issues
- 📖 https://supabase.com/docs
- 🆘 https://supabase.com/support
- 💬 Supabase Discord

### Next.js Issues
- 📖 https://nextjs.org/docs
- 🐛 https://github.com/vercel/next.js/issues

---

## 🎉 Deployment Complete!

**After successful deployment:**

1. ✅ Share production URL: `https://your-domain.vercel.app`
2. ✅ Test semua features
3. ✅ Monitor untuk issues
4. ✅ Setup analytics (optional)
5. ✅ Celebrate! 🎉

---

**Production Status:** Ready for deployment
**Estimated Deploy Time:** 2-5 minutes
**Post-Deploy Testing:** 10-15 minutes

Selamat deploy! 🚀
