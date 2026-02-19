# ✅ Checklist Setup Sistem Login Supabase Google Auth

Ikuti langkah-langkah ini untuk menyelesaikan setup sistem login.

## Phase 1: Google Cloud Console Setup

- [X] Buat/gunakan project di https://console.cloud.google.com
- [X] Aktifkan Google+ API
- [X] Buat OAuth 2.0 Credentials (Web Application)
- [X] Copy `Client ID` dan `Client Secret` dari Google Console
- [X] Tambahkan redirect URI ke Google Console:
  ```
  https://your-project-name.supabase.co/auth/v1/callback
  ```

## Phase 2: Supabase Project Setup

- [X] Buat project baru di https://supabase.com
- [X] Tunggu project selesai diprovision
- [X] Copy URL dan Anon Key dari Settings → API
- [X] Buka Authentication → Providers → Google
- [X] Aktifkan (toggle) Google provider
- [X] Paste `Client ID` dan `Client Secret` dari Google Console
- [X] Klik Save
- [X] Konfigurasi URL di Authentication → URL Configuration

## Phase 3: Local Configuration

- [X] Copy `.env.local.example` ke `.env.local`:
  ```bash
  cp .env.local.example .env.local
  ```

- [X] Edit `.env.local` dan isi:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
  NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  ```

- [X] **IMPORTANT**: Jangan commit `.env.local` ke git!
- [X] Tambahkan ke `.gitignore` (biasanya sudah ada):
  ```
  .env.local
  .env.*.local
  ```

## Phase 4: Installation & Testing

- [X] Jalankan: `npm install`
- [X] Jalankan: `npm run dev`
- [X] Buka browser: `http://localhost:3000/login`

### Test Login Email/Password
- [ ] Klik "Daftar di sini"
- [ ] Buat akun baru dengan email dan password
- [ ] Cek berhasil signup
- [ ] Login dengan akun yang baru dibuat
- [ ] Verify redirect ke `/dashboard`

### Test Google OAuth
- [ ] Klik "Masuk dengan Google"
- [ ] Pilih/login dengan Google Account
- [ ] Cek berhasil login
- [ ] Verify redirect ke `/dashboard`

### Test Admin Access
- [ ] Login dengan email = `NEXT_PUBLIC_ADMIN_EMAIL`
- [ ] Verify di dashboard ada section "Admin Panel"
- [ ] Verify role di navbar menunjukkan "👤 Admin"

### Test Protected Routes
- [ ] Logout dari dashboard
- [ ] Coba akses `/dashboard` langsung
- [ ] Verify auto-redirect ke `/login`

## Phase 5: Security Checklist

- [ ] ✅ `.env.local` tidak di-commit (check in `.gitignore`)
- [ ] ✅ Semua NEXT_PUBLIC_* keys minimal aman di production
- [ ] ✅ SUPABASE_SERVICE_ROLE_KEY hanya untuk server-side code
- [ ] ✅ Google OAuth credentials aman di Google Console
- [ ] ✅ Supabase project bukan public

## Phase 6: Production Deployment Checklist

- [ ] Update `NEXT_PUBLIC_ADMIN_EMAIL` sesuai email prod admin
- [ ] Update authorized redirect URIs di Google Console dengan domain prod:
  ```
  https://your-production-domain.com/auth/callback
  ```
- [ ] Update authorized redirect URIs di Supabase dengan domain prod
- [ ] Set environment variables di hosting platform (Vercel, Netlify, dll)
- [ ] Test login flow di production
- [ ] Monitor auth logs di Supabase dashboard

## Troubleshooting Checklist

### "Redirect URI mismatch"
- [ ] Copy-paste exact URL dari Supabase Settings → API → "Your URL"
- [ ] Pastikan sama di Google Console
- [ ] Pastikan tidak ada trailing slash
- [ ] Check lowercase/uppercase

### "OAuth provider not enabled"
- [ ] Buka Supabase → Authentication → Providers
- [ ] Cek Google provider sudah di-toggle ON
- [ ] Cek Client ID dan Secret sudah terisi

### "Email atau password salah"
- [ ] Pastikan email yang dipakai sudah di-verify di Supabase
- [ ] Cek password benar
- [ ] Cek tidak ada typo di email

### User tidak jadi admin
- [ ] Pastikan email Google = NEXT_PUBLIC_ADMIN_EMAIL
- [ ] Case sensitive! (admin@example.com ≠ Admin@example.com)
- [ ] Logout dan login ulang
- [ ] Clear browser cache

### Stuck di loading page
- [ ] Check browser console (F12 → Console)
- [ ] Check network tab untuk failed requests
- [ ] Verify Supabase URL dan keys benar di .env.local
- [ ] Restart dev server (Ctrl+C, npm run dev)

## Documentation Files

- 📖 [SETUP_AUTH.md](./SETUP_AUTH.md) - Setup guide lengkap (Bahasa Indonesia)
- 📋 [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Feature summary & usage
- 🔗 Configuration file: `.env.local.example`

## Resources

- 🔗 [Supabase Documentation](https://supabase.com/docs/guides/auth)
- 🔗 [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- 🔗 [Next.js 14 Documentation](https://nextjs.org/docs)

---

## Summary

✅ Kode sudah siap 100%
⚠️ Butuh konfigurasi Supabase + Google OAuth (30-45 menit)
🚀 Setelah setup, aplikasi langsung production-ready

**Estimate time:** 
- Development setup: ✅ Done
- Google + Supabase config: 30-45 menit
- Testing: 10-15 menit
- **Total: ~1 jam**

---

**Status**: Ready for team review & Supabase setup
