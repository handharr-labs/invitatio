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
    (invitation)/[slug]/        # public guest invitation → <Invitation config /> + write actions
    (dashboard)/dashboard/      # admin-only (gold DS): sites list + StatCards
      sites/new/                # create a site from a preset
      sites/[id]/               # site detail — RSVP table + guestbook moderation tabs
      sites/[id]/edit/          # config editor — live PreviewFrame + theme/section controls
                                # (site detail also has a Guests tab: CSV import + links)
    login/                      # public Google sign-in
    api/auth/[...nextauth]/     # forge-auth route handler
  features/
    sites/                      # read path — Site model, repo, use-cases, seed fallback, site.di.ts
    rsvp/                       # guest write — submit RSVP (+ list for Phase 3)
    guestbook/                  # guest write — submit + list-visible feed
    wishlist/                   # guest write — claim item (+ list claims to merge)
    # each: domain/ (forge-core only) · data/ (dto+mapper · datasource Supabase+Null · repo) · <f>.di.ts
  lib/                          # auth (server + client), supabase client
  middleware.ts                 # guards /dashboard
supabase/migrations/, supabase/seed.sql
```

The read path is the plug-and-play seam: `sites.customization` maps **1:1** onto
the forge-ui-dos `InvitationConfig`, so rendering is essentially
`JSON → <Invitation config />`.

## Roadmap (from the initiative)

- **Phase 0/1/2 — done here:** scaffold, config-driven read path,
  publish/unpublish, and the guest **write path** — RSVP, guestbook, and
  wishlist claims persisted through the DS `on*` handlers → server actions →
  Supabase (`rsvp`, `guestbook`, `wishlist` features; migration `0002`). Writes
  degrade gracefully to optimistic-only when Supabase isn't connected.
- **Phase 3 (partial) — done here:** admin dashboard on
  `@handharr-labs/forge-ui-base-gold` — `DashboardShell` + `Sidebar` chrome
  (scoped under `.tier-gold`), sites list (StatCards + `DataTable`, inline
  publish/unpublish), per-site detail (`/dashboard/sites/[id]`) with tabbed
  **RSVP responses** table + **guestbook moderation** (hide/unhide), and the
  **config editor**: create-from-preset (`/dashboard/sites/new`) plus a live
  editor (`…/edit`) — `PreviewFrame` of `<Invitation config>` beside
  palette/typeface/layout/night controls, chrome toggles, `SortableList`
  section reorder + enable, and a per-section JSON content drawer. Plus
  **guest lists**: CSV import (upload or paste; lenient parser with
  quoted-field + header detection), a guests table with per-guest
  **personalized links** (`/{slug}?to={token}`) + copy/export, and link
  resolution on the guest route (stamps the greeting into the cover + RSVP
  name). **Phase 3 complete.** Richer per-section content forms remain a
  nice-to-have follow-up.
- **Phase 4:** gamification wiring · **5:** subdomains · **6:** couple self-serve + payments.
