# 🎯 DEPLOYMENT CHECKLIST - Follow This Order!

**Your auth fixes are complete. Follow this checklist to deploy and test.**

---

## ⏱️ Total Time Required: ~10 minutes

```
SQL Migration:    1 minute
Code Deployment:  2-3 minutes  
Testing:          5 minutes
TOTAL:            ~10 minutes
```

---

## 📋 PRE-DEPLOYMENT CHECKLIST

- [ ] You have access to Supabase Dashboard
- [ ] You have access to Vercel Dashboard
- [ ] You can run `git` commands locally
- [ ] You have your Vercel project URL handy
- [ ] You have browser DevTools (F12) available for testing

---

## ✅ STEP 1: Execute SQL Migration (⏰ 1 minute)

**THIS STEP IS CRITICAL - DO THIS FIRST!**

### Instructions:

```
1. Open: https://supabase.com/dashboard
   ☐ You see dashboard

2. Select your project (Emerald Tech Solution)
   ☐ Project loaded

3. Click: SQL Editor (left sidebar)
   ☐ SQL Editor opened

4. Click: "New SQL" button (top right)
   ☐ New blank query created

5. COPY the entire file:
   /supabase/migrations/002_fix_auth_user_creation.sql
   ☐ File copied to clipboard (Ctrl+A, Ctrl+C)

6. PASTE into the SQL Editor
   ☐ Entire content pasted

7. Click: "RUN" button
   ☐ Migration executed

8. Check result:
   ☐ No red errors shown
   ☐ See success message
```

### Expected Result:
```
✅ Query executed successfully
✅ No errors in output
✅ In Supabase, SQL Editor shows "Success"
```

### Verify Migration Worked:

```
Still in SQL Editor, run this single query:

SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

☐ You should see these policies:
   - Service role can insert new users ← NEW! (most important)
   - Users can insert own profile
   - Users can update own profile
   - Users can view own profile
```

**If this query doesn't show "Service role can insert new users", the migration FAILED. Check error message above.**

---

## ✅ STEP 2: Deploy Updated Code (⏰ 2-3 minutes)

**Execute in your terminal/command line:**

```bash
# Step A: Show what will be deployed
git status

# You should see these files modified/new:
# - app/auth/callback/page.tsx (modified)
# - hooks/useAuth.ts (modified)
# - supabase/migrations/002_fix_auth_user_creation.sql (new)
# - Various documentation files (new)

☐ Files shown are correct


# Step B: Stage all changes
git add .

☐ Command executed without errors


# Step C: Commit changes
git commit -m "Fix: auth database error and OAuth callback issues"

☐ Commit created, see "files changed" message


# Step D: Push to main branch
git push origin main

☐ Code pushed (may take 5-10 seconds)
```

### Verify Deployment:

```
1. Open: https://vercel.com/dashboard
   ☐ Vercel dashboard loaded

2. Select your project
   ☐ Project page loaded

3. Look at "Deployments" section
   ☐ See newest deployment at top

4. Wait for status:
   ⏳ Should see "Building..." then "Ready"
   ☐ Deployment complete (green checkmark)
   ☐ Takes ~2-3 minutes
```

**Note:** If deployment fails, check:
- Error message in Vercel Deployments tab
- Environment variables are correctly set in Vercel
- No syntax errors in code files

---

## ✅ STEP 3: Test Email/Password Signup (⏰ 3 minutes)

**Now test if signup works:**

### Pre-Test Setup:

```
1. Open your app in browser:
   https://your-vercel-domain.vercel.app
   ☐ App loaded

2. Open DevTools:
   Press F12 on keyboard
   ☐ DevTools panel opened (right side)

3. Click Console tab (in DevTools)
   ☐ Console visible, ready to see logs
```

### Test Signup:

```
1. In your app, click: "Daftar" button
   ☐ Signup form loaded

2. Fill the form:
   - Nama Lengkap: Test User
   - Email: test.user.123@gmail.com
   - Password: SecurePassword123!
   ☐ Form filled

3. Click: "Buat Akun" button
   ☐ Form submitted, waiting...

4. Check result:
   ☐ See success message (NOT "Database error")
   ☐ See "redirecting to login..." message
   ☐ Page redirects to login page (3 seconds)
```

### Verify in Console:

