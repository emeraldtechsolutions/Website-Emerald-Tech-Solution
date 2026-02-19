# Emerald Tech Solution - Website Frontend

Solusi transformasi digital untuk UMKM dengan teknologi Next.js, TypeScript, Tailwind CSS, dan Shadcn UI.

## 🎯 Fitur Utama

- **AI Chatbot (Gemini Integration)**: Asisten AI 24/7 untuk menjawab pertanyaan teknis dan konsultasi
- **Interactive Cost Estimator**: Kalkulator harga dan durasi proyek dengan modul-modul pilihan
- **Portfolio Showcase**: Galeri interaktif menampilkan project sukses dengan mockup aplikasi
- **Documentation Portal**: Knowledge base lengkap untuk panduan penggunaan sistem
- **Client Dashboard**: Dashboard untuk tracking proyek, pembayaran, dan invoicing

## 🛠️ Tech Stack

- **Frontend Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5.3+
- **Styling**: Tailwind CSS 3.3+ & Shadcn UI
- **UI Components**: Lucide React Icons
- **Package Manager**: npm/yarn/pnpm

## 📁 Struktur Project

```
emerald-tech-web/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout & metadata
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles
│   ├── dashboard/               # Client dashboard
│   │   └── page.tsx
│   ├── portfolio/               # Portfolio showcase
│   │   └── page.tsx
│   ├── estimator/               # Cost estimator
│   │   └── page.tsx
│   ├── docs/                    # Documentation
│   │   └── page.tsx
│   ├── login/                   # Login page
│   │   └── page.tsx
│   ├── signup/                  # Signup page
│   │   └── page.tsx
│   └── not-found.tsx            # 404 page
│
├── components/                   # Reusable UI Components
│   ├── Navbar.tsx               # Navigation bar
│   ├── Footer.tsx               # Footer
│   ├── AIChat.tsx               # AI Chatbot widget
│   ├── Button.tsx               # Button component
│   ├── Card.tsx                 # Card component
│   ├── Input.tsx                # Input component
│   └── ...                      # More components
│
├── lib/                         # Utilities & Config
│   ├── utils.ts                 # Helper functions (cn, formatCurrency, etc)
│   ├── supabaseClient.ts        # Supabase setup (future)
│   ├── geminiConfig.ts          # Gemini AI setup (future)
│   └── ...
│
├── types/                       # TypeScript Types
│   └── index.ts                 # All type definitions
│
├── public/                      # Static assets
│   ├── favicon.ico
│   └── ...
│
├── .env.local                   # Environment variables (local)
├── .eslintrc.json              # ESLint config
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js config
├── tailwind.config.ts          # Tailwind config
├── tsconfig.json               # TypeScript config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🚀 Instalasi & Setup

### Prerequisites
- Node.js 18+ & npm/yarn
- Git

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd emerald-tech-web
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Isi file `.env.local` dengan:
```
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Run development server**
```bash
npm run dev
```

Buka browser dan akses `http://localhost:3000`

## 📝 Halaman-halaman

### 1. **Home (/)** 
- Hero section dengan value proposition
- Feature cards untuk solusi POS, ERP, F&B
- Services section
- Call-to-action

### 2. **Portfolio (/portfolio)**
- Gallery proyek dengan filter kategori
- Project cards dengan mockup dan features
- Detail project cards

### 3. **Estimator (/estimator)**
- Interactive cost calculator
- Module selection with pricing
- Real-time price & duration calculation
- FAQ section

### 4. **Docs (/docs)**
- Documentation portal dengan navigasi sidebar
- Sections: Getting Started, POS System, ERP System, F&B System, Support
- Tips & tricks section

### 5. **Login (/login)**
- Email & password authentication form
- Demo account untuk testing
- Forgot password link
- Sign up link

### 6. **Signup (/signup)**
- Registrasi user baru dengan validasi
- Form fields: nama, perusahaan, email, telepon, password
- Terms & conditions checkbox

### 7. **Dashboard (/dashboard)**
- Protected route (akan diimplementasikan dengan auth)
- Project tracking dengan progress bars
- Invoice & billing management
- Quick stats cards
- Sidebar navigation

### 8. **404 (not-found)**
- Custom 404 page dengan navigation links

## 🧩 Komponen Reusable

### Button Component
```tsx
<Button variant="default" size="lg" isLoading={false}>
  Click me
</Button>
```
Props: `variant` | `size` | `isLoading` | All HTML button attributes

### Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer here</CardFooter>
</Card>
```

### Input Component
```tsx
<Input placeholder="Type here..." type="text" />
```

### AI Chat Widget
Tersedia di floating button di bottom-right setiap halaman.

## 🎨 Styling

### Color Scheme
- **Primary**: Orange (rgb(249, 115, 22))
- **Secondary**: Slate (rgb(15, 23, 42))
- **Accent**: Orange
- **Background**: White / Slate 50

### CSS Classes
- Menggunakan Tailwind CSS utility classes
- Custom CSS di `app/globals.css`
- Component-specific styles di file component

## 📱 Responsive Design

Semua halaman responsive dengan breakpoints:
- Mobile: 0px
- Tablet: 768px (md)
- Desktop: 1024px (lg)
- Large: 1280px (xl)

## 🔐 Security Considerations

- [ ] Implement Supabase authentication
- [ ] Add CSRF protection
- [ ] Implement rate limiting
- [ ] Validate all form inputs
- [ ] Secure API endpoints
- [ ] Use HTTPS
- [ ] Implement API key management

## 📊 Performance

- Next.js Image optimization
- Code splitting & lazy loading
- CSS-in-JS with Tailwind
- Optimized font loading
- Static generation where possible

## 🔄 Future Implementations

- [ ] Integrate Supabase for auth & database
- [ ] Integrate Google Gemini API for AI chatbot
- [ ] Add payment gateway integration (Stripe/Midtrans)
- [ ] Real-time project tracking
- [ ] Email notifications
- [ ] Admin panel
- [ ] Analytics dashboard
- [ ] Mobile app version

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Gemini API](https://ai.google.dev)

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

Proprietary - Emerald Tech Solution

## 📧 Support

- Email: support@emeraldtech.id
- Phone: +62 XXX-XXXX-XXXX
- Website: https://emeraldtech.id

---

**Built with ❤️ by Emerald Tech Solution Team**
