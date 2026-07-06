-- invitatio — Phase 3: guest lists + personalized links
-- Each guest gets a unique token; the public link /{slug}?to={token} resolves to
-- the guest and personalizes the invitation (cover greeting, RSVP name prefill).

create table if not exists public.guests (
  id            uuid primary key default gen_random_uuid(),
  site_id       uuid not null references public.sites (id) on delete cascade,
  name          text not null,
  invited_count integer not null default 1,
  -- URL-safe per-guest token for the personalized link. Globally unique.
  token         text not null unique,
  created_at    timestamptz not null default now()
);

create index if not exists guests_site_idx
  on public.guests (site_id, created_at desc);