```
1. In DevTools Console (F12), you should see:
   ☐ "🔓 Attempting email login: test.user.123@gmail.com"
   ☐ "✅ Email login successful: test.user.123@gmail.com"
   ☐ "✅ Profile loaded, authentication complete"
   
   These indicate signup was successful!
```

### Verify in Supabase:

```
1. Open: https://supabase.com/dashboard
   ☐ Supabase dashboard opened

2. Select your project
   ☐ Project loaded

3. Click: Authentication (left sidebar)
   ☐ Auth page loaded

4. Click: Users tab
   ☐ Users list shows

5. Look for: test.user.123@gmail.com
   ☐ Email appears in users list
   ☐ Created timestamp shows recent time
```

### Verify Database:

```
1. In Supabase, click: Database (left sidebar)
   ☐ Database page loaded

2. Click: Tables > users
   ☐ Users table shown

3. Look for test.user.123@gmail.com:
   ☐ Email is in the table
   ☐ Role column shows: "customer"
   ☐ Status shows: "active"
   ☐ Created timestamp recent
```

**If any verification fails, check:**
- Browser console for error details (red text)
- Supabase Logs > Database for trigger errors
- Check SQL migration was actually executed

---

## ✅ STEP 4: Test Email/Password Login (⏰ 1 minute)

### Test Login:

```
1. In app, you should be on Login page already
   ☐ Login form visible

2. Fill the form:
   - Email: test.user.123@gmail.com
   - Password: SecurePassword123!
   ☐ Form filled

3. Click: "Masuk dengan Email" button
   ☐ Form submitted, very brief loading...

4. Check result:
   ☐ Instantly redirect to dashboard (NOT loading forever)
   ☐ See username in navbar
   ☐ See project sections (Proyek, Invoices, Portfolio, etc.)
```

### Verify Session Persistence:

```
1. If dashboard loaded:
   ☐ Refresh the page (F5)

2. Check result:
   ☐ Page still shows dashboard (NOT redirected to login)
   ☐ User still logged in
   ☐ Session persisted ✅
```

---

## ✅ STEP 5: Test Google OAuth (⏰ 2 minutes)

### Setup Google Test:

```
1. Go back to login page:
   - Click logout button in navbar, OR
   - Navigate to: /login
   ☐ Login page loaded

2. Open DevTools (F12) and Console tab:
   ☐ Console visible
```

### Test Google OAuth:

```
1. Click: "Masuk dengan Google" button
   ☐ Google sign-in popup opens

2. In popup:
   - Select your Google account
   ☐ Account selected or logged in

3. Click: "Allow" (to authorize the app)
   ☐ Google popup closes
   ☐ You're redirected back to your app

4. Check App Status:
   ☐ See "Processing authentication..." message
   ☐ See green loading spinner
   ☐ WAIT 1-2 seconds...
   ☐ Automatically redirected to dashboard
   ☐ NOT stuck on processing page
```

### Verify in Console:

```
1. In DevTools Console (F12), you should see:
   ☐ "🔄 Processing OAuth callback..."
   ☐ "📊 Session check: {hasSession: true}"
   ☐ "✅ Session found, user: your-email@gmail.com"
   ☐ "🎯 Redirecting to dashboard..."

If you see these logs, OAuth is working! ✅
```

### Verify in Supabase:

```
1. Open: https://supabase.com/dashboard
2. Authentication > Users
   ☐ Your Google email appears in users list
   
3. Database > users table
   ☐ Your email visible
   ☐ Role: "customer" (unless it's admin email)
   ☐ Status: "active"
```

---

## ✅ STEP 6: Verify Admin Role (⏰ 1 minute - Optional)

**If you want to verify admin role assignment works:**

### Setup:

```
1. In your code, have this in .env.local:
   NEXT_PUBLIC_ADMIN_EMAIL=your.email@gmail.com
   (use your actual Google email)
   ☐ Environment variable set

2. Redeploy code:
   git add . && git commit -m "Set admin email" && git push
   ☐ Code pushed, Vercel deploying
   ☐ Wait for green checkmark in Vercel
```

### Test Admin Login:

```
1. Go to login page
   ☐ Login page loaded

2. Click: "Masuk dengan Google"
   ☐ Google popup opens

3. Use the email matching NEXT_PUBLIC_ADMIN_EMAIL
   ☐ Account selected/authorized

4. Wait for redirect to dashboard
   ☐ Redirected (should work same as before)
```

