-- ============================================================================
-- EMERALD TECH SOLUTION - SUPABASE DATABASE SCHEMA
-- ============================================================================
-- Database setup untuk Emerald Tech Solution dengan PostgreSQL di Supabase
-- Last Updated: February 19, 2026
-- ============================================================================

-- ============================================================================
-- 1. EXTENSION SETUP
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 2. USERS TABLE (Extension dari Supabase auth.users)
-- ============================================================================
-- Catatan: Supabase sudah menyediakan auth.users table
-- Tabel ini adalah extension untuk store additional user info

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  phone_number VARCHAR(20),
  avatar_url TEXT,
  role VARCHAR(50) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pos', 'erp', 'fnb')),
  status VARCHAR(50) DEFAULT 'planning' CHECK (status IN ('planning', 'in-progress', 'on-hold', 'completed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  
  -- Budget tracking
  budget_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  spent_amount DECIMAL(15,2) DEFAULT 0,
  
  -- Additional info
  notes TEXT,
  priority VARCHAR(50) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create index untuk common queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON public.projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- ============================================================================
-- 4. MODULES TABLE (Bagian dari project)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed', 'cancelled')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Timeline
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  
  -- Cost estimation
  estimated_duration INTEGER, -- in days
  actual_duration INTEGER,
  cost_estimate DECIMAL(15,2),
  cost_actual DECIMAL(15,2),
  
  -- Additional
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_modules_project_id ON public.modules(project_id);
CREATE INDEX IF NOT EXISTS idx_modules_status ON public.modules(status);

-- ============================================================================
-- 5. INVOICES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  
  -- Invoice details
  invoice_number VARCHAR(50) NOT NULL UNIQUE,
  invoice_date DATE NOT NULL,
  due_date DATE NOT NULL,
  paid_date DATE,
  
  -- Amounts
  subtotal DECIMAL(15,2) NOT NULL,
  tax DECIMAL(15,2) DEFAULT 0,
  total_amount DECIMAL(15,2) NOT NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'pending', 'paid', 'overdue', 'cancelled')),
  payment_method VARCHAR(100),
  payment_notes TEXT,
  
  -- Description
  description TEXT,
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON public.invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON public.invoices(invoice_date DESC);

-- ============================================================================
-- 6. INVOICE ITEMS TABLE  
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.invoice_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  
  description VARCHAR(255) NOT NULL,
  quantity DECIMAL(10,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  
  -- Additional
  notes TEXT,
  order_index INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);

-- ============================================================================
-- 7. PORTFOLIO PROJECTS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  description TEXT,
  content TEXT,
  
  category VARCHAR(50) NOT NULL CHECK (category IN ('pos', 'erp', 'fnb')),
  
  -- Images
  featured_image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Client info (optional)
  client_name VARCHAR(255),
  client_company VARCHAR(255),
  
  -- Features & Technologies
  features JSONB DEFAULT '[]'::jsonb, -- Array of strings
  technologies JSONB DEFAULT '[]'::jsonb, -- Array of strings
  
  -- Metrics
  views_count INTEGER DEFAULT 0,
  
  -- Status
  is_published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  
  -- SEO
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords JSONB DEFAULT '[]'::jsonb,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON public.portfolio_projects(is_published);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON public.portfolio_projects(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON public.portfolio_projects(featured);

-- ============================================================================
-- 8. ACTIVITY LOG TABLE (Audit trail)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  action VARCHAR(100) NOT NULL, -- e.g., 'create', 'update', 'delete', 'login'
  resource_type VARCHAR(50), -- e.g., 'project', 'invoice', 'user'
  resource_id UUID,
  
  changes JSONB DEFAULT '{}'::jsonb, -- Before/after values
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

-- ============================================================================
-- 9. CONTACT MESSAGES TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  
  status VARCHAR(50) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  assigned_to UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  reply_message TEXT,
  replied_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create index
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- ============================================================================
-- 10. SETTINGS TABLE (Global settings)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) NOT NULL UNIQUE,
  value JSONB,
  
  description TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk users table
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk projects table
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk modules table
CREATE TRIGGER trigger_modules_updated_at
  BEFORE UPDATE ON public.modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk invoices table
