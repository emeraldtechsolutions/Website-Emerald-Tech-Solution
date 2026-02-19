# 🗄️ SUPABASE DATABASE SETUP GUIDE

Panduan lengkap untuk setup database schema di Supabase.

---

## 📋 Prerequisites

- ✅ Supabase project sudah berjalan
- ✅ Akses ke Supabase SQL Editor
- ✅ Database credentials

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Backup Existing Database (Recommended)

```bash
# Vercel Postgres backup (jika menggunakan)
pg_dump dbname > backup.sql
```

### Step 2: Copy SQL Schema

File schema sudah tersedia di:
```
/supabase/migrations/001_initial_schema.sql
```

### Step 3: Run Schema in Supabase SQL Editor

1. Buka Supabase Dashboard > [Project] > SQL Editor
2. Klik "New Query"
3. Copy seluruh isi dari `001_initial_schema.sql`
4. Paste ke SQL Editor
5. Klik "Run" (atau Cmd+Enter)
6. Wait untuk completion

**Atau gunakan Supabase CLI:**

```bash
# Install Supabase CLI
npm install -g supabase

# Login ke Supabase
supabase login

# Jalankan migration
supabase db push
```

### Step 4: Verify Database Tables

Di Supabase Dashboard:
1. Klik "Table Editor"
2. Verify tables sudah ada:
   - ✅ users
   - ✅ projects
   - ✅ modules
   - ✅ invoices
   - ✅ invoice_items
   - ✅ portfolio_projects
   - ✅ activity_logs
   - ✅ contact_messages
   - ✅ settings

---

## 📊 Database Schema Overview

### Tables Structure

```
┌─────────────────────────────────────────────┐
│              auth.users                      │
│         (Supabase Auth)                      │
└────────────────┬────────────────────────────┘
                 │ REFERENCES
                 ▼
┌─────────────────────────────────────────────┐
│            public.users                      │
│     (Extended User Profile)                  │
├─────────────────────────────────────────────┤
│ id, email, full_name, role, status...       │
└────────────────┬────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐  ┌────────┐  ┌──────────┐
│Projects│  │Invoices│  │Activity  │
├────────┤  ├────────┤  │Logs      │
│id,name │  │id,..   │  └──────────┘
│type    │  │items() │
│status  │  │        │ ┌──────────────┐
└────┬───┘  └────────┘ │Portfolio     │
     │                 │Projects      │
     ▼                 └──────────────┘
┌────────────┐
│ Modules    │
├────────────┤
│id, project │
│ progress   │
└────────────┘
```

---

## 🔑 Key Features

### 1. Row Level Security (RLS)

Semua tables sudah configured dengan RLS policies:

```sql
-- Users can only see their own data
SELECT * FROM projects 
WHERE user_id = auth.uid();  -- Auto-filtered

-- Admins can see everyone's data
SELECT * FROM projects;  -- If auth.uid() is admin
```

### 2. Automatic Timestamp Updates

Setiap table punya `created_at` dan `updated_at`:

```sql
-- Otomatis update saat record diubah
UPDATE projects SET name = 'New Name'
-- updated_at automatically set to CURRENT_TIMESTAMP
```

### 3. Auto-create User Profile

Ketika user sign up via auth:

```
User signup → Auth User created
           → Trigger: handle_new_user()
           → Create user profile di public.users
           → Role auto-assigned (admin or customer)
```

### 4. Invoice Number Generation

Otomatis generate invoice numbers:

```sql
-- Format: INV-YYMMM-00001
SELECT generate_invoice_number();  
-- Returns: INV-260219-00001
```

---

## 🛡️ RLS Policy Summary

| Table | Policy | Access |
|-------|--------|--------|
| users | Own profile | User can view/edit own |
| users | Admin override | Admin can view/edit all |
| projects | Own projects | User can manage own |
| projects | Admin override | Admin can manage all |
| invoices | Own invoices | User can manage own |
| invoices | Admin override | Admin can manage all |
| portfolio | Public | Anyone can view published |
| portfolio | Admin edit | Only admin can edit |
| activity_logs | Own logs | Users can view own |
| activity_logs | Admin logs | Admin can view all |

---

## 📝 Common SQL Queries

### Get User Dashboard Stats

```sql
-- Via View (recommended)
SELECT * FROM vw_user_statistics 
WHERE id = 'user-id-here';

-- Or direct query
SELECT
  u.id,
  COUNT(DISTINCT p.id) as total_projects,
  COUNT(DISTINCT i.id) as total_invoices,
  SUM(i.total_amount) as total_invoice_amount
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
LEFT JOIN invoices i ON u.id = i.user_id
WHERE u.id = 'user-id-here'
GROUP BY u.id;
```

### Get Project dengan Modules

