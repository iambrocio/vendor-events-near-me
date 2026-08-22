-- Where the market actually happens. Vendors filter on this before anything
-- else — a $2,000 booth two states away is worth less than a $40 one down the
-- road — so it sits on the row next to the name.
alter table listings add column if not exists location text not null default '';

-- apply_paid_bid() gains a parameter. Postgres treats a changed signature as an
-- overload rather than a replacement, so the old one has to go explicitly —
-- otherwise both versions exist and the nine-argument call keeps silently
-- winning, dropping the location on the floor.
drop function if exists apply_paid_bid(
  text, text, text, text, text, text, text, integer, integer
);

create or replace function apply_paid_bid(
  p_session_id     text,
  p_name           text,
  p_normalized     text,
  p_email          text,
  p_apply_url      text,
  p_category       text,
  p_location       text,
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
    name, normalized_name, email, apply_url, category, location, blurb, bid_cents
  ) values (
    p_name, p_normalized, p_email, p_apply_url, p_category, p_location, p_blurb, p_total_cents
  )
  on conflict (normalized_name, email) do update set
    -- A late retry must never undo a raise that landed in between.
    bid_cents  = greatest(listings.bid_cents, excluded.bid_cents),
    name       = excluded.name,
    apply_url  = excluded.apply_url,
    category   = excluded.category,
    location   = excluded.location,
    blurb      = excluded.blurb,
    updated_at = now()
  returning * into v_listing;

  insert into processed_payments (session_id, listing_id, amount_cents)
  values (p_session_id, v_listing.id, p_charged_cents)
  on conflict (session_id) do nothing;

  return v_listing;
end;
$$;
