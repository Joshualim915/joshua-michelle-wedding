# Joshua & Michelle — Wedding Invitation

A garden-wedding invitation and RSVP site for **Joshua & Michelle**, 19 June 2027,
at Takun Retreat Club, Rawang, Selangor.

Built with **Next.js 16** (App Router), **Tailwind CSS v4**, and **Supabase** for
RSVP storage. Deployed on **Vercel**.

## Prerequisites

- Node.js `>=22.13.0`
- A Supabase project with the `rsvps` table (see below)

## Quick Start

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm run dev
```

Visit http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Meaning |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The `anon` public API key from Supabase Dashboard → Settings → API |

Both must be prefixed `NEXT_PUBLIC_` so they reach the browser.

## Database Setup

Run `supabase/migrations/0001_create_rsvps.sql` in the Supabase Dashboard →
SQL Editor. This creates the `public.rsvps` table and enables Row Level
Security so anonymous guests can insert RSVPs but cannot read other people's
submissions.

Stored columns: `name`, `attending` (yes/no), `guests`, `appetizer`, `main`,
`carbs`, `dessert`, `dietary`, `song`, `created_at`.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel → New Project → import the GitHub repo.
3. Settings:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `./` (the repo root — leave default)
   - **Build Command:** `next build` (default — leave as-is)
   - **Output Directory:** `.next` (default — leave as-is)
   - **Install Command:** `npm install` (default — leave as-is)
4. Add Environment Variables in Vercel → Project → Settings → Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy. Vercel will build and give you a `*.vercel.app` URL.

## Useful Commands

- `npm run dev`: local development
- `npm run build`: production build
- `npm run start`: serve the production build locally
- `npm test`: run source-content tests
- `npm run lint`:	eslint