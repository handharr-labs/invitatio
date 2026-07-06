# Invitatio

Admin-scaffolded, per-couple published wedding invitation sites. The **data +
admin + routing** layer on top of the [`@handharr-labs` Forge Kit](https://github.com/handharr-labs/web-forge-kit).
Guest-facing rendering is the published `@handharr-labs/forge-ui-dos` design
system; this app persists a config per couple and serves it at its own address.

See the initiative: `personal-workdocs/invitatio-docs/initiatives/2026-07-06-invitation-web-app.md`.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript 6** · **Tailwind CSS 4**
- **Auth:** `@handharr-labs/forge-auth` (NextAuth / Google adapter)
- **DB + storage:** Supabase (Postgres) via `@handharr-labs/forge-web-server`
- **Guest UI:** `@handharr-labs/forge-ui-dos` — `<Invitation config />` renderer

The Forge Kit packages ship raw TS source and are published to **GitHub
Packages**, so install needs a token (see below) and Next transpiles them
(`transpilePackages` in `next.config.ts`).

## Getting started

```bash
# 1. Auth for GitHub Packages (@handharr-labs/* live there).
#    A classic PAT with `read:packages`, or the gh token:
export NODE_AUTH_TOKEN=$(gh auth token)

# 2. Install + run
npm install
npm run dev            # http://localhost:3000
```

The app **runs with zero configuration**: `/inka-riyadi` renders a full sample
invitation from an in-memory fallback so you can see the read path immediately.
`/` is a landing page; `/dashboard` is the admin area (needs auth, below).

## Configuration

Copy `.env.example` → `.env.local` and fill in as you enable each piece. Nothing
is required to boot; each block activates a capability:

| Block | Activates |
|---|---|
| `AUTH_SECRET`, `GOOGLE_ID`, `GOOGLE_SECRET` | Admin sign-in at `/login` (Google OAuth) |
| `ADMIN_EMAILS` | Restrict the dashboard to specific accounts (blank = any account) |
| `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | DB-backed read path + publish/unpublish (replaces the in-memory fallback) |

### Google OAuth (not set up yet)

Create an OAuth 2.0 Client in Google Cloud Console → Credentials, and register
the redirect URI per environment:

| Environment | Redirect URI |
|---|---|
| Local | `http://localhost:3000/api/auth/callback/google` |

Then set `AUTH_SECRET` (`openssl rand -base64 32`), `GOOGLE_ID`, `GOOGLE_SECRET`.

### Supabase

Create a project, then apply the schema and seed:

```bash
# via the Supabase SQL editor or psql:
supabase/migrations/0001_init.sql   # schema
supabase/seed.sql                   # seeds the inka-riyadi published site
```

Set `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. The read path
then serves `sites.customization` from Postgres and the dashboard can
publish/unpublish. (MVP has no RLS — auth is app-owned; service-role is
server-only. RLS arrives with Phase 6 couple self-serve.)

## Architecture

Clean Architecture per the kit's web-architecture convention. One feature so far:

```
src/
  app/                          # Application layer — routes, layouts, actions, DI
    (invitation)/[slug]/        # public guest invitation → <Invitation config />
    (dashboard)/dashboard/      # admin-only: site list + publish/unpublish
    login/                      # public Google sign-in
    api/auth/[...nextauth]/     # forge-auth route handler
  features/sites/
    domain/                     # Site model, repository interface, use-cases (forge-core only)
    data/                       # DTO (zod) · mapper · datasources (Supabase + in-memory) · repository
    seed/                       # sample-config builder (DS-derived fallback)
    site.di.ts                  # feature composition root (picks datasource by env)
  lib/                          # auth (server + client), supabase client
  middleware.ts                 # guards /dashboard
supabase/migrations/, supabase/seed.sql
```

The read path is the plug-and-play seam: `sites.customization` maps **1:1** onto
the forge-ui-dos `InvitationConfig`, so rendering is essentially
`JSON → <Invitation config />`.

## Roadmap (from the initiative)

- **Phase 0/1 — done here:** scaffold, config-driven read path, publish/unpublish.
- **Phase 2:** guest writes (RSVP, guestbook, wishlist claim) via `on*` handlers.
- **Phase 3:** full admin dashboard on `@handharr-labs/forge-ui-base-gold`
  (config editor, guest lists, RSVP moderation).
- **Phase 4:** gamification wiring · **5:** subdomains · **6:** couple self-serve + payments.
