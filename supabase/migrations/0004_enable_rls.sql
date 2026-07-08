-- invitatio — enable Row Level Security (RLS) on all public tables.
--
-- WHY: Supabase auto-exposes the `public` schema via a PostgREST API reachable
-- with the publishable `anon` key. With RLS OFF, anyone holding the project URL
-- + anon key can read/write every row over the internet (Supabase's linter flags
-- this as a security error).
--
-- SAFE-BY-DEFAULT: the app's server uses the `service_role` key, which BYPASSES
-- RLS entirely. So enabling RLS with NO policies = deny-all for anon/public,
-- allow-all for the server. No app code changes; all current flows keep working.
--
-- LATER (Phase 6, couple self-serve): published guest reads move to an anon
-- client behind RLS — that is when actual per-site policies get added here.

alter table public.sites             enable row level security;
alter table public.rsvp_responses    enable row level security;
alter table public.guestbook_entries enable row level security;
alter table public.wishlist_claims   enable row level security;
alter table public.guests            enable row level security;
