-- The board. One row per paid listing; rank is derived from bid_cents at read
-- time, never stored — see lib/listings.ts.
create table if not exists listings (
  id                uuid primary key default gen_random_uuid(),

  -- Ownership is (normalized_name, email): bidding again with the same market
  -- name and the same email raises that listing instead of creating a second
  -- one. Rule 02, "one listing per market", leans on this.
  name              text        not null,
  normalized_name   text        not null,
  email             text        not null,
  apply_url         text        not null,
  category          text        not null default 'Market',
  blurb             text        not null default '',

  -- Money is always integer cents. bid_cents is the CUMULATIVE total paid for
  -- position, not the amount of the most recent charge — raising a bid charges
  -- only the difference (rule 06) but sets this to the new total.
  bid_cents         integer     not null check (bid_cents > 0),

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  unique (normalized_name, email)
);

-- The board's read path: highest bid first, oldest bid winning a tie, so
-- somebody who matches your bid can't take your spot.
create index if not exists listings_rank_idx
  on listings (bid_cents desc, created_at asc);

-- Every Stripe Checkout session that has been applied to the board. The
-- webhook inserts here first; the unique constraint is what makes a replayed
-- or duplicated `checkout.session.completed` a no-op rather than a double bid.
create table if not exists processed_payments (
  session_id        text        primary key,
  listing_id        uuid        not null references listings (id) on delete cascade,
  -- What the card was actually charged, which is the delta on a raise.
  amount_cents      integer     not null,
  created_at        timestamptz not null default now()
);

-- No client ever talks to these tables: reads and writes both go through the
-- server with the service role key, which bypasses RLS. Enabling it with no
-- policies means a leaked anon key still gets nothing.
alter table listings enable row level security;
alter table processed_payments enable row level security;

-- Applies one paid Checkout Session to the board, atomically and at most once.
--
-- Stripe retries webhooks, and retries arrive out of order. Doing this as
-- separate statements from the app would leave two holes: a retry could lower
-- a bid that has since been raised, and two concurrent deliveries could both
-- pass an "already applied?" check. Both close here — the function body is one
-- transaction, GREATEST never walks a bid backwards, and the session_id
-- primary key makes the second delivery a no-op.
create or replace function apply_paid_bid(
  p_session_id     text,
  p_name           text,
  p_normalized     text,
  p_email          text,
  p_apply_url      text,
  p_category       text,
  p_blurb          text,
  p_total_cents    integer,
  p_charged_cents  integer
) returns listings
language plpgsql
as $$
declare
  v_listing listings;
begin
  -- Seen this session already: hand back the listing untouched.
  select l.* into v_listing
    from processed_payments p
    join listings l on l.id = p.listing_id
   where p.session_id = p_session_id;

  if found then
    return v_listing;
  end if;

  insert into listings (
    name, normalized_name, email, apply_url, category, blurb, bid_cents
  ) values (
    p_name, p_normalized, p_email, p_apply_url, p_category, p_blurb, p_total_cents
  )
  on conflict (normalized_name, email) do update set
    -- A late retry must never undo a raise that landed in between.
    bid_cents  = greatest(listings.bid_cents, excluded.bid_cents),
    name       = excluded.name,
    apply_url  = excluded.apply_url,
    category   = excluded.category,
    blurb      = excluded.blurb,
    updated_at = now()
  returning * into v_listing;

  insert into processed_payments (session_id, listing_id, amount_cents)
  values (p_session_id, v_listing.id, p_charged_cents)
  on conflict (session_id) do nothing;

  return v_listing;
end;
$$;