CREATE TRIGGER trigger_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk invoice_items table
CREATE TRIGGER trigger_invoice_items_updated_at
  BEFORE UPDATE ON public.invoice_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk portfolio_projects table
CREATE TRIGGER trigger_portfolio_projects_updated_at
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk contact_messages table
CREATE TRIGGER trigger_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger untuk settings table
CREATE TRIGGER trigger_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function: Auto-create user profile when auth user created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    status
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    CASE 
      WHEN NEW.email = current_setting('app.admin_email', true) 
      THEN 'admin'
      ELSE 'customer'
    END,
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger untuk auto-create user profile
CREATE TRIGGER trigger_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function: Generate invoice number
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS VARCHAR AS $$
DECLARE
  year VARCHAR;
  month VARCHAR;
  counter INTEGER;
  invoice_number VARCHAR;
BEGIN
  year := TO_CHAR(CURRENT_DATE, 'YY');
  month := TO_CHAR(CURRENT_DATE, 'MM');
  
  counter := COALESCE(
    (SELECT MAX(CAST(substring(invoice_number, 10, 5) AS INTEGER))
     FROM public.invoices
     WHERE invoice_number LIKE 'INV-' || year || month || '%'),
    0
  ) + 1;
  
  invoice_number := 'INV-' || year || month || '-' || LPAD(counter::TEXT, 5, '0');
  
  RETURN invoice_number;
END;
$$ LANGUAGE plpgsql;

