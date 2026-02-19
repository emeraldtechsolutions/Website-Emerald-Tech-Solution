# Panduan Setup Sistem Login Supabase Google Auth

Dokumen ini menjelaskan cara mengonfigurasi sistem login menggunakan Supabase dengan Google OAuth.

## 📋 Persyaratan

1. Akun Supabase (https://supabase.com)
2. Akun Google Cloud Console (https://console.cloud.google.com)
3. Node.js dan npm terinstal

## 🔧 Langkah Konfigurasi

### 1. Setup Supabase Project

**a. Buat Project Baru di Supabase:**
- Kunjungi https://supabase.com dan login
- Klik "New Project"
- Isi nama project (e.g., "Emerald Tech")
- Buat password database yang kuat
- Pilih region terdekat
- Tunggu project selesai diprovision

**b. Dapatkan API Keys:**
- Di dashboard Supabase, klik "Settings" → "API"
- Copy nilai berikut:
  - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
  - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` (untuk server-side saja)

### 2. Setup Google OAuth di Supabase

**a. Konfigurasi di Google Cloud Console:**

1. Buka https://console.cloud.google.com
2. Buat project baru atau gunakan yang sudah ada
3. Aktifkan Google+ API:
   - Cari "Google+ API" di search bar
   - Klik "Enable"

4. Buat OAuth 2.0 Credentials:
   - Klik "Create Credentials" → "OAuth client ID"
   - Jika diminta, konfigurasi OAuth consent screen terlebih dahulu:
     - Pilih "External"
     - Isi informasi aplikasi (App name, User support email, dll)
     - Scope yang diperlukan: `email`, `profile`
   - Pilih application type: "Web application"
   - Tambahkan Authorized redirect URIs:
     ```
     https://your-project-name.supabase.co/auth/v1/callback
     ```
   - Klik "Create"
   - Copy `Client ID` dan `Client Secret`

**b. Konfigurasi di Supabase:**

1. Di dashboard Supabase, klik "Authentication" → "Providers"
2. Cari dan klik "Google"
3. Aktifkan provider (toggle "Enabled")
4. Paste `Client ID` dan `Client Secret` dari Google Cloud Console
5. Klik "Save"

### 3. Konfigurasi Environment Variables

1. Copy file `.env.local.example`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` dan isi dengan:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_ADMIN_EMAIL=your-email@example.com
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

3. Ganti `your-email@example.com` dengan email Anda yang akan menjadi admin

### 4. Setup Database Tables (Opsional)

Jika ingin menyimpan data profil user lebih lengkap, buat tabel di Supabase:

**Tabel `users` (public):**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

### 5. Install Dependencies

```bash
npm install
```

Paket `@supabase/supabase-js` sudah ditambahkan ke `package.json`.

### 6. Setup Redirect URL di Next.js

Pastikan aplikasi Anda berjalan di:
- Development: `http://localhost:3000`
- Production: `https://your-domain.com`

Tambahkan kedua URL ke authorized redirect URIs di Google Cloud Console dan Supabase jika diperlukan.

## 🚀 Menjalankan Aplikasi

1. Jalankan development server:
   ```bash
   npm run dev
   ```

2. Buka browser ke `http://localhost:3000`

3. Klik "Login" dan coba:
   - Login dengan Email + Password
   - Login dengan Google

## 👥 Sistem Role

- **Admin**: Email yang sama dengan `NEXT_PUBLIC_ADMIN_EMAIL` otomatis mendapat role `admin`
- **Customer**: Semua email lain mendapat role `customer`

Untuk mengubah admin email, ubah nilai `NEXT_PUBLIC_ADMIN_EMAIL` di `.env.local`.

## 📁 File Struktur Auth

```
app/
├── login/              # Halaman login
├── signup/             # Halaman signup
└── auth/
    ├── callback/       # Callback Google OAuth
    └── forgot-password/ # Reset password
components/
contexts/
├── AuthContext.tsx     # Auth context & provider
hooks/
├── useAuth.ts         # Auth hook dengan Supabase
lib/
├── supabaseClient.ts  # Konfigurasi Supabase
types/
├── index.ts           # Type definitions
```

## 🔐 Best Practices

1. **Environment Variables:**
   - Jangan commit `.env.local`
   - Hanya `NEXT_PUBLIC_*` yang aman dipublikasikan
   - Gunakan `SUPABASE_SERVICE_ROLE_KEY` hanya di server-side

2. **Authentication:**
   - Session otomatis diatur oleh Supabase
   - User context tersedia via `useAuthContext()` hook
   - Role checking bisa dilakukan via `user.role`

3. **Google OAuth:**
   - Redirect URI harus sesuai 100% dengan config di Google Console
   - Testing lokal perlu `http://localhost:3000` di whitelist
   - Production perlu domain yang sebenarnya

## 🆘 Troubleshooting

### Error: "Redirect URI mismatch"
- Pastikan URL di Supabase settings → "Auth" → "URL Configuration" sesuai dengan domain aplikasi
- Pastikan Google OAuth redirect URI sesuai

### Error: "OAuth provider not enabled"
- Buka Supabase Dashboard → Authentication → Providers
- Pastikan Google provider sudah diaktifkan (toggle ON)

### User tidak mendapat role admin
- Pastikan email di `NEXT_PUBLIC_ADMIN_EMAIL` sesuai persis dengan email Google Account
- Jika sudah terdaftar sebelumnya, logout lalu login ulang

### Token expired atau session loss
- Supabase otomatis refresh token
- Jika masalah persisten, clear cookies dan login ulang

## 📚 Referensi

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Next.js 14 Documentation](https://nextjs.org/docs)

---

**Catatan:** Setelah setup, pastikan untuk testing login di development mode sebelum deploy ke production.