### Verify Admin Role:

```
1. Open: https://supabase.com/dashboard
2. Database > users table
3. Find your email row
   ☐ Role column shows: "admin" ← NOT "customer"!

If admin role assigned correctly, the admin logic is working! ✅
```

---

## 📊 FINAL VERIFICATION CHECKLIST

After all steps above, verify:

```
✅ Email signup works (no "Database error")
✅ Signup user appears in Supabase Auth > Users
✅ Signup user appears in Supabase Database > users table
✅ Email login instantly redirects to dashboard
✅ Session persists after page refresh
✅ Google OAuth redirects to dashboard (not stuck)
✅ OAuth user appears in Supabase Auth > Users
✅ OAuth user appears in Supabase Database > users table
✅ Console shows detailed logs (🔄, 📊, ✅, 🎯)
✅ Console shows NO red error messages
✅ Can click around dashboard freely
✅ Can logout and login again
✅ Admin role assigns correctly (if tested)
```

**If all above are checked, your auth system is FIXED! 🎉**

---

## 🚨 TROUBLESHOOTING

### Problem: "Database error saving new user"
**Check:**
- [ ] SQL migration actually executed (rerun the pg_policies query)
- [ ] Browser console (F12) for detailed error
- [ ] Supabase > Logs > Database for trigger errors
- [ ] Supabase Settings > Authentication > Email Confirmation is DISABLED

### Problem: OAuth doesn't redirect
**Check:**
- [ ] Vercel deployment successful (green checkmark)
- [ ] Browser console (F12) for errors
- [ ] Hard refresh browser (Ctrl+Shift+R on Windows)
- [ ] Check Supabase > Settings > Auth > Redirect URLs includes `/auth/callback`

### Problem: Session lost on refresh
**Check:**
- [ ] Browser have localStorage enabled
- [ ] Environment variables in Vercel are correct
- [ ] Check /lib/supabaseClient.ts has persistSession config

**For more detailed troubleshooting, see: `/FIX_AUTH_DATABASE_ERROR.md`**

---

## 📞 Key Resources

**Documentation:**
- Quick reference: `/QUICK_FIX_GUIDE.md`
- Detailed guide: `/FIX_AUTH_DATABASE_ERROR.md`
- Changes summary: `/CHANGES_SUMMARY.md`

**Files involved:**
- SQL migration: `/supabase/migrations/002_fix_auth_user_creation.sql`
- OAuth callback: `/app/auth/callback/page.tsx`
- Auth hook: `/hooks/useAuth.ts`

**External Links:**
- Supabase: https://supabase.com/dashboard
- Vercel: https://vercel.com/dashboard
- Your App: https://your-vercel-domain.vercel.app

---

## ✨ Success Indicators

Your auth is working correctly when:

1. **Signup:** Click "Daftar" → Fill form → Click "Buat Akun" → Success message (no error)
2. **User appears:** Email immediately shows in Supabase Auth > Users
3. **Login:** Click "Masuk dengan Email" → Instant redirect to dashboard
4. **Session:** Refresh dashboard → Still logged in (not redirected to login)
5. **OAuth:** Click "Masuk dengan Google" → Wait 1-2 sec → Dashboard loads
6. **Logs:** Console (F12) shows detailed steps with ✅ indicators
7. **Database:** All users appear in Supabase with correct role

---

## ⏱️ Time Tracking

```
Step 1 (SQL):        ☐ ___ minutes
Step 2 (Deploy):     ☐ ___ minutes
Step 3 (Signup test):☐ ___ minutes
Step 4 (Login test): ☐ ___ minutes
Step 5 (OAuth test): ☐ ___ minutes
Step 6 (Admin test): ☐ ___ minutes (optional)
                     ───────────────
TOTAL TIME:          ☐ ~10 minutes

Actual time taken: ___ minutes
```

---

## 🎯 When You're Done

After completing all checklist items:

```
✅ Your auth system is fully fixed
✅ Signup works
✅ Login works
✅ Google OAuth works
✅ Session persists
✅ No errors in console
✅ Ready for production! 🚀
```

---

**🎉 Congratulations! Your auth bugs are fixed!**

**Next Steps After Testing:**
1. Show the fixed app to your team
2. Do user acceptance testing
3. Deploy to production
4. Monitor for any issues

**Questions?** Refer to the many documentation files in the repo root.

