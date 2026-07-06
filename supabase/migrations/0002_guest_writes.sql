-- invitatio — Phase 2: guest write path
-- Guest interactions persisted from the forge-ui-dos on* handlers. All rows are
-- site-scoped and cascade-deleted with their site. No RLS in MVP (auth is
-- app-owned); writes go through server actions using the service-role client.

-- RSVP submissions (write-only from the guest; admin reviews in Phase 3).
create table if not exists public.rsvp_responses (
  id          uuid primary key default gen_random_uuid(),
  site_id     uuid not null references public.sites (id) on delete cascade,
  name        text not null,
  attending   boolean not null,
  guest_count integer not null default 1,
  message     text,
  created_at  timestamptz not null default now()
);
create index if not exists rsvp_responses_site_idx
  on public.rsvp_responses (site_id, created_at desc);

-- Guestbook — "Doa & Ucapan". Read as a public feed + guest-appended.
create table if not exists public.guestbook_entries (
  id         uuid primary key default gen_random_uuid(),
  site_id    uuid not null references public.sites (id) on delete cascade,
  name       text not null,
  message    text not null,
  attending  boolean,                       -- optional Hadir / Tidak Hadir badge
  is_hidden  boolean not null default false, -- admin moderation (Phase 3)
  created_at timestamptz not null default now()
);
create index if not exists guestbook_entries_feed_idx
  on public.guestbook_entries (site_id, created_at desc)
  where is_hidden = false;

-- Wishlist claims. Items are authored in sites.customization; a claim marks one
-- as taken so guests avoid duplicate gifts. `item_id` matches WishlistItem.id.
create table if not exists public.wishlist_claims (
  id         uuid primary key default gen_random_uuid(),
  site_id    uuid not null references public.sites (id) on delete cascade,
  item_id    text not null,
  claimed_by text not null,
  created_at timestamptz not null default now(),
  unique (site_id, item_id)                  -- one claim per item
);
create index if not exists wishlist_claims_site_idx
  on public.wishlist_claims (site_id);
