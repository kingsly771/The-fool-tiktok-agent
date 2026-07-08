# FOOL — AI TikTok Growth Analyst

An AI-powered TikTok growth analytics platform built with Next.js 15, Groq, Clerk, and Supabase.

> **Status: Phase 1 of a multi-phase build.** This delivers the full architecture plus two
> complete, working features end-to-end (Account Analysis and Video Idea Generator), so you have
> a real, runnable foundation to extend. See "What's implemented" below for exact scope.

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Next.js Route Handlers, Groq API (`groq-sdk`)
- **Database:** Supabase (Postgres)
- **Auth:** Clerk
- **Validation:** Zod
- **Forms:** React Hook Form
- **Charts:** Recharts (wired, not yet used in Phase 1 UI)
- **Deployment:** Vercel

## What's implemented (Phase 1)

- Full project scaffold: config, Tailwind theme, dark mode, folder structure for the entire app
- Clerk authentication wired via middleware (`src/middleware.ts`) and `ClerkProvider`
- Supabase server client + full database schema (`supabase/schema.sql`) covering profiles,
  analyses, content ideas, growth plans, and reports
- Reusable, typed Groq AI service (`src/lib/groq.ts`) with three production system prompts:
  account analysis, video idea generation, and growth report generation — all requesting
  structured JSON and validated with Zod on the way back
- **Account Analysis** — fully working: input form → `/api/analyze` → Groq → Zod-validated
  result → animated score UI (growth score ring, 6 sub-scores, strengths/weaknesses/
  opportunities/threats, ranked recommendations) → persisted to Supabase
- **Video Idea Generator** — fully working: niche + tone input → `/api/ideas` → Groq → 30
  expandable idea cards (hook, script, CTA, length, audience, editing tips, keywords, hashtags,
  difficulty, expected performance) → persisted to Supabase
- Report generation API route (`/api/report`) implemented and ready to wire into a report UI
- Dashboard shell with sidebar navigation to every planned section (Dashboard, Account Analysis,
  Video Ideas, Reports, History, Settings) — Reports/History/Settings currently have functional
  placeholder pages pending Phase 2
- Landing page, loading skeletons, toast notifications (Sonner), dark mode by default

## What's next (Phase 2 — say the word and I'll build it)

- Reports UI (executive summary, SWOT grid, exportable action plan) wired to `/api/report`
- PDF export (jsPDF is already a dependency)
- History page reading real data back from Supabase
- Competitor analysis, hashtag generator, hook generator, caption generator, 30-day growth plan UI
- Analytics dashboard with Recharts (score trends over time)
- Settings: profile, plan/billing
- shadcn/ui full component set (currently a hand-rolled subset: Button, Card, Input, Badge, Skeleton)
- Empty/error states polish, mobile nav (sidebar currently desktop-only)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

- **Groq:** Get an API key at [console.groq.com](https://console.groq.com)
- **Supabase:** Create a project at [supabase.com](https://supabase.com), then run
  `supabase/schema.sql` in the SQL editor
- **Clerk:** Create an app at [clerk.com](https://clerk.com)

### 3. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 4. Deploy

Push to GitHub, import into Vercel, and add the same environment variables in the Vercel project
settings.

## Project Structure

```
src/
  app/
    (dashboard)/          # Authenticated app shell + pages
      dashboard/
      analysis/
      ideas/
      reports/
      history/
      settings/
    api/                   # Route handlers (analyze, ideas, report)
    layout.tsx             # Root layout with ClerkProvider
    page.tsx               # Public landing page
  components/
    ui/                    # Design system primitives
    dashboard/              # Sidebar, stat cards, score ring
    analysis/                # Analysis form + result UI
    ideas/                   # Idea generator form + card
  lib/
    groq.ts                 # AI service layer (server-only)
    supabase.ts              # Supabase server client (server-only)
    validations.ts            # Zod schemas
    utils.ts
  types/
    index.ts
supabase/
  schema.sql               # Full DB schema
```

## Security Notes

- `GROQ_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` are server-only and never imported into a
  Client Component.
- All API routes verify the Clerk session (`auth()`) before doing any work.
- Growth-affecting writes go through the service role key on the server, not direct client
  Supabase calls, so RLS misconfiguration can't leak data.