-- Function: Log activity
CREATE OR REPLACE FUNCTION public.log_activity(
  p_user_id UUID,
  p_action VARCHAR,
  p_resource_type VARCHAR,
  p_resource_id UUID,
  p_changes JSONB
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.activity_logs (
    user_id,
    action,
    resource_type,
    resource_id,
    changes
  )
  VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_changes
  )
  RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 12. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Users: Users dapat melihat dan edit profil mereka sendiri, admin dapat melihat semua
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (
    auth.uid() = id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admin can update any user" ON public.users;
CREATE POLICY "Admin can update any user" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Projects: Users dapat melihat proyek mereka sendiri, admin dapat melihat semua
DROP POLICY IF EXISTS "Users can view own projects" ON public.projects;
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT USING (
    user_id = auth.uid() OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can insert own projects" ON public.projects;
CREATE POLICY "Users can insert own projects" ON public.projects
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all projects" ON public.projects;
CREATE POLICY "Admin can manage all projects" ON public.projects
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Modules: Same as projects
DROP POLICY IF EXISTS "Users can view own project modules" ON public.modules;
CREATE POLICY "Users can view own project modules" ON public.modules
  FOR SELECT USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can manage own project modules" ON public.modules;
CREATE POLICY "Users can manage own project modules" ON public.modules
  FOR INSERT WITH CHECK (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can update own project modules" ON public.modules;
CREATE POLICY "Users can update own project modules" ON public.modules
  FOR UPDATE USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can delete own project modules" ON public.modules;
CREATE POLICY "Users can delete own project modules" ON public.modules
  FOR DELETE USING (
    project_id IN (SELECT id FROM public.projects WHERE user_id = auth.uid())
  );

-- Invoices: Users dapat melihat invoice mereka sendiri
DROP POLICY IF EXISTS "Users can view own invoices" ON public.invoices;
CREATE POLICY "Users can view own invoices" ON public.invoices
  FOR SELECT USING (
    user_id = auth.uid() OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can manage own invoices" ON public.invoices;
CREATE POLICY "Users can manage own invoices" ON public.invoices
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own invoices" ON public.invoices;
CREATE POLICY "Users can update own invoices" ON public.invoices
  FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all invoices" ON public.invoices;
CREATE POLICY "Admin can manage all invoices" ON public.invoices
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Invoice Items: Same as invoices
DROP POLICY IF EXISTS "Users can view own invoice items" ON public.invoice_items;
CREATE POLICY "Users can view own invoice items" ON public.invoice_items
  FOR SELECT USING (
    invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid()) OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Users can manage own invoice items" ON public.invoice_items;
CREATE POLICY "Users can manage own invoice items" ON public.invoice_items
  FOR INSERT WITH CHECK (
    invoice_id IN (SELECT id FROM public.invoices WHERE user_id = auth.uid())
  );

-- Portfolio Projects: Public readable, admin can edit
DROP POLICY IF EXISTS "Portfolio projects readable by all" ON public.portfolio_projects;
CREATE POLICY "Portfolio projects readable by all" ON public.portfolio_projects
  FOR SELECT USING (is_published = true);

DROP POLICY IF EXISTS "Admin can manage portfolio projects" ON public.portfolio_projects;
CREATE POLICY "Admin can manage portfolio projects" ON public.portfolio_projects
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Activity Logs: Users dapat melihat aktivitas mereka, admin melihat semua
DROP POLICY IF EXISTS "Users can view own activity logs" ON public.activity_logs;
CREATE POLICY "Users can view own activity logs" ON public.activity_logs
  FOR SELECT USING (
    user_id = auth.uid() OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Only server can insert logs" ON public.activity_logs;
CREATE POLICY "Only server can insert logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- Contact Messages: Admin can view all, system can insert
DROP POLICY IF EXISTS "Admin can view contact messages" ON public.contact_messages;
CREATE POLICY "Admin can view contact messages" ON public.contact_messages
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Anyone can submit contact message" ON public.contact_messages;
CREATE POLICY "Anyone can submit contact message" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Settings: Admin can manage
DROP POLICY IF EXISTS "Admin can view settings" ON public.settings;
CREATE POLICY "Admin can view settings" ON public.settings
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "Admin can manage settings" ON public.settings;
CREATE POLICY "Admin can manage settings" ON public.settings
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- ============================================================================
-- 13. INSERT DEFAULT SETTINGS
-- ============================================================================

-- Portfolio settings
INSERT INTO public.settings (key, value, description)
VALUES (
  'portfolio_featured_count',
  '6'::jsonb,
  'Jumlah portfolio featured yang ditampilkan di homepage'
)
ON CONFLICT (key) DO NOTHING;

INSERT INTO public.settings (key, value, description)
VALUES (
  'invoice_tax_rate',
  '10'::jsonb,
  'Default tax rate untuk invoice dalam persen'
)
ON CONFLICT (key) DO NOTHING;

-- ============================================================================
-- 14. VIEWS
-- ============================================================================

-- View: Project Summary (untuk dashboard)
CREATE OR REPLACE VIEW public.vw_project_summary AS
SELECT
  p.id,
  p.user_id,
  p.name,
  p.type,
  p.status,
  p.progress,
  p.budget_amount,
  p.spent_amount,
  p.budget_amount - p.spent_amount as remaining_budget,
  p.start_date,
  p.due_date,
  COUNT(m.id) as total_modules,
  SUM(CASE WHEN m.status = 'completed' THEN 1 ELSE 0 END) as completed_modules,
  p.created_at,
  p.updated_at
FROM public.projects p
LEFT JOIN public.modules m ON p.id = m.project_id
WHERE p.deleted_at IS NULL
GROUP BY p.id;

-- View: User Statistics
CREATE OR REPLACE VIEW public.vw_user_statistics AS
SELECT
  u.id,
  u.email,
  u.full_name,
  u.role,
  COUNT(DISTINCT p.id) as total_projects,
  COUNT(DISTINCT CASE WHEN p.status = 'in-progress' THEN p.id END) as active_projects,
  COUNT(DISTINCT i.id) as total_invoices,
  COALESCE(SUM(i.total_amount), 0) as total_invoice_amount,
  COUNT(DISTINCT CASE WHEN i.status = 'paid' THEN i.id END) as paid_invoices,
  u.created_at,
  u.last_login_at
FROM public.users u
LEFT JOIN public.projects p ON u.id = p.user_id AND p.deleted_at IS NULL
LEFT JOIN public.invoices i ON u.id = i.user_id AND i.deleted_at IS NULL
WHERE u.status = 'active'
GROUP BY u.id;

-- View: Invoice Details dengan items
CREATE OR REPLACE VIEW public.vw_invoice_details AS
SELECT
  i.id,
  i.invoice_number,
  i.user_id,
  i.project_id,
  i.invoice_date,
  i.due_date,
  i.total_amount,
  i.status,
  i.created_at,
  COUNT(ii.id) as item_count,
  SUM(ii.total_price) as items_total
FROM public.invoices i
LEFT JOIN public.invoice_items ii ON i.id = ii.invoice_id
WHERE i.deleted_at IS NULL
GROUP BY i.id;

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
