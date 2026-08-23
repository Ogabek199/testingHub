# TestingHub 🧪

Professional dasturiy ta'minot test platformasi. **Next.js 14** + **Tailwind CSS** + **TypeScript** bilan qurilgan.

## Ishga tushirish

```bash
# Dependencies o'rnatish
npm install

# Development server
npm run dev

# Production build
npm run build
npm run start
```

## Papka tuzilmasi

```
testinHub/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing sahifa
│   ├── globals.css         # Global CSS
│   ├── (auth)/             # Auth route group
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/          # Dashboard
│   │   ├── layout.tsx      # Sidebar layout
│   │   └── page.tsx
│   ├── tests/              # Testlar
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   └── api/
│       └── health/route.ts
├── components/
│   ├── ui/                 # Reusable UI
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   ├── layout/             # Layout komponentlar
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── sections/           # Landing seksiyalar
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Stats.tsx
│       └── CTA.tsx
└── lib/
    └── utils.ts            # Yordamchi funksiyalar
```

## Texnologiyalar

| Texnologiya | Maqsad |
|---|---|
| **Next.js 14** | React framework, App Router |
| **Tailwind CSS** | Utility-first CSS |
| **TypeScript** | Type safety |
| **Lucide React** | Ikonlar |
| **clsx + tailwind-merge** | Class utility |

## Sahifalar

- `/` — Landing page (Hero, Stats, Features, CTA)
- `/login` — Kirish sahifasi
- `/register` — Ro'yxatdan o'tish
- `/dashboard` — Boshqaruv paneli (sidebar bilan)
- `/tests` — Test ro'yxati
- `/tests/[id]` — Test tafsilotlari
- `/api/health` — Health check API

## Dizayn

- 🌙 Dark mode qo'llab-quvvatlash
- 📱 Responsive (mobile-first)
- ✨ Glassmorphism effektlari
- 🎨 Minimalistik, zamonaviy dizayn
- 🏷️ TZ logo (indigo-purple gradient)