```sql
SELECT
  p.*,
  json_agg(json_build_object(
    'id', m.id,
    'name', m.name,
    'status', m.status,
    'progress', m.progress
  )) as modules
FROM projects p
LEFT JOIN modules m ON p.id = m.project_id
WHERE p.id = 'project-id'
GROUP BY p.id;
```

### Get Active Invoices

```sql
SELECT
  i.*,
  json_agg(ii) as items,
  p.name as project_name
FROM invoices i
LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
LEFT JOIN projects p ON i.project_id = p.id
WHERE i.user_id = 'user-id'
  AND i.status IN ('pending', 'sent')
  AND i.due_date > CURRENT_DATE
GROUP BY i.id, p.name
ORDER BY i.due_date;
```

### Create Activity Log

```sql
-- Use function
SELECT log_activity(
  'user-id',
  'create',
  'project',
  'project-id',
  jsonb_build_object(
    'name', 'New Project',
    'type', 'pos'
  )
);
```

---

## 🔧 Management & Maintenance

### Backup Database

```bash
# Via pg_dump
pg_dump postgresql://user:password@host/db > backup.sql

# Via Supabase CLI
supabase db pull
```

### Restore Database

```bash
# From backup file
psql postgresql://user:password@host/db < backup.sql
```

### Monitor Database

Supabase Dashboard > Database > Logs:
- Slow queries
- Connection count
- Error logs
- Resource usage

### Optimize Queries

```sql
-- Add indexes untuk frequent queries
CREATE INDEX idx_projects_user_status 
ON projects(user_id, status);

CREATE INDEX idx_invoices_status_date
ON invoices(status, invoice_date DESC);

-- Check slow queries
SELECT * FROM pg_stat_statements 
ORDER BY mean_time DESC LIMIT 10;
```

---

## 🎯 Advanced Features

### 1. Full-Text Search

```sql
-- Setup FTS column
ALTER TABLE portfolio_projects 
ADD COLUMN search_vector tsvector 
GENERATED ALWAYS AS (
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(description, '')
  )
) STORED;

-- Query
SELECT * FROM portfolio_projects
WHERE search_vector @@ plainto_tsquery('pos system');
```

### 2. Audit Triggers

Automatic activity logging via trigger:

```sql
-- Already included in schema
-- Logs all project changes
SELECT * FROM activity_logs 
WHERE resource_type = 'project'
ORDER BY created_at DESC;
```

### 3. Materialized Views

For frequently accessed aggregations:

```sql
CREATE MATERIALIZED VIEW 
  vw_project_metrics AS
SELECT ... FROM ...;

-- Refresh setelah data berubah
REFRESH MATERIALIZED VIEW vw_project_metrics;
```

---

## 📊 Database Capacity

Current schema supports:

- **Users:** Unlimited (unlimited auth users)
- **Projects:** Unlimited per user
- **Invoices:** Millions of records
- **Database size:** Supabase PostgreSQL default 200GB
- **Connections:** 100 concurrent connections

**Upgrade di Settings > Billing** jika perlu lebih besar.

---

## 🔐 Security Features

### 1. Encryption at Rest
- Supabase automatically encrypts all data
- Managed encryption keys

### 2. Encryption in Transit
- SSL/TLS untuk semua connections
- Secure by default

### 3. Access Control
- Auth integration (Supabase Auth)
- RLS policies untuk row-level security
- API key management

### 4. Audit Trail
- Activity logs dari semua changes
- Log retention: Configurable

---

## 🚨 Troubleshooting

### ❌ "Table does not exist"

**Solution:**
```bash
# Verify migrations ran
supabase db list

# Re-run migrations
supabase db push --force-skip-validation
```

### ❌ "Permission denied"

**Solution:**
1. Check RLS policies enabled
2. Verify user role
3. Check auth session active
4. Review activity logs untuk denied access

### ❌ "Slow queries"

**Solution:**
```sql
-- Analyze query
EXPLAIN ANALYZE SELECT ... FROM ...;

-- Add missing indexes
CREATE INDEX idx_... ON table(column);
```

### ❌ "Out of connections"

**Solution:**
1. Check active connections
2. Close idle connections
3. Upgrade connection limit
4. Implement connection pooling

---

## 📈 Monitoring Checklist

Daily:
- [ ] Check error logs
- [ ] Monitor slow queries
- [ ] Verify database connection count

Weekly:
- [ ] Review activity logs
- [ ] Check storage usage
- [ ] Analyze query performance

Monthly:
- [ ] Database backup verify
- [ ] Review user statistics
- [ ] Update indexes if needed

---

## 🔗 Useful Links

- 📖 [Supabase PostgreSQL Docs](https://supabase.com/docs/guides/database)
- 📖 [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- 📖 [PostgreSQL Docs](https://www.postgresql.org/docs/)
- 🆘 [Supabase Support](https://supabase.com/support)

---

**Status:** ✅ Ready for production
**Last Updated:** February 19, 2026
**Schema Version:** 1.0

Database setup lengkap dan siap digunakan! 🎉
