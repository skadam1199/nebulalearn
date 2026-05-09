# NebulaLearn

> Turn any lecture into a complete study experience.

NebulaLearn processes any YouTube lecture URL and instantly generates outlines, smart summaries, flashcards, and semantic search — powered by 6 specialized AI agents working in sequence.

---

## What it does

| Capability | Who it's for | What they get |
|---|---|---|
| **Student** | College students | Outline, summaries, flashcards, semantic search, multilingual support |
| **Faculty** | Professors | Private pedagogical audit, timestamped fix list, accessibility report |
| **Provost** | Academic leaders | Curriculum map, learning objective coverage, gap analysis |

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS v4 |
| UI Components | shadcn/ui, Radix UI |
| Animations | Framer Motion, tsParticles |
| 3D Graphics | Spline |
| Auth | Supabase |
| Deployment | Vercel |
| Backend | FastAPI (Python) — separate repo |
| AI Agents | OpenAI GPT-4o + GPT-4o-mini |
| Transcripts | yt-dlp + Groq Whisper fallback |

---

## Getting started locally

### Prerequisites
- Node.js 18+
- A Supabase account (free)

### 1. Clone the repo

```bash
git clone https://github.com/skadam1199/nebulalearn.git
cd nebulalearn
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=your_fastapi_backend_url
```

Get your Supabase credentials from:
`https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api-keys/legacy`

### 4. Run locally

```bash
npm run dev
```

Open `http://localhost:3000`

---

## Project structure

```
nebulalearn/
├── app/                        # Next.js app router pages
│   ├── page.tsx                # Landing page
│   ├── dashboard/              # Main dashboard after login
│   ├── results/                # Study results view
│   └── auth/                   # Login, signup, callback
├── components/
│   ├── landing/                # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── features-section.tsx
│   │   ├── stats-section.tsx
│   │   ├── roles-section.tsx
│   │   ├── testimonials-section.tsx
│   │   └── footer.tsx
│   ├── dashboard/              # Dashboard components
│   │   ├── dashboard-hero.tsx
│   │   ├── dashboard-header.tsx
│   │   └── particles-background.tsx
│   ├── results/                # Results page components
│   │   ├── outline-tab.tsx
│   │   ├── summaries-tab.tsx
│   │   ├── flashcards-tab.tsx
│   │   └── search-tab.tsx
│   └── ui/                     # shadcn/ui components
├── lib/
│   └── supabase/               # Supabase client config
├── styles/
│   └── globals.css
└── public/                     # Static assets
```

---

## Deployment

### Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Add New Project
3. Import your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL`
5. Click Deploy

Every push to `main` triggers an automatic redeploy.

---

## Backend

The AI agent backend is a separate FastAPI service deployed on Render.

**Repo:** [nebulalearn-backend](https://github.com/skadam1199/nebulalearn-backend)

**Endpoints:**
```
POST /api/process          → Student mode: full study materials
POST /api/faculty-audit    → Faculty mode: pedagogical report  
POST /api/curriculum-map   → Provost mode: curriculum coverage
GET  /api/health           → Health check
```

---

## The 6 AI agents

```
YouTube URL
    ↓
Agent 1 — Ingestion      yt-dlp transcript extraction + semantic chunking
    ↓
Agent 2 — Synthesis      GPT-4o-mini → outline + summaries + flashcards
    ↓
Agent 3 — Search         OpenAI embeddings + cosine similarity
    ↓
Agent 4 — Pedagogy       GPT-4o → faculty audit + timestamped fixes
    ↓
Agent 5 — Translation    GPT-4o-mini → multilingual output
    ↓
Agent 6 — Curriculum     GPT-4o → objective coverage mapping
```

---

## Environment variables reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon public key |
| `NEXT_PUBLIC_API_URL` | ✅ | FastAPI backend base URL |

---

## Built for

nebulaONE Frontier Internship Challenge — May 2026

> "A beautifully executed Capability 1 will beat a half-broken attempt at all three — every single time."

---

## License

MIT